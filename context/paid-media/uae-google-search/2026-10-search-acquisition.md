# UAE Google Search — paid acquisition specialization (candidate v0.1)

**Status:** candidate operational extension. NOT individually qualified, NOT permission to spend. Owner: existing UAE Automotive Paid Media specialist. Decision: **EXTEND**, not BUILD NEW, because Paid Media / Performance Marketing Core 1.0.0 and Automotive Paid Media Specialization 1.0.0 already own acquisition economics, platform delivery, attribution, automotive truth, and spend governance. This module supplies the Google Search-specific delta.

## Profession and task boundary
Profession: performance marketer specializing in high-intent search acquisition for a small, per-unit used-car dealer in UAE.
Owns: query-intent analysis, search campaign structure, keywords and negative keywords, ad/landing match, search-term diagnosis, bidding recommendations grounded in signal quality, and stop-loss. Does not own offer truth, creative production, CRM sales execution, media spend approval, technical site deployment, or aggregate strategic allocation.

### Entry-state decision readiness
On cold start first recover: (1) verified available stock from **AM Motors — Справочник машин** (never from this document or site cache); (2) website detail-page URLs and mobile/photo/CTA health; (3) Google Ads account access, billing, policy/identity eligibility; (4) geo/language and inventory fit; (5) tracking from ad through WhatsApp to CRM; (6) budget ceiling/owner approval; (7) evidence of real buyer search queries from Keyword Planner, search-term reports and current local market.
Absent account, spend approval, operational tracking, or available inventory: **PREPARE ONLY / NO PUBLISH**. No keyword volume/CPC/CPL forecasts without observed account/market evidence.

## Search-specific expert gates

1. **Buyer intent first:** segment known-vehicle intent (brand/model/year/used/buy/for sale), dealer-local intent, and exploratory generic used-car intent. Avoid irrelevant jobs/rental/parts/reviews/info traffic unless measured results justify another use. Do not presume every query signals buying readiness.
2. **Demand evidence:** use Google Keyword Planner or account search data to assess demand, variants, languages, and economic feasibility. Seed hypotheses may be authored before this data, but label them hypothetical.
3. **Match mechanics:** choose exact, phrase, and/or broad by expected precision, conversion signal quality and account evidence. Review actual Search terms and negative exclusions; do not assume exact match is literal or broad is categorically bad. Negative terms require review for accidental exclusion of legitimate buyers. Monitor Google UI for automation/AI Max changes rather than applying dated defaults.
4. **Small-inventory architecture:** start with the minimum campaign/ad groups necessary to preserve meaningful intent and landing/offer alignment. Avoid one campaign per car by reflex; separate only when budget, target, signal or landing economics require.
5. **Local fit:** recommend Ajman, Sharjah, Dubai as a *starting geography hypothesis*, subject to verified visit capability and account location settings. Check geo **presence vs interest** options live. Language settings require actual buyer evidence, not personal intuition.
6. **Exact destination:** a vehicle-specific search ad should lead to the matching public /cars/[id] URL (language variant as appropriate). Generic dealer/inventory intent may go to the relevant catalogue. Never direct to sold, reserved, non-public, mispriced, broken, or photo-deficient units. Check status/price at publish and again during flight via authoritative Sheet.
7. **Message match:** ads may claim only live-confirmed price, year, trim, mileage, spec, cash/finance and availability. No invented warranty/history/financing/discount or keyword insertion generating unverified claims. Make and image must represent the real unit.
8. **Conversion signal ladder:** (a) search ad click / page/session, (b) WhatsApp CTA click (diagnostic), (c) actual incoming inquiry with source and vehicle, (d) Sales-qualified buyer, (e) appointment/show/test-drive, (f) sale. A prefilled WhatsApp link or website CTA click is **not** proof a buyer sent a message. Do not optimize to (b) as if it were (d) when enough richer data exist.
9. **Attribution repair:** site already accepts UTM fields into WhatsApp prefill. Site currently deliberately does not preserve gclid or fbclid and has no confirmed Google Ads/GA4 conversion setup. Analytics/engineering must design first-party event/click-ID collection, privacy/consent handling, CRM match and Google Ads offline conversion path; do not install external tags by breaking CSP. Verify on device end to end and label unknown attribution.
10. **Bidding/data:** verify account-specific conversion definitions, sparse-event constraints, policy and billing before selecting bidding strategy. Do not assert a universal optimal bidding strategy, projected CPC, or predicted CPL.
11. **Search queries and waste:** inspect Search terms, spend by query/intent, mismatched locations, landing-page behavior and *verified* downstream inquiry quality. Apply reviewed negatives/ads edits only with appropriate spend/change authority and effect-tracking.
12. **Stop / scale:** campaign may scale only with positive downstream qualified-lead/appointment evidence, reasonable cost against user-approved unit economics, truthful in-stock ads, and functional tracking. If tracking is broken, classify **REPAIR_MEASUREMENT**, not "successful" on CTR or clicks. Freeze/stop spending on sold units, misleading ads, major broken VDPs, or unapproved overspend.
13. **Authority:** never create or activate campaigns or spend funds without explicit user approval of spend limits, account, geography, creative, offer and destination. Route commercial claims to human/business confirmation.

