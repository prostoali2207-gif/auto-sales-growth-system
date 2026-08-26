"""Regressions for the sheet column contract and the integrity check.

No real AM Motors data here. Every value is invented for testing; the sheet
itself stays out of this public repository.
"""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "adapters" / "inventory"))

from inventory_columns import (  # noqa: E402
    ALLOWED_STATUSES,
    InventoryColumnError,
    is_blank,
    map_headers,
    normalize_header,
    row_to_record,
)
from inventory_integrity import check_inventory, folder_key, format_report  # noqa: E402

# Headers exactly as they appear in the live sheet, commas and all.
LIVE_HEADERS = [
    "ID", "Марка", "Модель", "Год", "VIN", "Цвет", "Пробег, км", "Двигатель",
    "Топливо", "Коробка", "Привод", "Спецификация", "Состояние",
    "Аварии / крашеные детали", "Сервисная история", "Владельцев", "Цена, AED",
    "Мин. цена, AED", "Статус", "Мулькия до", "Банковский залог",
    "Ссылка на фото/видео", "Ссылка на пост", "Заметки", "Дата обновления",
]

# The older spelling the adapter shipped with.
LEGACY_HEADERS = [
    "ID", "Марка", "Модель", "Год", "VIN", "Цвет", "Пробег (км)", "Двигатель",
    "Топливо", "Коробка", "Привод", "Спецификация", "Состояние",
    "Аварии/крашеные детали", "Сервисная история", "Владельцев", "Цена AED",
    "Мин. цена AED", "Статус", "Мулькия до", "Банковский залог",
    "Ссылка на фото/видео", "Ссылка на пост", "Заметки", "Дата обновления",
]


def record(**overrides):
    base = {
        "vehicle_id": "AM-001", "make": "Hyundai", "model": "Tucson", "year": 2021,
        "vin": "TESTVN00000000001", "mileage_km": 40000, "price_aed": 70000,
        "condition": "Хорошее", "status": "В наличии", "updated_at": "2026-08-24",
    }
    base.update(overrides)
    return {k: v for k, v in base.items() if v is not None}


class HeaderMapping(unittest.TestCase):
    def test_comma_and_spacing_variants_fold_together(self):
        for renamed, original in [
            ("Пробег, км", "Пробег (км)"),
            ("Цена, AED", "Цена AED"),
            ("Мин. цена, AED", "Мин. цена AED"),
            ("Аварии / крашеные детали", "Аварии/крашеные детали"),
        ]:
            self.assertEqual(normalize_header(renamed), normalize_header(original))

    def test_live_and_legacy_headers_map_identically(self):
        self.assertEqual(map_headers(LIVE_HEADERS), map_headers(LEGACY_HEADERS))

    def test_the_renamed_price_column_is_actually_found(self):
        """The bug: 'Цена, AED' was skipped, dropping a required field silently."""
        mapping = map_headers(LIVE_HEADERS)
        self.assertEqual(mapping[LIVE_HEADERS.index("Цена, AED")], "price_aed")
        self.assertEqual(mapping[LIVE_HEADERS.index("Пробег, км")], "mileage_km")
        self.assertEqual(mapping[LIVE_HEADERS.index("Мин. цена, AED")], "min_price_aed")
        self.assertEqual(mapping[LIVE_HEADERS.index("Аварии / крашеные детали")], "accident_history")

    def test_case_and_whitespace_noise_still_maps(self):
        noisy = list(LIVE_HEADERS)
        noisy[noisy.index("Цена, AED")] = "  ЦЕНА ,  AED  "
        self.assertEqual(noisy.index("  ЦЕНА ,  AED  "),
                         [i for i, f in map_headers(noisy).items() if f == "price_aed"][0])

    def test_missing_required_column_raises_instead_of_skipping(self):
        for dropped in ("Цена, AED", "VIN", "Статус", "Дата обновления"):
            headers = [h for h in LIVE_HEADERS if h != dropped]
            with self.assertRaises(InventoryColumnError) as caught:
                map_headers(headers)
            self.assertIn(dropped, str(caught.exception))
            self.assertIn("Refusing to continue", str(caught.exception))

    def test_missing_optional_column_is_fine(self):
        headers = [h for h in LIVE_HEADERS if h != "Заметки"]
        self.assertNotIn("notes", map_headers(headers).values())

    def test_duplicate_column_raises(self):
        with self.assertRaises(InventoryColumnError) as caught:
            map_headers(LIVE_HEADERS + ["Цена AED"])
        self.assertIn("more than one column", str(caught.exception))

    def test_unknown_columns_are_ignored(self):
        self.assertEqual(map_headers(LIVE_HEADERS + ["Что-то новое"]), map_headers(LIVE_HEADERS))


