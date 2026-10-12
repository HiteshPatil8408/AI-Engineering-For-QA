# Pass rates and flaky-test analysis

## Groupby makes the denominator explicit

Create a passed indicator and take its mean within each test group. This measures run-level pass rate. A test-level report answers a different question: how many distinct tests exhibit a behavior? Name the denominator in your report.

A mixed-outcome test has at least one pass and one fail in the observation window. Different code versions, environments, or test data can explain that pattern. Analyze repeated runs under comparable conditions before asserting nondeterministic flakiness.

```
import pandas as pd
df = pd.DataFrame({"test": ["login", "login", "search"],
                   "status": ["failed", "passed", "passed"]})
df["passed"] = df["status"].eq("passed")
print(df.groupby("test")["passed"].mean())
```

## Build a CI health report

Aggregate counts, median duration, and p95 by module and build. Retain failed-first-attempt rate separately from eventual pass rate so retries cannot hide instability.

Sort by impact, not merely count: consider failure frequency, business criticality, added retry time, and reproducibility. Use pivot tables for build-by-module summaries and convert timestamps before resampling.

## SDET relevance

A test that both passes and fails is a triage candidate. Confirm controlled conditions before labeling it flaky.

## Common mistake

A test passing after a retry is not evidence that its original failure was harmless.
