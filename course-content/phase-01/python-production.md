# Types, validation, and error boundaries

## Type hints describe, validation enforces

A type hint helps tooling find incompatible calls; Python does not automatically reject a wrong runtime value. A dataclass reduces boilerplate for domain objects but also does not validate fields automatically.

Validate external JSON with explicit checks or a schema library such as Pydantic in local labs. Separate transport errors, parsing errors, and domain validation errors so a retry policy can distinguish temporary failures from bad requests.

```
from dataclasses import dataclass

@dataclass(frozen=True)
class TestResult:
    name: str
    status: str
    duration: float

def validate(result):
    if result.status not in {"passed", "failed", "skipped"}:
        raise ValueError("unknown status")
    if result.duration < 0:
        raise ValueError("negative duration")
    return result
```

## Reliable I/O and concurrency

Use pathlib for portable paths and context managers to guarantee file cleanup. Log event metadata without credentials or private payloads. JSON parsing is not schema validation.

async/await helps overlap I/O, not accelerate CPU work. Use bounded concurrency to avoid flooding a service. Propagate cancellation and set timeouts; broad except Exception plus an empty return makes service failures look like successful zero-result runs.

```
import json
from pathlib import Path

with Path("test-results.json").open(encoding="utf-8") as stream:
    records = json.load(stream)
```

## SDET relevance

Invalid API data should fail at the boundary instead of creating misleading CI analytics.

## Common mistake

Catching every exception and returning [] hides outages as valid empty datasets.
