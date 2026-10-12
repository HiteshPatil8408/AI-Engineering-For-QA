# Test the analyzer, including what can break

## Useful tests specify behavior

pytest discovers test_ functions and reports assertion differences. Parametrization describes a set of cases without duplicated code. A fixture owns setup and cleanup; avoid session-scoped mutable objects that leak state between tests.

Test empty input, one record, mixed outcomes, duplicate test names, invalid duration, and ties in slowest tests. A passing line-coverage target does not prove these behaviors.

```
import pytest

@pytest.mark.parametrize("runs, expected", [
    ([], []),
    ([{"name": "login", "status": "failed"}], ["login"]),
    ([{"name": "search", "status": "passed"}], []),
])
def test_failed_names(runs, expected):
    assert failed_names(runs) == expected
```

## Mocks and properties

Mock the HTTP client, not the internal implementation you want to test. monkeypatch can replace environment values or functions for one test. Test real schema validation against malformed synthetic API responses.

A property is an invariant over many inputs: the failure count is between zero and total count; reordering results should not change a rate. Property-based tests generate cases to challenge those invariants, complementing carefully chosen examples.

## SDET relevance

Your existing SDET skills apply directly: test small functions deterministically and integration points separately.

## Common mistake

A mock that returns the same answer the implementation expects can pass while the real integration is broken.
