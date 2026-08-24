# Eval plan — Verified Business-Facts Adapter (v0, file-backed)

Written before any implementation code, per the required order of work in the task brief.
This plan is the spec the implementation must satisfy. If implementation and plan diverge,
the plan wins and the code is fixed — not the other way around.

## What is being tested

1. `data-schemas/business-fact.schema.json` — the extracted fact-record contract.
2. The rewiring of `sales-lead-turn.schema.json`, `creator-deliverable.schema.json`,
   `post-production-deliverable.schema.json`, `sales-lead.schema.json` to reference it.
3. `adapters/business-facts/adapter.mjs` — file-backed loader that reads a human-maintained
   source file and emits only schema-valid `business-fact` records.
4. `adapters/business-facts/gate.mjs` — deterministic staleness/conflict resolution.
5. `config/business-facts-policy.json` — the (currently unset) freshness-window policy.

## Design decisions this plan fixes (so tests have one target, not a moving one)

These are not in the audit or the task brief verbatim; they are the concrete choices needed
to make "deterministic" and "fail closed" testable. Each is a deliberate, documented decision,
not an invented business fact.

### Reason codes (exactly 7, evaluated in this fixed order)

For a lookup key `(entity_type, entity_id, field)` against the loaded fact pool and the
policy config, at a given instant `now`:

1. `MISSING_FACT` — no fact record matches the key (includes: source file missing, source
   file malformed/unparseable, or the field genuinely never verified — the caller cannot
   and must not distinguish these; all three fail closed identically).
2. `REVOKED_FACT` — any matching candidate has `status: "REVOKED"`. Checked before anything
   else once a candidate exists: a revocation is authoritative regardless of how many older
   `CONFIRMED` records also match ("revoked-after-confirmed" must fail closed even though a
   confirmed value exists earlier in the record set).
3. `CONFLICTING_FACT_STATUS` — no `REVOKED` candidate, but any candidate has
   `status: "CONFLICTING"` (the source system/human marked it conflicting directly).
4. `STALE_FACT_STATUS` — no `REVOKED`/`CONFLICTING` candidate, but any candidate has
   `status: "STALE"`.
5. `CONFLICTING_DUPLICATES` — every remaining candidate is `CONFIRMED` (the only other enum
   value), and two or more of them disagree on `value` for the same key. This is a distinct
   failure from class 3: class 3 is one record self-declaring conflict; class 5 is the gate
   *deriving* a conflict from two records that each individually claim to be confirmed.
6. `EXPIRED_FACT` — exactly one effective value remains (either a single `CONFIRMED`
   candidate, or several that agree on `value`; the one with the latest `verified_at` is
   canonical) and it is expired. A record is expired when:
   - it has an explicit `expires_at` and `now >= expires_at` (boundary is inclusive — the
     instant of expiry is already expired, per the fail-closed constraint), OR
   - it has no `expires_at`, a policy freshness window is configured for `field` (or a
     configured default), and `now - verified_at >= window_seconds`.
   Both routes report the same code: from the consumer's point of view "no longer fresh" is
   one outcome, whether the record carried its own TTL or relies on the shared policy window.
7. `POLICY_UNSET` — the canonical record has no `expires_at` and no freshness window is
   configured for its `field` (and no default is configured either). This is the only
   currently-reachable branch of class 6/7's policy path, because every window in
   `config/business-facts-policy.json` starts as `null` (see below) — so today, any
   `CONFIRMED` fact with no explicit `expires_at` fails closed with `POLICY_UNSET`, full stop.

If none of 1–7 apply, the gate returns `{available: true, fact: <canonical record>}`.

### Why REVOKED > CONFLICTING > STALE in priority

These are listed in the order a human reviewing the source file would want to know about
them: a revocation is a hard stop; a self-declared conflict is next because it means two
systems disagree right now; staleness is the softest signal. The adapter never needs to
report more than one reason code per query, so an explicit, fixed priority is required for
determinism, and this is it.

### Clock/timezone handling

