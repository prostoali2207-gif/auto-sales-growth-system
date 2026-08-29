#!/usr/bin/env python3
"""Check the vehicle sheet and report problems in plain language.

Run this after editing the sheet:

    python3 adapters/inventory/check-inventory.py

Exit code 0 means the sheet is clean. Anything else means do not ship it.

Optional:
    --sheet-id ID     another spreadsheet
    --from FILE.json  check an already-exported file instead of the live sheet
    --out FILE.json   also write the normalized inventory (never the internal
                      columns) for the adapter to consume
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))

from inventory_columns import INTERNAL_FIELDS, InventoryColumnError  # noqa: E402
from inventory_integrity import check_inventory, format_report  # noqa: E402
from sheets_source import DEFAULT_SHEET_ID, SheetUnavailable, load_inventory  # noqa: E402

EXIT_OK = 0
EXIT_PROBLEMS = 1
EXIT_SHEET_UNAVAILABLE = 2
EXIT_COLUMN_CONTRACT = 3
EXIT_SCHEMA = 4


def validate_schema(records, schema_path: Path) -> int:
    try:
        import jsonschema
    except ImportError:
        print("(подсказка: pip install jsonschema — тогда проверю и структуру строк)", file=sys.stderr)
        return 0
    validator = jsonschema.Draft202012Validator(json.loads(schema_path.read_text(encoding="utf-8")))
    failures = 0
    for offset, record in enumerate(records):
        for error in sorted(validator.iter_errors(record), key=lambda e: list(e.absolute_path)):
            failures += 1
            where = "/".join(str(p) for p in error.absolute_path) or "строка целиком"
            print(f"  • строка {offset + 2} ({record.get('vehicle_id', '?')}): "
                  f"{where}: {error.message}", file=sys.stderr)
    return failures


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--sheet-id", default=DEFAULT_SHEET_ID)
    parser.add_argument("--from", dest="source_file", type=Path)
    parser.add_argument("--out", type=Path)
    parser.add_argument("--schema", type=Path,
                        default=Path(__file__).resolve().parents[2] /
                        "data-schemas/vehicle-inventory-record.schema.json")
    args = parser.parse_args()

    try:
        if args.source_file:
            records = json.loads(args.source_file.read_text(encoding="utf-8"))
        else:
            records = load_inventory(args.sheet_id)
    except SheetUnavailable as exc:
        print(f"Не удалось прочитать таблицу.\n\n{exc}\n\n"
              "Старые данные я специально не подставляю: устаревшая цена хуже отсутствующей.",
              file=sys.stderr)
        return EXIT_SHEET_UNAVAILABLE
    except InventoryColumnError as exc:
        print(f"Проблема со столбцами таблицы.\n\n{exc}", file=sys.stderr)
        return EXIT_COLUMN_CONTRACT

    problems = check_inventory(records)
    print(format_report(problems, len(records)))

    schema_failures = validate_schema(records, args.schema) if args.schema.is_file() else 0
    if schema_failures:
        print(f"\nСтрок, не подходящих под структуру: {schema_failures}.", file=sys.stderr)

    if problems or schema_failures:
        return EXIT_PROBLEMS if problems else EXIT_SCHEMA

    if args.out:
        publishable = [{k: v for k, v in r.items() if k not in INTERNAL_FIELDS} for r in records]
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(publishable, indent=2, ensure_ascii=False) + "\n",
                            encoding="utf-8")
        print(f"Выгружено строк: {len(publishable)} -> {args.out} "
              "(внутренние столбцы не выгружаются).")

    return EXIT_OK


if __name__ == "__main__":
    raise SystemExit(main())