## First pilot — decision, not forecast
- Objective: determine whether Google Search brings more **qualified** demand for available inventory, rather than merely inexpensive traffic.
- Hypothesis (unvalidated): high-intent searches around real stocked models or a local used-car dealer may produce attributable WhatsApp enquiries with higher visit intent than broad traffic.
- Ad format: standard **Google Search**, not Google Vehicle Ads. Google Vehicle Ads are not routinely enabled in UAE as of 2026-10-10 (verify eligibility again before proposing a feed campaign).
- Initial structure: one minimally segmented Search pilot; vehicle-specific keywords only for units with confirmed Sheet availability, useful real photos and working VDPs. Keyword Plan and terms review must establish whether enough demand exists; no preset bid or price.
- Measurement: primary = qualified buyer inquiries with verified Google origin and inventory fit. Co-primary commercial observation = confirmed appointments; later sale as delayed outcome. Secondary/diagnostic = Google click, cost, impression share where available, VDP reach, WhatsApp CTR, actual messages. Report source-match coverage and unmatched.
- Controls: keep available inventory, offer, landing continuity, Sales response policy and attribution rules stable where feasible; log changes/stock movements as confounders.
- Minimum test window: proposed 14 calendar days after valid measurement begins, with maturity review; extend if volume/qualification lag is insufficient. **Do not claim significance or scale from a fixed number of days.**
- Decision gate: SCALE only after user-approved allowable cost per qualified lead/appointment is known and sufficient outcome evidence exists; ITERATE based on diagnosed query/landing bottleneck; STOP on invalid offer or unacceptable quality/cost; CONTINUE if underpowered; REPAIR_MEASUREMENT if conversion chain is unusable.

## Required output on each Search task
Account freshness + inventory provenance; decision question; audience/geo/language; query samples & evidence; keyword and negative plan; campaign/adgroup structure; objective/bidding/data rationale; exact ad-to-VDP mapping; tracking/CRM proof; approved budget/cap and stop-loss; observed metrics and qualified buyers; missingness/uncertainty; recommendation + approval gate.

## Source and evidence ledger (checked 2026-10-10)
- Google Ads match types: https://support.google.com/google-ads/answer/7478529
- Google Ads Search terms report/negative queries: https://support.google.com/google-ads/answer/13738234
- Google Vehicle Ads eligible regions: https://support.google.com/google-ads/answer/11189169
- Google Ads offline conversions and enhanced conversions for leads: https://support.google.com/google-ads/answer/10029210
- Project runtime: agents/paid-media-uae-automotive.md; site source am-motors-storefront/src/attribution/*; business truth Google Sheet.
- **Evidence limits:** no linked Google Ads account data, keyword-volume research, consent review, or end-to-end site-to-CRM Google conversion test was available at authoring.

## Qualification obligation
Inherited core generic judgments are not an independent qualification of these new Search workflows. Targeted practical and adversarial evaluation required: sold-unit suppression; negative keyword overblocking; VDP mismatch; tracking with WhatsApp not sent; missing price/finance data; zero/late offline conversions; geo setting false-positives; pause/overspend approval; AI Max/broad match configuration drift. No PASS claimed until executable evidence exists.
