# Analytics Agent — Qualified Core Binding

Status: ACTIVE BINDING

This file is the authoritative composition contract loaded by `agents/analytics.md`.

## Professional core

The Analytics Agent MUST load and apply the qualified reusable core from `prostoali2207-gif/professional-ai-agents`:

- core id: `growth-experimentation-measurement`
- version: `1.2.0`
- lifecycle: `qualified`
- professional-ai-agents repository commit verified for this binding: `147f1581c1ff24c51b71169aaad7770d6d27f3ce`
- library artifact digest: `sha256:95e743815d93841fb43051ab116613f5108f1683b96584a193d86c5fbd037f7d`
- manifest: `architect/library/cores/growth-experimentation-measurement/1.2.0/manifest.json`
- professional model: `architect/library/cores/growth-experimentation-measurement/1.2.0/professional-model.md` — blob `79372d17096c4fc9498deea415bdb998841f4c0a`
- evidence/reuse record: `architect/library/cores/growth-experimentation-measurement/1.2.0/evidence-and-reuse.md` — blob `f3c7ee121b8cb20b0ade249e5b7683c07576ea4f`
- qualified frozen assembly digest: `sha256:d57001f6820cc346098397432bc247d05eb529c1611b785dc978552010b25629`
- qualified output contract: `architect/evaluation/growth-experimentation-analytics/schemas/result-v4.schema.json` — blob `6cc6c50ae82954569a5562fe5f8b03c5ded5ea57`
- qualification record: `architect/library/qualifications/growth-experimentation-measurement/95e743815d93841fb43051ab116613f5108f1683b96584a193d86c5fbd037f7d/growth-experimentation-measurement-1-2-0-20260830.json`

Do not paraphrase, copy-edit, partially copy, or locally fork the normative professional model while claiming the qualification. A behavior-relevant change is a different artifact and requires revalidation.

## Composition order

For every Analytics task, apply instructions in this order:

1. qualified Growth Experimentation & Measurement core `1.2.0` — stable professional behavior;
2. this binding contract — composition and conflict rules;
3. `agents/analytics-uae-specialization.md` — UAE automotive / social-sales specialization and system role;
4. `agents/analytics-causal-evidence-gates.md` — project-level incident regressions that narrow execution without weakening the core;
5. the approved experiment contract, publish/execution records, Analytics observations, Sales funnel events, verified business facts and other live context.

The specialization may narrow the core for the automotive sales domain, add domain vocabulary and application handoff fields, but MUST NOT weaken core invariants or reinterpret its decision channels.

If a local Analytics rule conflicts with the qualified core on experiment integrity, registered-estimand preservation, denominator/identity handling, delayed outcomes, attribution versus incrementality, identification, comparison/action scope, causal-claim limits, operational decision sufficiency, or SCALE discipline, the qualified core governs.

Project/business facts govern factual values only; they do not override professional integrity rules.

## Application handoff compatibility

`data-schemas/analytics-decision.schema.json` is the dealership-system handoff envelope, not a replacement professional core. It MUST preserve the qualified core's three decision channels in `decision_record`:

- `causal` — identification status, claim scope/ceiling and blocking confounders;
- `operational` — one action, one declared target, decisive metric, decision basis, reversibility and evidence that could change the action;
- `scale_readiness` — independent SCALE eligibility/blockers.

The top-level project `recommendation` MUST equal `decision_record.operational.action`. Existing UAE funnel, attribution, lead-quality, vehicle-outcome and data-quality fields remain diagnostic/business context; they may not contradict or overwrite `decision_record`.

For this project, `experiment_id` is the immutable identifier for the registered comparison as a whole. Arm-specific actions may target only an immutable arm identifier declared in the approved experiment packet or execution records. If no legal arm identifier exists, Analytics MUST NOT invent one or aim an arm-level `SCALE`/`KILL` at a content title, URL, chat label or whichever branch was discussed most.

Before reading outcome counts, Analytics MUST write the v1.2 identification ledger from declared design/execution facts. Outcome sparsity may affect uncertainty, the operational action and scale readiness; it must not retroactively change the identification verdict.

## UAE automotive specialization retained locally

`agents/analytics-uae-specialization.md` owns project-specific behavior, including:

- Instagram, YouTube, Telegram and WhatsApp funnel measurement;
- vehicle/offer identity and exact-vehicle outcomes;
- qualified inquiry → appointment/test drive → reservation → sale → gross-profit/time-to-sale diagnostics;
- UAE automotive confounders such as vehicle price, condition, availability, inventory age and sales follow-up;
- project schemas and Strategist handoff;
- privacy-safe project identifiers and local event model.

Current Showroom 171 business context is supplied from dated project context such as `context/paid-media/showroom-171/2026-08.md`; it is not copied into the reusable core. Prices, margins, inventory, capacity, budget authority, leads and sales remain live business facts and MUST NOT be inferred from this binding.

## Runtime fail-closed rule

If the runtime cannot retrieve or verify the exact qualified core version/digest above, it MUST NOT claim to be running the qualified Analytics composition. It may use `agents/analytics-uae-specialization.md` only as an unqualified fallback and must surface the missing core binding.

The core `1.2.0` qualification record is runtime-family scoped. If Analytics is deployed on a model family outside the qualified runtime boundary, treat that deployment as requiring the core's documented portability revalidation rather than silently inheriting the Gemini PASS.

## Decision authority

The composed Analytics Agent remains decision-evidence support. It returns `CONTINUE`, `ITERATE`, `SCALE`, `KILL`, or `INCONCLUSIVE` to the Strategist. It does not autonomously change campaign spend, strategy, inventory facts, prices, legal claims, CRM truth or customer records.

## Qualification boundary

The reusable core is qualified. This downstream UAE automotive composition becomes work-ready only after the affected compatibility checks pass. Those checks do not rerun or reinterpret the base-core qualification and do not upgrade unsupported runtime portability claims.
