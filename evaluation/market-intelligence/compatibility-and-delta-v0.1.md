# UAE Automotive Market Intelligence — Core Compatibility and Delta v0.1

Date: 2026-08-20

## Inherited professional core

- core: `market-competitive-intelligence/1.0.0`
- repository: `prostoali2207-gif/professional-ai-agents`
- library artifact digest: `sha256:4584599b86125c85c77a10f118eba4b1472f59947bd5106a8a19174ab53f6e03`
- qualified assembly digest: `sha256:7dee471c3b707927fd255a2539548882e2b18765c943d0e6c7dbee9a2edbff62`
- base blob: `7af5b93c1a4d499b5972a0dd20aec8e4253a9651`
- epistemic overlay blob: `e0685f4a5a868cd2e2d119d9c01d8ad36bb59b21`

## Architect reuse decision

`ADAPT`.

The target work remains the same profession. UAE automotive adds domain-specific comparability, commercial-truth, platform/content-observability and handoff constraints; it does not justify a fork or a second profession.

## Unchanged inherited invariants

Prior universal-core evidence is retained as prior evidence for:
- exact-claim epistemic calibration;
- source/freshness discipline;
- selection/coverage limits;
- comparability reasoning;
- provenance/dependence;
- non-observation handling;
- longitudinal collection drift;
- prompt-injection resistance;
- research stopping;
- research-versus-strategy authority boundary.

These invariants are not declared automatically requalified merely by inheritance. The applied composition must preserve them where the specialization interacts with them.

## UAE automotive delta

### Vehicle/price comparability

The specialization must distinguish official new retail, ordinary local dealer new retail, export-only, used dealer retail, private used and non-comparable states. It must not pool new/used, GCC/import, export/local, salvage/ordinary retail or finance teaser prices into one market benchmark.

### Organization commercial truth

Market observations do not establish the dealership's actual sellable price, availability, mileage, condition/history, warranty or finance terms. Those require verified business context/authority.

### Social/content observability

Caption/metadata-only collections cannot support claims about first-frame composition, spoken hook, shot cadence or visual execution. Competitor views/profile actions are proxies and cannot be promoted to qualified leads, appointments or sales without evidence.

### Small-dealer transferability

Large luxury/hypercar account outliers may be informative but are not assumed transferable to ordinary used-car inventory. Account-normalized or cohort-aware evidence is preferred to raw cross-account view comparisons where appropriate.

### Handoff contract

Market Intelligence may hand Strategist a bounded `TEST_CANDIDATE` or research requirement. Experiment hypothesis approval, variables/controls/KPI/threshold/sample/window and SCALE/ITERATE/KILL remain Strategist/Analytics decision responsibilities.

### Schema boundary repair

The previous `market-intelligence-report.schema.json` required `test_candidates` containing experiment design fields. This violated the profession boundary. The revised contract replaces that with evidence findings, collection/coverage metadata, unknowns, stopping status and `strategist_handoff.bounded_implications`.

## New/affected behavior requiring evaluation

1. price-class and subject-vehicle comparability;
2. UAE commercial-fact separation;
3. content-observability limits with metadata-only evidence;
4. social proxy versus sales/lead outcome discipline;
5. transferability/outlier reasoning;
6. MI→Strategist handoff under user pressure;
7. structured report contract does not force experiment design back into MI.

## Release gate

Applied specialization may be called qualified only if:
- deterministic schema/contract checks pass;
- all critical fresh semantic delta cases pass across 3 stochastic trials;
- no case fabricates a commercial fact or grants MI strategic authority;
- a fresh composed work sample produces evidence suitable for Strategist without designing/approving the experiment.
