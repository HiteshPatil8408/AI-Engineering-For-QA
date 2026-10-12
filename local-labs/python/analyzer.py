"""Deterministic baseline for synthetic CI results. No external dependencies."""
import json
import math
import sys
from collections import Counter
from pathlib import Path


def analyze(records: list[dict]) -> dict:
    allowed = {"passed", "failed", "skipped"}
    for row in records:
        if row.get("status") not in allowed or not isinstance(row.get("name"), str):
            raise ValueError("Invalid test-result schema")
        duration = row.get("duration")
        if isinstance(duration, bool) or not isinstance(duration, (int, float)) or not math.isfinite(duration) or duration < 0:
            raise ValueError("Duration must be a finite non-negative number")
    failed = [row for row in records if row["status"] == "failed"]
    return {
        "total": len(records),
        "statuses": dict(Counter(row["status"] for row in records)),
        "pass_rate": sum(row["status"] == "passed" for row in records) / len(records) if records else None,
        "slowest": sorted(records, key=lambda row: row["duration"], reverse=True)[:3],
        "failure_frequency": dict(Counter(row["name"] for row in failed)),
        "failure_categories": dict(Counter(row.get("category", "unclassified") for row in failed)),
    }


if __name__ == "__main__":
    records = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    print(json.dumps(analyze(records), indent=2))
