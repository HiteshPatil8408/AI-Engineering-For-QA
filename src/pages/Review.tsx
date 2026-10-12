import { Link } from "react-router-dom";
import { ArrowRight, Bookmark, RotateCcw } from "lucide-react";
import { useState } from "react";
import { lessons } from "../course";
import { useProgress } from "../state/ProgressContext";
import { reviewIds, mastery } from "../state/progress";
import { EmptyState, PageHeading } from "../components/Layout";
export default function Review() {
  const { progress, updateLesson } = useProgress();
  const [filter, setFilter] = useState("review");
  const ids = reviewIds(progress);
  const items = lessons.filter((l) =>
    filter === "bookmarks"
      ? progress.lessons[l.id]?.bookmark
      : filter === "skipped"
        ? progress.lessons[l.id]?.exercise === "skipped"
        : ids.includes(l.id),
  );
  return (
    <div className="page">
      {progress.finalAssessment && !progress.finalAssessment.passed && <section className="panel"><h2>Final assessment review</h2><p>{progress.finalAssessment.weakAreas.join(", ")}</p><Link to="/assessment">Retry the applied assessment</Link></section>}
      <PageHeading
        eyebrow="TURN PRACTICE INTO MASTERY"
        title="A second look goes a long way."
        description="Your review queue brings together skipped exercises, incorrect answers, hints, and developing topics."
      />
      <div className="filter-tabs">
        {[
          ["review", "Review today"],
          ["skipped", "Skipped exercises"],
          ["bookmarks", "Bookmarks"],
        ].map(([v, t]) => (
          <button
            key={v}
            className={filter === v ? "active" : ""}
            onClick={() => setFilter(v)}
          >
            {t}
          </button>
        ))}
      </div>
      {items.length ? (
        <div className="review-list">
          {items.map((l) => {
            const s = progress.lessons[l.id] ?? {};
            return (
              <div className="panel review-item" key={l.id}>
                {filter === "bookmarks" ? (
                  <Bookmark size={23} />
                ) : (
                  <RotateCcw size={23} />
                )}
                <div>
                  <span className="section-label">{l.module}</span>
                  <h3>{l.title}</h3>
                  <p className="subtle">
                    {s.exercise === "skipped"
                      ? "Exercise skipped"
                      : s.exercise === "incorrect"
                        ? "Exercise needs another attempt"
                        : (s.hints ?? 0) > 0
                          ? "Practiced with hints"
                          : "Build confidence with the assessment"}{" "}
                    · {mastery(s)}% mastery
                  </p>
                </div>
                <Link className="secondary" to={"/lesson/" + l.id}>
                  Review <ArrowRight size={15} />
                </Link>
                {s.exercise === "passed" &&
                  s.quiz === 1 &&
                  s.checkpoint === 1 && (
                    <button
                      className="text-button"
                      onClick={() => updateLesson(l.id, { hints: 0 })}
                    >
                      Clear hint review
                    </button>
                  )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={
            filter === "bookmarks"
              ? "Your saved lessons will live here."
              : "You’re all caught up."
          }
          description="Keep learning. Any topics that need practice will appear here automatically."
        />
      )}
      {Object.values(progress.interviews).includes("review") && (
        <div className="roadmap-banner">
          <p>You also have interview questions marked Needs Review.</p>
          <Link to="/interviews">
            Review interview answers <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}
