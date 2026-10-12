# Functions, arguments, and maintainable modules

## Design an explicit interface

Positional arguments fit obvious small inputs. Keyword-only arguments make policy visible at the call site: summarize(runs, slow_threshold=3.0). The * marker in a function signature makes following parameters keyword-only.

Local scope belongs to each function call. Read-only access to a global configuration can look convenient, but passing configuration makes tests independent and deterministic.

```
def slow_tests(runs, *, threshold=3.0):
    return [r["name"] for r in runs if r["duration"] > threshold]

print(slow_tests([{ "name": "checkout", "duration": 4.2}], threshold=4.0))
```

## Modules should be safe to import

A module executes its top-level statements when imported. Guard CLI entry points with if **name** == "**main**" so imports do not read files or start network requests. Packages group related modules; keep core logic separate from transport and presentation.

Decorators wrap functions, so preserve metadata with functools.wraps. Generators yield values lazily and avoid holding every record in memory, but they are consumed once. Materialize a list if downstream operations need multiple passes.

```
def failures(records):
    for record in records:
        if record["status"] == "failed":
            yield record

if __name__ == "__main__":
    print(list(failures([])))
```

## SDET relevance

Reusable test utilities need stable public interfaces and predictable imports.

## Common mistake

Iterating over an exhausted generator again produces no values.
