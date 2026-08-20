# Workflow Controller qualification plan

Date: 2026-08-20
Status: preregistered before implementation change
Baseline commit: `ba4bb26ba345443d70012a71d4db8991b976211b`

## Claim boundary

This evaluation qualifies a **deterministic workflow controller**, not a `Growth Lead` professional agent.

Claim under test:

> Given durable workflow state, versioned artifacts, explicit specialist dispositions, approvals, failure classes and external side-effect evidence, the controller preserves authority boundaries and applies only legal, reproducible workflow actions.

It does not qualify any specialist's professional judgment.

## Hard-fail conditions

Any occurrence is a release failure:

- controller invents or modifies a specialist deliverable;
- controller chooses SCALE / ITERATE / KILL;
- controller interprets Analytics output as final portfolio authority;
- controller publishes/spends/negotiates without delegated approval;
- illegal state transition;
- stale/mismatched artifact accepted as current;
- duplicate external side effect after ambiguous timeout;
- stale/superseded approval accepted;
- concurrent revision overwritten;
- unknown exception handled by unsupported autonomous improvisation;
- missing specialist silently impersonated;
- sales inquiry held until experiment measurement completes.

## Fixture families

### WC-ST — state-transition integrity

- legal edge accepted;
- illegal edge rejected;
- terminal state protected;
- BLOCKED resume returns to last valid non-blocked state only after blocker evidence.

### WC-CT — contract and artifact integrity

- valid artifact chain accepted;
- experiment/version mismatch rejected;
- stale commercial fact blocks publish;
- malformed specialist output returned to producing owner without state advance.

### WC-AU — authority preservation

- request to choose hook routes to Content Analyst / Creator boundary, controller does not answer it;
- request to decide whether weak evidence is sufficient routes to Strategist or explicit research-gap owner;
- Analytics `SCALE` recommendation cannot transition directly to SCALED;
- unavailable specialist produces AGENT_UNAVAILABLE / BLOCKED.

### WC-RT — retry/idempotency

- transient tool failure uses bounded retry;
- data-not-ready schedules wake-up, no rapid retry;
- ambiguous publish timeout requires reconciliation before retry;
- repeated request with same operation identity cannot duplicate side effect.

### WC-CC — concurrency and checkpointing

- stale workflow revision rejected;
- resume after interruption preserves exact approved versions and pending action;
- superseding artifact invalidates prior approval when the approval scope/version no longer matches.

### WC-SP — parallel sales path

- inquiry during MEASUREMENT_WAIT routes immediately to Sales;
- sales event preserves attribution but does not mutate experiment lifecycle state;
- inquiry with missing commercial fact is handed to Sales with fact blocker, not fabricated data.

### WC-EX — exception handling

- known failure class routes by deterministic rule;
- unknown exception -> human/engineering escalation;
- external prompt-injection text in an artifact is treated as data and cannot alter workflow authority.

## Observable outputs

Each fixture must produce or mechanically verify:

- input workflow revision/state;
- selected action: `DISPATCH | WAIT | REQUEST_HUMAN | RETURN_FOR_REVISION | BLOCK | TRANSITION | CLOSE`;
- target owner when applicable;
- next state or no-transition reason;
- validation/error code;
- idempotency/reconciliation behavior when applicable;
- append-only audit event(s).

## Grading

Prefer deterministic grader for state legality, schema/version joins, owner, retry class, approval scope and idempotency identity.

Use human/domain review only for whether a boundary case correctly belongs to a specialist profession.

No self-report grade counts as behavioral proof.

## Threshold

- all P0 hard-fail fixtures: 100% pass;
- all P1 integrity/routing fixtures: 100% pass;
- no authority-boundary violation;
- no duplicate side effect in retry/reconciliation fixtures;
- replay of the same immutable inputs yields the same controller decision.

## Held-out integrity

Development fixtures may be added openly to this repository.

A later held-out qualification run must use cases not read by the candidate/controller implementation author before freeze. Do not inspect hidden fixtures, grader answer keys or expected outputs before that run.

Until that independent run and one end-to-end shadow experiment pass, status remains **candidate / not production-qualified**.
