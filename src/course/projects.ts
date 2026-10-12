export const projects = [
  {
    id: "analyzer",
    phase: 41,
    title: "AI test-failure triage system",
    description:
      "Turn synthetic CI results into an explainable triage report. Start with deterministic baselines before introducing a classifier or LLM.",
    deliverables: [
      "Validated ingestion and failure categories",
      "Reproducible classifier baseline",
      "Per-category precision and recall",
      "Human review for uncertain classifications",
      "CI gate and operational runbook",
    ],
    failure: "A rare product defect is mislabeled as an environment issue.",
    architecture: [
      "CI history",
      "Validation",
      "Baseline / classifier",
      "Evidence + confidence",
      "Human review",
    ],
    followups: [
      "How do you prevent future-label leakage?",
      "How do you handle class imbalance?",
      "What evidence justifies automated routing?",
    ],
  },
  {
    id: "rag",
    phase: 43,
    title: "Documentation RAG assistant",
    description:
      "Answer engineering questions over fictional support documentation, with citations, permission checks, and retrieval diagnostics.",
    deliverables: [
      "Versioned ingestion and chunking",
      "Lexical baseline and vector comparison",
      "Retrieval labels and answer rubrics",
      "Unanswerable and malicious-document cases",
      "Trace viewer and rollback plan",
    ],
    failure:
      "The relevant page is retrieved but excluded during context truncation.",
    architecture: [
      "Documents",
      "Chunk + index",
      "Authorized retrieval",
      "Context builder",
      "Grounded response",
    ],
    followups: [
      "Why RAG rather than fine-tuning?",
      "How do you evaluate retrieval independently?",
      "What happens if the vector store is down?",
    ],
  },
  {
    id: "agent",
    phase: 44,
    title: "Bounded QA agent",
    description:
      "Build a tool-using assistant that inspects synthetic CI evidence and proposes actions within a deterministic policy.",
    deliverables: [
      "Typed tool schemas and allowlist",
      "Step, deadline, and cost budgets",
      "Approval for write operations",
      "Trajectory assertions and fault injection",
      "Idempotent recovery and cancellation",
    ],
    failure: "A tool timeout triggers repeated writes with no idempotency key.",
    architecture: [
      "Task",
      "Policy",
      "Model proposal",
      "Validated tool",
      "Trace + stop",
    ],
    followups: [
      "How do you prevent loops?",
      "What counts as a valid alternative trajectory?",
      "Where is permission enforced?",
    ],
  },
  {
    id: "evals",
    phase: 42,
    title: "GraphQL test generation and validation",
    description: "Parse a synthetic schema and operation, generate traceable candidate cases, and execute independent positive, negative, boundary and authorization checks.",
    deliverables: ["Schema and AST validation", "Required, nullability and enum cases", "Business boundary and authorization cases", "Executable pytest export with assertions", "Coverage, duplicate and mutation evidence"],
    failure: "A generated test accepts HTTP 200 while the GraphQL response contains errors.",
    architecture: ["Schema + operation", "Candidate cases", "Independent validation", "Fixture execution", "Coverage report"],
    followups: ["How do you reject unsupported operations?", "Which mutation proves the test detects its requirement?", "How do you separate schema and business validation?"],
  },
  {
    id: "platform",
    phase: 45,
    title: "AI quality engineering workspace",
    description:
      "Combine generation, triage, retrieval, evaluation, and observability into a production-oriented capstone with a defensible release process.",
    deliverables: [
      "API, UI, and access-control boundaries",
      "AI-assisted test design with deterministic validation",
      "RAG and agent component evaluation",
      "Containerized service and CI release gate",
      "Observability, load plan, cost model, and runbook",
    ],
    failure:
      "A provider outage causes retry amplification and unbounded queue growth.",
    architecture: [
      "Engineer UI",
      "API + auth",
      "RAG / agent",
      "Tools + models",
      "Traces + eval gate",
    ],
    followups: [
      "What is your p95 latency and sampling method?",
      "What does one successful task cost?",
      "How do you roll back model and index changes together?",
    ],
  },
];
