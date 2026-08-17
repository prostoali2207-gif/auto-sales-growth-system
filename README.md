# Auto Sales Growth System

System for researching the UAE automotive market and turning evidence into social-media content, qualified leads, appointments and vehicle sales.

## Core principle

Do not invent content ideas in isolation. Collect evidence, register a measurable experiment, preserve controlled variables, publish with attribution, connect inquiries to sales outcomes, and keep only learning supported by data.

## Structure

- `agents/` — specialist and orchestration instructions
- `playbooks/` — repeatable operating procedures
- `research/` — market and architecture research
- `data-schemas/` — structured artifacts, state and handoff contracts
- `reports/` — dated analysis and architecture audits
- `scripts/meta-ads-executor.mjs` — guarded Meta Marketing API publisher

## Agent team

1. Orchestrator / Growth Lead Agent — active
2. Market Intelligence Agent — active
3. Strategist Agent — active
4. Content Analyst Agent — active
5. Content Creator Agent — active
6. UAE Automotive Video Post-Production Agent — candidate integration
7. Sales / Lead Conversion Agent — active
8. Analytics Agent — active
9. Publisher — human-approved; guarded Meta API executor available for validation and paused creation

The Orchestrator owns workflow state, routing, contract validation, retries, approvals and auditability. It never performs a specialist's work.

## Core operating loop

`Market Intelligence → Strategist → Content Analyst → Content Creator → Video Post-Production → human approval → Publisher → Sales path + measurement → Analytics → Strategist → SCALE / ITERATE / KILL → shared knowledge`

## Operational contracts

- `data-schemas/orchestrator-workflow.schema.json`
- `data-schemas/agent-handoff.schema.json`
- `data-schemas/market-intelligence-report.schema.json`
- `data-schemas/strategy-experiment.schema.json`
- `data-schemas/content-spec.schema.json`
- `data-schemas/creator-deliverable.schema.json`
- `data-schemas/post-production-deliverable.schema.json`
- `data-schemas/publish-record.schema.json`
- `data-schemas/meta-ad-launch-spec.schema.json`
- `data-schemas/analytics-observation.schema.json`
- `data-schemas/analytics-decision.schema.json`
- `data-schemas/lead-attribution.schema.json`
- `data-schemas/sales-lead.schema.json`
- `data-schemas/sales-lead-turn.schema.json`
- `data-schemas/sales-funnel-event.schema.json`
- `data-schemas/growth-knowledge-entry.schema.json`

## Start here

- Orchestrator: `agents/orchestrator-growth-lead.md`
- Content Creator: `agents/content-creator.md`
- Video Post-Production: `agents/uae-automotive-video-post-production.md`
- Operating procedure: `playbooks/orchestration-runbook.md`
- Meta Ads Executor: `docs/meta-ads-executor.md`
- Architecture research: `research/orchestrator-architecture-sources-2026-08.md`
- Full system audit: `reports/architecture-audit-2026-08-11.md`

## Current readiness

The repository is contract-ready, not yet production-ready. Meta ad specifications can be validated and, after one-time credentials and environment configuration, created through a guarded executor. Browser-based authorization, creative upload and inspection remain explicit human-controlled steps.

Before a live automated loop:

1. add schema validation and fixtures in CI;
2. implement persistent workflow/event/artifact/approval storage;
3. connect verified inventory and commercial facts;
4. connect a render-capable media toolchain and artifact inspection;
5. connect publication/attribution/inquiry/outcome data;
6. complete one end-to-end experiment whose entire history can be reconstructed without chat logs.
