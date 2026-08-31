# Experiment exp-20260811-elantra-gt-001

First manual end-to-end system test for the selected Hyundai Elantra GT 2020.

## Current state

- Workflow: `CREATIVE_PREPARATION`
- Owner: `CONTENT_CREATOR`
- Active strategy: `v3`
- Strategy approval: human-approved for zero-spend preparation on 2026-08-12
- Content spec: `READY_FOR_CREATOR`
- Publication: not authorized
- Advertising: not authorized
- Budget: not approved

## Decision history

- `v1`: organic paired test proposed, then human approval withdrawn after authenticated account evidence showed that the assumed sample was not grounded.
- `v2`: simultaneous paid Instagram-only A/B proposal with AED 400 as an unapproved planning proposal.
- `v3`: separates zero-spend creative preparation from the later launch, targeting and budget decision. Human approved preparation on 2026-08-12.
- Content Analyst produced the canonical content spec and found no blocker.

## Immutable artifact chain

1. `v1/business-facts.json`
2. `v1/market-intelligence-report.json`
3. `v1/strategy-experiment.json` — rejected history; do not overwrite
4. `v2/account-evidence.json`
5. `v2/strategy-experiment.json` — superseded proposal; do not overwrite
6. `v3/strategy-experiment.json`
7. `v3/content-spec.json`
8. Creator deliverables for both controlled variants
9. Human creative approval and publish/ad record
10. Sales attribution and funnel events
11. Analytics observation and decision
12. Strategist portfolio decision

No publication, campaign activation, budget reservation or spend is authorized by the v3 preparation approval.

Do not overwrite approved or rejected historical artifacts. Create a new version directory for material revisions.
