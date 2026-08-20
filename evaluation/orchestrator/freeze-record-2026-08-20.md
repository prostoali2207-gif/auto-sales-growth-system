# Workflow Controller candidate freeze

Date: 2026-08-20

Behavioral candidate commit: `8235e81877de1e175a2830c311d72ec5874c7f87`

The controller implementation, executable policy, workflow schema and development regressions are frozen at this commit for the next post-freeze adversarial run.

Files inside the behavioral freeze:

- `agents/orchestrator-growth-lead.md`
- `config/orchestrator-policy.json`
- `scripts/orchestrator-policy.mjs`
- `data-schemas/orchestrator-workflow.schema.json`
- `playbooks/orchestration-runbook.md`
- `evaluation/orchestrator/run-dev-qualification.mjs`

Rules for the next run:

1. Do not modify the above behavior-relevant files after inspecting the post-freeze fixture results.
2. A failing adversarial case fails this candidate. Repair requires a new candidate freeze and a fresh adversarial layer.
3. Passing the post-freeze pack is not by itself production qualification because the pack is authored within the same reconstruction effort and therefore has weaker independence than an external/sealed evaluator.
4. Production readiness still requires an independently authored held-out layer plus a practical end-to-end shadow run.
