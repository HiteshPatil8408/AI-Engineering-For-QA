# From SDET to AI quality engineer

## Two tracks, one engineering mindset

Track A uses AI to improve software testing: generating API test candidates, classifying CI failures, or proposing missing edge cases. The generated artifacts still need review and deterministic execution.

Track B tests the AI application itself: whether a chatbot stays grounded, whether retrieval finds the right document, and whether an agent calls an authorized tool. Treat its output as evidence to evaluate, not a trustworthy oracle.

## Deterministic contracts, probabilistic behavior

A REST endpoint may promise an exact status code and schema. A chatbot can express the same correct answer in many ways. Separate hard invariants (valid JSON, no forbidden tool, citation points to supplied evidence) from quality rubrics (helpfulness, completeness, groundedness).

Freeze representative test inputs and application versions. Run repeated samples when variation matters. Record outputs, scores, cost, latency, and failure categories. One passing response is not proof of reliability.

## Your learning path

Build Python, data, SQL, and statistical foundations before abstractions. Then learn embeddings and retrieval before RAG frameworks; tool calling before agents; evaluation before release.

An AI engineer assembles useful model-powered systems. An ML engineer develops model training and serving pipelines. A data scientist investigates data and experiments. An AI quality engineer designs evidence and controls across those systems. Roles overlap; judge work by its purpose.

## SDET relevance

You already understand contracts, coverage, regression, and release risk. AI extends these skills to systems where valid answers can vary between runs.

## Common mistake

Using exact text equality for every LLM response rejects good paraphrases and misses groundedness failures.
