# Social profile readiness — 2026-08-31

Status: EXECUTION_IN_PROGRESS
Scope: Instagram, Facebook, TikTok, Telegram, YouTube
Business objective: profile visit -> content consumption -> DM/WhatsApp/contact -> qualified lead -> appointment/test drive -> sale.

## Authoritative inputs

- Vehicle commercial truth: Google Sheet `AM Motors — Справочник машин`, updated 2026-08-31.
- Inventory rule confirmed by business: vehicles absent from the sheet are sold/outdated; old prices outside the sheet are stale.
- Verified sales policy in repo: cash only; no dealer finance/instalments.
- Current conversion endpoint used by active inventory content: WhatsApp +971 50 978 6337.
- Current location used by active inventory content: Ajman Auto Market, Showroom 171.
- Market Intelligence evidence: WhatsApp/test drive is the practical low-friction UAE used-car conversion endpoint; transparency/risk reduction is a repeated TRUST mechanism.
- Strategist rule: optimize qualified demand and sales, not vanity metrics; Instagram profile/DM, YouTube proof/consideration, Telegram owned continuation/inventory.

## Unified buyer-facing identity target

Working display name: `Al Musafir Cars | Ajman`
Primary CTA: WhatsApp / DM toward current vehicle availability and viewing/test drive.
Location: `Ajman Auto Market, Showroom 171`.
Languages supported in current business content: English / العربية / Русский.

Do not use unsupported claims such as cheapest, below market, no accidents, warranty, finance, guaranteed approval, or discount unless separately verified and approved.

### Instagram target

Username: keep `@almusafircars` unless evidence supports a change.
Display name: `Al Musafir Cars | Ajman`.
Category: used-car dealer / car dealership equivalent available on platform.
Bio intent:
- identify used cars in Ajman;
- surface current stock/prices without embedding volatile vehicle-specific values;
- location;
- one primary WhatsApp/DM action.
Primary link target: WhatsApp +971 50 978 6337.
Highlights target: `Available`, `History`, `Location`, `How to buy`.
Pinned set target: one LEAD/profile explainer, one TRUST/transparency proof, one current inventory/vehicle post. Do not pin sold/stale inventory.

### Facebook target

Page: `Al musafir cars trading` (page ID 1135061356346488) is the connected working page.
A second accessible page `almusafirmotors` (page ID 1087092621158156) exists and must not be merged/deleted until its live purpose/content is inspected.
Target name: `Al Musafir Cars | Ajman` where platform/business-name rules allow.
About: same factual identity/location/WhatsApp path as Instagram.
CTA: WhatsApp or Send Message, choosing the lowest-friction verified path.
Cover: only from confirmed logo/showroom material; none found in Drive search as of audit.

### TikTok target

Connected account: `@almusafircars5`.
Current connected account has no detected videos/followers/views.
Target display name: `Al Musafir Cars | Ajman`.
Bio: used cars in Ajman + location/WhatsApp or platform-supported link.
Do not create pins until real content exists.

### Telegram — EXECUTED

Channel: `@Almusafir_car_market` / chat ID `-1003963335180`.
Bot `@ajmanautosales_bot` verified as administrator with change-info/edit/delete/post permissions.

Executed on 2026-08-31:
- title changed from `Almusafir_car_market` to `Al Musafir Cars | Ajman`;
- description set to used cars + Ajman Auto Market Showroom 171 + WhatsApp + languages;
- pinned buyer-entry message created and pinned as message 169;
- old service messages created by maintenance were deleted;
- old test messages 164-167 could not be deleted due Telegram age limit, so were edited into verified current inventory cards from the Google Sheet: AM-009, AM-011, AM-012, AM-016;
- stale Elantra GT photo post 149 could not be deleted due age limit and was repaired via caption edit to current AM-002 facts (AED 21,000; 92,500 km; 2.0 petrol/FWD; known front-end/salvage history; available; cash).
- messages 153 and 154 are old media-only posts with no text visible in public scrape; no mutation was made because their visual content could not be safely identified through the current API surface.

