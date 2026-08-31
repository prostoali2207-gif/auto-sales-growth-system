# Social channels live audit — 2026-08-31

As of: 2026-08-31, Asia/Dubai
Scope: Instagram, Facebook, TikTok, Telegram, YouTube
Goal: make profiles safe and useful for the funnel `content -> profile -> inquiry -> qualified lead -> appointment/test drive -> sale`.

## Rules used

- Current vehicle facts come only from Google Sheet `AM Motors — Справочник машин`.
- Existing social captions are not an authoritative source for price, availability, mileage, condition/history, finance, warranty or other changing commercial facts.
- Do not launch or increase paid budget as part of this audit.
- Do not autonomously reply to customers.
- Prefer edit/archive over deletion where a post can be made accurate without losing useful evidence/content.
- Do not change profile settings until the current value and intended replacement are both verified.

## Connected identities — live evidence

Metricool brand `6753190` (`Al musafir cars trading`) has been connected since 2026-08-20 and currently reports:

- Instagram: `almusafircars`
- Facebook Page: `1135061356346488`, `Al musafir cars trading `
- TikTok: `almusafircars5`
- YouTube channel ID: `UC0kvMwngNDesLOafpYsX6SA`

Meta additionally exposes a second Facebook Page:

- `1087092621158156`, `almusafirmotors`

This second Page is an unresolved possible duplicate/legacy asset. Do not delete, merge or repurpose it without first establishing its current content, ownership role and inbound traffic.

Telegram is owned through the current application integration:

- channel id: `-1003963335180`
- username: `Almusafir_car_market`
- route: `OWNED_CHANNEL / PUBLICATION_CHANNEL`
- current workflow mode: `OBSERVE_ONLY`
- publishing requires human approval

## Overall readiness

**NOT READY FOR TRAFFIC.**

The primary failure is not aesthetics. Existing social surfaces contain stale/unverified commercial data and inconsistent buyer paths. Sending paid or organic traffic now can create distrust and incorrect inquiries.

## Instagram

### Confirmed live state

- username: `almusafircars`
- avatar: set (asset exists in Metricool); visual suitability not yet independently inspected
- approximately 40–41 followers and 55 following during the current connected period
- latest observed post: 2026-08-24
- historical feed and Reels are present
- Metricool brand-level website field is blank

### Commercial-data audit

Examples against the 2026-08-31 authoritative inventory sheet:

- Toyota Yaris 2026 post: AED 54,000 / 4,500 km / 1.5L — consistent with AM-001 for those fields.
- Hyundai Elantra 2020 (172,600 km): consistent with AM-003 for price/mileage/engine.
- Hyundai Elantra GT 2020 post says 147,700 km; AM-002 currently says 92,500 km. Conflict.
- Hyundai Elantra SE 2020 post says 190,450 km; AM-006 currently says 119,000 km. Conflict.
- Hyundai Tucson SEL 2024 post says 71,500 km; AM-007 currently says 60,000 km. Conflict.
- Several active posts advertise vehicles not present in the current inventory sheet, including Nissan Kicks, Nissan Altima, Hyundai Kona, Mazda 3 and Hyundai Elantra 2025 variants. Current availability cannot be inferred from those posts.
- Older captions repeatedly use `Negotiable`; this must not be propagated as a current commercial promise unless confirmed by an authoritative business source.
- Contact inconsistency exists: most feed posts use `+971509786337`, while at least one historical Reel used `+971503432337`. Neither number is currently established as authoritative in the repository or Drive search.

### Profile fields not yet observable through current connector/API surface

- display name
- bio
- category
- location
- contact buttons
- WhatsApp/DM/link configuration
- Highlights
- pinned posts

Public Instagram crawling is currently blocked/timing out, and Metricool does not expose these profile-setting fields.

### Readiness

**NOT READY.** Existing commercial content must be reconciled before profile traffic is scaled.

## Facebook

### Confirmed live state

- connected Page: `Al musafir cars trading `
- Page ID: `1135061356346488`
- avatar: set; visual suitability not yet independently inspected
- 11 followers during the current connected period
- current content is largely cross-posted inventory content
- second Page `almusafirmotors` remains unresolved

### High-severity content conflicts

Cross-platform versions of the same posts contain material factual differences:

- Toyota Yaris 2026: Facebook version reports 2.0L while Instagram + AM-001 report 1.5L.
- Hyundai Elantra SE 2020: Facebook version has blank price while Instagram reports AED 21,000.
- Lexus ES 350 2010: Facebook version has blank price while Instagram + AM-005 report AED 18,000.
- Hyundai Elantra 2025: Facebook and Instagram versions disagree on price/specification; this vehicle is not in current inventory.
- KIA Optima 2020: Facebook version reports AED 28,000 / 192,700 km / 1.6L, while Instagram + AM-004 report AED 21,000 / 12,450 km / 2.4L. This is a critical commercial-data conflict.
- `Nissan 200, SX S 2023`: Facebook and Instagram versions disagree on price and mileage; vehicle is not in current inventory.

### Profile fields not yet observable through current connector/API surface

- cover
- About
- current phone/WhatsApp
- address
- CTA button
- linked Instagram/WhatsApp state at Page-settings level
- pinned material

Meta Ads exposes the Page identity but not these organic Page profile fields through the currently available actions.

### Meta identity warning

