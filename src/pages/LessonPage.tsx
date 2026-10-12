import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Clock3,
  Check,
  Lightbulb,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import type { Lesson } from "../types/course";
import { getLesson, loadLesson, lessons } from "../course";
import { useProgress } from "../state/ProgressContext";
import { mastery, masteryLabel } from "../state/progress";
import { ExerciseCard } from "../exercises/ExerciseCard";
import { LessonDemo } from "../components/LessonDemo";
import { InterviewBridge } from "../components/InterviewBridge";
import { QuizCard } from "../components/QuizCard";
import { EmptyState } from "../components/Layout";
export default function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState<Lesson | undefined>(getLesson(id ?? ""));
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    loadLesson(id ?? "").then(value => { if(active) {setLesson(value);setLoading(false);} }).catch(() => {if(active) {setLesson(undefined);setLoading(false);}});
    return () => {active=false;};
  }, [id]);
  const { progress, setProgress, updateLesson } = useProgress();
  useEffect(() => {
    if (lesson) {
      updateLesson(lesson.id, { started: true });
      setProgress((p) => ({ ...p, lastLesson: lesson.id }));
    }
  }, [lesson, setProgress, updateLesson]);
  if (loading) return <div className="page" role="status">Loading lesson…</div>;
  if (!lesson)
    return (
      <div className="page">
        <EmptyState
          title="Lesson not found"
          description="Choose a published lesson from the learning path."
        />
      </div>
    );
  const state = progress.lessons[lesson.id] ?? {};
  const index = lessons.findIndex((l) => l.id === lesson.id);
  const score = mastery(state);
  return (
    <div className="page lesson-page" key={lesson.id}>
      <div className="lesson-top">
        <Link to="/roadmap">
          <ArrowLeft size={15} />
          Learning path
        </Link>
        <span>
          PHASE {String(lesson.phase).padStart(2, "0")} / {lesson.module}
        </span>
      </div>
      <div className="lesson-layout">
        <article className="lesson-body">
          <div className="eyebrow">
            AI ENGINEERING · LESSON {String(index + 1).padStart(2, "0")}
          </div>
          <h1>{lesson.title}</h1>
          <div className="lesson-meta">
            <Clock3 size={15} />
            {lesson.minutes} min<span>•</span>Learn → practice → evaluate
          </div>
          <section className="objectives">
            <h3>What you’ll be able to do</h3>
            {lesson.objectives.map((o) => (
              <p key={o}>
                <Check size={16} />
                {o}
              </p>
            ))}
          </section>
          <div className="sdet-box">
            <Lightbulb size={21} />
            <div>
              <h3>Why this matters to an SDET</h3>
              <p>{lesson.relevance}</p>
            </div>
          </div>
          {lesson.sections.map((section, i) => (
            <section
              className="content-section"
              id={"section-" + i}
              key={section.title}
            >
              <div className="section-label">
                {String(i + 1).padStart(2, "0")} / CONCEPT
              </div>
              <h2>{section.title}</h2>
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {section.code && (
                <div className="code-block">
                  <div>
                    <span>{section.language ?? (lesson.phase === 4 ? "SQL" : "Python")}</span>
                    <span>Worked example</span>
                  </div>
                  <pre>
                    <code>{section.code}</code>
                  </pre>
                </div>
              )}
            </section>
          ))}
          <LessonDemo id={lesson.id} demo={lesson.demo} />
          <div className="mistake-box">
            <AlertTriangle size={20} />
            <div>
              <h3>What usually goes wrong?</h3>
              <p>{lesson.mistake}</p>
            </div>
          </div>
          <ExerciseCard
            key={lesson.id + "-exercise"}
            exercise={lesson.exercise}
            lessonId={lesson.id}
          />
          <QuizCard
            key={lesson.id + "-quiz"}
            quiz={lesson.quiz}
            lessonId={lesson.id}
          />
          <QuizCard
            key={lesson.id + "-checkpoint"}
            quiz={lesson.checkpoint}
            lessonId={lesson.id}
            checkpoint
          />
          <InterviewBridge ids={lesson.interviewIds ?? []} phase={lesson.phase} />
          <div className="takeaway">
            <span className="section-label">TAKE THIS WITH YOU</span>
            <h3>{lesson.takeaway}</h3>
          </div>
          <div className="sources">
            <strong>Further reading · reviewed {lesson.reviewed ?? "2026-10-10"}</strong>
            {lesson.sources.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {new URL(url).hostname} <ExternalLink size={12} />
              </a>
            ))}
          </div>
          <div className="lesson-footer">
            {index > 0 && <Link className="secondary" to={"/lesson/" + lessons[index-1].id}>Previous lesson</Link>}
            <button
              className="primary"
              onClick={() =>
                updateLesson(lesson.id, { complete: !state.complete })
              }
            >
              <Check size={17} />
              {state.complete ? "Lesson read ✓ · undo" : "Mark lesson as read"}
            </button>
            {index + 1 < lessons.length && (
              <Link
                className="secondary"
                to={"/lesson/" + lessons[index + 1].id}
              >
                Next lesson <ArrowRight size={17} />
              </Link>
            )}
          </div>
          <p className="fine">
            Reading contributes 15% of mastery. Exercises, quizzes, and
            checkpoints measure the remaining 85%.
          </p>
        </article>
        <aside className="lesson-aside">
          <section className="panel">
            <div className="section-heading">
              <h3>Lesson progress</h3>
              <button
                className={
                  "icon-button " + (state.bookmark ? "bookmarked" : "")
                }
                aria-label={
                  state.bookmark ? "Remove bookmark" : "Bookmark lesson"
                }
                onClick={() =>
                  updateLesson(lesson.id, { bookmark: !state.bookmark })
                }
              >
                <Bookmark size={18} />
              </button>
            </div>
            <strong className="large-score">{score}%</strong>
            <p className="subtle">{masteryLabel(score)}</p>
            <div className="progress-bar">
              <i style={{ width: score + "%" }} />
            </div>
            <ul className="progress-checklist">
              {[
                ["Read the lesson", state.complete],
                ["Pass the exercise", state.exercise === "passed"],
                ["Knowledge check", state.quiz === 1],
                ["Module checkpoint", state.checkpoint === 1],
              ].map(([label, done]) => (
                <li key={String(label)}>
                  <span className={done ? "check-done" : ""}>
                    <Check size={12} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <h3>In this lesson</h3>
            <nav className="toc">
              {lesson.sections.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() =>
                    document
                      .getElementById("section-" + i)
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {s.title}
                </button>
              ))}
              <button
                onClick={() =>
                  document
                    .getElementById("exercise")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Your practice exercise
              </button>
            </nav>
          </section>
          <section className="panel">
            <label className="notes-label" htmlFor="lesson-notes">
              Your field notes
            </label>
            <p className="fine">
              Save a thought, a question, or a useful connection.
            </p>
            <textarea
              id="lesson-notes"
              placeholder="What clicked for you?"
              value={state.note ?? ""}
              onChange={(e) =>
                updateLesson(lesson.id, { note: e.target.value })
              }
            />
            <small className="fine">Saved on this device</small>
          </section>
          {state.history && state.history.length > 0 && (
            <section className="panel">
              <h3>Improvement history</h3>
              {state.history.slice(-5).map((h, i) => (
                <p key={i} className="history-row">
                  <span>{new Date(h.date).toLocaleDateString()}</span>
                  <strong>{h.score}%</strong>
                </p>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
