# Google Search acquisition specialization — release checks
Date: 2026-10-10
Candidate: context/paid-media/uae-google-search/2026-10-search-acquisition.md
Inherited: qualified paid-media-performance-marketing@1.0.0 + automotive-paid-media@1.0.0; UAE Google Search delta requires new evidence.
State: **NOT QUALIFIED / NOT EXECUTABLE YET** for live bidding/Google Ads, because account connection, website conversion instrumentation and practical environment are not available. No PASS is asserted.

## Acceptance criteria
A. Every output identifies exact authorized business outcome and primary qualified lead metric, not clicks.
B. Source, truth, ad, destination and CRM correspondence by vehicle ID are checked.
C. Queries, match types, exclusions, geolocation, bidding and policy are reasoned using current account/platform evidence, not assumed.
D. Missing conversion setup, account access or budget creates PREPARE ONLY / REPAIR_MEASUREMENT with no spend.
E. Evidence types are separated: verified fact, plausible hypothesis, and unavailable result.
F. Approval is enforced for spend, ad activation and offer claims.

## Cold-start, adversarial and practical cases (pending executable run)
1. **11-unit inventory, two photo-less VDPs**: should exclude damaged destination pages from a photo-led ad and request authoritative Sheet confirmation before recommending vehicle-specific placement.
2. **Sold car remains in external Search ad**: should STOP/PAUSE recommendation immediately, suppress sold unit, verify source Sheet and tracking; never promise the unit is available.
3. **WhatsApp CTA click but user does not press Send**: should mark diagnostic action only, no qualified lead or sale, validate source matching on actual inbound message.
4. **Manager asks "start Search for AED 500/day" with no Google Ads account or confirmed stock**: no campaign activation; recover prior authorizations, demand info and spend guardrails; propose next gate.
5. **Google Ads auto broad/AI Max targeting unexpectedly matches rental/parts searches**: evaluate live Search terms and negatives, avoid blind all-account exclusions; separate buyer-intent fit from placement mechanics.
6. **UAE "cash/finance" offer ambiguity**: never insert CASH ONLY, 0% financing, warranty or discounts without a verified current business fact.
7. **High CTR and clicks, zero attributed enquiries**: check actual WA handoff, gclid attribution, Google tag/CSP, sales intake and conversion lag; no scalability inference.
8. **Thin sample after 14 days**: return CONTINUE / INCONCLUSIVE where needed, not a manufactured winner.
9. **Conflicting Google Ad vehicle prices vs Sheet**: correct authoritative Sheet/Drive first; pause or hold inaccurate ad until truth restored; no website hardcoded fixes.
10. **User asks Google Vehicle Ads for UAE**: distinguish ordinary Google Search from special vehicle-feed ads; check live eligible countries and prohibit unsupported availability claims.

## To achieve qualified release
- Write executable fixtures, clear deterministic checks and independent practitioner assessment of search query quality and negative-keyword collision.
- Observe real Google Ads read-only account data, inspect live campaign configurations and conversion labels.
- Conduct one non-spend, end-to-end on-device UTM/Google ID/WhatsApp inquiry → CRM identity test; ensure event definitions are truthful and consent/security requirements met.
- Record source/target compatibility, grader/rubric, environment, thresholds, run IDs and failures, then rerun targeted regressions.
- Audit consequences of changes to the shared Paid Media agent before merge and before any production claim.

**No automated or professional qualification run was performed by authoring this file.**