- `verified_at`, `expires_at`, and the gate's `now` are all RFC3339 (`date-time` per the
  schema's `format` keyword) and may carry any offset, including `Z` or `+04:00`.
- All comparisons happen on the parsed absolute instant (`Date.parse`), never on the literal
  offset or on `run_context.timezone`. Two timestamps that name the same instant with
  different offsets must compare equal; the business's local timezone (e.g. Dubai, UTC+4)
  is display/authoring context only and must never enter the comparison.
- Test coverage: a fixture pair where `verified_at` is written with a non-`Z` offset
  (`+04:00`) and `now` is written as `Z`, chosen so the correct answer depends on resolving
  both to the same instant rather than comparing strings or naive local time.

## Required coverage (from the task brief) and how each is satisfied

| Case | Where | Expected outcome |
|---|---|---|
| Extraction equivalence | `evaluation/business-facts/extraction-equivalence.test.mjs` | Same fixture set validated against the pre-edit inline `verifiedFact` def (snapshotted verbatim from `sales-lead-turn.schema.json` before this change) and against `business-fact.schema.json`; every fixture's valid/invalid result must match exactly. |
| Expiry boundary (exactly-at-expiry) | gate fixtures `exp-boundary-*` | `now === expires_at` → `EXPIRED_FACT` (inclusive boundary, fails closed). `now === expires_at - 1s` → available. |
| Conflicting duplicates | gate fixtures `dup-conflict-*` | Two `CONFIRMED` records, same key, different `value` → `CONFLICTING_DUPLICATES`. Two `CONFIRMED` records, same key, same `value` → not treated as conflict (deduped to canonical). |
| Revoked-after-confirmed | gate fixtures `revoked-after-confirmed` | Older `CONFIRMED` + newer `REVOKED` for the same key → `REVOKED_FACT`, never falls back to the older confirmed value. |
| Missing field | gate fixtures `missing-field` | Key with zero matching candidates → `MISSING_FACT`. |
| Malformed source file | `evaluation/business-facts/adapter.test.mjs` | Invalid JSON syntax, and valid JSON with the wrong top-level shape (object instead of array), both load as zero usable facts (`malformed: true`, `facts: []`) — never a thrown/uncaught exception, and any downstream query against that pool fails closed with `MISSING_FACT`. |
| Clock/timezone handling | gate fixtures `tz-offset-*` | See above. |
| Each consumer's existing fixtures still validate | `evaluation/business-facts/consumer-fixtures.test.mjs` | Minimal representative valid instances for `sales-lead-turn`, `sales-lead`, `creator-deliverable`, `post-production-deliverable` schemas, captured against the schemas *before* rewiring is possible only conceptually (schemas are new-ish in this repo and ship without prior fixtures); concretely this test asserts the rewired schemas still validate one representative valid instance per schema and that `required` arrays are byte-identical to the pre-edit versions (diffed from git). |

Additional fixtures beyond the minimum table, to hit DoD's "≥1 valid + ≥1 invalid per
`status` value": `data-schemas/fixtures/business-fact/` holds one schema-valid and one
schema-invalid record for each of `CONFIRMED`, `STALE`, `CONFLICTING`, `REVOKED` (8 files).
"Invalid" here means schema-invalid for a reason unrelated to `status` (e.g. missing
`verified_at`, wrong `entity_type` enum value) — proving the schema rejects bad instances
regardless of which status they claim.

## What this plan does not cover (explicitly out of scope, per task brief)

- Any live DMS/CRM read or write.
- Any behavior change to Content Creator or Sales agents beyond the `$ref` rewiring itself.
- Real freshness-window values — the policy ships fully unset; see the escalation note in
  `adapters/business-facts/policy-escalation-recommendation.md`.

## Pass/fail bar

CI is green only if: all schemas resolve under AJV (Draft 2020-12, with cross-file `$ref`
loading), the extraction-equivalence test shows zero discrepancies, the consumer-fixture test
shows unchanged `required` arrays and one passing instance per consumer schema, and every gate
fixture's actual reason code (or `available: true`) matches its `expected` field exactly. No
test may be loosened to pass; a failure is reported and fixed at the root cause.
