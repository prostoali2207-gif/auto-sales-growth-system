# Orchestration Runbook

## Purpose

This is the minimum operating procedure for the Growth Orchestrator. It is intentionally framework-neutral and executable with a database, JSON Schema validator, job queue and human review screen.

## Start one workflow

1. Create a record validating against data-schemas/orchestrator-workflow.schema.json.
2. Set revision = 1, state = INTAKE, owner = ORCHESTRATOR.
3. Attach the business request as a versioned artifact.
4. Decide whether current structured Market Intelligence and business facts are sufficient.
5. Create an agent-handoff envelope for the next owner.
6. Validate before dispatch and after response.
7. Append a transition event only after the new artifact is valid.
8. Increment revision with optimistic locking.

## Artifact chain

A normal experiment must preserve this join:

market report
→ strategy experiment
→ content spec
→ creator deliverable
→ post-production deliverable
→ publish record
→ analytics observation
→ analytics decision
→ strategist portfolio decision
→ growth knowledge entry

Every artifact carries experiment_id where applicable. Never identify an experiment only by title, URL or chat thread.

## Required adapters

| Producer | Required output | Consumer |
|---|---|---|
| Market Intelligence | market-intelligence-report.schema.json | Strategist |
| Strategist | strategy-experiment.schema.json | Content Analyst, Analytics |
| Content Analyst | content-spec.schema.json | Content Creator, Analytics |
| Content Creator | creator-deliverable.schema.json | Video Post-Production, Analytics |
| Video Post-Production | post-production-deliverable.schema.json | Human/Publisher, Analytics |
| Publisher | publish-record.schema.json | Analytics, Sales attribution |
| Sales | sales-funnel-event.schema.json | Analytics |
| Analytics | analytics-decision.schema.json | Strategist |
| Strategist | final status + decision evidence | Orchestrator |
| Orchestrator | growth-knowledge-entry.schema.json after evidence and decision | shared knowledge |

## Pre-publish checklist

- experiment version is approved;
- content spec is READY_FOR_CREATOR;
- creative maps to every required block ID;
- post-production render exists and its deterministic, perceptual, truth and delivery QC passed;
- no INVALIDATES_TEST deviation;
- vehicle, price, availability, offer, finance, warranty, history and condition facts are current;
- CTA destination works;
- experiment/content/vehicle tracking token is present;
- human approval is recorded;
- measurement plan and decision date are scheduled.

## Post-publish checklist

- capture platform content ID, URL and publication timestamp;
- capture actual duration/block/offer/CTA timestamps and deviations;
- start the declared observation window;
- route attributed inquiries to Sales immediately;
- keep daily immutable measurement snapshots;
- wake Analytics only when the checkpoint is due or a guardrail requires early review.

## Contract violation handling

- Input invalid: do not dispatch; request the missing field from the current owner.
- Output invalid: keep current state; return field-level errors to producer.
- Wrong IDs/version: reject as STALE_ARTIFACT.
- Strategic lock changed downstream: return to Strategist.
- Structural lock cannot be executed: return to Content Analyst.
- Commercial fact missing/stale: human or authoritative fact-system review.
- Repeated violation: BLOCKED and engineering/human review.

## Retry defaults

- Transient external failure: two automatic retries after the first attempt.
- Delay: exponential backoff with jitter.
- Reuse the same idempotency key for the same intended side effect.
- Before retrying publication/message/appointment, reconcile external state.
- Data not ready: schedule a wake-up at the declared checkpoint.
- Contract, permission, business fact, logic and safety failures: no blind retry.

## Human inbox

Show only actionable approvals:

- experiment approval;
- creative/fact/publish approval;
- commercial fact conflict;
- sensitive Sales handoff;
- material scale approval;
- exception/legal/privacy/complaint review.

Each item must show exact decision, evidence, consequence, owner after approval/rejection and deadline.

## Daily operator view

- Active experiments by state and owner.
- Blocked items with age.
- Publications due today.
- Experiments due for Analytics.
- Inquiries without owner/response.
- Missing attribution or sale outcome joins.
- Scale candidates awaiting decision.
- Recent contract violations and retries.

## Bootstrap sequence

1. Install Content Creator Agent and make it emit creator-deliverable.schema.json.
2. Install Video Post-Production and make it emit post-production-deliverable.schema.json.
3. Add a schema validator in CI for every JSON Schema and example fixture.
4. Add example valid/invalid handoff fixtures.
5. Add a persistent workflow table plus append-only event table.
6. Add a small worker that claims work using revision/lease and idempotency keys.
7. Add human approval UI or controlled manual approval records.
8. Connect read-only verified inventory/commercial facts.
9. Connect a render-capable toolchain and direct artifact inspection.
10. Run one experiment end-to-end in shadow/manual mode.
11. Enable automated routing only after the audit trail reconstructs the full run.
