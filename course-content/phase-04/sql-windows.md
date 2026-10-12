# Latest results, ranks, and failure streaks

## Windows preserve rows

GROUP BY reduces multiple rows to a group. A window function annotates each row using its partition. ROW_NUMBER() gives a unique sequence within a partition; RANK() gives ties the same rank and leaves gaps.

Use PARTITION BY test_id for independent sequences. Order by build_id DESC and run_id DESC to break ties deterministically. Filter row number in an outer query or QUALIFY.

```
WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY test_id ORDER BY build_id DESC, run_id DESC
  ) AS rn
  FROM test_runs
)
SELECT test_id, status FROM ranked WHERE rn = 1 ORDER BY test_id;
```

## Lag and failure streaks

LAG(status) reads the previous row within the ordered partition; LEAD reads the next. Three consecutive executions failing is not always three consecutive builds: retries can add rows and missing builds create gaps.

Define a build-level status policy first, then check the current and previous two statuses plus consecutive build identifiers. Production build IDs may not be sequential; join to a build calendar or explicit sequence.

## SDET relevance

Latest-state dashboards and consecutive-failure alerts depend on per-test ordering, not global timestamps.

## Common mistake

Ordering only by timestamp when timestamps tie makes the selected latest row unstable.
