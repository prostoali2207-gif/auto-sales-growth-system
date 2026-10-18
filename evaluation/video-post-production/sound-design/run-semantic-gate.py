#!/usr/bin/env python3
from __future__ import annotations

import json
import os
from pathlib import Path
import subprocess
import sys
import urllib.error
import urllib.request

ROOT=Path(__file__).resolve().parents[3]
HERE=Path(__file__).resolve().parent
CASES=HERE/"automotive-cases.json"
AGENT=ROOT/"agents"/"uae-automotive-video-post-production.md"
ENDPOINT="https://generativelanguage.googleapis.com/v1beta/interactions"

ACTIONS=[
 "BLOCK_TRUTH_RISK","REVISE_SOUND_DESIGN","ESCALATE_EDITORIAL",
 "PROCEED_BOUNDED_LAYERING","REPLACE_WITH_FALSE_VEHICLE_SOUND",
 "PROCEED_WITH_SILENCE","FILL_EVERY_GAP","REVISE_MIX",
 "REVISE_DELIVERABLE","QC_REQUIRED","READY_FOR_REVIEW"
]
FLAGS=[
 "vehicle_sound_truth","abstract_or_omit","sound_cannot_hide_weak_picture",
 "door_event_fit","authentic_anchor","layer_roles","intentional_silence",
 "sound_driven_rhythm","event_hierarchy","transition_restraint","macro_arc",
 "phone_qc","mix_hierarchy","meters_not_enough","sound_design_mode",
 "schema_truth","real_media_perceptual_qc","no_false_ready_claim"
]

def sha()->str:
    return os.environ.get("AUTO_CSD_CANDIDATE_SHA") or subprocess.run(
        ["git","rev-parse","HEAD"],cwd=ROOT,text=True,capture_output=True,check=True
    ).stdout.strip()

def schema(ids:list[str])->dict:
    return {"type":"object","properties":{"answers":{"type":"array","minItems":len(ids),"maxItems":len(ids),"items":{
      "type":"object","properties":{
        "case_id":{"type":"string","enum":ids},
        "action":{"type":"string","enum":ACTIONS},
        "flags":{"type":"array","items":{"type":"string","enum":FLAGS},"uniqueItems":True},
        "rationale":{"type":"string"}
      },"required":["case_id","action","flags","rationale"],"additionalProperties":False
    }}},"required":["answers"],"additionalProperties":False}

def extract(raw:dict)->str:
    if isinstance(raw.get("output_text"),str): return raw["output_text"]
    for step in reversed(raw.get("steps") or []):
        if isinstance(step,dict) and step.get("type")=="model_output":
            content=step.get("content")
            if isinstance(content,str): return content
            for item in content or []:
                if isinstance(item,dict) and item.get("type")=="text":
                    return item["text"]
    raise ValueError("no observable model output")

def call(batch:list[dict],system:str):
    ids=[c["id"] for c in batch]
    visible=[{"id":c["id"],"title":c["title"],"facts":c["facts"]} for c in batch]
    payload={
      "model":os.environ.get("AUTO_CSD_MODEL","gemini-3.1-flash-lite"),
      "input":"Evaluate each automotive commercial sound-design case independently. Choose one primary action and directly implicated flags. Do not claim READY from text-only evidence. Return schema-valid JSON only. Cases: "+json.dumps(visible,ensure_ascii=False),
      "system_instruction":system,
      "response_format":{"type":"text","mime_type":"application/json","schema":schema(ids)},
      "store":False,
      "generation_config":{"thinking_level":os.environ.get("GEMINI_THINKING_LEVEL","medium")}
    }
    req=urllib.request.Request(ENDPOINT,data=json.dumps(payload).encode(),method="POST",headers={"Content-Type":"application/json","x-goog-api-key":os.environ["GEMINI_API_KEY"]})
    try:
        with urllib.request.urlopen(req,timeout=120) as r: raw=json.loads(r.read().decode())
        ans=json.loads(extract(raw).strip())
        returned=[x.get("case_id") for x in ans.get("answers",[]) if isinstance(x,dict)]
        if len(returned)!=len(ids) or len(set(returned))!=len(ids) or set(returned)!=set(ids):
            raise ValueError(f"case id mismatch expected={ids} actual={returned}")
        return ans,{"status":"OK"}
    except urllib.error.HTTPError as exc:
        return None,{"status":"PROVIDER_RUNTIME_FAIL","http_status":exc.code,"error":exc.read().decode(errors="replace")[:2000]}
    except Exception as exc:
        return None,{"status":"EVAL_OUTPUT_FAILURE","error":repr(exc)}

def grade(c:dict,item:dict|None,transport:dict,trial:int,commit:str)->dict:
    if item is None: return {"case_id":c["id"],"trial":trial,"candidate_sha":commit,**transport}
    action=item["action"]; flags=set(item["flags"])
    ok=action in set(c["allowed_actions"]) and action not in set(c["forbidden_actions"]) and set(c["required_flags"]).issubset(flags)
    return {"case_id":c["id"],"trial":trial,"candidate_sha":commit,"status":"PASS" if ok else "FAIL","action":action,"flags":sorted(flags)}

def main()->int:
    if not os.environ.get("GEMINI_API_KEY"):
        print("GEMINI_API_KEY missing; no model calls attempted",file=sys.stderr); return 2
    cases=json.loads(CASES.read_text(encoding="utf-8"))
    selected=os.environ.get("AUTO_CSD_CASE_IDS","").strip()
    if selected:
        ids=[x.strip() for x in selected.split(",") if x.strip()]
        by={c["id"]:c for c in cases}
        if len(ids)!=len(set(ids)) or any(x not in by for x in ids): raise SystemExit("unknown/duplicate case id")
        cases=[by[x] for x in ids]
    trials=int(os.environ.get("AUTO_CSD_TRIALS","1")); batch=int(os.environ.get("AUTO_CSD_BATCH_SIZE","4"))
    if trials<1 or trials>3 or batch<1 or batch>4: raise SystemExit("trials/batch must be 1..3")
    groups=[cases[i:i+batch] for i in range(0,len(cases),batch)]
    if len(groups)*trials>3: raise SystemExit("single invocation exceeds 3-call budget")
    system=AGENT.read_text(encoding="utf-8"); commit=sha(); results=[]; calls=0
    for t in range(1,trials+1):
        for g in groups:
            ans,tr=call(g,system); calls+=1
            if ans is None:
                results.extend(grade(c,None,tr,t,commit) for c in g)
                print(json.dumps({"candidate_sha":commit,"release_gate":"NOT_EXECUTABLE","executed_model_calls":calls,"application_retries":0,"results":results},ensure_ascii=False,indent=2)); return 1
            by={x["case_id"]:x for x in ans["answers"]}
            results.extend(grade(c,by[c["id"]],tr,t,commit) for c in g)
    passed=all(x["status"]=="PASS" for x in results) and len(results)==len(cases)*trials
    print(json.dumps({"candidate_sha":commit,"release_gate":"PASS_DEVELOPMENT_ONLY" if passed else "REVISE","executed_model_calls":calls,"application_retries":0,"results":results},ensure_ascii=False,indent=2))
    return 0 if passed else 1

if __name__=="__main__":
    raise SystemExit(main())
