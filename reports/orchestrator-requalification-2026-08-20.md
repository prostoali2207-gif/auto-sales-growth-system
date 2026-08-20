# Workflow Controller requalification report — 2026-08-20

## Decision

The former `Orchestrator / Growth Lead` should **not** be treated as a standalone AI Professional Core.

The target work is primarily deterministic workflow orchestration / operations control around bounded professional specialists.

Selected architecture:

`deterministic Workflow Controller + bounded specialists + explicit human/commercial authority`

The compatibility identifier `ORCHESTRATOR` remains in schemas, but it no longer implies a general-purpose Growth Lead agent.

## Architect decision

### REJECT

- `growth-experimentation-measurement@1.0.0` as controller core — belongs to Analytics/experiment judgment, not workflow mechanics.
- `paid-media-performance-marketing@1.0.0` as controller core — would import media/spend judgment into orchestration.
- `video-editing-post-production@0.1.0` as controller core — no responsibility compatibility.
- autonomous group-chat / voting orchestrators — coordination cost and authority ambiguity without demonstrated benefit.

### ADAPT as optional infrastructure only

- OpenAI Agents SDK for bounded manager-owned specialist calls/tracing when useful.
- LangGraph only if durable pause/checkpoint requirements outgrow the simpler ledger/worker model.

### REJECT for current implementation, preserve migration path

- Temporal: technically strong durable-execution option, but not justified by current scale/operational requirements.

## Major defects found in the old role

1. `Growth Lead` title implied strategic authority the orchestration layer must not have.
2. The old runbook asked the controller to decide whether Market Intelligence was sufficient — this is Strategist judgment.
3. No Orchestrator behavioral qualification existed.
4. `BLOCKED` recovery was described but the workflow schema did not persist the prior valid state.
5. Human approvals were status flags without exact artifact/experiment version binding.
6. `PARKED` was described as reopenable but the executable policy had no valid reopening edge.
7. Artifact identity in workflow state lacked the immutable hash/revision required by handoff integrity.

## Repairs implemented

- Replaced the behavioral role contract with `Workflow Controller` while retaining the compatibility filename/identifier.
- Added deterministic state/authority/retry policy in `config/orchestrator-policy.json`.
- Added executable policy helpers in `scripts/orchestrator-policy.mjs`.
- Moved evidence-sufficiency judgment to Strategist; controller routes explicit research requests only.
- Bound approvals to workflow revision, experiment/version and exact artifact identity/hash.
- Added `blocked_from_state` and blocker resolution evidence.
- Added explicit `PARKED -> STRATEGY_REQUIRED` reopening only on Strategist/human trigger.
- Added immutable artifact identity to workflow refs.
- Added dynamic ownership for data repair/contract remediation rather than letting the controller grab specialist work.
- Preserved parallel inquiry routing to Sales without experiment-state mutation.

## Evaluation integrity

Qualification plan was preregistered before behavior changes.

Behavioral freeze for the adversarial stage:

`8235e81877de1e175a2830c311d72ec5874c7f87`

Post-freeze test files and CI wiring were added after that freeze without changing the frozen behavior files.

### GitHub Actions run

Run ID: `32367716708`
Runtime: Ubuntu 24.04, Node 22.23.2
Conclusion: `success`

Results:

- development/regression: **25/25 PASS**
- post-freeze adversarial: **14/14 PASS**
- critical authority violations: **0**
- duplicate-side-effect retry violations: **0** in covered fixtures
- illegal direct Analytics/controller SCALE path: blocked
- stale/superseded approval: blocked
- stale/mismatched artifact: blocked
- unresolved blocker bypass: blocked
- controller specialist impersonation: blocked
- inquiry during measurement: routed to Sales while experiment state is preserved

## What this PASS proves

It is direct executable evidence that the current deterministic policy enforces the tested state, authority, approval, artifact, retry, recovery and parallel-routing invariants.

It does **not** prove specialist quality, production reliability, database durability, provider integration correctness or business outcomes.

## Independence limitation

The post-freeze pack was authored after candidate freeze and was not used to tune that frozen candidate, but it was authored inside the same reconstruction effort. It is therefore stronger than development fixtures but weaker than a genuinely external/sealed held-out evaluator.

Do not call this a fully independent held-out qualification.

## Current status

**Architecture-qualified direction; controller candidate passes executable development + post-freeze adversarial gates; NOT production-qualified.**

PR should remain unmerged/draft until the next release evidence is collected or an explicit decision is made to merge candidate infrastructure separately from production activation.

## Remaining release gates

1. independently authored sealed/held-out cases against the frozen controller behavior;
2. persistent workflow/event/artifact/approval storage;
3. schema validation against representative persisted records;
4. side-effect adapters with reconciliation tests for publish/message/appointment operations;
5. restart/checkpoint/resume test against durable state;
6. one end-to-end shadow/manual experiment reconstructable without chat logs;
7. only then production routing enablement.

## Practical conclusion

Do not spend additional effort inventing an intelligent `Growth Lead` coordinator. The value is in reliable state, clean specialist boundaries and measurable end-to-end execution. Any future LLM coordination capability must earn its complexity with a demonstrated failure that deterministic routing cannot solve and a representative evaluation showing measurable benefit.