Current pinned message 169:
`Al Musafir Cars — used cars in Ajman` -> location -> WhatsApp -> ask buyer to send model/screenshot -> confirm current details -> arrange viewing/test drive.

### YouTube target / identity blocker

Connected Metricool channel ID: `UC0kvMwngNDesLOafpYsX6SA`.
Metricool labels it `Al Musafir Cars Dubai` and reports 0 subscribers / 0 videos / 0 views.
Independent public fetch of the exact same channel ID returned `Quran&dua`.
Therefore identity is CONFLICTING. Do not rename/publish until authenticated YouTube API identity (`channels.list` with `mine=true`) confirms which channel the account authorization controls.
Once resolved, target role is Shorts discovery/testing plus longer proof/education only when useful; no channel trailer is required merely because the channel is empty.

## Instagram cleanup manifest

Decision rule:
- KEEP only if the vehicle exists in the current sheet and material commercial facts in the old post do not conflict with the sheet.
- ARCHIVE if vehicle is absent (sold/outdated) or any material current listing fact conflicts with the sheet.
- A historically true mileage is still poor as a live sales listing when the current authoritative mileage materially differs; republish/update from the sheet rather than presenting it as current inventory.

KEEP:
- `3970817630981882249_24243338500` — Toyota Yaris 2026 — https://www.instagram.com/p/DcbLZjaiIGJ/ — current 54,000 AED / 4,500 km / 1.5 GCC matches sheet.
- `3950427767094930589_24243338500` — Hyundai Elantra 2020 — https://www.instagram.com/p/DbSvR-4iGyd/ — 21,000 AED / 172,600 km / 2.0 matches AM-003.
- `3947539931924562691_24243338500` — Lexus ES 350 2010 — https://www.instagram.com/p/DbIeqczCIMD/ — 18,000 AED / 296,000 km / 3.5 matches AM-005.
- `3947500933772517606_24243338500` — KIA Optima 2020 — https://www.instagram.com/p/DbIVy88CKDm/ — 21,000 AED / 12,450 km / 2.4 matches AM-004.

ARCHIVE / REPLACE WITH CURRENT FACTS:
- `3949671011943223606_24243338500` — Elantra GT 2020 — 147,700 km conflicts with AM-002 92,500 km.
- `3947561584884743369_24243338500` — Elantra SE 2020 — 190,450 km conflicts with AM-006 119,000 km.
- `3947526996523226981_24243338500` — Elantra 2025 — absent from current sheet.
- `3947472324986935364_24243338500` — Nissan Kicks 2021 — absent from current sheet.
- `3946838180950968638_24243338500` — Nissan 200/SX S 2023 — absent from current sheet.
- `3941101090514682878_24243338500` — generic Hyundai Elantra 2020 / AED 20,000 — not traceable to a current sheet row and old price.
- `3896821453400100826_24243338500` — Nissan Altima 2020 — absent from current sheet.
- `3896820742071270920_24243338500` — Nissan Kicks 2021 — absent from current sheet.
- `3896819987524417989_24243338500` — Hyundai Tucson 2020 — absent from current sheet.
- `3891040048682388292_24243338500` — Tucson SEL 2024 — 71,500 km conflicts with AM-007 current 60,000 km.
- `3884672620071497353_24243338500` — Hyundai Kona 2021 — absent from current sheet.
- `3883117854182892598_24243338500` — Elantra 2025 — absent from current sheet.
- `3881792625053537274_24243338500` — Sorento 2025 — old 7,000 km conflicts with current AM-008 7,600 km; replace with current fact packet rather than keep as live inventory.
- `3881588339984054382_24243338500` — Hyundai Kona 2021 — absent from current sheet.
- `3881574902012843899_24243338500` — Elantra 2025 — absent from current sheet.
- `3881542474581677731_24243338500` — Mazda 3 2021 — absent from current sheet.
- `3881535828824704543_24243338500` — Sorento LX 2025 — old 7,552 km conflicts with current AM-008 7,600 km.

## Facebook cleanup manifest

KEEP:
- `1135061356346488_122100142862554950` — Hyundai Elantra 2020, 21,000 AED / 172,600 km / 2.0 matches AM-003.
- `1135061356346488_122100084668554950` — Lexus ES 350 2010; price omitted, but 296,000 km / 3.5 / American does not conflict with AM-005.

