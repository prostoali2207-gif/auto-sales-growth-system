# Content Creator — Qualified Core Binding

Status: PENDING UPSTREAM MERGE

This file is the authoritative composition contract for `agents/content-creator.md` once the upstream qualified core is present on `professional-ai-agents/main`.

## Professional core

The Content Creator MUST load and apply the reusable core from `prostoali2207-gif/professional-ai-agents`:

- core id: `social-content-creative`
- version: `0.1.0`
- lifecycle after release: `qualified`
- artifact digest: `sha256:ce5f537d336e6a6396f47c1ae492a687c4dc4b30ade8ab37bb4abb94d6251c0f`
- manifest: `architect/library/cores/social-content-creative/0.1.0/manifest.json`
- qualification record: `architect/library/qualifications/social-content-creative/ce5f537d336e6a6396f47c1ae492a687c4dc4b30ade8ab37bb4abb94d6251c0f/social-content-creative-0-1-0-20260823.json`

Do not paraphrase, locally fork, weaken or selectively copy behavior from the qualified core while claiming the qualified binding. Any behavior-relevant change creates a different artifact and requires revalidation.

## Composition order

For every Content Creator task, apply instructions in this order:

1. qualified Social Content Creative core — stable professional behavior;
2. this binding — composition and conflict rules;
3. `agents/content-creator.md` — UAE automotive/project specialization and canonical deliverable contract;
4. approved Content Analyst spec, verified business facts, production constraints, live platform context and approval state.

Project rules may narrow the core and add automotive facts, schemas, workflow IDs and handoffs. They MUST NOT weaken core invariants around truthful persuasion, brief fidelity, experiment locks, authority boundaries, feasible execution or live-context handling.

If local prose conflicts with the qualified core on those stable professional behaviors, the qualified core governs. Business facts govern factual values only; they do not override professional integrity rules.

## Project specialization retained locally

`agents/content-creator.md` remains authoritative for project-specific behavior including:

- `data-schemas/content-spec.schema.json` input contract;
- `data-schemas/creator-deliverable.schema.json` output contract;
- automotive `fact_id` usage and volatile price/mileage/availability rechecks;
- experiment IDs, block IDs, tested/locked/bounded variables and deviations;
- exact Content Analyst → Content Creator → Video Post-Production handoff;
- Instagram, YouTube and Telegram execution inside an approved content specification;
- human approval and publisher boundary.

## Runtime fail-closed rule

Until PR #88 in `professional-ai-agents` is merged and the exact digest can be retrieved from `main`, this binding is not ACTIVE and the application MUST NOT claim the composed Content Creator is production-qualified through this binding.

After upstream merge, change only the Status line from `PENDING UPSTREAM MERGE` to `ACTIVE BINDING` if the exact id, version, lifecycle, digest and qualification record above verify on `main`.

If the runtime later cannot retrieve or verify the exact qualified core, it MUST surface the missing core binding rather than silently claiming qualified execution.

## Qualification boundary

The reusable Social Content Creative core is qualified for its exact digest. The automotive composition is not automatically qualified merely because it imports the core. Project-specific compatibility must preserve schemas, authority boundaries and handoffs; affected/new behavior requires targeted regression rather than repeating the full core qualification.
