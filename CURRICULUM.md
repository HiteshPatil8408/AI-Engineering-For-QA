# Curriculum

46 phases, in the requested order. Foundation lessons are published; later phases retain their intended syllabus and are marked planned in the application. Full source requirements are preserved in docs/PROJECT_BRIEF.md.

## Phase 00 — Orientation: From Sdet To Ai Quality Engineer

- what AI engineering is
- AI engineer vs ML engineer vs data scientist
- AI Quality Engineer
- AI SDET
- traditional deterministic software vs probabilistic AI
- why AI testing differs
- testing AI vs testing with AI
- course roadmap
- development environment
- Python tooling
- VS Code
- Git/GitHub
- virtual environments
- package management
- notebooks vs production code
- traditional SDET
- using AI for testing
- testing AI
- ML engineering
- AI engineering

## Phase 01 — Python For Ai And Test Automation Engineers

- syntax
- variables
- types
- operators
- strings
- lists
- tuples
- dictionaries
- sets
- conditionals
- loops
- comprehensions
- functions
- arguments
- return values
- scopes
- transform API responses
- filter test results
- collect failed tests
- normalize JSON
- modules
- packages
- imports
- classes
- dataclasses
- typing
- enums
- exceptions
- custom exceptions
- context managers
- iterators
- generators
- decorators
- async/await
- concurrency fundamentals
- pathlib
- JSON
- CSV
- environment variables
- logging
- Pydantic
- type validation
- pytest
- fixtures
- parametrization
- markers
- mocks
- monkeypatching
- API testing
- assertions
- property-based testing introduction
- test architecture
- summary
- slowest tests
- failure frequency
- failure categories

## Phase 02 — Numerical Computing With Numpy

- arrays
- shapes
- dimensions
- dtype
- indexing
- slicing
- vectorization
- broadcasting
- aggregation
- masks
- random sampling
- matrix operations
- dot products
- normalization
- embeddings
- ML
- metrics
- similarity
- neural networks
- login failure
- timeout failure
- database failure

## Phase 03 — Data Analysis With Pandas

- Series
- DataFrame
- loading CSV/JSON
- inspection
- filtering
- selecting
- sorting
- missing values
- duplicates
- transformations
- apply/map
- groupby
- merge/join
- pivot
- datetime handling
- categorical data
- aggregations
- feature engineering
- calculate pass rate
- detect flaky tests
- calculate average execution duration
- identify most frequently failing modules
- identify tests getting slower

## Phase 04 — Sql For Test And Ai Engineering

- SELECT
- WHERE
- ORDER BY
- GROUP BY
- HAVING
- JOIN
- INNER/LEFT/RIGHT concepts
- UNION
- subqueries
- CTEs
- CASE
- window functions
- ROW_NUMBER
- RANK
- LAG
- LEAD
- partitioning
- indexes conceptually
- query-plan basics
- relational modeling
- test_runs
- test_cases
- builds
- failures
- defects
- calculate flaky-test percentage
- latest test result per testcase
- detect tests failing 3 builds in a row
- correlate defects with regression failures

## Phase 05 — Statistics For Quality And Ai Evaluation

- population vs sample
- mean
- median
- variance
- standard deviation
- percentiles
- probability
- conditional probability
- distributions
- normal distribution
- Bernoulli/binomial
- sampling
- confidence intervals
- correlation vs causation
- hypothesis testing
- null/alternative hypotheses
- p-values
- Type I/II errors
- effect size
- A/B testing
- statistical significance vs practical significance
- bootstrap
- outliers
- experiment design
- flaky tests
- latency regressions
- LLM eval scores
- model comparison
- prompt comparison

## Phase 06 — Machine Learning Fundamentals

