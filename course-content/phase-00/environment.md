# A reproducible engineering workspace

## An environment is part of the program

Use a project-specific virtual environment. Select its interpreter in VS Code. Keep dependency declarations in the repository and record the Python version in your README. A package imported from your global machine can hide a missing dependency.

A notebook is useful for inspecting data and plots. Move durable logic into importable modules with tests. Git should track source and small synthetic datasets, not virtual environments or secret files.

```
python -m venv .venv
# Linux / macOS
source .venv/bin/activate
python -m pip install pytest
python -m pytest
```

## Static safe mode and local labs

The course executes educational Python and SQL in your browser. It has no provider key and no model API requirement. Optional local labs use a Python process on your machine.

A browser bundle is downloadable by every visitor. An environment variable prefixed for Vite client use is still public after bundling. Keep provider credentials exclusively in local processes or a properly authenticated server.

```
import os
api_key = os.environ.get("OPENAI_API_KEY")
# Never print api_key or commit a populated .env file.
```

## SDET relevance

A reproducible lab turns a notebook experiment into a testable CI artifact that colleagues can run.

## Common mistake

Committing .env or putting a provider key into a VITE_ variable exposes the secret.
