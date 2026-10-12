# Distributions, percentiles, and misleading averages

## Location and spread

The population is the full set you care about; a sample is the subset you observe. The mean adds values and divides by count. The median is the midpoint after sorting. A few long timeouts can raise the mean far above most requests.

Variance summarizes squared deviations from the mean; standard deviation returns to the original unit. Sample variance commonly uses n-1 to estimate population variance. Percentiles summarize tails, but estimates depend on sample size and interpolation policy.

```
import statistics
latency = [100, 110, 120, 125, 900]
print(statistics.mean(latency))  # 271
print(statistics.median(latency))  # 120
```

## Measure the distribution, not just one number

Latency is often right-skewed: many fast responses and a few slow ones. A normal-distribution assumption may be a poor fit. Plot or inspect the observed distribution before choosing a method.

A p95 from 20 requests is fragile. Report sample count, workload, measurement window, and error rate. Excluding timeouts improves reported latency while hiding the worst outcomes; report them separately and state the censoring policy.

## SDET relevance

Reliability reports need to describe the customer experience beyond a single average.

## Common mistake

An average latency improvement can coexist with a worse tail and more timeouts.
