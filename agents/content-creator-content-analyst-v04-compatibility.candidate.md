# Content Creator ↔ Content Analyst v0.4 compatibility bridge

Status: PRACTICAL_HANDOFF candidate bridge only. This file does not modify or replace the qualified Social Content Creative core.

Purpose: allow the qualified Content Creator composition to consume the intended successor Content Analyst contract `data-schemas/content-spec-v2.candidate.schema.json` during the final Content Analyst v0.4 practical handoff.

## Invariants

- Qualified Creator professional core, authority, truth rules, experiment integrity and output contract remain unchanged.
- Creator output remains `data-schemas/creator-deliverable.schema.json`.
- This bridge changes field/interface interpretation only; it grants no new professional authority.
- Missing decision-critical facts, proof, permissions or tracking values still fail closed.

## v2 field interpretation

Treat a schema-valid v2 `READY_FOR_CREATOR` specification as a valid Content Analyst input when all IDs and locks match the workflow.

Map semantics as follows:

- `constraint_model` → the Creator's experiment lock: tested, locked, bounded, free and forbidden variables.
- `content_objective` → approved platform/funnel/audience/mechanism/action context.
- `attention_contract` → hook/opening mechanics. Creator owns exact wording and physical execution, not the upstream mechanism.
- `structural_timeline` → canonical upstream block order/jobs/timing bounds. Preserve block IDs and order.
- `pacing` → target duration and pacing bounds, not exact edit decisions.
- `proof_architecture` → claims/implications that require the named evidence scope before public wording or visual implication.
- `offer_and_cta` → approved offer/CTA objective, destination and placement. Creator may phrase the CTA but may not change its meaning/destination.
- `visual_communication_requirements` → comprehension/proof visibility constraints, not frame-level post-production instructions.
- `creator_handoff` → `must_preserve`, `bounded`, `may_choose`, `must_escalate` execution contract.
- `structural_observability` → structural metadata to preserve for later Analytics joining; it does not assign Analytics authority to Content Analyst or Creator.

## Legacy-field rule

Do not reject an otherwise valid v2 specification merely because it omits legacy v1 fields such as `analytics_handoff`, `hook_specification`, `visual_requirements` or `experiment_lock`. Their relevant semantics are represented by the v2 fields above.

Do not synthesize KPI thresholds, attribution logic, minimum sample, test window, causal interpretation or decision rules to recreate legacy `analytics_handoff`; those remain Analytics/Strategist-owned.

## Escalation

Return `NEEDS_CONTENT_ANALYST_REVISION` only when v2 architecture itself is contradictory, structurally impossible or insufficient for truthful execution. Return `NEEDS_STRATEGIST_REVISION` when execution would require changing strategy/experiment/commercial-path locks. Return `BLOCKED_MISSING_FACT` when a material claim/proof/fact is not confirmed.
