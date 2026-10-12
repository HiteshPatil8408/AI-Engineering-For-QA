"""Deterministic authorization around model-proposed actions."""
ALLOWED = {"read_logs", "classify", "request_review"}

def validate_trajectory(steps, project="demo", max_steps=5):
    if not isinstance(steps,list) or len(steps)>max_steps:
        raise ValueError("Step budget exceeded or invalid trajectory")
    for step in steps:
        if step.get("tool") not in ALLOWED: raise PermissionError("Tool is not authorized")
        if "project" in step and step["project"] != project: raise PermissionError("Project access denied")
        if step["tool"] == "read_logs" and (not isinstance(step.get("build"),int) or isinstance(step.get("build"),bool) or step["build"]<1): raise ValueError("Invalid build")
    return True

if __name__ == "__main__":
    import json
    from pathlib import Path
    cases=json.loads((Path(__file__).resolve().parents[2]/"datasets/agent-trajectories.json").read_text())
    for case in cases:
        try: validate_trajectory(case["steps"]);print(case["id"],"allowed")
        except (PermissionError,ValueError) as error: print(case["id"],"blocked:",error)
