import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, ChevronDown, Clock3 } from "lucide-react";
import { lessons, phases } from "../course";
import { PageHeading, PhaseIcon } from "../components/Layout";
import { useProgress } from "../state/ProgressContext";
import { mastery, masteryLabel } from "../state/progress";
export default function Roadmap() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<number[]>([0, 1]);
  const { progress } = useProgress();
  return (
    <div className="page">
      <PageHeading
        eyebrow="THE FULL ENGINEERING JOURNEY"
        title="One path. A stronger skillset."
        description="46 phases, built in sequence. Understand the foundations before you reach for a framework."
      />
      <div className="roadmap-banner">
        <span className="badge green">LEARNING WORKSPACE</span>
        <p>
          {lessons.length} lessons and applied checkpoints across all 46 phases.
          Reading, practice, and assessments contribute separately to mastery.
        </p>
      </div>
      <div className="filter-tabs" aria-label="Phase filter">
        {[
          ["all", "All phases"],
          ["started", "In progress"],
          ["mastered", "Strong mastery"],
        ].map(([v, label]) => (
          <button
            className={filter === v ? "active" : ""}
            key={v}
            onClick={() => setFilter(v)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="roadmap-list">
        {phases
          .filter(
            (p) =>
              filter === "all" ||
              (filter === "started" ? lessons.some(l=>l.phase===p.id && progress.lessons[l.id]?.started) : lessons.filter(l=>l.phase===p.id).every(l=>mastery(progress.lessons[l.id])>=85)),
          )
          .map((phase) => {
            const items = lessons.filter((l) => l.phase === phase.id);
            const score = items.length
              ? Math.round(
                  items.reduce(
                    (s, l) => s + mastery(progress.lessons[l.id]),
                    0,
                  ) / items.length,
                )
              : 0;
            return (
              <section
                className="phase-card"
                id={"phase-" + phase.id}
                key={phase.id}
              >
                <button
                  className="phase-card-header"
                  aria-expanded={open.includes(phase.id)}
                  onClick={() =>
                    setOpen((o) =>
                      o.includes(phase.id)
                        ? o.filter((n) => n !== phase.id)
                        : [...o, phase.id],
                    )
                  }
                >
                  <span
                    className={
                      "phase-icon " + (phase.id < 6 ? "sage" : "neutral")
                    }
                  >
                    <PhaseIcon phase={phase.id} />
                  </span>
                  <span className="phase-header-text">
                    <span className="section-label">
                      PHASE {String(phase.id).padStart(2, "0")}
                    </span>
                    <strong>{phase.title}</strong>
                    <small>
                      {items.length
                        ? `${items.length} lessons · ${masteryLabel(score)}`
                        : phase.description}
                    </small>
                  </span>
                  <span className={"badge " + (items.length ? "green" : "")}>
                    {items.length ? `${score}% mastery` : "Planned"}
                  </span>
                  <ChevronDown size={17} />
                </button>
                {open.includes(phase.id) && (
                  <div className="phase-detail"><p>{phase.description}</p><Link className="secondary" to={"/phase/"+phase.id}>Phase overview, prerequisites and checkpoint</Link>
                    {items.length ? (
                      <>
                        {[...new Set(items.map((l) => l.module))].map(
                          (module) => (
                            <div key={module}>
                              <h4>{module}</h4>
                              {items
                                .filter((l) => l.module === module)
                                .map((l) => (
                                  <Link
                                    to={"/lesson/" + l.id}
                                    className="roadmap-lesson"
                                    key={l.id}
                                  >
                                    <span
                                      className={
                                        "lesson-status " +
                                        (progress.lessons[l.id]?.complete
                                          ? "done"
                                          : "")
                                      }
                                    >
                                      {progress.lessons[l.id]?.complete ? (
                                        <Check size={15} />
                                      ) : (
                                        <span />
                                      )}
                                    </span>
                                    <span>{l.title}</span>
                                    <small>
                                      <Clock3 size={13} />
                                      {l.minutes} min
                                    </small>
                                    <ArrowUpRight size={15} />
                                  </Link>
                                ))}
                            </div>
                          ),
                        )}
                      </>
                    ) : (
                      <>
                        <p>
                          This phase is mapped for a later content release. It
                          is excluded from completion and mastery until its
                          lessons are published.
                        </p>
                        <div className="topic-tags">
                          {phase.topics.map((t, i) => (
                            <span key={i}>{t}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </section>
            );
          })}
      </div>
    </div>
  );
}
