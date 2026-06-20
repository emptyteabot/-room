from __future__ import annotations

import gzip
import json
import os
import shutil
import sys
from threading import Thread
from datetime import datetime, timezone
from pathlib import Path


LEDGER_PATH = Path(os.environ.get("FOCUS_ROOM_LEDGER_PATH", "/opt/focus-room/data/vip-ledger.json"))
BACKUP_DIR = Path(os.environ.get("FOCUS_ROOM_BACKUP_DIR", "/opt/focus-room/data/backups"))
RETENTION_COUNT = int(os.environ.get("FOCUS_ROOM_BACKUP_RETENTION", "14"))
WEBHOOK_URL = (os.environ.get("FOCUS_ROOM_BACKUP_WEBHOOK_URL") or os.environ.get("REMOTE_BACKUP_URL") or "").strip()
WEBHOOK_TOKEN = os.environ.get("FOCUS_ROOM_BACKUP_WEBHOOK_TOKEN", "").strip()
WEBHOOK_TIMEOUT = float(os.environ.get("FOCUS_ROOM_BACKUP_WEBHOOK_TIMEOUT", "5"))


def main() -> None:
    if not LEDGER_PATH.exists():
        raise FileNotFoundError(f"Ledger file not found: {LEDGER_PATH}")

    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    backup_path = BACKUP_DIR / f"ledger_{timestamp}.json.gz"

    with LEDGER_PATH.open("rb") as source, gzip.open(backup_path, "wb") as target:
        shutil.copyfileobj(source, target)

    backups = sorted(BACKUP_DIR.glob("ledger_*.json.gz"), key=lambda item: item.stat().st_mtime, reverse=True)

    for stale_backup in backups[RETENTION_COUNT:]:
        stale_backup.unlink()

    send_remote_backup(LEDGER_PATH.read_text(encoding="utf-8"), backup_path)

    print(str(backup_path))


def send_remote_backup(ledger_content: str, backup_path: Path) -> None:
    if not WEBHOOK_URL:
        return

    payload = {
        "source": "focus-room",
        "backup_name": backup_path.name,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "ledger": json.loads(ledger_content),
    }
    headers = {"content-type": "application/json"}

    if WEBHOOK_TOKEN:
        headers["authorization"] = f"Bearer {WEBHOOK_TOKEN}"

    def post_payload() -> None:
        try:
            import requests

            response = requests.post(WEBHOOK_URL, json=payload, headers=headers, timeout=WEBHOOK_TIMEOUT)
            response.raise_for_status()
        except Exception as error:
            print(f"remote backup failed: {error}", file=sys.stderr)

    worker = Thread(target=post_payload)
    worker.start()
    worker.join(WEBHOOK_TIMEOUT + 1)


if __name__ == "__main__":
    main()
