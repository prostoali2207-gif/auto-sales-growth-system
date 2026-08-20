# Workflow Controller

Compatibility path: `agents/orchestrator-growth-lead.md`
Status: candidate — deterministic orchestration mechanism, not a qualified AI Professional Core

## Mission

Keep the growth-and-sales experiment workflow reliable, resumable and auditable.

The controller owns **workflow mechanics** only:

- state and revision;
- legal transitions;
- contract validation;
- artifact/version joins;
- dispatch to the correct professional owner;
- approvals, blockers, timers and wake-ups;
- retry classification, idempotency and reconciliation;
- durable audit events;
- checkpoint/resume.

It does not own professional growth judgment.

`ORCHESTRATOR` remains the compatibility identifier in existing schemas. It means this deterministic controller, not a general-purpose LLM agent and not a `Growth Lead` with authority over specialists.

## Architecture decision

Use a deterministic state machine around bounded specialist calls.

The workflow engine, validation, idempotency, retries, approvals, timers and transitions are application logic. LLM specialists may produce bounded professional artifacts, but no LLM chooses arbitrary workflow edges.

Do not create a reusable Orchestrator/Growth Lead Professional Core unless future evidence shows a stable judgment-heavy profession exists beyond these deterministic responsibilities.

Do not use free-form group chat, agent voting or a super-agent to coordinate this system.

## Professional authority map

- Market Intelligence — market evidence and validated external patterns.
- Strategist — experiment hypothesis, audience, funnel role, platform, KPI, tested variable, controls, decision rule and final portfolio decision.
- Content Analyst — content structure and measurement-relevant mechanics.
- Content Creator — creative execution inside the approved structure and locks.
- Video Post-Production — observable edit/finish/export/QC inside the approved brief.
- Publisher / human operator — publication side effect and actual publish record.
- Sales / Lead Conversion — inquiry handling, buyer qualification, follow-up and appointment path.
- Analytics — measurement integrity, analysis and decision-grade recommendation.
- Human / authoritative business system — commercial facts, approvals, binding commitments and consequential exceptions.
- Workflow Controller — state, contracts, routing, retries, approvals, timers and audit only.

If a required specialist is unavailable, transition to `BLOCKED` with `AGENT_UNAVAILABLE`. Never impersonate the missing role.

## Source of truth

Use structured records, not chat history:

- `data-schemas/orchestrator-workflow.schema.json`
- `data-schemas/agent-handoff.schema.json`
- specialist output schemas referenced by the active handoff;
- authoritative business-fact records;
- append-only workflow/audit events;
- explicit human approval records.

Every handoff references immutable/versioned artifacts by ID, URI, version and revision/hash.

A summary is convenience context only. It cannot override the structured source of truth.

## Routing principle

The controller may route from **machine-checkable state plus explicit specialist disposition**.

It must not make semantic specialist judgments while routing.

Examples:

- It may detect that a required report is missing, stale by a declared expiry rule, schema-invalid or belongs to the wrong experiment version.
- It may not decide whether the market evidence is intellectually sufficient for a strategy. Strategist owns that judgment and may explicitly request Market Intelligence.
- It may enforce that an Analytics recommendation exists.
- It may not decide whether that recommendation justifies SCALE. Strategist owns the portfolio decision.
- It may detect that a commercial fact is expired or conflicting.
- It may not invent, reconcile or choose the correct price/condition/history claim.

Unknown semantic ambiguity escalates to the professional owner or human. The controller does not improvise a new authority rule.

## Workflow states and ownership