Neither currently accessible Meta ad account returns an eligible Instagram account through the Meta Ads account-to-Instagram lookup, while Metricool independently has `almusafircars` connected. This is an identity/linkage inconsistency that must be resolved before treating paid delivery identity as clean.

### Readiness

**NOT READY.** Do not drive paid traffic to the current Page until the contradictory inventory posts and duplicate Page identity are resolved.

## TikTok

### Confirmed live state

- username: `almusafircars5`
- avatar: set
- current Metricool evolution: 0 followers, 0 profile views, 0 video views, 0 account likes
- no posts returned for 2026

### Profile fields not yet observable

- display name
- bio
- link
- pinned videos
- avatar visual quality

Public TikTok crawling is blocked and the connected analytics surface does not expose organic profile settings.

### Readiness

**NOT READY / EMPTY SURFACE.** Technical connection exists, but the account currently provides no content or verified next step for a buyer.

## Telegram

### Confirmed live state

- public channel: `@Almusafir_car_market`
- 7 subscribers in the public preview
- current application integration targets the same exact channel ID and username
- observed public posts include:
  - Hyundai Elantra 2020 listing
  - Hyundai Elantra GT 2020 listing
  - `telegram test 1`
  - `telegram test 2`
  - `telegram test 3`
  - `SYSTEM TEST — Telegram publishing connection verified.`

The Elantra GT public post says 147,700 km, while current AM-002 says 92,500 km. Therefore the current post is stale/incorrect relative to the authoritative inventory.

### Profile fields not yet fully observable

- channel description text
- pinned-message state
- whether a linked discussion group is configured

### Readiness

**NOT READY.** Test posts should not remain in the buyer-facing channel, and stale vehicle content must be corrected/removed from the active sales surface. Title/description/next-step should then be unified with the rest of the brand once authoritative contact/location facts are established.

## YouTube

### Confirmed connection

Metricool reports:

- channel ID `UC0kvMwngNDesLOafpYsX6SA`
- channel name `Al Musafir Cars Dubai`
- avatar asset set
- 0 subscribers
- 0 videos
- 0 views

### Identity conflict

An independent live fetch of the exact same channel URL/ID returned the title `Quran&dua - YouTube` on 2026-08-31.

This is a direct source conflict. Possible explanations include stale metadata, a recent rename, or the wrong channel being connected. No conclusion should be invented.

### Profile fields requiring identity resolution first

- channel name/handle
- avatar/banner
- About
- links/contact/location
- Home layout
- trailer/featured video

### Readiness

**BLOCKED / NOT READY.** Do not rebrand or publish into this channel until the exact channel identity conflict is resolved.

## Cross-channel problems

1. **Commercial truth drift** — active content can disagree with the authoritative inventory sheet.
2. **Inventory drift** — multiple old vehicle posts remain active even though those vehicles are absent from the current sheet.
3. **Contact drift** — at least two WhatsApp/phone numbers appear across old content, with no current authoritative contact source found.
4. **Brand identity drift** — `almusafircars`, `almusafircars5`, `Al musafir cars trading`, `Almusafir_car_market`, possible `almusafirmotors`, plus a YouTube name conflict.
5. **CTA drift** — buyer next step is not consistently verifiable across all five channels.
6. **Testing debris** — Telegram buyer-facing channel contains internal system-test posts.

## Cleanup decision policy

For each existing vehicle post:

- If the post maps to a current inventory vehicle and only editable facts are stale: prefer edit/correction where the platform allows it.
- If the post advertises a vehicle absent from the current inventory and no current availability can be established: archive/hide where reversible; delete only if archive is unavailable or the post is clearly harmful and has no useful retained value.
- If identity of the vehicle cannot be established: do not rewrite it using guessed inventory data.
- Never preserve a misleading commercial claim solely for engagement/history.

## Authoritative facts currently available for profile setup

Confirmed:

- current inventory and vehicle facts: Google Sheet `AM Motors — Справочник машин`
- Telegram owned-channel identity and integration
- connected social account IDs/handles listed above
- dealership payment policy in current Market Intelligence record: CASH only; no dealer finance/instalments

Not yet authoritatively established for cross-channel profile use:

- canonical public business/brand display name
- canonical WhatsApp/phone
- canonical showroom address/location wording
- canonical logo/brand avatar asset
- canonical external profile/landing link
- correct YouTube channel identity

## Next execution order

1. Resolve canonical business identity/contact/location + YouTube identity.
2. Obtain live profile-setting visibility for fields not exposed by current APIs.
3. Clean active misleading/stale inventory posts, starting with high-severity Facebook conflicts and Telegram test/stale posts.
4. Normalize names, bios/About/descriptions, location and contact CTA across all channels.
5. Normalize avatar/cover/banner only from confirmed assets.
6. Configure buyer-facing pins/Highlights/Home layout based on funnel role, not aesthetics.
7. Re-audit every channel as a cold buyer: `who are you -> where are you -> what can I buy -> why trust you -> how do I contact/visit`.
8. Only after profile readiness PASS, route new organic/paid traffic into these surfaces.

## Current blocker statement

The live audit is sufficient to stop unsafe traffic, but not sufficient to perform all profile-setting changes through the currently connected tool surfaces. Metricool exposes analytics/content data, Meta Ads exposes advertising/Page identities, and the current Telegram integration exposes ingestion/publishing logic; none currently expose the full organic profile-setting controls requested for Instagram/Facebook/TikTok/YouTube.
