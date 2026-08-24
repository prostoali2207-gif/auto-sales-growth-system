# Staleness-policy escalation — for Ali

`config/business-facts-policy.json` ships in this PR with every freshness window `null`
(`status: "POLICY_UNSET"`). This is deliberate, per the task brief: the audit
(`reports/architecture-audit-2026-08-11.md`, P0 "No verified business-facts adapter")
requires stale-fact rejection, but nothing in the repository defines per-field freshness
windows, and those windows are a business decision, not something to invent in code. Until
you set real values here, `adapters/business-facts/gate.mjs` fails closed with reason code
`POLICY_UNSET` for every fact that has no explicit `expires_at` of its own — which in
practice is every fact the human-maintained source file will contain, because nothing in
this repo currently writes `expires_at` automatically.

This note is the recommendation the task brief asks for, grounded in what this repository
already documents about how the business (Showroom 171, Ajman Auto Market — used-car retail,
single lot) actually operates, not in generic dealership-industry benchmarks.

## What the repo already tells us

- `context/paid-media/showroom-171/2026-08.md`: "the growth system is not yet
  evidence-complete for authoritative inventory" and "authoritative live inventory
  integration" is listed as an explicit unknown blocking confident scale. There is no DMS/CRM
  feed today — the source file this adapter reads *is* the inventory system, maintained by a
  person.
- Same file, "Inventory truth": "Sold, reserved, repriced or materially changed vehicles
  invalidate prior execution assumptions" — for a single-lot used-car business, a unit can go
  from available to sold at any point in the day, and price is subject to manager
  negotiation, not a catalog update cycle.
- `context/post-production/showroom-171/2026-08.md`, "Pre-publication truth recheck":
  the business already requires reconfirming "current vehicle identity, availability,
  approved price, mileage and every material condition/spec/finance/warranty claim" right
  before publish — i.e. the org already treats commercial/status facts as needing a fresh
  recheck at time of use, not spec facts.
- `agents/sales-lead-conversion.md`'s truth boundary separately calls out price, discount,
  availability, reservation status, and finance terms as things that must never be answered
  from memory — the highest-frequency-change, highest-liability fields in a live
  conversation.

## Recommended tiers (qualitative — see open questions before Ali picks numbers)

**Short window (hours, not days) — recommend re-verifying at least every trading-day part,
possibly tighter:**
- `price` / sellable offer amount — subject to negotiation and manager repricing at any time.
- `availability` / reservation status — single-unit inventory; a sold or reserved car must
  stop being offered immediately, and the post-production context already enforces a
  pre-publish recheck on exactly this field.
- `finance_terms` / promo-linked offers — tied to lender/promo cycles that can change without
  a fixed schedule.
- `appointment_slot` availability — time-sensitive by definition; a slot's validity window is
  naturally short regardless of policy.

**Effectively static (long window, likely weeks-to-months, or no expiry at all) —**
- `vin`, `model`, `year`, `trim`, `spec` — fixed for the vehicle's life.
- `accident_history`, `import_status` (e.g. GCC/import), documented condition/paint
  disclosures — change only on a re-inspection event, not on a schedule.
- `mileage` — drifts slowly (test drives, transport); material only over longer periods,
  unlike price/availability.

**Needs Ali's input, not a benchmark guess:**
- `warranty_terms` — depends on whether it's a fixed dealer policy (long window) or
  vehicle-specific and negotiable (short window); the repo doesn't say which.

## Open questions before real numbers go into `config/business-facts-policy.json`

1. How is the source file actually going to be kept current — updated once per showroom
   walkthrough/day, updated the moment a car sells or is reserved, or only when someone
   remembers to? The right window is a function of that cadence, not of what's "typical" for
   a dealership in general.
2. Is there any digital record today (spreadsheet, WhatsApp group, notebook) behind price/
   availability changes, or is it verbal/memory-based? If it's not yet digital, a very short
   window (e.g. same trading day) is safer than assuming timely updates.
3. For `warranty_terms`: fixed policy or per-vehicle/negotiable?
4. Should `appointment_slot` freshness be handled by this policy at all, or does the booking
   system's own confirmation state make a TTL redundant for that entity type?

Once you answer these, the concrete numbers go into
`config/business-facts-policy.json`'s `default_freshness_window_seconds` and
`per_field_freshness_windows_seconds`, and `status` moves off `POLICY_UNSET`. No code change
is needed — `gate.mjs` already reads this file at call time.
