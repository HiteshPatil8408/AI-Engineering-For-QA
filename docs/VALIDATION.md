# Local validation, 2026-10-12

Passing checks:

- `npm run lint`
- `npm test`: 21 tests in three files
- `npm run build`: TypeScript and Vite production build; large lazy dependency chunks remain
- `npm run content:check`: 46 phases, 193 lessons, 719 questions, zero structural errors
- `.venv/bin/python scripts/verify-solutions.py`: 99/99 native Python reference solutions
- `.venv/bin/python -m pytest local-labs/tests local-labs/fastapi/test_app.py -q`: 27 tests
- Desktop/mobile Playwright: 26 tests, using installed Chromium headless shell 1243
- `python local-labs/evals/runner.py`: all 13 deterministic release cases
- Real MCP client/server integration: initialize, discovery, successful scoped call, traversal denial; negotiated version 2025-11-25
- Real embedding retrieval with Sentence Transformers and LlamaIndex
- Real LangChain fixture-model agent, LangGraph, local Qdrant, SQLite MLflow and OpenTelemetry
- Real sklearn/PyTorch training and pretrained LoRA fitting; see reports for synthetic-data limitations and the poor LoRA result
- Local API load: 50 requests at concurrency 5, zero errors; `artifacts/performance/report.json`
- `python -m pip check`: no broken requirements

Strict completion validation does not pass: fourteen phases are below the six-lesson target, and 29 identical interview answers need editorial refinement. The generated report keeps this visible. Every new Python exercise has been checked natively; only the original coding collection was exhaustively executed in the browser. Applied final-assessment success/failure paths still need fuller browser coverage.

Network/model downloads and HTTP browser/load execution used approved commands outside the restricted sandbox where necessary. The first sandbox load attempt returned 50 errors; the verified external-sandbox run returned zero. Load failures now produce nonzero exit and remain in the report denominator.

Docker execution, paid provider/judge evaluation, GitHub workflow execution and deployment were not performed. The project therefore remains an active completion implementation, not a fully verified final release.
