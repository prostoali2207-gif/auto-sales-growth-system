# Experiment exp-20260811-elantra-gt-001

First manual end-to-end system test for the selected Hyundai Elantra GT 2020.

## Current state

- Workflow: `EXPERIMENT_APPROVAL_REQUIRED`
- Owner: `HUMAN`
- Active proposal: `v2`
- Strategy status: `BACKLOG` until explicit paid-budget approval
- Publication: not started
- Advertising: not started

## Decision history

- `v1`: organic paired test proposed, then human approval withdrawn after authenticated account evidence showed that the assumed sample was not grounded.
- `v2`: simultaneous paid Instagram-only A/B proposal with a hard cap of AED 400 total (AED 200 per variant), pending explicit human approval.
- Content Analyst remains blocked until the `v2` strategy and budget are approved.

## Immutable artifact chain

1. `v1/business-facts.json`
2. `v1/market-intelligence-report.json`
3. `v1/strategy-experiment.json` — rejected history; do not overwrite
4. `v2/account-evidence.json`
5. `v2/strategy-experiment.json`
6. Content spec after experiment and budget approval
7. Creator deliverable after content analysis
8. Human creative approval and publish/ad record
9. Sales attribution and funnel events
10. Analytics observation and decision
11. Strategist portfolio decision

Do not overwrite approved or rejected historical artifacts. Create a new version directory for material revisions.
