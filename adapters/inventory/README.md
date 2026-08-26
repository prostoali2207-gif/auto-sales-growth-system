# Vehicle business-fact adapter

Turns the AM Motors vehicle sheet into the `verified_facts` the Sales / Lead
Conversion agent already expects. Without it the agent has no verified
commercial ground to stand on, which is what makes it fail the FACT family.

```
Google Sheet «AM Motors — Справочник машин»   ← source of truth
        │  sheets_source.py  +  inventory_columns.py
        ▼
inventory records  ── vehicle-inventory-record.schema.json
        │  inventory_integrity.py     (what check-inventory.py reports)
        │  vehicle-facts-adapter.mjs
        ▼
verified_facts  ── sales-lead-turn.schema.json#/$defs/verifiedFact
```

The xlsx is no longer the source of truth. `xlsx-to-inventory.py` stays for
offline snapshots and shares the same column mapping, so a renamed header
behaves identically in both.

## After editing the sheet, run this

```bash
npm run check:inventory
```

It reads the live sheet, reports any problem in plain language with the row
number, and exits non-zero if something needs fixing. Add
`--out data/inventory/am-motors-vehicles.json` to also write the normalized
inventory for the adapter; internal columns are stripped from that file.

Exit codes: `0` clean, `1` problems found, `2` sheet unreadable,
`3` column contract broken, `4` rows do not match the schema.

## Column names drift, and that used to be silent

Headers were matched literally, so when `Цена AED` became `Цена, AED` the
column simply vanished — and `price_aed` is required, so the agent could quote
a car with no price and nothing would complain. Headers are now matched on a
normalized form (case, spacing and punctuation folded), and **a missing
required column raises instead of skipping**. `Пробег (км)` / `Пробег, км`,
`Мин. цена AED` / `Мин. цена, AED` and `Аварии/крашеные детали` /
`Аварии / крашеные детали` all resolve to the same field.

```js
import {
  offerableVehicleFacts, resolveVehicle
} from './adapters/inventory/vehicle-facts-adapter.mjs';

resolveVehicle(inventory, { make: 'Hyundai', model: 'Elantra', year: 2020 },
               { sourceSystem: 'am-motors-inventory-sheet' });
```

## Rules it enforces

**A missing value produces no fact.** Blank, whitespace, `-`, `—` and absent
cells all count as absence. Nothing is defaulted or inferred. The agent is
supposed to say "I need to confirm that" rather than improvise, and it can only
do that if the adapter refuses to invent the fact.

**The negotiation floor never leaves this module.** `Мин. цена AED` is the
owner's internal limit. It is in `NEVER_DISCLOSED_FIELDS`, excluded from the
emitted field list, re-checked before every return, and kept out of the
disambiguation prompt as well. `Заметки` is withheld on the same basis.

**A stale price is worse than a missing one.** If the sheet cannot be read the
loader raises `SheetUnavailable`. It never falls back to a previous copy,
because the agent would quote the stale price with full confidence.

**No verification time, no facts.** `verified_at` comes from `Дата обновления`
and nowhere else. If that cell is missing or unparseable the row yields zero
facts, because an unverifiable fact is not a verified fact.

**Only `В наличии` may be offered.** Any other status returns
`offerable: false` with no facts, and resolution skips the vehicle by default.

**Ambiguity is reported, never resolved by guessing.** Several matches return
`AMBIGUOUS` with the candidates and only the attributes that actually differ
between them. Zero matches return `NO_MATCH` — the nearest vehicle is never
substituted.

## verified_at and the date-only source

The contract requires `format: date-time`; `Дата обновления` is date-only. A
date-only value is anchored at midnight `Asia/Dubai` (`BUSINESS_UTC_OFFSET`),
so `2026-08-24` becomes `2026-08-24T00:00:00+04:00`. This is a declared
convention, not precision observed in the source. A value that already carries
a time passes through untouched.

## Tests

```bash
npm run test:vehicle-facts                                   # 20 adapter tests
python3 -m unittest evaluation/vehicle-facts/test_inventory_sheet.py   # 24 sheet tests
```

`evaluation/vehicle-facts/synthetic-inventory.json` is **invented test data**,
not dealer inventory. Its VINs, mileages and prices exist only to exercise the
rules above and must never be quoted to a customer.
