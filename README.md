# Auto Sales Growth System

System for researching the UAE automotive market and turning evidence into social-media content, qualified leads, appointments and vehicle sales.

## Core principle

Do not invent content ideas in isolation. Collect evidence, register a measurable experiment, preserve controlled variables, publish with attribution, connect inquiries to sales outcomes, and keep only learning supported by data.

## Structure

- `agents/` — specialist instructions and workflow-controller contract
- `playbooks/` — repeatable operating procedures
- `research/` — market and architecture research
- `data-schemas/` — structured artifacts, state and handoff contracts
- `evaluation/` — development/qualification gates
- `reports/` — dated analysis and architecture audits

## Operating roles

1. Workflow Controller (`ORCHESTRATOR` compatibility identifier) — candidate deterministic control mechanism, not a Growth Lead Professional Core
2. Market Intelligence Agent — active
3. Strategist Agent — active
4. Content Analyst Agent — active
5. Content Creator Agent — active
6. UAE Automotive Video Post-Production Agent — candidate integration
7. Sales / Lead Conversion Agent — active
8. Analytics Agent — active
9. Publisher — human/manual for now

The Workflow Controller owns only workflow mechanics: state, routing by declared contracts, validation, retries, approvals, timers, idempotency and auditability. It never performs specialist work or decides strategy, measurement interpretation, creative quality, lead qualification or portfolio outcomes.

## Core operating loop

Default operating hypothesis:

`Strategist intake/frame → Market Intelligence when explicitly requested → Strategist → Content Analyst → Content Creator → Video Post-Production → human approval → Publisher → Sales path + measurement → Analytics → Strategist → SCALE / ITERATE / KILL → shared knowledge`

This sequence is not sacred. Specialist dispositions and evidence may route back for research/revision, while the controller enforces only legal deterministic edges.

## Operational contracts

- `data-schemas/orchestrator-workflow.schema.json`
- `data-schemas/agent-handoff.schema.json`
- `config/orchestrator-policy.json`
- `data-schemas/market-intelligence-report.schema.json`
- `data-schemas/strategy-experiment.schema.json`
- `data-schemas/content-spec.schema.json`
- `data-schemas/creator-deliverable.schema.json`
- `data-schemas/post-production-deliverable.schema.json`
- `data-schemas/publish-record.schema.json`
- `data-schemas/analytics-observation.schema.json`
- `data-schemas/analytics-decision.schema.json`
- `data-schemas/lead-attribution.schema.json`
- `data-schemas/sales-lead.schema.json`
- `data-schemas/sales-lead-turn.schema.json`
- `data-schemas/sales-funnel-event.schema.json`
- `data-schemas/growth-knowledge-entry.schema.json`

## Start here

- Workflow Controller contract: `agents/orchestrator-growth-lead.md`
- Executable policy helpers: `scripts/orchestrator-policy.mjs`
- Controller qualification plan: `evaluation/orchestrator/qualification-plan.md`
- Architect reconstruction: `research/orchestrator-profession-reconstruction-2026-08-20.md`
- Operating procedure: `playbooks/orchestration-runbook.md`
- Prior architecture sources: `research/orchestrator-architecture-sources-2026-08.md`
- Full system audit: `reports/architecture-audit-2026-08-11.md`

## Current readiness

The repository is not yet production-ready.

The Workflow Controller remains **candidate / not production-qualified** until:

1. development/regression fixtures pass in executable CI;
2. a genuinely independent held-out/adversarial layer passes without tuning to it;
3. persistent workflow/event/artifact/approval storage exists;
4. verified inventory/commercial-fact adapters exist;
5. publication/attribution/inquiry/outcome adapters exist with reconciliation for ambiguous side effects;
6. checkpoint/resume and approval supersession are tested;
7. one end-to-end shadow/manual experiment can be reconstructed without chat logs.
