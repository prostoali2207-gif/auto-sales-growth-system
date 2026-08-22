#!/usr/bin/env python3
from __future__ import annotations
import base64, json, os, subprocess, sys, time, urllib.error, urllib.request
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent
CASES=HERE/'uae-delta-cases-v0.1.json'
PRACTICAL=HERE/'uae-practical-case-v0.1.json'
SPECIALIZATION=ROOT/'agents/market-intelligence.md'
OUT=ROOT/'.tmp/uae-market-intelligence'
ENDPOINT='https://generativelanguage.googleapis.com/v1beta/interactions'
CORE_REPO='prostoali2207-gif/professional-ai-agents'
BASE_BLOB='7af5b93c1a4d499b5972a0dd20aec8e4253a9651'
OVERLAY_BLOB='e0685f4a5a868cd2e2d119d9c01d8ad36bb59b21'
DECISIONS=['PRICE_BLOCK_INVALID_POOLING','COMMERCIAL_FACT_UNVERIFIED','VISUAL_CLAIM_NOT_OBSERVED','PROXY_NOT_SALES_EVIDENCE','OUTLIER_TRANSFERABILITY_UNPROVEN','HANDOFF_STRATEGIST','TEST_CANDIDATE_ONLY']

def git_sha(): return subprocess.run(['git','rev-parse','HEAD'],cwd=ROOT,text=True,capture_output=True,check=True).stdout.strip()
def fetch_blob(sha):
    url=f'https://api.github.com/repos/{CORE_REPO}/git/blobs/{sha}'
    req=urllib.request.Request(url,headers={'Accept':'application/vnd.github+json','User-Agent':'uae-mi-qualification'})
    with urllib.request.urlopen(req,timeout=60) as r: raw=json.loads(r.read().decode())
    if raw.get('encoding')!='base64': raise RuntimeError('unexpected blob encoding')
    return base64.b64decode(raw['content']).decode('utf-8')
def system_text():
    return fetch_blob(BASE_BLOB)+'\n\n'+fetch_blob(OVERLAY_BLOB)+'\n\n# UAE Automotive specialization\n'+SPECIALIZATION.read_text(encoding='utf-8')
def extract_text(raw):
    if isinstance(raw.get('output_text'),str): return raw['output_text']
    for step in reversed(raw.get('steps') or []):
        if isinstance(step,dict) and step.get('type')=='model_output':
            c=step.get('content')
            if isinstance(c,str): return c
            for item in c or []:
                if isinstance(item,dict) and item.get('type')=='text': return item['text']
    raise ValueError('no observable model output')
def api_call(task,schema,system):
    key=os.environ['GEMINI_API_KEY']; model=os.environ.get('UAE_MI_MODEL','gemini-3.1-flash-lite')
    payload={'model':model,'input':task,'system_instruction':system,'response_format':{'type':'text','mime_type':'application/json','schema':schema},'store':False,'generation_config':{'thinking_level':os.environ.get('GEMINI_THINKING_LEVEL','medium')}}
    def run_once():
        req=urllib.request.Request(ENDPOINT,data=json.dumps(payload).encode(),method='POST',headers={'Content-Type':'application/json','x-goog-api-key':key})
        with urllib.request.urlopen(req,timeout=120) as r: raw=json.loads(r.read().decode())
        return json.loads(extract_text(raw).strip()),{'status':'OK','model':model,'usage':raw.get('usage') or raw.get('usageMetadata')}
    try: return run_once()
    except urllib.error.HTTPError as exc:
        if exc.code==429:
            time.sleep(float(os.environ.get('UAE_MI_429_BACKOFF_SECONDS','20')))
            try: return run_once()
            except urllib.error.HTTPError as exc2: return None,{'status':'INFRA_FAILURE','http_status':exc2.code,'error':exc2.read().decode(errors='replace')[:1200],'model':model}
        return None,{'status':'INFRA_FAILURE','http_status':exc.code,'error':exc.read().decode(errors='replace')[:1200],'model':model}
    except Exception as exc: return None,{'status':'EVAL_OUTPUT_FAILURE','error':repr(exc),'model':model}
def delta_schema(ids):
    return {'type':'object','properties':{'answers':{'type':'array','minItems':len(ids),'maxItems':len(ids),'items':{'type':'object','properties':{'case_id':{'type':'string','enum':ids},'decision':{'type':'string','enum':DECISIONS}},'required':['case_id','decision'],'additionalProperties':False}}},'required':['answers'],'additionalProperties':False}
