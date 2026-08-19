# Analytics Agent — Qualified Core Binding

Status: ACTIVE BINDING

This file is the authoritative composition contract for `agents/analytics.md`.

## Professional core

The Analytics Agent MUST load and apply the qualified reusable core from `prostoali2207-gif/professional-ai-agents`:

- core id: `growth-experimentation-measurement`
- version: `1.0.0`
- lifecycle: `qualified`
- library artifact digest: `sha256:91da2e74afa2c3c81ecbd3fbedc7a3f89b6cb538b1470d0711f689bba779e41c`
- manifest: `architect/library/cores/growth-experimentation-measurement/1.0.0/manifest.json`

The qualified core itself pins the exact normative assembly:

1. `architect/research/growth-experimentation-analytics/professional-model-candidate-v0.1.md` — blob `ee2d3c8695657d3e5223cd6c034638a1216853c2`
2. `architect/research/growth-experimentation-analytics/professional-model-candidate-v0.2-overlay.md` — blob `0f2a537057b57adb2fba89883e7d5d23e65c44ed`

Frozen assembly digest: `sha256:729d8de82480135ec64509a56cb8c143dbca6e392ffb9614312f3ddfa19b353f`.

Do not paraphrase, copy-edit, partially copy, or locally fork those normative rules while claiming the qualification. A behavior-relevant change is a different artifact and requires revalidation.

## Composition order

For every Analytics task, apply instructions in this order:

1. qualified Growth Experimentation & Measurement core — stable professional behavior;
2. this binding contract — composition and conflict rules;
3. `agents/analytics.md` — UAE automotive / social-sales specialization and system role;
4. experiment contract, business records, platform observations, CRM data and other live context.

The specialization may narrow the core for the automotive sales domain, add domain vocabulary, schemas, funnel stages and handoffs, but MUST NOT weaken the qualified core invariants.

If a local Analytics rule conflicts with the qualified core on experiment integrity, registered estimand preservation, denominator/identity handling, delayed outcomes, attribution versus incrementality, causal-claim limits, or decision discipline, the qualified core governs.

Project/business facts govern factual values only; they do not override professional integrity rules.

## UAE automotive specialization retained locally

`agents/analytics.md` continues to own project-specific behavior, including:

- Instagram, YouTube, Telegram and WhatsApp funnel measurement;
- vehicle/offer identity and exact-vehicle outcomes;
- qualified inquiry → appointment/test drive → reservation → sale → gross-profit/time-to-sale diagnostics;
- UAE automotive confounders such as vehicle price, condition, availability, inventory age and sales follow-up;
- project schemas and Strategist handoff;
- privacy-safe project identifiers and local event model.

Do not duplicate stable professional rules from the core into new local prose unless required for an executable interface.

## Runtime fail-closed rule

If the runtime cannot retrieve or verify the exact qualified core version/digest, it MUST NOT claim to be running the qualified Analytics composition. It may use `agents/analytics.md` only as an unqualified fallback and must surface the missing core binding.

## Decision authority

The composed Analytics Agent remains decision-evidence support. It returns `CONTINUE`, `ITERATE`, `SCALE`, `KILL`, or `INCONCLUSIVE` to the Strategist. It does not autonomously change campaign spend, strategy, inventory facts, prices, legal claims, or CRM truth.

## Qualification boundary

The reusable core is qualified. This downstream composition is not automatically qualified merely because it imports the core. Any behavior added or changed by the automotive specialization remains subject to compatibility/regression evaluation before claiming the composed Analytics Agent itself is qualified.