- supervised learning
- unsupervised learning
- features
- labels
- training
- validation
- test sets
- leakage
- overfitting
- underfitting
- bias
- variance
- cross-validation
- linear regression
- logistic regression
- k-NN
- decision trees
- random forests
- gradient boosting
- clustering
- anomaly detection
- accuracy
- precision
- recall
- F1
- confusion matrix
- ROC-AUC
- MAE
- MSE
- RMSE
- R²
- product defect
- automation defect
- environment issue
- data issue

## Phase 07 — Deep Learning Foundations

- perceptron
- neuron
- weights
- bias
- activation functions
- layers
- forward propagation
- loss functions
- gradient descent
- learning rate
- backpropagation intuition
- epochs
- batches
- regularization
- dropout
- embeddings as learned representations
- feed-forward network
- CNN
- RNN
- LSTM
- weight
- bias
- activation

## Phase 08 — Nlp And Transformer Foundations

- text preprocessing
- tokenization
- vocabulary
- tokens
- token IDs
- embeddings
- positional information
- sequence models
- attention
- query/key/value intuition
- self-attention
- multi-head attention
- encoder
- decoder
- transformer blocks
- context windows
- inference
- pretraining
- instruction tuning
- RL-related alignment at a conceptual level
- why transformers scale
- why context matters
- why hallucinations happen
- why LLM output is probabilistic

## Phase 09 — Large Language Model Fundamentals

- foundation models
- LLM lifecycle
- inference
- temperature
- top-p
- deterministic vs probabilistic behavior
- context windows
- tokens
- system/developer/user instructions
- reasoning models
- model selection
- latency
- throughput
- rate limits
- token usage
- cost
- caching concepts
- hallucination
- stale knowledge
- prompt sensitivity
- non-determinism
- context degradation
- bias
- tool errors

## Phase 10 — Llm Api Engineering

- request
- response
- authentication
- model selection
- error handling
- retries
- exponential backoff
- timeout
- rate limiting
- streaming
- concurrency
- structured outputs
- schema validation
- Pydantic
- token accounting
- logging
- retry
- timeout
- observability
- provider abstraction

## Phase 11 — Prompt Engineering As Software Engineering

- zero-shot
- few-shot
- instruction design
- constraints
- separators
- context
- roles
- examples
- structured outputs
- prompt templates
- prompt versioning
- prompt regression
- prompt injection awareness

## Phase 12 — Structured Outputs And Tool/Function Calling

- schemas
- JSON Schema
- typed outputs
- validation
- retries
- invalid outputs
- tool definitions
- tool selection
- tool arguments
- tool execution
- tool results
- multiple tools
- incorrect tool use

## Phase 13 — Embeddings

- dense vectors
- dimensionality
- semantic similarity
- normalization
- cosine similarity
- dot product
- Euclidean distance
- text embeddings
- query/document embeddings
- embedding model selection
- multilingual embeddings
- embedding drift
- versioning
- batching
- cost
- dimensionality tradeoffs

## Phase 14 — Vector Databases

- vector stores
- metadata
- namespaces/collections
- indexing
- nearest neighbors
- ANN
- HNSW intuition
- IVF intuition
- filtering
- top-k
- recall vs latency
- persistence
- FAISS
- Chroma
- Qdrant
- Weaviate
- Pinecone
- pgvector

## Phase 15 — Retrieval-Augmented Generation

- ingestion
- loaders
- cleaning
- chunking
- chunk overlap
- semantic chunking
- metadata
- embeddings
- retrieval
- top-k
- filtering
- reranking
- context construction
- citations
- grounding
- synthetic automation docs
- testing conventions
- API patterns
- CI troubleshooting guides

## Phase 16 — Advanced Rag

- sparse retrieval
- BM25
- dense retrieval
- hybrid retrieval
- reciprocal rank fusion
- reranking
- query rewriting
- query expansion
- multi-query retrieval
- HyDE concept
- parent-child retrieval
- contextual compression
- metadata filtering
- multi-hop retrieval
- agentic RAG
- multimodal RAG overview
- Graph RAG concepts
- freshness
- incremental indexing
- document deletion
- permissions
- tenant isolation
- ingestion
- chunking
- embedding
- retrieval
- ranking
- context
- model generation

