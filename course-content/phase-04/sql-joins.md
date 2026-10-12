# Join failures to builds and defects

## Preserving evidence

INNER JOIN retains matching pairs only. LEFT JOIN retains every left row and fills absent right fields with NULL. RIGHT JOIN is the symmetric concept; it can usually be rewritten as a left join with reversed tables.

Filtering a right-hand column in WHERE after a left join can remove the unmatched rows and effectively behave like an inner join. Put the match restriction in ON when retaining all left rows is the goal.

```
SELECT tc.name, COUNT(tr.run_id) AS executions
FROM test_cases tc
LEFT JOIN test_runs tr ON tc.test_id = tr.test_id
GROUP BY tc.test_id, tc.name
ORDER BY tc.name;
```

## Correlation is not causal attribution

Join failures to defects using an explicit defect_id when available. A shared time window or module is weaker evidence; describe it as correlation. Multiple defects per failure need a linking table and deliberate counting of distinct failure IDs.

UNION removes duplicate rows; UNION ALL preserves them. Do not use UNION as a bandage for an incorrect join. Indexes and query plans help diagnose performance, but measure scanned rows and join cardinalities before guessing.

## SDET relevance

Defect correlation requires faithful event relationships. A bad join can fabricate a spike in product failures.

## Common mistake

COUNT(*) after a left join counts the preserved unmatched row; count a right-hand ID for actual matches.
