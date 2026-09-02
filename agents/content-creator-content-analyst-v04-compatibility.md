# Content Creator ↔ Content Analyst v0.4 compatibility bridge

Status: **QUALIFIED APPLIED INTERFACE**.

Purpose: allow the qualified Content Creator composition to consume the canonical Content Analyst v0.4 contract `data-schemas/content-spec.schema.json`. This bridge was exercised in practical handoff gate `content-architecture-v0.4-practical-handoff-2026-09-02-r2`, run `33623482450` — PASS.

## Invariants

- Qualified Creator professional core, authority, truth rules, experiment integrity and output contract remain unchanged.
- Creator output remains `data-schemas/creator-deliverable.schema.json`.
- This bridge changes field/interface interpretation only; it grants no new professional authority.
- Missing decision-critical facts, proof, permissions or tracking values still fail closed.

## Content Analyst v0.4 field interpretation

Treat a schema-valid `READY_FOR_CREATOR` specification as valid Creator input when all IDs and locks match the workflow.

Map semantics as follows:

- `constraint_model` → Creator experiment lock: tested, locked, bounded, free and forbidden variables.
- `content_objective` → approved platform/funnel/audience/mechanism/action context.
- `attention_contract` → hook/opening mechanics. Creator owns exact wording and physical execution, not the upstream mechanism.
- `structural_timeline` → canonical upstream block order/jobs/timing bounds. Preserve block IDs and order.
- `pacing` → target duration and pacing bounds, not exact edit decisions.
- `proof_architecture` → claims/implications that require the named evidence scope before public wording or visual implication.
- `offer_and_cta` → approved offer/CTA objective, destination and placement. Creator may phrase the CTA but may not change its meaning/destination.
- `visual_communication_requirements` → comprehension/proof visibility constraints, not frame-level post-production instructions.
- `creator_handoff` → `must_preserve`, `bounded`, `may_choose`, `must_escalate` execution contract.
- `structural_observability` → structural metadata preserved for later Analytics joining; it grants no Analytics authority to Content Analyst or Creator.

## Legacy-field rule

Do not require retired v1 fields such as `analytics_handoff`, `hook_specification`, `visual_requirements` or `experiment_lock`. Their valid structural semantics are represented by the v0.4 contract above.

Do not synthesize KPI thresholds, attribution logic, minimum sample, test window, causal interpretation or decision rules to recreate legacy `analytics_handoff`; those remain Analytics/Strategist-owned.

## Escalation

Return `NEEDS_CONTENT_ANALYST_REVISION` only when the architecture is contradictory, structurally impossible or insufficient for truthful execution. Return `NEEDS_STRATEGIST_REVISION` when execution would require changing strategy/experiment/commercial-path locks. Return `BLOCKED_MISSING_FACT` when a material claim/proof/fact is not confirmed.
