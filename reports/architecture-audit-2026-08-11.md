# Architecture audit — 2026-08-11

## Scope inspected

All repository files were enumerated from commit history. Every existing agent and every JSON Schema was read:

- agents/market-intelligence.md
- agents/strategist.md
- agents/content-analyst.md
- agents/analytics.md
- agents/sales-lead-conversion.md
- all pre-existing files under data-schemas/

Research, collection scripts, workflow, measurement playbook and README were also reviewed for system context.

## Overall result

The specialist boundaries are unusually strong for an early repository. Strategist, Content Analyst, Analytics and Sales clearly separate decision rights and already preserve experiment_id in most downstream records.

The repository was not yet an executable closed loop. It lacked an orchestrator, a workflow state record, a universal handoff envelope, a structured Market Intelligence output, a Creator output, a publication record and a shared-learning contract. Those contracts are now added.

## Contract compatibility

| Boundary | Result | Finding |
|---|---|---|
| Market Intelligence → Strategist | FIXED | Agent prose existed; structured output contract was missing. Added market-intelligence-report.schema.json. |
| Strategist → Content Analyst | PASS | strategy-experiment and content-spec boundaries are aligned. |
| Content Analyst → Creator | PARTIAL / P0 | content-spec defines the handoff, and creator-deliverable schema now exists; agents/content-creator.md is absent. |
| Creator → Publish | FIXED CONTRACT / P0 RUNTIME | creator-deliverable and publish-record contracts now exist; publishing remains human/manual. |
| Publish → Analytics | FIXED CONTRACT | publish-record supplies platform IDs, actual execution and attribution fields. |
| Sales → Analytics | PASS WITH ADAPTER | sales-funnel-event is strong; Analytics observation uses a smaller funnel-event vocabulary, so an explicit deterministic mapping adapter is required. |
| Analytics → Strategist | PASS | Analytics recommends; Strategist owns the final decision. |
| Decision → shared knowledge | FIXED CONTRACT | growth-knowledge-entry schema added. |
| All agents → Orchestrator | FIXED CONTRACT | agent-handoff and orchestrator-workflow schemas added. |

## Conflicts and risks

### P0 — Content Creator Agent is absent

README listed Content Creator without active status, and no agents/content-creator.md exists. The system must stop at CREATIVE_REQUIRED with AGENT_UNAVAILABLE. Do not let the Orchestrator, Strategist or Content Analyst write the creative as a workaround.

Required fix:
- install Content Creator Agent;
- require creator-deliverable.schema.json output;
- add Creator contract tests preserving block IDs and controlled variables.

### P0 — No runtime or persistent ledger

The repository defines agents and schemas but has no executable orchestrator, database tables, queue, leases, idempotency store or approval UI.

Required minimum:
- workflow table with revision and current owner;
- append-only workflow_events table;
- artifact registry;
- approval records;
- job claims/leases;
- scheduled wake-ups;
- schema validation in worker and CI.

### P0 — No verified business-facts adapter

Sales correctly forbids invented facts, but no current inventory/price/offer/finance/warranty/history/condition adapter is present. Content and publication also depend on the same facts.

Required minimum:
- read-only fact records with source, verified_at, expires_at and status;
- publication and sales gates rejecting stale/conflicting facts;
- human correction path.

### P0 — Attribution is designed but not operationally connected

Schemas preserve experiment/content/vehicle attribution, but Instagram/YouTube/Telegram/WhatsApp entry points and CRM joins are not implemented.

Required minimum:
- unique CTA tokens/links/keywords;
- immutable inquiry capture;
- identity-safe lead linkage;
- platform content ID and vehicle ID propagation;
- appointment/sale outcome backfill discipline.

### P1 — Sales/Analytics event vocabulary mismatch

sales-funnel-event has detailed events such as APPOINTMENT_SET and SALE_WON. analytics-observation accepts broad funnel events such as APPOINTMENT and SALE. This is not fatal, but direct schema reuse is impossible.

Required fix:
- deterministic versioned mapping table;
- preserve original sales event ID/type in metadata;
- never discard APPOINTMENT proposed/set/show distinctions in the raw store.

### P1 — Strategy status mixes lifecycle and decision

strategy-experiment.status contains BACKLOG/APPROVED/RUNNING and CONTINUE/ITERATE/SCALE/KILL. Operational workflow state must not be stored only there.

Resolution:
- orchestrator-workflow is the operational source;
- strategy status remains Strategist-owned decision state;
- use the mapping defined in agents/orchestrator-growth-lead.md.

### P1 — Market Intelligence prose and examples are not yet migrated

The new structured contract exists, but the current Market Intelligence agent file does not yet explicitly require it.

Required fix:
- update the agent in its next revision to validate against market-intelligence-report.schema.json;
- preserve existing narrative reports as human-readable views of the structured artifact.

### P1 — No fixtures or CI schema validation

Schemas may drift without valid/invalid examples and reference resolution tests.

Required fix:
- add an AJV or equivalent Draft 2020-12 test;
- test all $ref resolution;
- add one valid and several invalid fixtures per handoff;
- fail CI on incompatible contract changes.

### P1 — Human approval policy needs named business roles

The contracts identify HUMAN but not who may approve experiment, creative, commercial facts, publish and scaling.

Required fix:
- define role-to-approval matrix and substitutes;
- record approver ID, authority scope and expiry;
- forbid self-approval where separation is necessary.

### P2 — No cost or capacity controls

The system is intended to be cheap, but no per-run token/tool budget, active-experiment WIP limit or daily spend guardrail is encoded.

Required fix:
- add configurable budgets and alerts;
- keep WIP limit human-configured;
- cache immutable artifacts and avoid resending full histories.

### P2 — No prompt/schema version registry

Agent documents exist, but runtime versioning and compatibility are not defined.

Required fix:
- register agent_version, prompt_version, policy_version and supported input/output schema versions;
- reject unsupported contracts;
- include versions in traces and artifacts.

### P2 — Privacy retention and access policy is incomplete

Sales mentions minimum necessary data and opt-out, but repository-wide retention, redaction and deletion handling are not operational.

Required fix:
- separate growth analytics from CRM PII;
- redact traces;
- define retention and deletion propagation;
- restrict raw conversation/document access.

## What should not be automated now

- final publication;
- autonomous paid scaling;
- creation/correction of commercial facts;
- discounts, negotiation, finance decisions, deposits and trade-in valuation;
- ambiguous identity merges;
- legal/privacy/complaint decisions;
- final sale/gross-profit attribution correction;
- strategic approval.

## Recommended implementation order

1. Finish and install Content Creator Agent.
2. Add schema validation plus fixtures in CI.
3. Implement workflow/event/artifact/approval storage.
4. Connect verified business facts.
5. Connect publish record and attribution tokens.
6. Connect inquiry capture and Sales events.
7. Add Analytics observation mapper and outcome joins.
8. Run one end-to-end experiment manually with complete audit reconstruction.
9. Only then automate routing and selected low-risk actions.
10. Consider LangGraph/Temporal after real durability requirements appear.

## Acceptance test for the first live experiment

The system is operational only if one experiment can be reconstructed without chat history:

- evidence report;
- approved strategy version;
- content spec;
- creator deliverable;
- human approval;
- publication record;
- attributed inquiries and Sales events;
- measurement snapshots;
- Analytics decision;
- Strategist final decision;
- shared knowledge entry;
- complete handoff/transition/error trail.

Until this passes, the architecture is contract-ready but not production-ready.
