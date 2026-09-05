# Meta organic execution — 2026-08-31

Status: EXECUTION_PARTIAL
Parent readiness record: `operations/social-profile-readiness-2026-08-31.md`
Priority Page: `1135061356346488` — `Al musafir cars trading`
Priority Instagram: `@almusafircars`

## Why this record exists

This is the continuation/execution record after live inspection of the installed ChatGPT connectors. It supersedes any earlier statement that the official Instagram API can delete already-published Instagram Business media.

## Verified connector state

- Installed `Meta Ads` is callable and its ChatGPT app permission is `Allow all actions`.
- It can see the priority Facebook Page and the relevant business/ad-account relationship.
- It exposes ads/campaign/catalog operations and Page/advertisable-Instagram reads, but no organic Facebook Page post delete/edit action and no Facebook/Instagram profile-management action.
- `ads_get_ig_accounts` returned no advertisable IG account for the visible ad accounts; Metricool separately confirms `@almusafircars` is the connected Instagram surface.
- Metricool exposes scheduling/planning but no action for removing already-published FB/IG content or editing profile fields; the checked future schedule was empty.
- Sociality.io is not connected to the target FB/IG accounts.
- Plugin discovery found no separate installable Facebook/Instagram content-management connector that would remove this blocker.
- The OAuth credential held by the Meta Ads connector is not exposed as a reusable token through its tool contract. ChatGPT plugin permission (`Allow all actions`) controls tool approval behavior; it does not expose the connector's OAuth secret to the repository/Vercel runtime.

## Correct platform capability

### Facebook Page

Facebook Graph API supports managing Page posts with a Page access token. Deleting a Page post uses `DELETE /{page-post-id}` and requires `pages_manage_posts`; reading/reconciliation also requires Page read access such as `pages_read_engagement`. Old posts may still reject deletion depending on ownership/app/task restrictions, so execution must start with one stale manifest target and reconcile before bulk deletion.

### Instagram

The current official Instagram API supports reading/publishing professional-account media, but it does **not** expose DELETE for already-published Instagram Business media. Therefore the Instagram ARCHIVE manifest is genuinely manual-only at the platform API level. A new Graph token or a new Meta app would not make those old IG posts deletable through the official Instagram API.

Instagram profile identity fields (display name/bio/category/link) are not exposed by the currently installed connectors for write and are not included in the guarded transport below. They remain manual-only unless a separately verified official write surface is found.

## Guarded first-party transport added

Two Vercel API routes were added to the existing `auto-sales-growth-system` project. They do not touch ads, campaigns, ad sets, targeting, budgets, billing, or customer messages.

### `api/meta/page-cleanup.js`

Purpose: execute the already-approved Facebook ARCHIVE manifest only.

Safety constraints:
- hard-bound to Page `1135061356346488`;
- hard allowlist of the eight Facebook ARCHIVE post IDs from the readiness manifest;
- supports `PROBE`, `READ_POST`, and `DELETE_POST` only;
- `DELETE_POST` supports dry-run (`execute:false`);
- execution performs a pre-write read, DELETE, then a follow-up read to reconcile deletion;
- no arbitrary Graph path, object ID, advertising object, or copy can be supplied by the caller.

Facebook allowlist:
- `1135061356346488_122100661352554950`
- `1135061356346488_122100127040554950`
- `1135061356346488_122100086162554950`
- `1135061356346488_122100084116554950`
- `1135061356346488_122100083270554950`
- `1135061356346488_122100082226554950`
- `1135061356346488_122100067154554950`
- `1135061356346488_122099950184554950`

### `api/meta/page-profile.js`

Purpose: try the minimum buyer-facing Facebook Page identity fields that can be safely represented without inventing business facts.

Hardcoded target fields:
- `about`: used cars in Ajman + Ajman Auto Market, Showroom 171 + WhatsApp + supported languages;
- `description`: same factual buyer-facing identity in fuller text;
- `phone`: `+971 50 978 6337`.

Safety constraints:
- hard-bound to Page `1135061356346488`;
- supports `PROBE` and `SYNC_IDENTITY` only;
- dry-run available;
- writes one field at a time and reads it back after each write;
- Page name, username, category, location structure, website and CTA are intentionally excluded until their exact write capability/required shape is proven against the live Page.

## Deployment state

- `api/meta/page-cleanup.js` commit: `3fcb329142570a46cd31ffba6ea00f2313fed8b3`.
- Production Vercel deployment for that commit reached `READY`.
- Live route probe returned HTTP `405 method_not_allowed` on GET, proving the deployed serverless route exists and correctly rejects the wrong method.
- `api/meta/page-profile.js` commit: `7d1190bdb2089b40810f4b285e170c3f593c9160`.
- `.env.example` documents the required transport variables.

## Remaining credential blocker

The Vercel project does not currently contain a reusable Meta Page access token. The transport therefore requires these runtime variables before it can execute:

- `META_GRAPH_API_VERSION=v26.0`
- `META_PAGE_ACCESS_TOKEN=<Page access token for Page 1135061356346488>`
- `META_TRANSPORT_SECRET=<random private transport secret>`

Required Page-token capability for the intended work:
- `pages_read_engagement`
- `pages_manage_posts`
- `pages_manage_metadata` for the guarded Page detail sync attempt

Do not paste the token into repository files or commit history. Store it only as a protected runtime secret.

## Execution order once credential exists

