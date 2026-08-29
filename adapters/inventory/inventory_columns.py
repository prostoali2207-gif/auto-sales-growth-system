"""Shared column mapping for every inventory source.

The sheet's headers drift: "Пробег (км)" became "Пробег, км", "Цена AED"
became "Цена, AED". Matching header strings literally meant a renamed column
silently disappeared -- and because `price_aed` is a required schema field,
"silently disappeared" meant the agent quoted a car with no price.

So headers are matched on a normalized form (case, spacing and punctuation
folded away), and a missing REQUIRED column is a hard error. Never a warning,
never a skip.
"""
from __future__ import annotations

import re
import unicodedata

SHEET_NAME = "Машины"

# Canonical header -> schema field. Lookup happens on the normalized form of
# both sides, so "Цена AED", "Цена, AED" and "цена  aed" all resolve here.
COLUMN_MAP = {
    "ID": "vehicle_id",
    "Марка": "make",
    "Модель": "model",
    "Год": "year",
    "VIN": "vin",
    "Цвет": "color",
    "Пробег, км": "mileage_km",
    "Двигатель": "engine",
    "Топливо": "fuel",
    "Коробка": "transmission",
    "Привод": "drivetrain",
    "Спецификация": "trim",
    "Состояние": "condition",
    "Аварии / крашеные детали": "accident_history",
    "Сервисная история": "service_history",
    "Владельцев": "owners_count",
    "Цена, AED": "price_aed",
    "Мин. цена, AED": "min_price_aed",
    "Статус": "status",
    "Мулькия до": "registration_valid_until",
    "Банковский залог": "bank_lien",
    "Ссылка на фото/видео": "media_url",
    "Ссылка на пост": "listing_url",
    "Заметки": "notes",
    "Дата обновления": "updated_at",
}

# Mirrors "required" in data-schemas/vehicle-inventory-record.schema.json.
REQUIRED_FIELDS = (
    "vehicle_id", "make", "model", "year", "vin",
    "mileage_km", "price_aed", "condition", "status", "updated_at",
)

# Read from the sheet so integrity checks can see them, never emitted as facts.
INTERNAL_FIELDS = ("min_price_aed", "notes")

INTEGER_FIELDS = frozenset({"year", "mileage_km", "owners_count"})
NUMBER_FIELDS = frozenset({"price_aed", "min_price_aed"})
DATE_FIELDS = frozenset({"updated_at", "registration_valid_until"})

# Mirrors the "Статус" dropdown in the sheet, exactly. Anything outside this
# list is a typo or a value someone invented, and the integrity check says so.
# Only AVAILABLE_STATUS ("В наличии", in vehicle-facts-adapter.mjs) may be
# offered to a customer; the other three are valid states, not availability.
ALLOWED_STATUSES = ("В наличии", "Резерв", "Продана", "На ремонте")

_NON_ALNUM = re.compile(r"[^0-9a-zа-яё]+", re.IGNORECASE)


def normalize_header(header) -> str:
    """Fold a header to its comparison key.

    Case, punctuation and repeated whitespace are removed, so
    "Пробег (км)", "Пробег, км" and "ПРОБЕГ  КМ" all become "пробег км".
    """
    if header is None:
        return ""
    text = unicodedata.normalize("NFKC", str(header)).replace("ё", "е").lower()
    return " ".join(_NON_ALNUM.sub(" ", text).split())


_NORMALIZED_MAP = {normalize_header(header): field for header, field in COLUMN_MAP.items()}
_FIELD_TO_HEADER = {field: header for header, field in COLUMN_MAP.items()}


class InventoryColumnError(RuntimeError):
    """A column contract problem that must stop the run."""


def map_headers(headers) -> dict[int, str]:
    """Map column index -> schema field.

    Raises InventoryColumnError when a required column is absent or when the
    same field is claimed by two columns. Unknown columns are ignored, which is
    safe: they cannot become facts.
    """
    resolved: dict[int, str] = {}
    duplicates: list[str] = []

    for index, header in enumerate(headers):
        field = _NORMALIZED_MAP.get(normalize_header(header))
        if field is None:
            continue
        if field in resolved.values():
            duplicates.append(f"{_FIELD_TO_HEADER[field]!r}")
            continue
        resolved[index] = field

    if duplicates:
        raise InventoryColumnError(
            "The sheet has more than one column for: "
            + ", ".join(sorted(set(duplicates)))
            + ". Remove the duplicate column and run this again."
        )

    missing = [f for f in REQUIRED_FIELDS if f not in resolved.values()]
    if missing:
        seen = ", ".join(repr(str(h)) for h in headers if str(h).strip()) or "(no headers at all)"
        raise InventoryColumnError(
            "The sheet is missing required column(s): "
            + ", ".join(f"{_FIELD_TO_HEADER[f]!r}" for f in missing)
            + f".\nHeaders found: {seen}."
            + "\nRefusing to continue: a missing required column would silently drop a fact "
              "the agent is allowed to quote."
        )

    return resolved


def is_blank(value) -> bool:
    """Blank stays absent. Not an empty string, not a zero."""
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() in {"", "-", "—", "–", "n/a", "N/A"}
    return False


def to_number(value):
    """'85 000 AED' -> 85000.0. None when nothing numeric is present."""
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    digits = re.sub(r"[^0-9.,-]", "", str(value)).replace(" ", "")
    if digits.count(",") == 1 and digits.count(".") == 0 and len(digits.split(",")[-1]) != 3:
        digits = digits.replace(",", ".")
    else:
        digits = digits.replace(",", "")
    return float(digits) if re.fullmatch(r"-?\d+(\.\d+)?", digits or "") else None


def to_date(value) -> str:
    import datetime as dt

    if isinstance(value, dt.datetime):
        return value.date().isoformat()
    if isinstance(value, dt.date):
        return value.isoformat()
    raw = str(value).strip()
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", raw):
        return raw
    match = re.fullmatch(r"(\d{1,2})[./](\d{1,2})[./](\d{4})", raw)
    if match:
        return f"{match.group(3)}-{int(match.group(2)):02d}-{int(match.group(1)):02d}"
    return raw


def row_to_record(row, column_index: dict[int, str]) -> dict:
    """Turn one raw row into a normalized inventory record.

    A blank cell yields no key at all, so the adapter emits no fact for it.
    """
    record: dict = {}
    for index, field in column_index.items():
        cell = row[index] if index < len(row) else None
        if is_blank(cell):
            continue
        if field in INTEGER_FIELDS:
            number = to_number(cell)
            if number is None:
                continue
            record[field] = int(number)
        elif field in NUMBER_FIELDS:
            number = to_number(cell)
            if number is None:
                continue
            record[field] = number
        elif field in DATE_FIELDS:
            record[field] = to_date(cell)
        else:
            record[field] = str(cell).strip()
    return record


def header_for(field: str) -> str:
    """Sheet header for a schema field, for messages a non-developer reads."""
    return _FIELD_TO_HEADER.get(field, field)
