# Filter, transform, and summarize test runs

## From API response to useful evidence

An if statement branches by a condition. A for loop iterates over objects directly. A comprehension expresses a simple filter and transformation together; keep complex business decisions in a named function.

A function should have an explicit contract: inputs, output shape, and exceptional cases. Parameters are local names. return sends a value to the caller; print only writes a display message.

```
runs = [{"name": "login", "status": "failed"},
        {"name": "search", "status": "passed"}]
failed = [r["name"] for r in runs if r["status"] == "failed"]
print(failed)
```

## Empty input and scope

A pass rate for no test executions is undefined; return None or raise a domain error rather than claiming 100%. Use type hints to communicate that possibility.

Avoid hidden globals and mutable default arguments. A default list is created once when the function is defined, so repeated calls can unintentionally share state. Use None and create a new list inside the function.

```
def pass_rate(runs):
    if not runs:
        return None
    return sum(r["status"] == "passed" for r in runs) / len(runs)
```

## SDET relevance

A small pure analyzer is easier to unit test than a script that reads files, mutates globals, and prints everything.

## Common mistake

A function that prints a result but never returns it gives the caller None.
