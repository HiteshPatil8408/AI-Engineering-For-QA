# Is 85% really better than 82%?

## The missing information

Model A scores 82% and B scores 85%. The observed difference is three percentage points. Without sample size, dataset composition, pairing, repeated runs, and uncertainty, you cannot judge whether the difference generalizes.

Evaluate both versions on the same held-out cases to reduce noise from case difficulty. Analyze per-case differences. A paired bootstrap resamples case IDs and recomputes the mean difference; keep conversational clusters together.

## Statistical versus practical significance

A confidence interval expresses uncertainty under a sampling procedure; it is not a probability that this specific fixed parameter lies in the realized interval. A p-value measures how incompatible the observations are with a specified null model, not the chance that the null is true.

Predefine a minimum worthwhile effect and release constraints for latency, cost, safety, and critical slices. A statistically detectable one-point improvement may be worthless if it doubles cost. A non-significant result is not proof of equivalence.

## Experiment discipline

A false positive (Type I error) rejects a true null. A false negative (Type II error) misses a real effect. Repeatedly checking many prompt variants until one passes increases false-positive risk.

State the hypothesis and stopping rule first. Keep a final untouched evaluation set, report all important slices, and investigate disagreements with human review. Never cherry-pick the most favorable judge configuration.

## SDET relevance

A small eval-score increase should not trigger a model migration unless the benefit is credible and useful.

## Common mistake

A higher point estimate alone does not establish a reliable or useful improvement.
