# Business-facts adapter (v0, file-backed)

Reference implementation for the P0 gap in `reports/architecture-audit-2026-08-11.md`:
"No verified business-facts adapter." This is the deliberate v0 named in the task brief —
**not** a live DMS/CRM integration, and it has no write path back into any business system.

## What this is

- `adapter.mjs` — reads a human-maintained JSON source file (a top-level array of records
  matching `data-schemas/business-fact.schema.json`) and returns only the records that
  validate against that schema. A missing, unreadable, or malformed source file never throws;
  it reports `malformed: true` and an empty fact pool, so downstream queries fail closed.
- `gate.mjs` — pure, deterministic functions that resolve "what is the current confirmed
  value of `(entity_type, entity_id, field)`, if any" against a fact pool and a policy config,
  at an explicit instant. No LLM involvement, no wall-clock reads, no silent picking of a
  "most recent" value across a genuine conflict.
- `index.mjs` — wires the two together for one-shot callers.
- `policy-escalation-recommendation.md` — the written recommendation to Ali on freshness
  windows, since `config/business-facts-policy.json` ships with every window unset.

## What this is not

- Not connected to any live inventory/DMS/CRM system.
- Has no write path — it never updates a business system, and it never corrects a fact on
  its own. A human edits the source file directly; that edit *is* the correction path for v0.
- Does not decide business policy. `config/business-facts-policy.json` ships with every
  freshness window `null` (`status: "POLICY_UNSET"`) because the audit requires
  stale-fact rejection but no per-field freshness window has been set by the business yet.
  Until it is, every fact without its own explicit `expires_at` fails closed with reason code
  `POLICY_UNSET` — this adapter is intentionally unusable for anything beyond
  facts that carry an explicit `expires_at` until that policy decision is made.

## Fail-closed contract

`gate.mjs`'s `resolveFact()` never guesses. It returns either
`{available: true, fact}` or `{available: false, reason_code}`, where `reason_code` is one
of exactly seven values (see `evaluation/business-facts/eval-plan.md` for the full priority
order and reasoning):

`MISSING_FACT`, `REVOKED_FACT`, `CONFLICTING_FACT_STATUS`, `STALE_FACT_STATUS`,
`CONFLICTING_DUPLICATES`, `EXPIRED_FACT`, `POLICY_UNSET`.

## Source file format

A JSON array of objects, each matching `data-schemas/business-fact.schema.json`, e.g.:

```json
[
  {
    "fact_id": "fact-price-veh001-2026-08-20",
    "entity_type": "PRICE",
    "entity_id": "veh-001",
    "field": "price",
    "value": 85000,
    "source_system": "HUMAN_MAINTAINED_SOURCE",
    "verified_at": "2026-08-20T09:00:00Z",
    "expires_at": null,
    "status": "CONFIRMED"
  }
]
```

There is no envelope, no versioning wrapper — just the array. A human (or a future importer)
edits this file directly to add, correct, or revoke a fact; there is no other correction path
in v0.

## Usage

```js
import { loadFactsFromFile } from './adapter.mjs';
import { resolveFact, REASON_CODES } from './gate.mjs';

const { facts, malformed, invalidRecords } = loadFactsFromFile('./data/facts.json');
const policy = JSON.parse(fs.readFileSync('../../config/business-facts-policy.json', 'utf8'));

const result = resolveFact(
  { entityType: 'PRICE', entityId: 'veh-001', field: 'price' },
  facts,
  policy,
  new Date().toISOString()
);

if (!result.available) {
  // handle result.reason_code — never fall back to a cached/remembered value
} else {
  // use result.fact
}
```
