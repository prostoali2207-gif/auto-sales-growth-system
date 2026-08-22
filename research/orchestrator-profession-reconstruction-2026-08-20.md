# Orchestrator / Growth Lead — Agent Architect reconstruction

Date: 2026-08-20
Status: architecture decision complete; existing role NOT professionally qualified
Frozen baseline: `ba4bb26ba345443d70012a71d4db8991b976211b`

## 1. Real work, not role title

The system needs reliable coordination of a long-running growth-and-sales experiment lifecycle. The required work is:

- maintain one authoritative workflow state and revision;
- enforce legal state transitions;
- validate specialist handoff contracts and artifact identity/version joins;
- dispatch work to the owner that has professional authority for the next decision;
- persist approvals, blockers, timers, retries, idempotency and audit evidence;
- route sales inquiries immediately without allowing the sales path to mutate experiment state;
- pause safely on stale commercial facts, missing permissions, unknown exceptions or human decisions;
- resume after delays/failures without duplicate side effects;
- expose what happened, why, who owned it and what happens next.

This is primarily **workflow orchestration / operations control**, not a standalone growth profession.

The word `Growth Lead` is misleading because the role must not own growth strategy, measurement interpretation, creative direction, lead qualification or commercial decisions. Those are already assigned to specialists.

## 2. Profession / mechanism decision

### Decision

Use a **deterministic workflow controller around bounded professional specialists**.

Do **not** create a standalone reusable AI Professional Core for `Orchestrator / Growth Lead` at this stage.

Do **not** give an LLM authority to choose arbitrary workflow edges.

The controller is application logic. LLM specialists remain inside bounded nodes. Novel ambiguity that cannot be resolved by declared contracts is escalated to the accountable specialist, human, or engineering owner rather than solved by a super-agent.

### Why

The high-consequence responsibilities of the orchestration layer are mostly mechanically verifiable invariants: state legality, schema validity, ownership, version joins, idempotency, retry class, approval presence, timing and auditability. These are better expressed and tested deterministically than delegated to a probabilistic model.

Professional judgment still exists in the system, but it belongs to the specialist whose profession owns the decision:

- evidence gap / market claim -> Market Intelligence and/or Strategist;
- experiment design / KPI / decision rule / portfolio decision -> Strategist;
- content structure -> Content Analyst;
- creative execution -> Content Creator;
- media finishing -> Video Post-Production;
- buyer qualification and appointment path -> Sales / Lead Conversion;
- measurement integrity and analysis -> Analytics;
- commercial, legal, reputational and irreversible authority -> human/authorized business system.

The controller must not semantically decide whether market evidence is sufficient, whether an outlier matters, whether content is strategically correct, or whether an experiment should scale. It may only enforce explicit machine-checkable gates and route explicit specialist requests.

## 3. Required competencies / capabilities

These are system capabilities, not a new profession core.

### CORE

1. **State-transition integrity**
   - accept only declared legal edges;
   - one current owner;
   - optimistic concurrency / revision checks;
   - terminal-state protection.

2. **Contract and artifact integrity**
   - validate input/output schemas;
   - enforce experiment/version/artifact joins;
   - reject stale or mismatched artifacts;
   - never silently coerce missing decision-critical fields.

3. **Authority-preserving routing**
   - dispatch only to the role owning the required professional decision;
   - never substitute controller reasoning for missing specialist output;
   - explicit unavailable-owner blocking.

4. **Durable execution control**
   - timers / wake-ups;
   - bounded retries by failure class;
   - idempotency keys;
   - side-effect reconciliation before retry;
   - checkpoint/resume.

5. **Human approval governance**
   - durable approval scope/version;
   - reject expired or superseded approvals;
   - prevent approval from silently crossing experiment/creative/commercial versions.

6. **Auditability / observability**
   - append-only event trail;
   - actor, evidence, transition reason, tool/model version, external IDs;
   - reconstruct a run without chat history.

7. **Parallel sales-path preservation**
   - route inquiries immediately;
   - preserve experiment/content/vehicle attribution;
   - prevent sales events from owning or mutating experiment state.

### BOUNDARY-CRITICAL

- privacy / minimum necessary lead data in orchestration traces;
- prompt-injection resistance at specialist/output boundaries;
- stale commercial fact gating;
- side-effect permission and irreversible-action boundaries;
- unknown exception escalation rather than autonomous improvisation.

## 4. Evidence and architecture support

### Internal Agent Architect evidence

`architect/SKILL.md` requires the least complex architecture that satisfies the work and explicitly separates deterministic workflows from professional agents when appropriate.

`architect/methodology/agent-boundary-and-coordination.md` states that multi-agent decomposition must earn its coordination cost and requires clear handoff contracts, recovery, single ownership and evaluation of context loss / circular delegation / specialist overreach.

`architect/methodology/runtime-state-memory-context.md` requires explicit persistent state, checkpoint/resume, provenance, supersession handling and source-of-truth separation instead of relying on chat history.

### External engineering evidence

Current official workflow systems converge on the same mechanisms:

- AWS Step Functions models orchestration as state machines and exposes retry/redrive/history semantics.
- AWS Well-Architected guidance emphasizes idempotency for mutating operations and warns about duplicate delivery / brittle synchronous chains.
- Temporal provides durable execution and resume after crashes/failures for long-running workflows.
- LangGraph provides checkpointed state, durable execution and human-in-the-loop; its documentation requires side effects around interrupts to be idempotent.