## Phase 17 — Rag Evaluation

- Precision@K
- Recall@K
- Hit Rate
- MRR
- NDCG
- correctness
- answer relevance
- faithfulness
- groundedness
- completeness
- context precision
- context recall
- context relevance
- golden datasets
- human evaluation
- LLM-as-a-judge
- deterministic evaluation
- evaluator calibration
- evaluator bias
- pairwise comparison
- regression evaluation
- Ragas
- DeepEval
- provider-native eval systems where appropriate

## Phase 18 — Ai Agents

- tool use
- planning
- state
- memory
- workflows
- iteration
- termination
- error recovery
- deterministic vs agentic architecture

## Phase 19 — Agent Frameworks

- LangGraph
- LangChain where useful
- LlamaIndex where useful
- provider agent SDK concepts
- nodes
- edges
- state
- conditional transitions
- retries
- checkpoints
- human approval
- parallel tasks
- deterministic workflows
- subagents

## Phase 20 — Mcp: Model Context Protocol

- why MCP exists
- client
- server
- tools
- resources
- prompts where applicable
- transport concepts
- permissions
- authentication considerations
- security considerations
- coding agents
- assistants
- internal AI systems

## Phase 21 — Multi-Agent Systems

- supervisor pattern
- specialist agents
- delegation
- routing
- shared state
- agent handoffs
- coordination
- failure propagation
- excessive-agent anti-pattern

## Phase 22 — Ai Chatbot Engineering

- conversation state
- session handling
- message history
- context management
- retrieval
- citations
- fallback handling
- structured responses
- refusal
- user intent
- multi-turn ambiguity
- latency
- streaming

## Phase 23 — Llm / Chatbot Evaluation

- schema validation
- tool-call arguments
- required fields
- forbidden content
- citation presence
- JSON validity
- latency
- token budget
- correctness
- relevance
- completeness
- groundedness
- tone constraints
- context retention
- contradiction
- topic adherence
- instruction retention
- memory
- task completion
- prompt injection
- leakage
- unsafe tool usage
- unauthorized actions

## Phase 24 — Agent Evaluation

- retriever
- planner
- model
- tool
- parser
- tool-call accuracy
- tool arguments
- goal completion
- unnecessary tool calls
- loop detection
- step count
- trajectory quality
- cost
- latency
- pytest-style LLM tests
- RAG evaluation
- agent evaluation
- conversational evaluation
- tool-use evaluation
- RAG quality metrics
- tool/agent metrics where appropriate
- evaluation datasets
- traces
- experiments
- offline evaluation
- online evaluation
- regressions
- experiments
- tracing
- scorers
- evaluation
- model/prompt comparison

## Phase 25 — Build An Ai Evaluation Framework

- YAML/JSON test definitions
- reusable evaluators
- threshold configuration
- baseline comparison
- model comparison
- prompt version comparison
- trace capture
- HTML report
- pass/fail gates
- failure categorization

## Phase 26 — Ai Safety And Security Testing

- prompt injection
- indirect prompt injection
- data leakage
- insecure output handling
- excessive agency
- insecure tool usage
- sensitive information disclosure
- model denial-of-service concepts
- retrieval poisoning
- malicious documents
- privilege escalation
- cross-tenant retrieval
- unsafe plugin/tool invocation
- what happened?
- why?
- how should the system defend against it?
- how would you automate the regression test?

## Phase 27 — Ai Guardrails

- input validation
- output validation
- moderation
- policy checks
- structured-output enforcement
- tool permissioning
- human confirmation
- allowlists
- deny lists
- sandboxing
- least privilege
- rate limits
- anomaly detection

## Phase 28 — Ai-Assisted Test Automation

