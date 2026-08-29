"""Integrity check for the vehicle sheet, written for the business owner.

Run after editing the sheet. Every message names the row and says what to fix
in plain language -- no schema paths, no field names the owner has never seen.

It never prints the negotiation floor or the internal notes, even when the
problem is in those columns.
"""
from __future__ import annotations

import re

from inventory_columns import (
    ALLOWED_STATUSES,
    INTERNAL_FIELDS,
    REQUIRED_FIELDS,
    header_for,
    is_blank,
)

# ISO 3779 excludes I, O and Q so they cannot be confused with 1 and 0.
VIN_PATTERN = re.compile(r"^[A-HJ-NPR-Z0-9]{17}$")
VIN_FORBIDDEN = re.compile(r"[IOQ]", re.IGNORECASE)

# Google Drive folder id out of a share link.
_FOLDER_ID = re.compile(r"/folders/([A-Za-z0-9_-]+)|[?&]id=([A-Za-z0-9_-]+)")


def folder_key(url) -> str | None:
    """The identity of a Drive folder link, ignoring cosmetic query differences."""
    if is_blank(url):
        return None
    match = _FOLDER_ID.search(str(url))
    if match:
        return match.group(1) or match.group(2)
    return str(url).strip().split("?")[0].rstrip("/")


def _label(record, row_number: int) -> str:
    vehicle_id = record.get("vehicle_id")
    return f"строка {row_number} ({vehicle_id})" if vehicle_id else f"строка {row_number}"


def check_inventory(records) -> list[dict]:
    """Return problems, worst first. Empty list means the sheet is clean.

    Each problem: {row, vehicle_id, kind, message}.
    """
    problems: list[dict] = []
    seen_ids: dict[str, int] = {}
    seen_vins: dict[str, int] = {}
    seen_folders: dict[str, int] = {}

    for offset, record in enumerate(records):
        row = offset + 2  # row 1 is the header
        label = _label(record, row)
        vehicle_id = record.get("vehicle_id")

        def add(kind: str, message: str) -> None:
            problems.append({"row": row, "vehicle_id": vehicle_id, "kind": kind, "message": message})

        # 1. required fields
        for field in REQUIRED_FIELDS:
            if is_blank(record.get(field)) and field not in record:
                add("empty_required",
                    f"{label}: не заполнен столбец «{header_for(field)}». "
                    "Без него машину нельзя предлагать клиенту.")
            elif is_blank(record.get(field)):
                add("empty_required",
                    f"{label}: столбец «{header_for(field)}» пустой. "
                    "Без него машину нельзя предлагать клиенту.")

        # 2. duplicate ID
        if not is_blank(vehicle_id):
            key = str(vehicle_id).strip()
            if key in seen_ids:
                add("duplicate_id",
                    f"{label}: такой же ID уже стоит в строке {seen_ids[key]}. "
                    "Два разных автомобиля не могут иметь один ID — исправьте один из них.")
            else:
                seen_ids[key] = row

        # 3. VIN
        vin = record.get("vin")
        if not is_blank(vin):
            value = str(vin).strip().upper()
            if len(value) != 17:
                add("bad_vin",
                    f"{label}: VIN состоит из {len(value)} символов, а должен из 17. "
                    "Проверьте, не потерялся ли символ при копировании.")
            elif VIN_FORBIDDEN.search(value):
                bad = ", ".join(sorted(set(re.findall(r"[IOQ]", value, re.IGNORECASE))))
                add("bad_vin",
                    f"{label}: в VIN есть буквы {bad}. В VIN их не бывает — "
                    "скорее всего, это цифры 1 или 0.")
            elif not VIN_PATTERN.match(value):
                add("bad_vin",
                    f"{label}: в VIN есть посторонние символы. "
                    "Допустимы только латинские буквы и цифры.")
            elif value in seen_vins:
                add("duplicate_vin",
                    f"{label}: такой же VIN уже стоит в строке {seen_vins[value]}. "
                    "VIN уникален для каждого автомобиля — одна из строк относится к другой машине.")
            else:
                seen_vins[value] = row

        # 4. shared media folder
        key = folder_key(record.get("media_url"))
        if key is not None:
            if key in seen_folders:
                add("duplicate_folder",
                    f"{label}: ссылка на фото ведёт в ту же папку, что и в строке {seen_folders[key]}. "
                    "Клиенту уйдут фотографии чужой машины.")
            else:
                seen_folders[key] = row

        # 5. status
        status = record.get("status")
        if not is_blank(status):
            value = str(status).strip()
            if value not in ALLOWED_STATUSES:
                add("bad_status",
                    f"{label}: статус «{value}» не из списка. "
                    f"Допустимые варианты: {', '.join(ALLOWED_STATUSES)}.")

    order = {"duplicate_id": 0, "duplicate_vin": 1, "duplicate_folder": 2,
             "bad_vin": 3, "empty_required": 4, "bad_status": 5}
    problems.sort(key=lambda p: (order.get(p["kind"], 9), p["row"]))
    return problems


def format_report(problems, total_rows: int) -> str:
    """Plain-language report. Never echoes an internal column's value."""
    if not problems:
        return (f"Проверено строк: {total_rows}. Ошибок нет — "
                "таблицу можно отдавать в работу.")

    lines = [f"Проверено строк: {total_rows}. Найдено проблем: {len(problems)}.", ""]
    for problem in problems:
        lines.append(f"  • {problem['message']}")
    lines += ["", "Пока это не исправлено, данные в работу не берутся."]
    text = "\n".join(lines)

    for field in INTERNAL_FIELDS:  # defensive: internal values never reach the report
        assert header_for(field) not in text or "пустой" in text or "не заполнен" in text
    return text
