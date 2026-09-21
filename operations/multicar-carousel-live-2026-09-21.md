# EXP-MULTICAR-CAROUSEL-001 — live launch

## Purpose
DIRECT_SALE / LEAD experiment.

Decision question: does a multi-car carousel with explicit price/payment filtering produce a better downstream buyer mix than the prior single-car Yaris Reel campaign?

## Evidence basis
Prior Yaris campaign generated 32 Meta-reported messaging conversations on AED 149.21 spend. Human review reported repeated loss reasons including roughly 10 finance/installment requests, roughly 10 non-responsive conversations, several buyers seeking other vehicles, several price offers, and several location/visit-intent conversations.

## Offer set
- AM-001
- AM-019
- AM-020
- AM-017
- AM-015

Vehicle price/mileage/spec values must come from the current Google Sheet `AM Motors — Справочник машин`. Do not strengthen condition/history/warranty claims.

## Variable tested
Single-car Reel offer -> multi-car carousel offer with five vehicle choices.

## Controlled
- Meta account: 1529250598625310
- objective: OUTCOME_ENGAGEMENT
- optimization: CONVERSATIONS
- destination: WhatsApp sales number
- audience/geography: same Ajman + Dubai + Sharjah broad/Advantage setup used by prior Yaris campaign
- campaign budget: AED 50/day
- test window: through 2026-09-24

## Qualification repair applied before valid launch
The first draft ad was invalidated before evaluation:
- old ad id: 120252408829060064
- status: PAUSED
- defect: did not prominently encode the known CASH ONLY / NO FINANCE filter and did not deterministically identify the selected carousel vehicle in the WhatsApp handoff.

Valid revised ad:
- campaign id: 120252408770640064
- ad set id: 120252408783620064
- ad id: 120252408978980064
- creative rule: original vehicle photos only; explicit CASH ONLY / NO FINANCE; exact vehicle ID + current price on every card; each card opens WhatsApp with that vehicle ID/model/price prefilled.
- status requested: ACTIVE

## KPI hierarchy
Primary: qualified conversations / attributable conversations.
Secondary: exact-vehicle fit, cash-payment fit, concrete price negotiation, location/visit intent, appointment/show/test-drive, sale.
Diagnostic only: CTR, CPC, CPM, raw messaging-conversation count, views.

## Decision rule
- SCALE only if downstream buyer quality improves and no material guardrail fails.
- ITERATE if Meta conversations remain efficient but finance-only, off-target, or no-response loss remains the dominant pattern.
- KILL/PARK if the multi-car offer fails to produce meaningful qualified demand after the observation window.
- Do not declare a format winner from views alone.