- completeness
- duplicates
- traceability
- schema
- query
- mutation
- positive cases
- required-field tests
- nullability tests
- invalid enum
- auth
- authorization
- boundary
- malformed request
- business validation
- stack trace
- screenshot metadata
- logs
- test history
- application defect
- automation defect
- environment
- data
- unknown
- code changes
- dependency graphs
- historical failure data
- risk scoring

## Phase 29 — Testing Ai-Generated Code

- never trust generated code automatically
- compile/type checks
- unit tests
- integration tests
- static analysis
- security scanning
- mutation testing concepts
- code review
- hallucinated libraries/APIs
- dependency risk

## Phase 30 — Fastapi For Ai Services

- application structure
- routes
- request models
- response models
- Pydantic
- validation
- dependency injection
- errors
- async
- middleware
- authentication concepts
- testing
- OpenAPI
- health endpoints

## Phase 31 — Production Ai Architecture

- caching
- queues
- retry
- circuit breaker concepts
- idempotency
- concurrency
- rate limiting
- fallback
- model failover
- graceful degradation

## Phase 32 — Docker

- image
- container
- Dockerfile
- layers
- dependency caching
- environment variables
- ports
- health checks
- volumes
- multi-stage builds conceptually
- Docker Compose

## Phase 33 — Ci/Cd And Github Actions

## Phase 34 — Ai Observability

- traces
- spans
- prompts
- responses
- model
- tool calls
- retrieval
- latency
- tokens
- cost
- errors
- user feedback
- OpenTelemetry concepts
- LangSmith
- MLflow
- Phoenix where appropriate

## Phase 35 — Cost Engineering

- caching
- smaller models
- routing
- batch work
- reduce context
- better retrieval
- fewer agent steps
- structured prompts

## Phase 36 — Ai Performance Testing

- TTFT
- end-to-end latency
- tokens/sec
- p50
- p95
- p99
- throughput
- concurrency
- rate-limit behavior
- streaming
- cold starts

## Phase 37 — Reliability Engineering For Ai

- provider outage
- rate limit
- timeout
- malformed response
- hallucination
- vector-store outage
- stale index
- broken tool
- infinite agent loop
- context overflow

## Phase 38 — Mlops / Llmops Foundations

- datasets
- experiments
- model versions
- prompt versions
- reproducibility
- artifact tracking
- evaluation runs
- tracing
- deployment
- monitoring
- rollback

## Phase 39 — Fine-Tuning Foundations

- when RAG is appropriate
- when prompting is appropriate
- when fine-tuning is appropriate
- supervised fine-tuning
- LoRA
- PEFT concepts
- training examples
- overfitting
- evaluation

## Phase 40 — Ai System Design

- support chatbot
- test failure triage system
- test-generation platform
- enterprise RAG
- defect-analysis agent
- AI QA assistant

## Phase 41 — Capstone Project 1

- CI results
- logs
- stack traces
- historical failures
- embeddings
- similar-failure search
- classification
- RAG
- LLM explanation
- root-cause suggestion
- probable owner
- report generation
- classification accuracy
- retrieval quality
- explanation correctness
- latency
- cost

## Phase 42 — Capstone Project 2

- inspect query/mutation
- identify parameters
- generate tests
- positive
- negative
- boundary
- authorization
- data validation
- schema validation

## Phase 43 — Capstone Project 3

- Docker
- pytest
- Ragas/DeepEval-style evaluation
- tracing
- GitHub Actions

## Phase 44 — Capstone Project 4

- inspect failing test
- read logs
- search history
- propose explanation
- suggest fix
- suggest locator replacement
- generate candidate test
- prepare draft defect summary
- modifying code
- filing defects
- changing tests

## Phase 45 — Final Master Project

- typed APIs
- structured output
- unit tests
- integration tests
- RAG tests
- agent tests
- security tests
- performance tests
- evaluation dataset
- Docker
- CI
- documentation
- architecture diagram
