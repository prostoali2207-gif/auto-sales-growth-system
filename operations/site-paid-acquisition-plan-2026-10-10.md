# AM Motors — paid website acquisition: launch decision (2026-10-10)

**State:** PREPARATION / no advertising created, no campaign activated, no budget authorized.
**Business path:** Google or Meta ad → relevant AM Motors vehicle detail/catalogue → WhatsApp buyer inquiry → qualified lead → appointment/test-drive/show → sale.
**Decision owner:** Strategist; acquisition implementation: existing UAE Automotive Paid Media (Google Search conditional extension); evidence owner: Analytics; sales outcome owner: Sales / Lead Conversion; publish/spend approval: human.

## Observed facts vs hypotheses

Verified 2026-10-10:
- Public site https://am-motors-storefront.vercel.app displays 11 available units, with at least two catalogue entries marked Photos unavailable. This is a live web observation, **not** authority for future stock or prices.
- Site source implements UTM-first-touch capture in sessionStorage and appends known UTMs to prefilled WhatsApp enquiry copy. The sender must still press Send in WhatsApp. Source does NOT track gclid/fbclid and no verified Ads conversion tags/GA4 end-to-end flow were found. Security CSP restricts third-party resources.
- The connected Meta account 1529250598625310 has campaign EXP-MULTICAR-CAROUSEL-001, PAUSED, with approximately AED 518.97 spend and 123 Meta-reported messaging conversations for 2026-09-01 through 2026-10-10. These are **not** verified qualified leads, appointments or sales. Comparison to Google cannot be made yet.
- Google Vehicle Ads standard eligibility does not list UAE; ordinary Search campaigns are the intended Google pilot, not Merchant Center vehicle ads.
- No Google Ads account performance, search demand data, verified acquisition unit economics or ad-spend authorization was available in this session.

Research-backed reasoning:
- **Hypothesis H1:** high-intent UAE Google Search queries might convert to qualified showroom leads better than broad social traffic. Untested for AM Motors.
- **Hypothesis H2:** Meta Reels can generate additional discovery and then hand visitors to matching vehicle VDPs; using VDP vs direct WhatsApp is an empirical choice, not a rule.
- **Risk:** campaigns can appear cheap in platform dashboards while bringing unqualified/no-response WhatsApp messages.

## Prioritized work and readiness gates

### P0 — before paid launch
1. Read today's authoritative Google Sheet **AM Motors — Справочник машин**. Freeze an eligible inventory roster by ID, availability, price and all ad claims. Reconcile it against website; do not edit stock/prices directly in site/repo.
2. Verify real Website/ Drive photos and mobile image load of each unit selected. Exclude missing-photo/broken-page/sold units. Test the phone UX and WhatsApp per-vehicle attribution.
3. Measurement contract: distinct source/campaign/vehicle in every enquiry; real inbound enquiry identification (not mere CTA click); qualified/appointment/sale statuses in Sales records; handling duplicated contacts, attribution unknowns and time-to-reply. Define who records the outcome and how to check it daily.
4. Engineer/test Google Ads conversion measurement and/or first-party click/session logging with lawful collection, CSP compatibility and offline conversion import when eligible. A WhatsApp CTA click alone may be diagnostic/secondary; do not falsely label it a completed lead.
5. Connect a dedicated Google Ads account (billing, organization and access), verify Ads policy eligibility; review and approve keyword estimates/geo/language and ad copy against current Sheet.
6. Obtain explicit spend cap and financial stop-loss approval. Do not publish before these six gates pass.

### P1 — first focused acquisition test
- Run **one controlled Google Search pilot** with model-specific / local used-car-intent terms chosen from Keyword Planner or observed account evidence, using verified available cars with functioning VDPs. Use exact/phrase/broad only according to search evidence and conversion maturity; inspect Search terms to remove irrelevant queries. No invented CPC, CPL or traffic figures.
- In parallel or sequentially, **Meta**: prepare one ad-to-matching-VDP hypothesis based on existing paid creative; do not conflate results of different campaigns, dates, offers, sources, or final sales processes. Avoid splitting tiny budgets into many ads.
- For each click and lead trace: source → ad/campaign → landing URL → WhatsApp vehicle reference → actual inbound message → qualification → appointment → sale.
- Proposed first review after 14 days of valid measurement (extend if outcomes immature). Interim checks for invalid offer, overspend or data break; do not modify a learning campaign merely because one day is poor.

### P2 — only when evidence supports it
- Scale an acquisition route only against verified **cost per qualified buyer / appointment**, sale/vehicle economics when available, and Sales response capacity.
- Invest in Google Business Profile and basic SEO hygiene (relevant local business identity, accurate location, indexable public VDPs, canonical consistency); these are supporting channels, not substitutes for paid-outcome tracking.
- Defer YouTube/TikTok/Display expansion and Google Vehicle Ads until prerequisites and relative incremental value justify them.