ARCHIVE / REPLACE:
- `1135061356346488_122100661352554950` — Toyota Yaris 2026 — engine stated 2.0L; current sheet says 1.5L.
- `1135061356346488_122100127040554950` — Elantra — 147,700 km conflicts with AM-002 92,500 km.
- `1135061356346488_122100086162554950` — Elantra SE — 190,450 km conflicts with AM-006 119,000 km.
- `1135061356346488_122100084116554950` — Elantra 2025 — absent from current sheet; old commercial data.
- `1135061356346488_122100083270554950` — KIA Optima LX 2020 — states AED 28,000 / 192,700 km / 1.6L; current AM-004 is AED 21,000 / 12,450 km / 2.4L.
- `1135061356346488_122100082226554950` — Nissan Kicks 2021 — absent from current sheet.
- `1135061356346488_122100067154554950` — Nissan 200/SX S 2023 — absent from current sheet.
- `1135061356346488_122099950184554950` — generic Hyundai Elantra 2020 / AED 20,000 — not traceable to a current row and old price.

## Current execution route

Do not use Cloud Browser for this task.

Evidence from the existing system:
- Telegram proves the intended pattern: a thin first-party transport over the official platform API, deployed on the existing Vercel project, rather than browser automation.
- Metricool remains the existing publishing/planning/analytics surface for Instagram/Facebook/TikTok/YouTube.
- The official `Meta Ads` ChatGPT connector was previously authorized through OAuth for business portfolio `almusafircars` and has access to the working Meta assets. Its ChatGPT app permission is `Allow all actions`.
- GitHub environment `meta-ads-production` is configured with `META_GRAPH_API_VERSION=v26.0`, but a read-only 2026-08-31 probe confirmed `META_ACCESS_TOKEN` is not stored there.
- A separate Vercel environment-name probe confirmed no direct Meta/Instagram access-token or app-ID/app-secret variables are currently stored in the Vercel project under the checked canonical names.

Execution precedence:
1. Reuse the already-authorized `Meta Ads` connector when its action namespace is loaded; do not create a second Meta OAuth integration merely because a prior chat omitted the tool surface.
2. Use the connector to inspect the Page/Instagram relationship and attempt the required organic operations with live reconciliation where such actions are exposed.
3. Respect Meta ownership/API restrictions: old Facebook posts created by another app may reject edit/delete; verify one known stale target before bulk mutation if a content-management action becomes available and do not blind-retry ambiguous writes.
4. Instagram publishing/deletion can use the current official API path if exposed by an authorized connector; captions on existing media are not assumed editable.
5. For TikTok and YouTube, reuse their existing connected publishing surfaces first; add only the minimum official-API adapter needed for capabilities Metricool does not expose.
6. Browser automation is not an accepted fallback for this project. If a platform offers no API/connector capability for a specific profile-only field, record that exact field as manual-only rather than moving the whole workflow to a browser.

## Live Meta connector verification — 2026-08-31

This section records the live continuation run so future chats do not repeat the same connector audit.

### Confirmed assets and relationships

- `Meta Ads` connector is loaded and callable in this chat.
- `ads_get_user_pages` returned both accessible Pages:
  - `1135061356346488` — `Al musafir cars trading `;
  - `1087092621158156` — `almusafirmotors`.
- Business ad account `1529250598625310` belongs to business portfolio `809077722268934` / `almusafircars` and is active/queryable.
- The business/Page edge and ad-account/Page edge both return only priority Page `1135061356346488` for that portfolio/account.
- A second ad account `1400216298878887` is also visible but is not the business-owned account for this workflow.
- `ads_get_ig_accounts` returned an empty list for both visible ad accounts. Under the connector contract this means no Instagram account is currently advertisable through those account edges with the connector's required Instagram permission; it is not evidence that `@almusafircars` does not exist or is globally disconnected.
- Metricool brand `6753190` independently confirms the currently connected brand surfaces:
  - Facebook Page `1135061356346488`;
  - Instagram `almusafircars`;
  - TikTok `almusafircars5`;
  - YouTube `UC0kvMwngNDesLOafpYsX6SA`.
