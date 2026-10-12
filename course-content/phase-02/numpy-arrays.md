# Arrays, shapes, and vectorized metrics

## Shape describes your contract

A NumPy ndarray stores typed values in a multidimensional shape. A matrix shaped (runs, tests) has one row per run. sum(axis=0) reduces the run axis and produces one value per test. sum(axis=1) produces one value per run.

Vectorized operations apply across arrays efficiently. A boolean mask selects observations. Slices can share memory with the original array, so use .copy() when mutation should be isolated.

```
import numpy as np
passed = np.array([[1, 0, 1], [1, 1, 0]])
print(passed.shape)  # (2, 3)
print(passed.mean(axis=0))  # rate for each test
```

## Broadcasting rules

NumPy compares trailing dimensions. Dimensions match when equal or when one is 1. An array of shape (3,) can be added to (2, 3); an array of shape (2,) cannot without reshaping to (2, 1).

The result may be valid mathematically but wrong semantically. Label axes before operations. Explicitly choose floating-point dtype before division or normalization; integer storage can truncate derived values.

```
latency = np.array([[100., 200., 300.], [120., 220., 330.]])
baseline = np.array([100., 200., 300.])
print(latency / baseline)
```

## SDET relevance

Embedding batches and latency metrics use array operations. A wrong axis gives plausible but incorrect quality reports.

## Common mistake

Broadcasting a baseline along the wrong axis silently compares unrelated observations.
