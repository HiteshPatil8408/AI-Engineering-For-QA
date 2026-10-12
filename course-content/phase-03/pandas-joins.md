# Joins, time windows, and regression signals

## A join is a cardinality contract

Join executions to test metadata by stable test_id. validate="many_to_one" asserts that each metadata key appears once. A many-to-many join multiplies matching rows and inflates counts; inspect unmatched keys with indicator=True.

Use a left join to retain unknown tests for investigation. An inner join silently removes records with missing metadata. Group by environment and build when comparing performance.

```
# runs.merge(cases, on="test_id", how="left",
#            validate="many_to_one", indicator=True)
import pandas as pd
runs = pd.DataFrame({"test_id": [1,1,2], "duration": [2.,3.,1.]})
cases = pd.DataFrame({"test_id": [1,2], "module": ["auth","search"]})
print(runs.merge(cases, on="test_id", validate="many_to_one"))
```

## Time is an ordering constraint

Sort within a test by timestamp before shift() or rolling(). Use lagged features when predicting a future failure; a rolling window that includes the outcome leaks future information.

For a latency trend, compare median and tail within stable workloads and report sample sizes. A different mix of tests can change overall mean even when each test has unchanged latency.

## SDET relevance

Bad joins duplicate failures; uncontrolled comparisons make harmless dataset changes look like performance regressions.

## Common mistake

A duplicate metadata key can multiply execution rows without raising an error unless cardinality is checked.
