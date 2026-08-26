"""Read the live AM Motors sheet.

The Google Sheet replaced the xlsx as the source of truth, so inventory edits
reach the agent without a manual export.

If the sheet cannot be read, this raises. It never falls back to a previous
copy: a stale price is worse than a missing one, because the agent will quote
a stale price with full confidence and no way to know it is wrong.
"""
from __future__ import annotations

import json
import os
import urllib.error
import urllib.parse
import urllib.request

from inventory_columns import SHEET_NAME, map_headers, row_to_record

DEFAULT_SHEET_ID = "1RXA5OCKCnGQvZxde0_miF_WjLXsBw0hdPDK-3A_kGBQ"
API_KEY_ENV = "GOOGLE_SHEETS_API_KEY"
TIMEOUT_SECONDS = 30


class SheetUnavailable(RuntimeError):
    """The sheet could not be read. Callers must stop, not substitute a cache."""


def _fetch(url: str, what: str) -> bytes:
    try:
        with urllib.request.urlopen(url, timeout=TIMEOUT_SECONDS) as response:
            return response.read()
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")[:400]
        if exc.code in (401, 403):
            raise SheetUnavailable(
                f"Нет доступа к таблице ({what}, HTTP {exc.code}).\n"
                "Откройте доступ «Просмотр для всех, у кого есть ссылка» "
                f"или задайте {API_KEY_ENV}.\n{detail}"
            ) from exc
        if exc.code == 404:
            raise SheetUnavailable(
                f"Таблица или лист не найдены ({what}, HTTP 404). "
                f"Проверьте ID таблицы и что лист называется «{SHEET_NAME}».\n{detail}"
            ) from exc
        raise SheetUnavailable(f"Таблица недоступна ({what}, HTTP {exc.code}).\n{detail}") from exc
    except urllib.error.URLError as exc:
        raise SheetUnavailable(f"Не удалось соединиться с Google ({what}): {exc.reason}") from exc


def _rows_via_api(sheet_id: str, sheet_name: str, api_key: str) -> list[list]:
    range_ = urllib.parse.quote(sheet_name)
    url = (f"https://sheets.googleapis.com/v4/spreadsheets/{sheet_id}/values/{range_}"
           f"?key={urllib.parse.quote(api_key)}&majorDimension=ROWS"
           f"&valueRenderOption=UNFORMATTED_VALUE")
    payload = json.loads(_fetch(url, "Sheets API").decode("utf-8"))
    return payload.get("values") or []


def _rows_via_csv(sheet_id: str, sheet_name: str) -> list[list]:
    import csv
    import io

    url = (f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq"
           f"?tqx=out:csv&sheet={urllib.parse.quote(sheet_name)}")
    body = _fetch(url, "CSV export").decode("utf-8-sig")
    if body.lstrip().startswith("<"):
        raise SheetUnavailable(
            "Google вернул страницу входа вместо данных. Таблица закрыта для анонимного "
            f"доступа — откройте доступ по ссылке или задайте {API_KEY_ENV}."
        )
    return [row for row in csv.reader(io.StringIO(body))]


def fetch_rows(sheet_id: str = DEFAULT_SHEET_ID, sheet_name: str = SHEET_NAME) -> list[list]:
    """Raw rows, header first. Uses the API key when set, else the CSV export."""
    api_key = os.environ.get(API_KEY_ENV, "").strip()
    rows = _rows_via_api(sheet_id, sheet_name, api_key) if api_key else _rows_via_csv(sheet_id, sheet_name)
    if not rows:
        raise SheetUnavailable(
            f"Лист «{sheet_name}» пустой. Ничего не выгружаю: пустая выгрузка "
            "затёрла бы рабочий инвентарь."
        )
    return rows


def rows_to_records(rows) -> list[dict]:
    """Normalized records from raw rows. Blank cells stay absent."""
    column_index = map_headers(rows[0])  # raises on a missing required column
    records = [row_to_record(row, column_index) for row in rows[1:]]
    return [record for record in records if record]


def load_inventory(sheet_id: str = DEFAULT_SHEET_ID, sheet_name: str = SHEET_NAME) -> list[dict]:
    """Live inventory, or an exception. Never a cached copy."""
    return rows_to_records(fetch_rows(sheet_id, sheet_name))
