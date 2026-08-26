# Vehicle business-fact adapter

Turns the AM Motors vehicle sheet into the `verified_facts` the Sales / Lead
Conversion agent already expects. Without it the agent has no verified
commercial ground to stand on, which is what makes it fail the FACT family.

```
AM-Motors-справочник-машин.xlsx
        │  xlsx-to-inventory.py        (rename + type-normalize only)
        ▼
inventory JSON  ── vehicle-inventory-record.schema.json
        │  vehicle-facts-adapter.mjs
        ▼
verified_facts  ── sales-lead-turn.schema.json#/$defs/verifiedFact
```

## Use

```bash
pip install openpyxl jsonschema
python3 adapters/inventory/xlsx-to-inventory.py \
  --xlsx AM-Motors-справочник-машин.xlsx \
  --out data/inventory/am-motors-vehicles.json
```

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
npm run test:vehicle-facts
```

`evaluation/vehicle-facts/synthetic-inventory.json` is **invented test data**,
not dealer inventory. Its VINs, mileages and prices exist only to exercise the
rules above and must never be quoted to a customer.
