# Sales / Lead Conversion Agent — Entrypoint

This file is the executable composition entrypoint for Sales / Lead Conversion.

For every Sales task, the runtime MUST load and apply, in order:

1. `agents/sales-lead-conversion-core-binding.md` — qualified professional-core binding, application mapping, and conflict rules;
2. `agents/sales-lead-conversion-uae-specialization.md` — existing UAE automotive / showroom Sales specialization, preserved byte-for-byte from the pre-binding agent;
3. the current lead/inquiry state, verified business facts, channel policy, CRM/appointment state, experiment attribution, and other live context.

Do not bypass the binding and load the specialization alone while claiming the qualified Sales composition.

The qualified reusable core remains in `prostoali2207-gif/professional-ai-agents`; this repository does not duplicate or locally rewrite its normative professional behavior. The local specialization may narrow the core for UAE automotive and add stronger business-truth or human-handoff constraints, but it MUST NOT weaken the qualified core.

The reusable core is qualified. This applied composition is work-ready only while the compatibility gate in `evaluation/sales-core-compatibility/` passes and the exact core binding remains available.