- Sociality.io returned no matching connected Facebook or Instagram accounts and is not a fallback write path for these assets.

### Current authoritative inventory recheck

- The Google Sheet `AM Motors — Справочник машин` was found directly at spreadsheet ID `1RXA5OCKCnGQvZxde0_miF_WjLXsBw0hdPDK-3A_kGBQ`.
- Sheet tab `Машины` was read directly during this continuation run.
- Current rows AM-001 through AM-017 carry update date `2026-08-31`; the existing KEEP/ARCHIVE manifests above remain aligned with this authoritative source.
- No new commercial facts were inferred from old social posts.

### What the existing connectors can and cannot write

Exhaustive action discovery on the installed `Meta Ads` connector found advertising/campaign/catalog actions plus read access to Pages and advertisable Instagram media, but no action for:
- deleting or editing an already-published organic Facebook Page post;
- changing Facebook Page name/About/location/phone/CTA/profile fields;
- deleting an already-published Instagram post/reel/media item;
- changing Instagram display name/bio/category/link/profile fields.

The connector does expose `ads_get_ig_media`, but it requires an Instagram account ID returned by `ads_get_ig_accounts`; none was returned in this session, so that read path cannot be invoked for `@almusafircars` through the current Meta Ads authorization.

Metricool can create/update future scheduled posts but does not expose deletion/editing of already-published posts or profile-field writes in the installed action set. A live Metricool check for `2026-08-31` through `2026-09-30` returned zero scheduled posts, so there is no queued stale content to repair there.

The repo's deployed API transport currently contains Telegram routes only; repository searches found no existing Meta Graph transport or stored transport code under the obvious Graph/token/account relationship identifiers. No new OAuth/App was created.

### Official API capability vs current connected capability

Meta's official platform supports deletion of Facebook Page posts and current Instagram media deletion in supported API flows. Therefore the blocker is not a claim that Meta itself has no API; it is that the currently authorized ChatGPT connector does not expose those organic-content/profile write actions, and the existing repo/Vercel transport does not possess a reusable Meta access token.

Result for this run:
- Facebook stale published-post cleanup manifest: `MANUAL_ONLY_WITH_CURRENT_CONNECTED_TOOLS` until an existing authorized content-management surface is exposed.
- Facebook Page buyer-facing profile fields: `MANUAL_ONLY_WITH_CURRENT_CONNECTED_TOOLS`.
- Instagram stale published-media cleanup manifest: `MANUAL_ONLY_WITH_CURRENT_CONNECTED_TOOLS`.
- Instagram buyer-facing profile fields: `MANUAL_ONLY_WITH_CURRENT_CONNECTED_TOOLS`.
- Metricool future scheduled-post cleanup: `CLEAR` — no scheduled posts in the checked window.

No social write was falsely reported as completed. No ads, campaigns, ad sets, creatives, targeting, payment settings, or budgets were changed. No customer message was read/replied to as part of this execution run.

## Missing creative assets

Drive searches for a current auto-sales logo and current showroom image returned no reliable asset. Do not invent them.
Needed for visual identity completion if the current platform avatar cannot be safely reused:
- current logo source, preferably PNG/SVG or clean square image;
- 2-3 current showroom/location photos suitable for Facebook cover, YouTube banner, and Location/Visit proof.

## Completion rule

SOCIAL_PROFILE_READY only after:
1. stale/sold/conflicting posts are archived, deleted, or corrected on Instagram/Facebook according to the platform capability actually verified;
2. IG/FB profile identity, location, WhatsApp and CTA are coherent to the extent exposed by official APIs/connectors, with any API-impossible fields explicitly identified;
3. TikTok profile is branded and can route a buyer onward;
4. YouTube channel identity conflict is resolved through authenticated account/API identity before any mutation;
5. Telegram media-only posts 153/154 are visually inspected and retained/archived/re-captioned based on what they actually contain;
6. a buyer can move from each profile to a verified inquiry path with no contradictory commercial facts.
