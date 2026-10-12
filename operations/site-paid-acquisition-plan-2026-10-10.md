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
4. **Pilot-level minimum measurement:** current first-touch UTM and vehicle Ref in WhatsApp prefill, plus an operational Sales record of each **actually received** message, qualification, appointment/sale and known/unknown source, with dedup and prompt daily follow-up. Validate this chain by a small real human test. The richer click-ID → Google Ads offline conversion implementation (storefront PR #20) is **optional for an initial budget-capped manually measured Search pilot**, not a reason to delay learning; leave it disabled until approved, provisioned and tested. A WhatsApp CTA click is not a lead. Before smart bidding/scale based on rich conversion events, verified account conversion action, supported import and dedup become mandatory.
5. Connect a dedicated Google Ads account (billing, organization and access), verify Ads policy eligibility; review and approve keyword estimates/geo/language and ad copy against current Sheet.
6. Obtain explicit spend cap and financial stop-loss approval. Do not publish before gates 1–3, 5–6 pass; gate 4's minimum manual attribution + Sales validation is required, while its optional full offline conversion integration may follow a bounded pilot.

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

## Execution focus — 2026-10-11 (supersedes infrastructure-first interpretations)
- Independent code review of storefront PR #20 at head 408fb88 accepted the disabled-by-default implementation. **No further code-review loops**, no forced deploy or account write; E2E activation remains a separate optional step needing writer credentials and Preview/real-phone evidence.
- Storefront issue [#18](https://github.com/prostoali2207-gif/am-motors-storefront/issues/18) is the **next highest-impact engineering task**: diagnose intermittent unrendered photos and >9s mobile LCP on homepage/catalogue; retest one representative active VDP on mobile, WhatsApp CTA and real published stock.
- Minimal first Search campaign should be intentionally **small and manual-outcome measured**, not blocked by work on offline conversion automation. Google account connected; use intent terms from Planner with truthful catalogue landing; do not pretend volume is a lead forecast. 
- **Human still approves ad budget and activation**, and must verify any commercial claim absent from Sheet/business rules. Existing business rules confirm CASH ONLY 2026-08-31; do not ask repeatedly without contradictory fresh evidence.
- Practical order: (1) site photos/VDP mobile fix and manual UTM→real WhatsApp check; (2) Search campaign plan and Ads-native audit incl. networks, geo, AI Max/landing, keywords/negatives; (3) explicit daily/total budget approval; (4) launch one bounded pilot; (5) quality/appointment analysis; (6) add full Google offline conversion sync only if the test shows it is justified and technically ready.

## Cross-channel evidence update — 2026-10-11 Meta WhatsApp retrospective

Source-of-truth retrospective stored on main at `context/paid-media/showroom-171/2026-10-11-meta-reels-feed-retrospective.md` and structured `2026-10-11-reels-inventory-selection-learning.json`. It is **provisional owner-forwarded prior-chat analysis**, not reconciled independently with Meta export and not a qualified-appointment result.

- Reels reported **AED 378.11 / 243 transitions / 115 Meta-initiated conversations** (AED 3.29/conversation, ~47.3% transitions→conversations). Feed carousel **AED 136.38 / 181 / 8** (AED 17.05, ~4.4%). Observed response behaviour in WhatsApp suggests many buyers seek *other models or available cars under an AED budget*, not solely the car shown in the ad. Delayed responses of ~20–55 minutes were reported. Exact attribution dates, sample and downstream verified leads/sales unknown.
- **Search hypothesis:** local inventory intent (“used cars ajman”, etc.) plausibly fits **catalogue → live availability shortlist (2–3 cars) → WhatsApp → appointment**; this also has independent Keyword Planner demand evidence. Do not extrapolate Reels' Meta conversation conversion to Google Search or treat Reels cheaper conversations as proof of sales. Cash-only as confirmed in business rules; no finance promises.
- **Operational gate for either platform:** make Sales responsible for quick response, budget/model/body-type qualification, live Sheet-based shortlist, and moving location/visit-intent messages into specific appointment slots. Track unknowns and no-response, not only platform conversation count.
- **Do not launch Meta Feed unchanged or scale Reels spending from price per conversation alone.** Google Ads remains a distinct unqualified candidate agent until practical qualification is evidenced.

## Public site status update — 2026-10-11

The mobile image fix was approved and published: [storefront PR #21](https://github.com/prostoali2207-gif/am-motors-storefront/pull/21), production Vercel ready. Fresh mobile lab PageSpeed moved homepage from 74/100, LCP 9.6s to **95/100, 2.9s**; `/cars` from 74/100, 10.8s to **92/100, 3.3s**. These are **lab tests**, not real-user conversions or a guarantee all individual photos never fail. Four sampled URL checks returned HTTP 200. [Issue #18](https://github.com/prostoali2207-gif/am-motors-storefront/issues/18) includes deployment evidence. Inventory facts earlier in this document (12 in stock) are a dated snapshot and already superseded by subsequent Sheet updates; always reload live Sheet at pilot launch.

**Remaining pilot approvals:** Google Ads still needs expert-reviewed campaign settings and explicit daily/total spend cap. Optional click-ID offline import in PR #20 remains disabled; first bounded pilot can be manually UTM/WhatsApp-source audited.

## Google Ads draft created — 2026-10-12, Asia/Dubai

**Owner permission and spend boundary:** Owner approved a pilot *total* budget of AED 350 for 14 days, then enabled Supermetrics AW write access with `All live changes` human approval. That grants access to create a PAUSED draft; it is **not** a record of final go-live permission. DO NOT ACTIVATE or increase spend cap without explicit final approval and readback.

**Live write + readback evidence (Supermetrics AW `manage_campaign`, `campaign_and_resource_get` FULL):**
- Account: `Am motors` (`2470160660`), AED.
- Campaign: `24340357122`, `AM Motors | Search | Used Cars Ajman | 350 AED 14d | Oct2026`, `SEARCH`, `PAUSED`.
- Budget: `15946256608` `LIFETIME` **AED 350 total**, not daily, non-shared, one campaign. Start `2026-10-13`, end `2026-10-26`. Change dates and reverify before activation if the actual launch is later.
- Bidding `MANUAL_CPC`. Ad group `203911291431` `Ajman Used Cars | Local Buying Intent` `PAUSED`, manual ad group max CPC AED 2.
- Keywords verified on readback: PHRASE `used cars ajman`, `second hand cars ajman`; EXACT `used cars for sale ajman`, `ajman used car market`. No broad match added.
- Responsive Search Ad ID `827824429841` `PAUSED` with 15 headlines, 4 descriptions; Google review `UNKNOWN` as of readback. Contains Ajman local showroom / cash-only / viewing claims, no unsupported vehicle-specific prices or financing. Final URL with UTMs: `https://am-motors-storefront.vercel.app/cars?utm_source=google&utm_medium=cpc&utm_campaign=am-202610-search-ajman-350&utm_content=rsa-stock`.
- Geo: Ajman city Google geo-target ID `1000011`, English `en`. Geo option `PRESENCE` (**verified**), not default `PRESENCE_OR_INTEREST`. Search Partners **OFF**, Display **OFF**, Google Search **ON** (**all verified via live readback**).
- Google Ads has no registered conversion types at read time; manual source-tagged WhatsApp enquiry reconciliation required before claiming qualified CPL / automation for conversions. Campaign has no configured negative keyword lists; search-term negative plan and actual match semantics must be checked before activation and iterated after data. Search ad review not yet confirmed.
- Ad landing link tested HTTP 200, UTMs survive with zero redirects (Supermetrics `link_check`). Current Sheet source read 2026-10-12: **11 available**, **1 reserved** (AM-020); ad is **catalogue-level**, no promise about one reserved unit. Prior Sheet input-format fix for AM-025/026 was checked separately. **Actual WhatsApp message → Sales qualified buyer/appointment join not end-to-end verified**.
- Official Google Ads documentation verifies Search lifetime budgets (custom period total spend ceiling) and manual CPC eligibility. See https://support.google.com/google-ads/answer/10486938 and https://developers.google.com/google-ads/api/docs/campaigns/budgets/overview .
- Read-only current state (and setup) is not a qualified Google specialist exam; applied Search component remains **candidate / not professionally validated**.

**Next smallest step:** Verify ready-for-publication ad status, negative keyword exclusions/traffic safety and source-to-actual-WhatsApp record, then solicit one explicit final go-live approval for this exact campaign ID, spend cap and date range. Activation requires enabling campaign, ad group and ad separately (all currently PAUSED) under the `All live changes` approval policy, then confirming post-change status and cost protection. Do not start ads merely because a draft has been created.

## Draft geo scope corrected — 2026-10-12

Following the owner's question about Sharjah and Dubai, amended **PAUSED** Search campaign `24340357122` from only Ajman city to **three UAE city geotargets**: Ajman `1000011`, Sharjah `9047580`, Dubai `1000013`; kept English `en`. Verified Google Ads readback: `PRESENCE` only, not `PRESENCE_OR_INTEREST`; Search Partners OFF, Display OFF. **AED 350 LIFETIME**, Oct 13–26, ad group/ad/campaign all PAUSED and unchanged. The existing 4 phrase/exact keywords all intentionally express **Ajman showroom/used car market buying intent**; adding city locations does not expand keywords to `used cars dubai` or advertise a Dubai/Sharjah showroom. This is a small geo reach extension under the same budget, not separate split campaigns, and not proof of incremental lead quality. Reassess location-by-lead fit after actual qualifying buyer outcomes. Go-live requires explicit final human approval.