## Experiment skeleton
- **experiment_id:** EXP-20261010-GSEARCH-VDP-001 (planned, not launched).
- **Funnel role:** LEAD / DIRECT_SALE.
- **Population:** local buyers actively searching current available used cars in eligible service geographies.
- **Primary KPI:** verified *Sales-qualified* leads originating from Search, tagged to source and inventory fit.
- **Commercial KPI:** confirmed appointments/show/test drive, sale (lagged).
- **Supporting signals:** source-tagged inbound WhatsApp messages, query relevance, search-term waste, spend, CTR, landing/WhatsApp clicks (diagnostic only).
- **Variable:** new Google Search high-intent acquisition route; no causal claim vs Meta from a simple cross-platform before/after comparison.
- **Controlled where possible:** live inventory/offer, messaging/qualifying definitions, geographic eligibility, landing flow.
- **Observation:** minimum 14-day pilot window *proposed*, subject to meaningful sample and lead/sales lag.
- **Decision:** REPAIR_MEASUREMENT if source→sale chain fails; STOP for unavailable/misleading vehicles or unacceptable spend; ITERATE for diagnosed query/landing/qualification mismatch; CONTINUE on immature sample; SCALE only after threshold budget economics and qualified outcomes verified.
- **Unresolved:** Google account access, Search Planner demand, qualified-lead threshold, budget/stop-loss amount, full conversion tracking, real Sales outcome joins.

## Source references and provenance
- Repo agent: agents/paid-media-uae-automotive.md + context/paid-media/uae-google-search/2026-10-search-acquisition.md.
- Live Meta Ads account query at 2026-10-10; attribution data are Meta-defined conversations, not CRM.
- Site source: prostoali2207-gif/am-motors-storefront/src/attribution and src/conversion.
- Google docs: https://support.google.com/google-ads/answer/11189169 ; https://support.google.com/google-ads/answer/13738234 ; https://support.google.com/google-ads/answer/10029210 .

**Approval boundary:** this memo is a planning artifact only, not permission to spend, modify live advertising or publish unverified facts.


## Verified update — 2026-10-11 17:19 GST (supersedes earlier Google account/demand unknowns)

**Google Ads connectivity:** Supermetrics AW authenticated, account `Am motors` ID `2470160660`. Read-only list returned **0 campaigns** and **0 conversion action definitions**. No ads created or changed.

**Authoritative inventory:** Google Sheet `AM Motors — Справочник машин`, tab `Машины`, read 2026-10-11; **12** rows with status `В наличии`, **1** row `Резерв` (AM-020), **12** rows `Продана`. Eligible *candidates*, pending fresh photo/VDP verification, IDs: AM-003, AM-005, AM-007, AM-008, AM-012, AM-014, AM-015, AM-016, AM-017, AM-021, AM-024, AM-025. **Do not advertise AM-020 as available.** Stock may change again; recheck before campaign creation/publish.

**Keyword Planner data** retrieved from connected Google Ads account, seeded with English used-car queries in Ajman and UAE location filter. Approximate monthly searches are planning estimates, not forecast sales or validated precise volumes:
- `used cars ajman`: 720, competition MEDIUM, top-of-page low/high bid indication ~AED 0.37 / 4.31 (bid estimates, not actual CPC).
- `second hand cars ajman`: 720 (likely overlapping intent; **do not sum** with prior query).
- `ajman used car market`: 260, MEDIUM.
- `used cars for sale ajman`: 110, MEDIUM.
- `toyota yaris for sale in ajman`: 10, HIGH.
- Model-year-specific phrases in the current stock largely have no volume reported; `hyundai tucson 2024 uae` returned ~10 monthly. No demand is **not** proven when volume is null.

**Pilot recommendation changed by evidence:** start with *local used-car buying intent* and catalogue destination (after repairing photos/loading); optionally separate tightly matched in-stock model ad groups only where Keyword Planner, VDP and reliable buyer outcomes justify. The business-wide payment rule is **CASH ONLY** (direct human confirmation 2026-08-31, `context/business-rules.md`), until superseded. Do not imply dealer instalments or finance offers. Screen finance-only searches and validate proposed negatives against relevant mixed-intent queries, match types and collision risk; do not blindly block all searches with `finance`.

**Measurement/technical blockers confirmed:** website `src/attribution/*` currently captures UTMs into WhatsApp prefill but not Google click IDs; actual sent inquiries or appointments are not automatic site conversions; Google Ads account conversion_types empty. Tracking work: storefront [issue #19](https://github.com/prostoali2207-gif/am-motors-storefront/issues/19); mobile photo/LCP: [issue #18](https://github.com/prostoali2207-gif/am-motors-storefront/issues/18).

**Readiness now:** CONNECTED / RESEARCH STARTED / NO CAMPAIGN; **BLOCKED** on measurement setup, validated mobile VDP and **explicit user-authorized budget**. Keep account with 0 campaigns until gates close. This update adds no publication authority.