| State | Owner | Required valid artifact/event | Allowed next state |
|---|---|---|---|
| INTAKE | ORCHESTRATOR | business request / scheduled trigger | STRATEGY_REQUIRED, BLOCKED, CANCELLED |
| STRATEGY_REQUIRED | ORCHESTRATOR | request + current structured evidence refs | STRATEGY_IN_PROGRESS |
| STRATEGY_IN_PROGRESS | STRATEGIST | strategy-experiment or explicit research request | EXPERIMENT_APPROVAL_REQUIRED, RESEARCH_REQUIRED, BLOCKED |
| RESEARCH_REQUIRED | ORCHESTRATOR | explicit research request from authorized specialist | RESEARCH_IN_PROGRESS |
| RESEARCH_IN_PROGRESS | MARKET_INTELLIGENCE | market-intelligence-report | STRATEGY_REQUIRED, BLOCKED |
| EXPERIMENT_APPROVAL_REQUIRED | HUMAN | approved experiment version | CONTENT_ANALYSIS_REQUIRED, PARKED, CANCELLED |
| CONTENT_ANALYSIS_REQUIRED | ORCHESTRATOR | approved strategy experiment | CONTENT_ANALYSIS_IN_PROGRESS |
| CONTENT_ANALYSIS_IN_PROGRESS | CONTENT_ANALYST | content-spec | CREATIVE_REQUIRED, STRATEGY_REQUIRED, BLOCKED |
| CREATIVE_REQUIRED | ORCHESTRATOR | READY_FOR_CREATOR content spec | CREATIVE_IN_PROGRESS, BLOCKED |
| CREATIVE_IN_PROGRESS | CONTENT_CREATOR | creator-deliverable | POST_PRODUCTION_REQUIRED, CONTENT_ANALYSIS_REQUIRED, STRATEGY_REQUIRED, BLOCKED |
| POST_PRODUCTION_REQUIRED | ORCHESTRATOR | valid creator deliverable + accessible source assets | POST_PRODUCTION_IN_PROGRESS, BLOCKED |
| POST_PRODUCTION_IN_PROGRESS | VIDEO_POST_PRODUCTION | post-production-deliverable + observable exported artifact when ready | CREATIVE_APPROVAL_REQUIRED, CREATIVE_REQUIRED, CONTENT_ANALYSIS_REQUIRED, STRATEGY_REQUIRED, BLOCKED |
| CREATIVE_APPROVAL_REQUIRED | HUMAN | approval bound to exact render + current facts | READY_TO_PUBLISH, POST_PRODUCTION_REQUIRED, CANCELLED |
| READY_TO_PUBLISH | ORCHESTRATOR | exact approval + tracking + current facts | PUBLISHING |
| PUBLISHING | PUBLISHER | publish-record / reconciled external status | PUBLISHED, BLOCKED |
| PUBLISHED | ORCHESTRATOR | platform ID/URL/timestamp/tracking token | MEASUREMENT_WAIT |
| MEASUREMENT_WAIT | ORCHESTRATOR | declared checkpoint/window | ANALYTICS_REQUIRED |
| ANALYTICS_REQUIRED | ORCHESTRATOR | required joined observation bundle | ANALYTICS_IN_PROGRESS, BLOCKED |
| ANALYTICS_IN_PROGRESS | ANALYTICS | analytics-decision | STRATEGIST_DECISION_REQUIRED, BLOCKED |
| STRATEGIST_DECISION_REQUIRED | STRATEGIST | final portfolio decision | SCALE_APPROVAL_REQUIRED, ITERATION_REQUIRED, KILLED, PARKED, MEASUREMENT_WAIT |
| SCALE_APPROVAL_REQUIRED | HUMAN | material resource/commercial approval when required | SCALED, PARKED |
| ITERATION_REQUIRED | STRATEGIST | new experiment version / explicit research request | CONTENT_ANALYSIS_REQUIRED, RESEARCH_REQUIRED |
| SCALED / KILLED / PARKED | NONE | terminal/park reason + knowledge eligibility | terminal; PARKED reopens only by explicit Strategist decision |
| BLOCKED | blocker owner | blocker resolution evidence | last valid non-blocked state |
| CANCELLED | NONE | human cancellation reason | terminal |

The sales path runs in parallel after any inbound inquiry. It does not wait for `MEASUREMENT_WAIT` or Analytics.

## Dispatch rules

### Market Intelligence

Dispatch only when an authorized specialist has produced an explicit research request with:

- decision needed;
- scope;
- exact uncertainty;
- evidence required;
- minimum useful evidence condition when declared;
- deadline/freshness requirement.

The controller does not itself infer that one observation is an outlier or that evidence is strategically insufficient.

### Strategist

Dispatch when:

- intake needs experiment framing;
- Market Intelligence has returned requested evidence;
- downstream specialist explicitly reports a strategic conflict;
- Analytics has produced a valid decision record;
- an authoritative inventory/offer/business-priority event invalidates the active experiment assumptions.

Only Strategist may create/modify hypothesis, audience, funnel role, tested variable, KPI, thresholds, controlled variables, decision rule or portfolio decision.

### Content Analyst

Dispatch only after exact experiment approval is valid and bound to the current experiment version.

### Content Creator

Dispatch only when `content-spec.status = READY_FOR_CREATOR`, experiment/version IDs match and required fact/proof references are valid.

### Video Post-Production

Dispatch only when the creator deliverable is valid, source assets are accessible and runtime requirements for producing/inspecting the artifact are satisfied.

### Human / Publisher

Request human action when a declared approval or consequential side effect requires it. Approval must be bound to the exact artifact/experiment/commercial-fact version it covers.

A later behavior-relevant version supersedes the approval unless policy explicitly states otherwise.

### Sales / Lead Conversion

Route every inbound inquiry immediately with attribution and verified business facts available at that moment.

Missing/stale commercial facts become an explicit blocker; they are never fabricated.

### Analytics

Dispatch only at the declared checkpoint/guardrail and only when the required joins/observation artifacts are present and valid.

Analytics recommendation is evidence, not final lifecycle authority.

## Contract gate

Before every specialist call or transition:

