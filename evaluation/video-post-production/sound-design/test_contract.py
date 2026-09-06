#!/usr/bin/env python3
from __future__ import annotations
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
HERE=Path(__file__).resolve().parent
AGENT=(ROOT/"agents"/"uae-automotive-video-post-production.md").read_text(encoding="utf-8")
SCHEMA=json.loads((ROOT/"data-schemas"/"post-production-deliverable.schema.json").read_text(encoding="utf-8"))
CASES=json.loads((HERE/"automotive-cases.json").read_text(encoding="utf-8"))

assert "CANDIDATE / NOT QUALIFIED" in AGENT
assert "professional-ai-agents#289" in AGENT
modes=SCHEMA["properties"]["audio"]["properties"]["mode"]["enum"]
assert "SOUND_DESIGN" in modes and "SPEECH_SOUND_DESIGN" in modes
assert "sound_design" in SCHEMA["properties"]["audio"]["properties"]
assert len(CASES)==8
ids=[c["id"] for c in CASES]
assert len(ids)==len(set(ids))
for c in CASES:
    assert c["allowed_actions"] and c["forbidden_actions"] and c["required_flags"]
    assert set(c["allowed_actions"]).isdisjoint(set(c["forbidden_actions"]))
assert any(c["id"]=="AUTO-CSD-S7" and "sound_design_mode" in c["required_flags"] for c in CASES)
assert any(c["id"]=="AUTO-CSD-S8" and "READY_FOR_REVIEW" in c["forbidden_actions"] for c in CASES)
print("automotive sound-design deterministic contract: PASS")
