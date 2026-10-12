# Clean test history without hiding defects

## Inspect before transforming

A DataFrame is a labeled table; each column is a Series. Start with head(), info(), dtypes, and isna().sum(). Read CSV with explicit types when identifiers have leading zeros. Parse timestamps with a defined timezone.

Selecting df["duration"] gives a Series; df[["duration"]] gives a DataFrame. Use .loc for explicit row and column selection. Copy a filtered slice before modifying it when isolation is required.

```
import pandas as pd
df = pd.DataFrame([
    {"test": "login", "build": 1, "status": "failed", "duration": 4.5},
    {"test": "login", "build": 2, "status": "passed", "duration": None},
])
print(df.isna().sum())
print(df.loc[df["status"] == "failed", ["test", "build"]])
```

## Missing and duplicate records

A missing duration should remain unknown for latency analysis, not become zero. A missing status should be quarantined or counted separately. Preserve the denominator used in every metric.

Deduplicate by the ingestion identity, not merely by test name. Two executions of the same test in one build can be intentional retries. A stable key might include build_id, test_id, attempt, and environment. Keep raw data and document every cleaning decision.

## SDET relevance

A polished CI dashboard is misleading if ingestion silently drops flaky retries or imputes missing outcomes as success.

## Common mistake

drop_duplicates("test") destroys historical runs and can erase flakiness.