class BlankCells(unittest.TestCase):
    def test_blank_stays_absent_not_empty_string_or_zero(self):
        mapping = map_headers(LIVE_HEADERS)
        row = [""] * len(LIVE_HEADERS)
        row[LIVE_HEADERS.index("ID")] = "AM-001"
        row[LIVE_HEADERS.index("Цвет")] = "   "
        row[LIVE_HEADERS.index("Двигатель")] = "-"
        parsed = row_to_record(row, mapping)

        self.assertEqual(parsed, {"vehicle_id": "AM-001"})
        for absent in ("color", "engine", "price_aed", "mileage_km"):
            self.assertNotIn(absent, parsed)

    def test_zero_is_a_value(self):
        self.assertFalse(is_blank(0))
        mapping = map_headers(LIVE_HEADERS)
        row = [""] * len(LIVE_HEADERS)
        row[LIVE_HEADERS.index("Пробег, км")] = 0
        self.assertEqual(row_to_record(row, mapping)["mileage_km"], 0)

    def test_numbers_with_separators_and_units_parse(self):
        mapping = map_headers(LIVE_HEADERS)
        row = [""] * len(LIVE_HEADERS)
        row[LIVE_HEADERS.index("Цена, AED")] = "85 000 AED"
        row[LIVE_HEADERS.index("Пробег, км")] = "45 200 км"
        parsed = row_to_record(row, mapping)
        self.assertEqual(parsed["price_aed"], 85000.0)
        self.assertEqual(parsed["mileage_km"], 45200)


class IntegrityCheck(unittest.TestCase):
    def test_clean_sheet_reports_no_problems(self):
        rows = [record(), record(vehicle_id="AM-002", vin="TESTVN00000000002")]
        self.assertEqual(check_inventory(rows), [])
        self.assertIn("Ошибок нет", format_report([], len(rows)))

    def test_duplicate_id_is_caught_with_both_rows(self):
        rows = [record(), record(vin="TESTVN00000000002")]
        kinds = [p["kind"] for p in check_inventory(rows)]
        self.assertIn("duplicate_id", kinds)
        message = next(p["message"] for p in check_inventory(rows) if p["kind"] == "duplicate_id")
        self.assertIn("строка 3", message)
        self.assertIn("строке 2", message)

    def test_duplicate_vin_is_caught(self):
        rows = [record(), record(vehicle_id="AM-002")]
        self.assertIn("duplicate_vin", [p["kind"] for p in check_inventory(rows)])

    def test_duplicate_media_folder_is_caught(self):
        shared = "https://drive.google.com/drive/folders/ABC123folder"
        rows = [
            record(media_url=shared),
            record(vehicle_id="AM-002", vin="TESTVN00000000002",
                   media_url=shared + "?usp=sharing"),
        ]
        problem = next(p for p in check_inventory(rows) if p["kind"] == "duplicate_folder")
        self.assertIn("фотографии чужой машины", problem["message"])

    def test_different_folders_are_not_flagged(self):
        rows = [
            record(media_url="https://drive.google.com/drive/folders/AAA"),
            record(vehicle_id="AM-002", vin="TESTVN00000000002",
                   media_url="https://drive.google.com/drive/folders/BBB"),
        ]
        self.assertEqual([p for p in check_inventory(rows) if p["kind"] == "duplicate_folder"], [])

    def test_folder_key_ignores_cosmetic_link_differences(self):
        self.assertEqual(folder_key("https://drive.google.com/drive/folders/X1?usp=sharing"),
                         folder_key("https://drive.google.com/drive/folders/X1"))

    def test_short_vin_is_caught(self):
        problem = next(p for p in check_inventory([record(vin="TOOSHORT")]) if p["kind"] == "bad_vin")
        self.assertIn("8 символов", problem["message"])
        self.assertIn("17", problem["message"])

    def test_vin_with_forbidden_letters_is_caught(self):
        problem = next(p for p in check_inventory([record(vin="TESTVN00000000O1Q")])
                       if p["kind"] == "bad_vin")
        self.assertIn("O", problem["message"])
        self.assertIn("Q", problem["message"])

    def test_empty_required_field_is_caught_by_its_sheet_header(self):
        problems = check_inventory([record(price_aed=None)])
        problem = next(p for p in problems if p["kind"] == "empty_required")
        self.assertIn("Цена, AED", problem["message"])
        self.assertIn("нельзя предлагать клиенту", problem["message"])

    def test_status_outside_the_allowed_list_is_caught(self):
        problem = next(p for p in check_inventory([record(status="кому-то обещана")])
                       if p["kind"] == "bad_status")
        self.assertIn("не из списка", problem["message"])
        for allowed in ALLOWED_STATUSES:
            self.assertIn(allowed, problem["message"])

    def test_allowed_statuses_pass(self):
        for index, status in enumerate(ALLOWED_STATUSES):
            rows = [record(vehicle_id=f"AM-{index:03d}", vin=f"TESTVN00000000{index:03d}",
                           status=status)]
            self.assertEqual([p for p in check_inventory(rows) if p["kind"] == "bad_status"], [])

    def test_report_is_plain_language_without_jargon(self):
        rows = [record(), record(vin="TESTVN00000000002")]
        text = format_report(check_inventory(rows), len(rows))
        self.assertIn("строка 3", text)
        for jargon in ("Traceback", "KeyError", "additionalProperties", "$ref", "None"):
            self.assertNotIn(jargon, text)

    def test_report_never_prints_internal_column_values(self):
        rows = [record(min_price_aed=41500, notes="торгуется до 41500"),
                record(vehicle_id="AM-002", min_price_aed=39000, notes="секрет")]
        text = format_report(check_inventory(rows), len(rows))
        for secret in ("41500", "39000", "торгуется", "секрет"):
            self.assertNotIn(secret, text)


if __name__ == "__main__":
    unittest.main()
