# Meta Ads Executor

This is the low-cost, structured Publisher path for Meta campaigns. It replaces repeated browser clicking with a reviewed JSON contract and direct Marketing API calls.

## Safety model

- Dry-run is the default. API writes require `--execute`.
- Only lifetime budgets in AED are accepted.
- Execution fails closed when the server-side budget ceiling is missing or lower than the requested budget.
- Campaign, ad set and ad are always created `PAUSED` first.
- `ACTIVE` additionally requires `META_ALLOW_ACTIVE=true` and an exact confirmation phrase: `ACTIVATE:<idempotency_key>:<budget-in-fils>`.
- The campaign is activated last. A partial activation therefore cannot deliver.
- Every object name carries the idempotency key. Retries reconcile by exact name instead of blindly creating duplicates.
- Access tokens are sent in the Authorization header and must exist only in GitHub environment secrets.

## One-time Meta setup

Create and authorize a Meta developer app for the business-owned ad account using the official Marketing API flow. The token must be able to manage the intended ad account and connected business assets. Verify the exact app access level, permissions and current Graph API version in Meta's live developer console; do not copy a token or version from documentation examples.

Configure the GitHub environment `meta-ads-production`:

Secrets:

- `META_ACCESS_TOKEN`
- `META_AD_ACCOUNT_ID` (with or without `act_`)

Variables:

- `META_GRAPH_API_VERSION` — explicit current version such as `vXX.X`; no silent default
- `META_MAX_LIFETIME_BUDGET_AED` — set `252` for the current ceiling
- `META_ALLOW_ACTIVE` — keep `false` until a paused creation has been inspected; set `true` only when activation is intentionally delegated

Add a required reviewer to the `meta-ads-production` environment when the repository plan supports it.

## Per-ad workflow

1. Upload the final approved video to the correct Meta ad account and obtain its Meta video ID. The executor intentionally does not guess, substitute or re-upload a creative.
2. Copy `examples/meta-ads/yaris-template.json` to a new immutable experiment file.
3. Fill only facts verified for the current vehicle, account, audience, placement and WhatsApp destination.
4. Record approval. Keep `requested_status` as `PAUSED` for the first execution.
5. Run the `Meta Ads Executor` GitHub Action in `validate` mode.
6. Run it in `execute` mode. Inspect the created objects in Ads Manager.
7. To activate, change `requested_status` to `ACTIVE`, set the exact confirmation phrase, obtain a fresh approval record and run again. The same idempotency key reuses the paused objects.

## Local validation

```bash
META_MAX_LIFETIME_BUDGET_AED=252 \
node scripts/meta-ads-executor.mjs --spec examples/meta-ads/yaris-template.json
```

Run tests with `npm run test:meta-ads`.

## Intentional boundary

This first production-safe slice does not upload video files, choose targeting, invent commercial facts or grant Meta permissions. Those are separate controlled capabilities. The browser remains a one-time fallback for Meta app authorization and video upload until a verified media-storage/upload adapter is added.
