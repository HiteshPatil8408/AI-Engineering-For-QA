import { Link } from "react-router-dom";
import { ArrowRight, Code2, Database, ShieldCheck } from "lucide-react";
import { lessons } from "../course";
import { useProgress } from "../state/ProgressContext";
import { PageHeading } from "../components/Layout";
export default function Labs() {
  const { progress } = useProgress();
  return (
    <div className="page">
      <PageHeading
        eyebrow="LESS READING. MORE ENGINEERING."
        title="Your browser is your lab."
        description="Write real Python. Query a real SQL engine. Debug the result. No provider account required."
      />
      <div className="lab-mode-banner">
        <ShieldCheck size={24} />
        <div>
          <h3>Static safe mode</h3>
          <p>
            Code runs locally in disposable workers. Python downloads a free
            runtime on first use; SQL uses bundled DuckDB-WASM.
          </p>
        </div>
        <span className="badge green">DEFAULT MODE</span>
      </div>
      <section className="panel"><h2>Architecture and final assessment</h2><Link className="secondary" to="/diagrams">Editable architecture and sequence diagrams</Link><Link className="secondary" to="/assessment">Final applied assessment</Link></section>
      <div className="lab-grid">
        {lessons
          .filter((l) => ["python", "sql"].includes(l.exercise.kind))
          .map((l) => (
            <Link className="panel lab-card" to={"/lesson/" + l.id} key={l.id}>
              <span
                className={
                  "path-icon " +
                  (l.exercise.kind === "python" ? "sage" : "blue")
                }
              >
                {l.exercise.kind === "python" ? (
                  <Code2 size={23} />
                ) : (
                  <Database size={23} />
                )}
              </span>
              <span className="section-label">
                {l.exercise.kind.toUpperCase()} LAB · PHASE {l.phase}
              </span>
              <h3>{l.title}</h3>
              <p>{l.exercise.prompt}</p>
              <div className="path-card-bottom">
                <span>
                  {progress.lessons[l.id]?.exercise === "passed"
                    ? "Passed ✓"
                    : "Open exercise"}
                </span>
                <ArrowRight size={18} />
              </div>
            </Link>
          ))}
      </div>
      <section className="local-lab-info">
        <div className="eyebrow">LOCAL ENGINEERING MODE</div>
        <h2>Ready to go beyond the browser?</h2>
        <p>
          The companion local-labs directory includes a test-result analyzer,
          retrieval baseline, agent policy checks, deterministic evaluation
          gate, and a FastAPI service. Run these on your machine; keep any
          provider keys in environment variables.
        </p>
        <pre>
          <code>
            python -m venv .venv{"\n"}source .venv/bin/activate{"\n"}python
            local-labs/python/analyzer.py datasets/failures.json
          </code>
        </pre>
        <Link to="/projects" className="secondary">
          Explore portfolio projects <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
