# Conditional probability and base rates

## A probability needs a denominator

P(A|B) is the probability of A among cases where B occurred. It differs from P(B|A). Recall asks how many actual defects were flagged; precision asks how many flags were actual defects.

Suppose 1% of 10,000 failures are product defects. A detector catches 90 of 100 defects and falsely flags 5% of the 9,900 others, or 495 cases. Precision is 90/(90+495), about 15.4%, despite 90% recall.

## Bernoulli and binomial models

A single binary outcome can be modeled as Bernoulli with probability p. The binomial counts successes in n independent trials with the same p. These assumptions matter: repeated chatbot turns from the same conversation can be correlated.

Repeated flaky-test runs under shared infrastructure may fail together during an outage. Treating them as independent evidence produces overly narrow confidence intervals. Resample or analyze at the independent unit, such as build or conversation.

## SDET relevance

A failure triage model with impressive recall can still overwhelm engineers with false alerts when product defects are rare.

## Common mistake

High recall does not guarantee that a positive prediction is likely to be a true defect.
