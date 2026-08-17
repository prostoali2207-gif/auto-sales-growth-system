import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


class AutomotiveVideoPostProductionContract(unittest.TestCase):
    def test_schema_and_agent_exist(self):
        self.assertTrue((ROOT / "data-schemas/post-production-deliverable.schema.json").is_file())
        self.assertTrue((ROOT / "agents/uae-automotive-video-post-production.md").is_file())

    def test_schema_requires_artifact_for_ready(self):
        schema = json.loads((ROOT / "data-schemas/post-production-deliverable.schema.json").read_text())
        self.assertEqual(schema["properties"]["status"]["enum"][0], "READY_FOR_REVIEW")
        ready = schema["allOf"][0]["then"]["properties"]["export"]["properties"]
        self.assertEqual(ready["sha256"]["pattern"], "^[A-Fa-f0-9]{64}$")
        self.assertEqual(ready["duration_seconds"]["exclusiveMinimum"], 0)

    def test_agent_keeps_professional_and_project_boundaries(self):
        text = (ROOT / "agents/uae-automotive-video-post-production.md").read_text()
        for phrase in (
            "does not copy or redefine", "no per-vehicle agent", "never publish directly",
            "Do not pretend the video was mounted", "INVALIDATES_TEST",
            "sha256:7ff8ee887d64565632536596acaacfbcf884404abadd6003f2584f61eb1dfb9b"
        ):
            self.assertIn(phrase, text)

    def test_qualification_record_binds_parent_and_subject(self):
        record = json.loads((Path(__file__).with_name("qualification-record.json")).read_text())
        self.assertEqual(record["status"], "pass")
        self.assertEqual(record["subject_commit"], "480efbecf07abb53b8707a852bd4acb59c534e48")
        self.assertEqual(record["parent_core_digest"], "sha256:7ff8ee887d64565632536596acaacfbcf884404abadd6003f2584f61eb1dfb9b")
        self.assertEqual(record["evaluation"]["critical_passes"], "12/12")
        self.assertEqual(record["evaluation"]["complete_passes"], "8/8")

    def test_cases_cover_automotive_delta(self):
        cases = json.loads((Path(__file__).with_name("semantic-cases.json")).read_text())
        self.assertEqual(len(cases), 8)
        self.assertEqual(len({case["id"] for case in cases}), 8)
        for case in cases:
            self.assertTrue(case["allowed_actions"])
            self.assertTrue(case["forbidden_actions"])
            self.assertTrue(case["required_flags"])

    def test_semantic_gate_is_bounded(self):
        runner = (Path(__file__).with_name("run-semantic-gate.py")).read_text()
        workflow = (ROOT / ".github/workflows/automotive-video-post-production-qualification.yml").read_text()
        self.assertIn("single gate invocation exceeds 3-call budget", runner)
        self.assertIn("exactly 3 model calls", workflow)
        self.assertIn("exactly 2 model calls", workflow)
        self.assertIn("application_retries", runner)

    def test_orchestrator_and_handoff_route_post_production(self):
        workflow = json.loads((ROOT / "data-schemas/orchestrator-workflow.schema.json").read_text())
        self.assertIn("POST_PRODUCTION_REQUIRED", workflow["$defs"]["state"]["enum"])
        self.assertIn("POST_PRODUCTION_IN_PROGRESS", workflow["$defs"]["state"]["enum"])
        self.assertIn("VIDEO_POST_PRODUCTION", workflow["$defs"]["owner"]["enum"])
        handoff = json.loads((ROOT / "data-schemas/agent-handoff.schema.json").read_text())
        self.assertIn("VIDEO_POST_PRODUCTION", handoff["properties"]["target_owner"]["enum"])
        self.assertIn("POST_PRODUCE_VIDEO", handoff["properties"]["task_type"]["enum"])

    def test_render_is_joinable_to_publish_and_analytics(self):
        publish = json.loads((ROOT / "data-schemas/publish-record.schema.json").read_text())
        observation = json.loads((ROOT / "data-schemas/analytics-observation.schema.json").read_text())
        self.assertIn("render_id", publish["properties"])
        self.assertIn("render_id", observation["properties"])


if __name__ == "__main__":
    unittest.main()
