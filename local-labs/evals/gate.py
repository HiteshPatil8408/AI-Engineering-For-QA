"""Hard contract gates remain independent of average quality."""

def gate(report):
    failures=[]
    if report["critical_security_failures"]>0: failures.append("critical security violation")
    if report["faithfulness_delta"] < -0.05: failures.append("faithfulness regression exceeds 5 percentage points")
    if report["p95_latency_ms"] > report["p95_budget_ms"]: failures.append("latency budget exceeded")
    if report["cost_per_task"] > report["cost_budget"]: failures.append("cost budget exceeded")
    return {"passed":not failures,"failures":failures}

if __name__ == "__main__":
    import json
    print(json.dumps(gate({"critical_security_failures":0,"faithfulness_delta":0.02,"p95_latency_ms":800,"p95_budget_ms":1000,"cost_per_task":0.01,"cost_budget":0.02}),indent=2))
