# Orchestration Runbook

## Purpose

This is the minimum operating procedure for the deterministic Workflow Controller. It is framework-neutral and executable with a database, JSON Schema validator, job queue and human review screen.

`ORCHESTRATOR` is retained only as the compatibility identifier in existing schemas. It does not mean a general-purpose Growth Lead agent.

## Start one workflow

1. Create a record validating against `data-schemas/orchestrator-workflow.schema.json`.
2. Set `revision = 1`, `state = INTAKE`, `owner = ORCHESTRATOR`.
3. Attach the business request as a versioned artifact.
4. Route to Strategist for experiment framing with the currently available structured evidence references.
5. If Strategist explicitly identifies a research gap, create a `RESEARCH` handoff to Market Intelligence.
6. Validate before dispatch and after every response.
7. Append a transition event only after the required artifact/disposition is valid.
8. Increment revision with optimistic locking.

The controller never decides whether evidence is strategically sufficient. It only checks machine-verifiable presence, schema/version identity and declared freshness rules.

## Artifact chain

A normal experiment must preserve this join:

business request / current evidence refs
→ strategy experiment or explicit research request
→ market report when requested
→ approved strategy experiment
→ content spec
→ creator deliverable
→ post-production deliverable
→ publish record
→ analytics observation
→ analytics decision
→ strategist portfolio decision
→ growth knowledge entry

Every artifact carries `experiment_id` and experiment version where applicable. Never identify an experiment only by title, URL or chat thread.

## Required adapters

| Producer | Required output | Consumer |
|---|---|---|
| Strategist | strategy-experiment or explicit research request | Market Intelligence / Content Analyst / Analytics |
| Market Intelligence | market-intelligence-report.schema.json | Strategist |
| Content Analyst | content-spec.schema.json | Content Creator, Analytics |
| Content Creator | creator-deliverable.schema.json | Video Post-Production, Analytics |
| Video Post-Production | post-production-deliverable.schema.json | Human/Publisher, Analytics |
| Publisher | publish-record.schema.json | Analytics, Sales attribution |
| Sales | sales-funnel-event.schema.json | Analytics |
| Analytics | analytics-decision.schema.json | Strategist |
| Strategist | final status + decision evidence | Workflow Controller |
| Workflow Controller | state/audit transition after valid evidence | shared workflow ledger |

The Workflow Controller does not author `growth-knowledge-entry` content. It may persist/register an entry only after the evidence-bearing specialists have produced the required decision material under the declared knowledge contract.

## Pre-dispatch gate

Before any specialist call:

- current workflow revision matches;
- current state permits the dispatch;
- task type maps to the declared professional owner;
- required artifact references are present;
- artifact schemas and experiment/version joins validate;
- approval scope/version is current where required;
- commercial-fact freshness gate passes where required;
- operation identity/idempotency key exists;
- pre-dispatch audit event is appendable.

If a semantic question is required to decide the route, return it to the profession that owns that question. Do not let controller reasoning fill the gap.

## Pre-publish checklist

- experiment version is approved;
- content spec is `READY_FOR_CREATOR`;
- creative maps to every required block ID;
- post-production render exists and its deterministic, perceptual, truth and delivery QC passed;
- no `INVALIDATES_TEST` deviation;
- vehicle, price, availability, offer, finance, warranty, history and condition facts are current under authoritative fact rules;
- CTA destination works;
- experiment/content/vehicle tracking token is present;
- human approval is bound to the exact render/current version;
- measurement plan and decision checkpoint are scheduled.

## Post-publish checklist

- capture platform content ID, URL and publication timestamp;
- capture actual duration/block/offer/CTA timestamps and deviations;
- start the declared observation window;
- route attributed inquiries to Sales immediately and in parallel;
- keep immutable measurement snapshots as required;
- wake Analytics only when the declared checkpoint or guardrail is reached.

Sales routing never waits for measurement completion.

## Contract violation handling

- Input invalid: do not dispatch; request the missing/corrected field from the current owner.
- Output invalid: keep current state; return field-level errors to producer.
- Wrong IDs/version: reject as stale/mismatched artifact.
- Strategic lock changed downstream: return to Strategist.
- Structural lock cannot be executed: return to Content Analyst.
- Commercial fact missing/stale/conflicting: human or authoritative fact-system resolution.
- Repeated bounded contract violation: `BLOCKED` and engineering/human review.
- Unknown exception: `BLOCKED`; no autonomous improvisation.

## Retry defaults

- `TRANSIENT_TOOL`: maximum two automatic retries after the first attempt.
- Delay: exponential backoff with jitter.
- Reuse the same idempotency key for the same intended side effect.
- Before retrying publication/message/appointment or any other ambiguous side effect, reconcile external state.
- `DATA_NOT_READY`: schedule a wake-up at the declared checkpoint.
- Contract, permission, business-fact, logic, safety/compliance and unknown failures: no blind retry.

## Approval lifecycle

Approval is not a timeless boolean.

Store:

- approval type;
- exact workflow/experiment/artifact/commercial-fact version covered;
- approver;
- timestamp;
- expiry/supersession state where applicable.

If a behavior-relevant artifact/version changes after approval, treat the prior approval as no longer sufficient unless an explicit policy proves that the change is outside approval scope.

## Human inbox

Show only actionable approvals/exceptions:

- experiment approval;
- creative/fact/publish approval;
- commercial fact conflict;
- sensitive Sales handoff;
- material scale approval;
- exception/legal/privacy/complaint review.

Each item must show the exact decision, evidence, consequence, version scope, owner after approval/rejection and deadline.

## Daily operator view

- active experiments by state and owner;
- blocked items with age and blocker owner;
- publications due today;
- experiments due for Analytics;
- inquiries without owner/response;
- missing attribution or sale-outcome joins;
- scale candidates awaiting Strategist/human decision;
- recent contract violations, retries and reconciliation events;
- workflows without a next action/wake condition.

## Bootstrap sequence

1. Keep specialist contracts versioned and validated.
2. Run `evaluation/orchestrator/run-dev-qualification.mjs` for controller policy regressions.
3. Add schema validation in CI for every JSON Schema and representative valid/invalid fixtures.
4. Add persistent workflow state plus append-only event/audit storage.
5. Add a worker using revision/lease and idempotency keys.
6. Add durable human approval records/UI.
7. Connect read-only verified inventory/commercial facts.
8. Connect publication/attribution/inquiry/outcome adapters.
9. Test timeout/reconciliation behavior for every mutating side effect.
10. Run one complete experiment end-to-end in shadow/manual mode.
11. Reconstruct the run without chat logs.
12. Only then consider automated routing production-qualified, subject to held-out qualification.