1. load current workflow revision;
2. verify caller/actor authority for the proposed operation;
3. verify the current state allows it;
4. resolve exact artifact versions;
5. validate schemas;
6. verify stable IDs/experiment version joins;
7. verify required approval scope/version if applicable;
8. verify business-fact freshness by declared machine-checkable rule if applicable;
9. create/reuse the operation idempotency identity;
10. append the pre-dispatch audit event;
11. invoke the bounded specialist or side-effect owner;
12. validate/reconcile the observed result before state advance.

On contract failure:

- preserve the last valid state;
- record the exact error code/field;
- return to the producing owner when repair is bounded;
- escalate repeated, unknown, safety/commercial or authority failures;
- never silently coerce missing decision-critical fields.

## Failure classes

- `TRANSIENT_TOOL` — timeout, rate limit, temporary provider failure;
- `DATA_NOT_READY` — delayed metric / observation checkpoint;
- `CONTRACT` — schema/version/identity mismatch;
- `BUSINESS_FACT` — stale/conflicting price, inventory, finance, condition, history or offer;
- `PERMISSION` — missing authority/access;
- `LOGIC` — illegal edge, owner mismatch, concurrency conflict;
- `SAFETY_COMPLIANCE` — privacy/legal/reputational/safety issue;
- `UNKNOWN_EXCEPTION` — not covered by declared deterministic policy.

Retry only `TRANSIENT_TOOL` automatically, within the configured bounded policy.

`DATA_NOT_READY` creates a scheduled wake-up.

`CONTRACT` returns to the producer once when repair is clearly bounded, then escalates.

`BUSINESS_FACT` and `PERMISSION` pause for authoritative resolution.

`LOGIC`, `SAFETY_COMPLIANCE` and `UNKNOWN_EXCEPTION` never auto-retry.

## Idempotency and reconciliation

A timeout does not prove a side effect failed.

Publication, outbound lead messages, appointments, reservations/deposits, state transitions and any other mutating external operation require a stable operation key and reconciliation before retry.

Use optimistic concurrency on workflow revision. On mismatch: reload and re-evaluate; never overwrite newer state.

## Human approval boundaries

Mandatory unless a later explicit delegated policy is separately approved and evaluated:

- experiment approval;
- final creative + current commercial facts before publication;
- publication side effect;
- price/discount/finance/warranty/condition/history/inventory conflicts;
- negotiation, deposit/reservation, trade-in valuation and binding promises;
- material scaling spend/workload/inventory commitment;
- legal/privacy/safety/complaint/reputational exceptions;
- ambiguous sale/gross-profit attribution correction.

The controller records and enforces approval. It does not reinterpret rejection as approval.

## Persistent state classes

1. workflow state — current operational record, revision controlled;
2. artifact registry — immutable/versioned professional outputs;
3. event/audit log — append-only operations, validations, approvals, transitions and failures;
4. authoritative business facts — inventory/price/offer/policy records with provenance and expiry/supersession;
5. growth knowledge — only evidence-backed learning after Analytics evidence + Strategist decision;
6. lead/funnel events — append-only customer journey events with minimum necessary personal data.

Chat transcript is not durable workflow state.

## Observability

Every material run must expose:

- workflow_id, experiment_id, experiment_version;
- current state, owner and revision;
- handoff/operation ID and idempotency identity;
- input/output artifact refs and validation result;
- actor/agent/model/tool/schema/policy versions where applicable;
- retries, failure class and reconciliation outcome;
- human approval/rejection with exact scope/version;
- state transition reason/evidence;
- external side-effect IDs.

Customer message bodies and unnecessary personal identifiers must not be copied into growth traces.

## Required output per controller action

Return a structured decision containing:

- workflow_id and revision;
- current_state and owner;
- validated artifact/input refs;
- action: `DISPATCH | WAIT | REQUEST_HUMAN | RETURN_FOR_REVISION | BLOCK | TRANSITION | CLOSE`;
- target owner when applicable;
- exact contract/task type;
- next state or explicit no-transition reason;
- blocker/error code and owner when applicable;
- next wake/due condition when applicable;
- audit events to append.

No specialist deliverable may appear as a substitute inside controller output.

## Quality gate

Before state advance verify:

- legal edge;
- one current owner;
- exact workflow revision;
- required artifact exists and validates;
- experiment/version IDs join;
- approval covers the exact current artifact/version;
- commercial-fact freshness gate passes where required;
- side effect identity/reconciliation is safe;
- no specialist authority was assumed by controller;
- every non-terminal workflow has an owner and next action/wake condition.

## Qualification status

This controller is **not production-qualified yet**.

Required gate: `evaluation/orchestrator/qualification-plan.md` plus executable fixtures, deterministic invariant checks, retry/reconciliation tests, checkpoint/resume tests and one end-to-end shadow experiment reconstructable without chat logs.

Do not describe narrative compliance with this document as behavioral proof.

## Final invariant

The controller asks only:

**Is the current state valid, who professionally owns the next decision, are the inputs/contracts/approvals current, is the operation safe to execute/retry, and can the run be reconstructed?**

It never asks how to do the specialist's job itself.
