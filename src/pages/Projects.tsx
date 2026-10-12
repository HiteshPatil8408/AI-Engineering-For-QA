import { Link } from "react-router-dom";
import { Check, ArrowRight, FolderKanban } from "lucide-react";
import { projects } from "../course/projects";
import { useProgress } from "../state/ProgressContext";
import { PageHeading } from "../components/Layout";
export default function Projects() {
  const { progress, setProgress } = useProgress();
  return (
    <div className="page">
      <PageHeading
        eyebrow="LET YOUR WORK SPEAK FOR YOU"
        title="Build a portfolio with evidence."
        description="Five connected capstones with guided acceptance lessons and runnable local lab entry points."
      />
      <div className="roadmap-banner">
        <p>
          Run the companion acceptance suite, inspect its JSON/HTML report, and
          record the dataset, run ID, results, and one failure you diagnosed.
          Evidence entries are learner-reported; this application does not authenticate external artifacts.
        </p>
      </div>
      {projects.map((p, i) => (
        <article className="panel project-card" key={p.id}>
          <div className="question-meta">
            <span className="path-icon sage">
              <FolderKanban size={21} />
            </span>
            <span className="section-label">
              PROJECT {String(i + 1).padStart(2, "0")} · PHASE {p.phase}
            </span>
            <span className="badge">
              {progress.projects.includes(p.id)
                ? "Completed"
                : "Portfolio brief"}
            </span>
          </div>
          <h2>{p.title}</h2>
          <p>{p.description}</p>
          <div className="architecture" aria-label="Project architecture">
            {p.architecture.map((s, j) => (
              <div className="architecture-node" key={s}>
                <span>{s}</span>
                {j < p.architecture.length - 1 && <ArrowRight size={17} />}
              </div>
            ))}
          </div>
          <div className="project-columns">
            <div>
              <h3>Evidence to deliver</h3>
              <ul className="deliverables">
                {p.deliverables.map((d) => (
                  <li key={d}>
                    <Check size={15} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Break it deliberately</h3>
              <p>{p.failure}</p>
              <h3>Defend your decisions</h3>
              <ul>
                {p.followups.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
          <details className="project-story">
            <summary>Prepare your project story</summary>
            <p>
              Structure your explanation: Problem → Architecture → Important
              decisions → Tradeoffs → Evaluation → Failure discovered →
              Improvement → Production concerns.
            </p>
            <Link to="/interviews">
              Practice difficult follow-up questions →
            </Link>
          </details>
          <Link className="secondary" to={"/phase/"+p.phase}>Guided capstone lessons and checkpoint</Link>
          <label>Acceptance evidence<textarea aria-label={p.title+" acceptance evidence"} value={progress.projectEvidence?.[p.id] ?? ""} onChange={e=>setProgress(s=>({...s,projectEvidence:{...s.projectEvidence,[p.id]:e.target.value}}))} placeholder="Dataset/version, run ID, passed checks, detected failure, fix and report location" /></label>
          <button
            disabled={!progress.projects.includes(p.id) && (progress.projectEvidence?.[p.id]?.trim().length ?? 0)<120}
            className={
              progress.projects.includes(p.id) ? "secondary" : "primary"
            }
            onClick={() =>
              setProgress((s) => ({
                ...s,
                projects: s.projects.includes(p.id)
                  ? s.projects.filter((id) => id !== p.id)
                  : [...s.projects, p.id],
              }))
            }
          >
            <Check size={16} />
            {progress.projects.includes(p.id)
              ? "Completed · undo"
              : "Mark evidence delivered"}
          </button>
        </article>
      ))}
    </div>
  );
}
