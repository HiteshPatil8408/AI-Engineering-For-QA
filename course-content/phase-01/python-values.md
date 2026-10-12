# Values, collections, and API contracts

## Python values are objects

Names bind to objects; they are not storage boxes with fixed types. Integers, floats, strings, booleans, and None represent distinct meanings. The string "false" is truthy because it is non-empty. Never convert an API flag with bool(raw) when raw might be a string.

Lists preserve order and allow mutation; tuples represent fixed ordered records; dictionaries map keys to values; sets store unique hashable values. Choose a set for duplicate test IDs and a list for ordered execution results.

```
result = {"name": "login", "status": "failed", "duration": 4.5}
failed_ids = {"login", "checkout", "login"}
print(len(failed_ids))  # 2
print(result.get("retries", 0))  # 0
```

## Aliasing and boundary validation

Assigning a list to another name does not copy it. Mutating through either name changes the same object. A shallow copy only copies the outer collection; nested dictionaries still share identity.

Use direct indexing for a required field when absence is an error. Use .get for optional values only when a default has a defined meaning. Validate status values before computing pass rate; silently treating unknown status as pass corrupts metrics.

```
original = [{"status": "failed"}]
copy = original.copy()
copy[0]["status"] = "passed"
print(original[0]["status"])  # passed
```

## SDET relevance

Test reports and API responses arrive as nested data. The first quality boundary is explicit, predictable normalization.

## Common mistake

A shallow list copy still shares nested dictionaries.
