# Query test runs with explicit semantics

## Rows, filters, and groups

SELECT chooses expressions; FROM supplies relations; WHERE filters rows; GROUP BY forms groups; HAVING filters groups; ORDER BY orders the final result. Without ORDER BY, row order is not guaranteed.

COUNT(*) counts rows. COUNT(duration) counts non-NULL durations. AVG(duration) ignores NULL. SQL comparisons with NULL produce unknown; use IS NULL, not = NULL.

```
SELECT test_id, COUNT(*) AS runs,
       SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failures
FROM test_runs
GROUP BY test_id
HAVING COUNT(*) >= 2
ORDER BY test_id;
```

## The browser database

The lab seeds fictional builds, test_cases, test_runs, failures, and defects in DuckDB-WASM. No server receives your SQL. You can inspect data with SELECT * FROM test_runs.

Use GROUP BY for counts by module, CASE for indicators, and HAVING for minimum sample size. A CTE gives an intermediate result a meaningful name. It improves readability but does not necessarily force materialization.

## SDET relevance

SQL lets you investigate CI and service evidence near its source, with clear relational contracts.

## Common mistake

COUNT(duration) can be smaller than COUNT(*) when duration is unknown.
