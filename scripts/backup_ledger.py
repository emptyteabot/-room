from __future__ import annotations

import gzip
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path


LEDGER_PATH = Path(os.environ.get("FOCUS_ROOM_LEDGER_PATH", "/opt/focus-room/data/vip-ledger.json"))
BACKUP_DIR = Path(os.environ.get("FOCUS_ROOM_BACKUP_DIR", "/opt/focus-room/data/backups"))
RETENTION_COUNT = int(os.environ.get("FOCUS_ROOM_BACKUP_RETENTION", "14"))


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

    print(str(backup_path))


if __name__ == "__main__":
    main()
