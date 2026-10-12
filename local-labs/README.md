# Connected AI-quality local labs

Run from the repository root with Python 3.10+ (3.12 recommended). These labs use synthetic data. Fixture mode does not read a provider credential.

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r local-labs/requirements.txt
python local-labs/quality/data.py
python -m pytest local-labs/tests local-labs/fastapi local-labs/python -q
python local-labs/ml/train.py
python local-labs/evals/runner.py --output artifacts/evaluation
python local-labs/mcp/client.py
python local-labs/frameworks/langgraph_lab.py
python local-labs/rag/qdrant_lab.py
uvicorn app:app --app-dir local-labs/fastapi --port 8000
```

Inspect `artifacts/evaluation/results.json` and `report.html`. The runner exits nonzero when a required case fails. Compare a compatible baseline with `--baseline artifacts/baseline/results.json`; differing datasets or case IDs are rejected.

The service provides `/health`, `/ready`, `/classify-failure`, `/search-failures`, `/chat`, `/chat/stream`, `/generate-tests` and `/evaluate`. Fixture principals are `Bearer fixture-alpha` and `Bearer fixture-beta`; absent authorization selects the alpha fixture identity. Set `LAB_API_TOKEN` to require authentication. This is an educational authentication boundary, not a production identity provider.

`/chat` is an explicitly labeled extractive baseline. `/generate-tests` parses a real GraphQL operation and returns schema-rule candidate cases; the acceptance suite actually executes them against a synthetic resolver. Fixture agent writes are denied unless an exact, unexpired approval matches; an approved effect is still simulated and never modifies your repository.

## Actual CPU neural-network lab

```bash
python -m pip install torch==2.10.0 --index-url https://download.pytorch.org/whl/cpu
python local-labs/deep-learning/mechanisms.py
python local-labs/deep-learning/train.py --epochs 30
```

The scikit-learn and PyTorch classifiers fit training data and evaluate an incident-group holdout. Synthetic repeated patterns make the task easy; measured accuracy does not estimate production performance. Only load the model pickle created by your trusted local run.

## Optional real integrations

Install `local-labs/requirements-optional.txt` in a separate environment when experimenting with these larger dependencies. Model downloads, live calls and evaluator calls can consume time, storage or paid usage.

- `rag/dense.py`: actual sentence-transformer embeddings and hybrid ranking; downloads the configured encoder.
- `frameworks/langchain_lab.py`: real current `create_agent` with an allowlisted synthetic read tool and deterministic fixture model. Use `--live` with local `OPENAI_API_KEY` and `OPENAI_MODEL` for provider execution.
- `frameworks/llamaindex_lab.py`: actual LlamaIndex vector retrieval using a HuggingFace encoder.
- `frameworks/semantic_evaluators.py`: actual Ragas/DeepEval adapters. Calibrate against human labels before using semantic scores as release evidence.
- `frameworks/tracing.py`: actual OpenTelemetry parent/child spans, safe attributes and console export.
- `frameworks/mlflow_lab.py`: local SQLite-backed MLflow run, parameters, metrics and artifacts. The full optional MLflow package includes database dependencies; installations using `mlflow-skinny` additionally need `alembic` and `sqlalchemy`.
- `deep-learning/lora.py`: actual PEFT adapter initialization and forward check; explicitly does not claim that initialization is fine-tuning.
- `deep-learning/finetune.py --model prajjwal1/bert-tiny --epochs 3`: actual pretrained-model LoRA fitting, adapter saving and grouped holdout evaluation. The recorded three-epoch synthetic experiment achieved 40% accuracy and is unsuitable for promotion against the stronger baseline. See `artifacts/finetune/report.json`.

The service's live classification path requires `LAB_API_TOKEN`, `OPENAI_API_KEY` and `OPENAI_MODEL` on the server. It uses typed Responses parsing, evidence validation, bounded SDK retries and a total async deadline. Refusal/incomplete/invalid output becomes a controlled unavailable response. No key is accepted by the browser or exported progress.

## Containers and performance

```bash
docker compose up --build
# Optional remote vector-store service:
docker compose --profile vector-store up --build
python local-labs/performance/load.py --count 50 --concurrency 5
```

The API image uses a non-root user and excludes credentials from its build context. The optional Qdrant volume retains its store. The load runner reports local extractive-service latency and throughput; it explicitly does not claim live-provider TTFT or an open-loop arrival benchmark.
