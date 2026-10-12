# Bootstrap evaluation differences

## The resampling idea

A bootstrap treats your observed independent cases as an empirical population. Sample n case indices with replacement, calculate a statistic, repeat many times, and summarize the resulting distribution.

For paired evaluation, compute B-A for each case before resampling. Do not sample A and B independently when their scores correspond to the same cases. A percentile interval is useful for exploration but can be inaccurate in small or biased samples.

```
import numpy as np
diff = np.array([0, 1, -1, 0, 1, 0, 1, 0], dtype=float)
rng = np.random.default_rng(42)
means = [rng.choice(diff, size=len(diff), replace=True).mean()
         for _ in range(2000)]
print(np.percentile(means, [2.5, 97.5]))
```

## What an interval cannot fix

Bootstrap does not repair a biased dataset, a miscalibrated judge, or leakage from tuning on evaluation cases. A narrow interval around a biased score is still misleading.

For latency, evaluate comparable workloads and resample independent sessions when requests share a session. For correctness, retain human-adjudicated failures and report uncertainty for critical slices separately.

## SDET relevance

Resampling provides an accessible way to quantify uncertainty while preserving per-case model comparisons.

## Common mistake

Resampling individual turns from one conversation breaks the independence assumption.
