# Sampling, masks, and reproducible experiments

## Random does not mean uncontrolled

Use np.random.default_rng(seed) and keep the seed with the experiment. A fixed seed helps reproduce one sample but does not prove stability across samples. Sample multiple seeds when estimating uncertainty.

A mask such as durations > 5 identifies slow observations; np.percentile returns a tail summary. The mean can hide a small group of severe outliers, so retain raw observations and relevant segments.

```
import numpy as np
rng = np.random.default_rng(42)
durations = rng.lognormal(mean=1, sigma=0.5, size=100)
print(np.percentile(durations, 95))
print(durations[durations > 5].size)
```

## Representative samples

Sampling only successful production interactions creates survivorship bias. Include unsuccessful requests, rare categories, long inputs, empty retrieval, and adversarial inputs in separately labeled slices.

Keep training, tuning, and final evaluation samples separate. Changing a prompt repeatedly against the final evaluation set effectively trains your decisions on that set.

## SDET relevance

Reproducible synthetic CI history helps compare analyzer versions without depending on proprietary data.

## Common mistake

A fixed seed gives repeatability, not a guarantee that the sample represents production.