def practical_schema():
    e=lambda *x:{'type':'string','enum':list(x)}
    return {'type':'object','properties':{
      'sample_descriptive_status':e('DERIVED_FACT_WITHIN_SAMPLE','HYPOTHESIS_ONLY','UNRESOLVED'),
      'buyer_signal_status':e('OBSERVED_WITHIN_VISIBLE_COMMENTS','POPULATION_PREVALENCE','UNRESOLVED'),
      'population_prevalence':e('PROVEN','UNPROVEN'),
      'causal_sales_lift':e('PROVEN','UNPROVEN'),
      'first_party_validity':e('CAUSAL','OBSERVATIONAL_CONFOUNDED','UNUSABLE'),
      'commercial_vehicle_fact':e('REQUIRES_VERIFICATION','VERIFIED'),
      'handoff_owner':e('STRATEGIST','MARKET_INTELLIGENCE','CONTENT_CREATOR'),
      'handoff_status':e('TEST_CANDIDATE_ONLY','APPROVED_EXPERIMENT','SCALE'),
      'experiment_design_authority':e('NOT_OWNED_BY_MARKET_INTELLIGENCE','OWNED_BY_MARKET_INTELLIGENCE'),
      'short_reasoning':{'type':'string','minLength':80,'maxLength':1200}
    },'required':['sample_descriptive_status','buyer_signal_status','population_prevalence','causal_sales_lift','first_party_validity','commercial_vehicle_fact','handoff_owner','handoff_status','experiment_design_authority','short_reasoning'],'additionalProperties':False}
def run_delta(cases,system,trials,sha):
    ids=[c['id'] for c in cases]; visible=[{'id':c['id'],'question':c['question']} for c in cases]; results=[]
    task=('Fresh UAE automotive Market Intelligence specialization qualification. Each case asks one decision. Apply the pinned professional core plus specialization. Do not invent commercial facts or take Strategist authority. Return exactly one answer per case. Cases: '+json.dumps(visible,ensure_ascii=False))
    for trial in range(1,trials+1):
        answer,transport=api_call(task,delta_schema(ids),system)
        if answer is None:
            results.extend([{'case_id':c['id'],'trial':trial,'status':transport['status'],**transport} for c in cases]); break
        by={a['case_id']:a for a in answer['answers']}; batch=[]
        for c in cases:
            actual=by[c['id']]['decision']; row={'case_id':c['id'],'trial':trial,'status':'PASS' if actual==c['expected'] else 'FAIL','expected':c['expected'],'actual':actual,'candidate_sha':sha,'model':transport.get('model')}; results.append(row); batch.append(row)
        print(json.dumps({'suite':'uae_delta','trial':trial,'results':batch},ensure_ascii=False))
    return results
def run_practical(case,system,trials,sha):
    visible={k:v for k,v in case.items() if k!='expected'}; expected=case['expected']; results=[]
    task=('Produce the Market Intelligence evidence handoff for this fresh UAE automotive work sample. Preserve bounded facts and uncertainty. Do not design or approve the experiment, publish content, or invent vehicle/commercial facts. Return schema-valid JSON only. Case: '+json.dumps(visible,ensure_ascii=False))
    for trial in range(1,trials+1):
        actual,transport=api_call(task,practical_schema(),system)
        if actual is None: results.append({'trial':trial,'status':transport['status'],**transport}); break
        mm=[{'field':k,'expected':v,'actual':actual.get(k)} for k,v in expected.items() if actual.get(k)!=v]; row={'trial':trial,'status':'PASS' if not mm else 'FAIL','mismatches':mm,'actual':actual,'candidate_sha':sha,'model':transport.get('model')}; results.append(row); print(json.dumps({'suite':'uae_practical',**row},ensure_ascii=False))
    return results
def main():
    if not os.environ.get('GEMINI_API_KEY'): print('GEMINI_API_KEY missing',file=sys.stderr); return 2
    trials=int(os.environ.get('UAE_MI_TRIALS','3')); cases=json.loads(CASES.read_text()); practical=json.loads(PRACTICAL.read_text()); system=system_text(); sha=git_sha(); OUT.mkdir(parents=True,exist_ok=True)
    delta=run_delta(cases,system,trials,sha); practical_results=run_practical(practical,system,trials,sha)
    delta_expected=len(cases)*trials; pass_all=len(delta)==delta_expected and all(r['status']=='PASS' for r in delta) and len(practical_results)==trials and all(r['status']=='PASS' for r in practical_results)
    summary={'candidate_git_sha':sha,'inherited_core_artifact_digest':'sha256:4584599b86125c85c77a10f118eba4b1472f59947bd5106a8a19174ab53f6e03','inherited_assembly_digest':'sha256:7dee471c3b707927fd255a2539548882e2b18765c943d0e6c7dbee9a2edbff62','delta_cases':[c['id'] for c in cases],'trials_per_case':trials,'delta_passes':sum(r['status']=='PASS' for r in delta),'practical_case':practical['id'],'practical_passes':sum(r['status']=='PASS' for r in practical_results),'release_gate':'PASS' if pass_all else 'REVISE_OR_INFRA_BLOCK','delta_results':delta,'practical_results':practical_results}
    (OUT/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
    return 0 if pass_all else 1
if __name__=='__main__': raise SystemExit(main())