1. `PROBE` Page identity and Page/Instagram relationship.
2. `READ_POST` the first known stale Facebook manifest target.
3. `DELETE_POST execute:false` on that same target.
4. `DELETE_POST execute:true` on that target and require reconciliation.
5. If successful, process the remaining seven Facebook ARCHIVE targets one at a time with reconciliation after every delete. If a target fails because Meta says the object cannot be managed by this token/app, mark only that target manual-only and continue the rest.
6. `page-profile PROBE`.
7. `SYNC_IDENTITY execute:false`.
8. Execute about/description/phone field-by-field; preserve per-field failures as manual-only instead of treating the whole Page as blocked.
9. Do not attempt automated Instagram deletion; execute its ARCHIVE manifest manually on Instagram because the official API has no delete endpoint for published media.

No ads or budgets are part of this transport.


## Live execution update — 2026-09-05

The Meta credential blocker is resolved.

### Credential / asset state

- Meta system user `Al Musafir Automation` exists under business portfolio `809077722268934` / `almusafircars` with Admin access.
- The runtime token is stored only in Vercel as `META_PAGE_ACCESS_TOKEN`; no token was committed to GitHub.
- Live Graph verification on `v26.0` resolved:
  - Facebook Page `1135061356346488` — `Al musafir cars trading`;
  - Instagram professional account `17841424315000417` — `@almusafircars`.
- Granted token permissions include `pages_read_engagement`, `pages_manage_posts`, `pages_manage_metadata`, `pages_show_list`, `pages_read_user_content`, `pages_manage_engagement`, `instagram_basic`, `instagram_manage_contents`, `instagram_content_publish`, `instagram_manage_comments`, `instagram_manage_insights`, `instagram_manage_messages`, `read_insights`, and `business_management`.
- The generated credential is a system-user token. A Page access token can be derived live from Page `1135061356346488`; the durable Meta transports were updated to do this automatically before Page mutations.

### Authoritative inventory recheck

The Google Sheet `AM Motors — Справочник машин` was read directly on 2026-09-05 before mutation.

Material change from the 2026-08-31 manifest:
- `AM-002` Hyundai Elantra GT 2020 is now `Продана` (updated 2026-09-01).
- `AM-004` KIA Optima 2020 is now `Продана` (updated 2026-09-01).

Therefore the prior Instagram KEEP decision for the AM-004 Optima post was superseded to ARCHIVE before execution.

### Facebook execution — completed for approved stale manifest

All eight Facebook ARCHIVE targets were deleted through the official Graph API and reconciled against the Page's `published_posts` edge:

- `1135061356346488_122100661352554950`
- `1135061356346488_122100127040554950`
- `1135061356346488_122100086162554950`
- `1135061356346488_122100084116554950`
- `1135061356346488_122100083270554950`
- `1135061356346488_122100082226554950`
- `1135061356346488_122100067154554950`
- `1135061356346488_122099950184554950`

The first target was read and dry-run checked before deletion; after successful reconciliation the remaining seven were processed one at a time.

Facebook Page identity sync:
- `about` — updated and read-back verified.
- `description` — updated and read-back verified.
- `phone` — Meta normalizes formatting to `+971509786337`; this is the same verified number `+971 50 978 6337`.
- Page name, username, category, location structure, website and CTA were not mutated by this transport.

### Instagram API capability correction and execution

The earlier statement in this record that published Instagram media cannot be deleted through the official API is superseded by live 2026-09-05 evidence.

The current token has `instagram_manage_contents`, and live `DELETE /{ig-media-id}` calls on Graph API `v26.0` successfully deleted and reconciled published Instagram feed posts/reels for this account.

Live media count before cleanup: 28.
Live media count after the successful deletions: 10.

18 stale/sold/conflicting Instagram media objects were deleted and confirmed absent from the account media edge. This included:
- sold AM-002 Elantra GT content;
- sold AM-004 KIA Optima content;
- inventory absent from the current Sheet;
- material mileage/fact conflicts;
- stale Sorento/Kona/Elantra/Mazda/Nissan inventory covered by the prior ARCHIVE decisions.

Two ARCHIVE targets remain because Meta returned a non-transient internal error `OAuthException code -1 / subcode 2207085` on deletion:
- `17925514275302291` — reel `DYPOEwiI4uw` — contains wrong WhatsApp number `+971503432337` and unsupported claims `Clean Condition` / `Best Prices`;
- `18128328997601809` — post `DXe5dNsDBP6` — KIA Sorento 2025 with stale `7000 km` claim vs current `AM-008 = 7600 km`.

Per stop-loss, these two were not blind-retried after the explicit non-transient API failure.

Current Instagram media that were intentionally retained:
- current verified inventory: Toyota Yaris 2026, Hyundai Elantra 2020 AM-003, Lexus ES 350 2010 AM-005;
- two August generic export/sales reels without current commercial facts;
- two older hashtag-only Hyundai reels that require visual identification before deletion;
- one old image with no caption that still requires visual identification;
- the two API-failed stale targets above pending manual removal or a separately justified retry path.

Current Instagram profile identity still reads:
- display name: `Al musafir White Motors`;
- bio: generic showroom text in three languages;
- website: empty.

Those profile fields were not mutated by the Graph transport in this run.

### Durable transport correction

The production Meta routes were updated so `META_PAGE_ACCESS_TOKEN` may contain the current system-user token:
- Page token is derived internally before Page reads/writes.
- Facebook deletion reconciliation falls back to the Page `published_posts` edge when direct read-back returns an ambiguous Graph error after deletion.
- Phone verification compares normalized digits so Meta's formatting normalization does not create a false failure.

No ads, campaigns, ad sets, creatives, targeting, budgets, billing settings or customer messages were changed.