These sources support deterministic durable control. They do not establish a need for an LLM `Growth Lead`.

## 5. Professional Core Library / reuse decisions

Library inspected: `architect/library/catalog.json`.

### `growth-experimentation-measurement@1.0.0` -> REJECT for orchestrator

Useful elsewhere (Analytics / experiment decision support), but responsibility scope is measurement integrity and bounded experiment decisions. Reusing it in orchestration would collapse Analytics/Strategist authority into the controller.

### `paid-media-performance-marketing@1.0.0` -> REJECT for orchestrator

Paid-media allocation, auction reasoning and spend governance are not workflow-control invariants. Would create super-agent scope creep.

### `video-editing-post-production@0.1.0` -> REJECT for orchestrator

No responsibility compatibility.

### OpenAI Agents SDK -> ADAPT as optional runtime component

Use manager-owned bounded specialist calls/tracing if needed. It is an execution framework, not a professional core and not the owner of workflow policy.

### LangGraph -> ADAPT only if durable agent pauses/checkpointing become material

Useful runtime capability when persistence/HITL needs exceed the database/job-runner implementation. Do not adopt merely because it is an agent framework.

### Temporal -> REJECT for current implementation; preserve migration path

Strong durable-execution mechanism, but current scale does not justify the operational cost. Re-evaluate if workflows become materially long-running/concurrent and failure recovery exceeds the simple ledger/worker design.

### Autonomous group-chat / voting orchestrators -> REJECT

They add coordination variance, authority ambiguity and context-loss risk without solving a demonstrated need.

## 6. State and handoff requirements

The current repository direction is mostly correct, with one important repair:

**The controller must not make semantic specialist decisions while routing.**

A valid handoff must carry:

- objective/task type;
- exact input artifact references and provenance;
- immutable constraints / locked experiment fields;
- unresolved uncertainty explicitly produced by the prior owner;
- required output contract;
- definition of done;
- escalation condition;
- downstream consumer;
- workflow revision and idempotency identity.

Routing should be driven by state + validated artifacts + explicit specialist disposition, not by free-form controller judgment.

## 7. Authority

The controller has authority to:

- validate;
- dispatch;
- wait/wake;
- reject invalid/stale contracts;
- apply legal deterministic transitions;
- record approvals and audit events;
- retry only declared transient failures;
- block and escalate.

It does **not** have authority to:

- create or alter strategy;
- decide evidence sufficiency semantically;
- interpret market evidence;
- evaluate creative quality;
- qualify a buyer;
- interpret experiment results;
- choose SCALE / ITERATE / KILL;
- invent commercial facts;
- negotiate, discount, reserve, publish or spend beyond explicit delegated authority.

## 8. Failure modes to qualify

P0/P1 cases:

1. illegal transition accepted;
2. stale artifact accepted;
3. controller performs missing specialist work;
4. Analytics recommendation treated as final SCALE decision;
5. stale commercial fact passes publication gate;
6. timeout after external side effect causes duplicate publication/message/appointment;
7. concurrent revision overwrite;
8. missing specialist is impersonated rather than blocked;
9. human approval reused after behavior-relevant version change;
10. inquiry waits for experiment measurement instead of routing to Sales immediately;
11. unknown exception triggers autonomous improvisation instead of escalation;
12. chat summary is treated as source of truth over structured records.

## 9. Evaluation decision before implementation

The existing Orchestrator is **NOT QUALIFIED** because:

- no orchestrator behavioral qualification exists in `evaluation/`;
- the role title conflates workflow control with `Growth Lead` professional authority;
- some routing language asks the controller to make semantic judgments (for example evidence sufficiency / outlier significance) that belong to specialists;
- readiness is explicitly described by the repository as contract-ready, not production-ready.

The deterministic architecture itself is retained as the strongest part of the current design, but implementation wording and evaluation must be repaired before claiming readiness.

## 10. Architecture decision record

`problem` -> reliable multi-stage sales-growth execution without specialist authority collapse

`decomposition hypothesis` -> deterministic workflow controller + bounded specialists + explicit human authority

`single-super-agent alternative` -> rejected: role conflict, probabilistic transition policy, weak auditability, larger blast radius

`expected benefit` -> lower coordination variance, reproducible state, specialist authority preservation, safer retries/approvals, easier debugging

`coordination risks` -> stale handoffs, schema drift, version mismatch, orphaned work, delayed sales routing

`evidence/test` -> contract validation + state-machine adversarial fixtures + replay/recovery tests + one end-to-end shadow experiment

`decision` -> **deterministic controller; no Orchestrator/Growth Lead Professional Core**

## 11. Readiness gate

Do not call the controller professionally/behaviorally qualified until:

1. adversarial state/routing fixtures pass;
2. schema and invariant checks are executable in CI;
3. retry/idempotency/revision-conflict behavior is executable, not narrative;
4. checkpoint/resume and approval supersession are tested;
5. one complete shadow/manual experiment is reconstructable from durable records without chat logs;
6. any future LLM coordination helper is separately scoped and evaluated before receiving authority.
