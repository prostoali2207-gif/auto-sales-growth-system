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
            "Do not pretend the video was mounted", "INVALIDATES_TEST"
        ):
            self.assertIn(phrase, text)

    def test_cases_cover_automotive_delta(self):
        cases = json.loads((Path(__file__).with_name("semantic-cases.json")).read_text())
        self.assertEqual(len(cases), 8)
        self.assertEqual(len({case["id"] for case in cases}), 8)


if __name__ == "__main__":
    unittest.main()
