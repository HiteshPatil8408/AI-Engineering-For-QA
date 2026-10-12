# Cosine similarity from first principles

## A vector is a representation

A vector is an ordered list of numeric coordinates. An embedding model learns representations whose geometry can capture useful relationships. The synthetic vectors in this lab are hand-designed for arithmetic practice; they are not real semantic embeddings.

The dot product sums pairwise coordinate products. A norm measures length. Cosine similarity divides the dot product by both lengths, so it compares direction. Cosine 1 means the same direction; 0 is orthogonal; -1 is opposite.

```
import numpy as np
a = np.array([1., 2., 0.])
b = np.array([2., 4., 0.])
print(np.dot(a, b))  # 10
print(np.linalg.norm(a))  # sqrt(5)
```

## Normalization and distance

A unit vector is v / norm(v). For unit vectors the dot product equals cosine similarity. Squared Euclidean distance between unit vectors is 2 - 2*cosine, so they induce the same ranking. Unnormalized dot product also rewards magnitude.

A zero vector has no direction, so cosine is undefined. Reject it or apply a documented fallback. Do not divide by zero and hope NaN sorting will produce sensible retrieval results.

## SDET relevance

Semantically similar failures may have different text. Vector similarity is a useful candidate signal, but it is not proof of the same root cause.

## Common mistake

Vectors from different models or dimensions are not comparable, even if their text looks related.
