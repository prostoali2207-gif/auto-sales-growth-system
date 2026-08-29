#!/usr/bin/env python3
"""Convert an exported AM Motors xlsx into normalized inventory JSON.

The live Google Sheet is now the source of truth -- use check-inventory.py.
This stays for offline snapshots and historical exports, and shares the exact
same column mapping, so a renamed header behaves identically in both.

    pip install openpyxl jsonschema
    python3 adapters/inventory/xlsx-to-inventory.py --xlsx export.xlsx --out inventory.json
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))

from inventory_columns import (  # noqa: E402
    INTERNAL_FIELDS,
    SHEET_NAME,
    InventoryColumnError,
    map_headers,
    row_to_record,
)


def convert(xlsx: Path, sheet_name: str) -> list[dict]:
    from openpyxl import load_workbook

    workbook = load_workbook(xlsx, data_only=True)
    if sheet_name not in workbook.sheetnames:
        raise SystemExit(f"worksheet {sheet_name!r} not found; sheets are {workbook.sheetnames}")

    rows = list(workbook[sheet_name].iter_rows(values_only=True))
    if not rows:
        raise SystemExit(f"worksheet {sheet_name!r} is empty")

    column_index = map_headers(rows[0])  # raises on a missing required column
    records = [row_to_record(row, column_index) for row in rows[1:]]
    return [record for record in records if record]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--xlsx", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--sheet", default=SHEET_NAME)
    parser.add_argument("--keep-internal", action="store_true",
                        help="keep min_price_aed and notes in the output (never for a public file)")
    parser.add_argument("--schema", type=Path,
                        default=Path(__file__).resolve().parents[2] /
                        "data-schemas/vehicle-inventory-record.schema.json")
    args = parser.parse_args()

    try:
        records = convert(args.xlsx, args.sheet)
    except InventoryColumnError as exc:
        print(f"Column contract problem:\n\n{exc}", file=sys.stderr)
        return 3

    try:
        import jsonschema
    except ImportError:
        print("note: jsonschema not installed, skipping validation", file=sys.stderr)
    else:
        validator = jsonschema.Draft202012Validator(
            json.loads(args.schema.read_text(encoding="utf-8")))
        failures = 0
        for record in records:
            for error in sorted(validator.iter_errors(record), key=lambda e: list(e.absolute_path)):
                failures += 1
                where = "/".join(str(p) for p in error.absolute_path) or "$"
                print(f"{record.get('vehicle_id', '?')}: {where}: {error.message}", file=sys.stderr)
        if failures:
            raise SystemExit(f"{failures} inventory row(s) do not match the schema")

    if not args.keep_internal:
        records = [{k: v for k, v in r.items() if k not in INTERNAL_FIELDS} for r in records]

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"rows": len(records), "out": str(args.out),
                      "internal_columns_included": args.keep_internal}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
