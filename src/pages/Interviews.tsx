import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Bookmark,
  Check,
  Clock3,
  Lightbulb,
  MessagesSquare,
  Play,
  RotateCcw,
} from "lucide-react";
import { questions } from "../interview";
import { getLesson } from "../course";
import { ExerciseCard } from "../exercises/ExerciseCard";
import { useProgress } from "../state/ProgressContext";
import { PageHeading } from "../components/Layout";
import type { InterviewQuestion } from "../types/course";
export default function Interviews() {
  const [params]=useSearchParams();
  const [query,setQuery]=useState("");
  const [page,setPage]=useState(1);
  const [category, setCategory] = useState("All topics");
  const [difficulty, setDifficulty] = useState("All levels");
  const [filter, setFilter] = useState("All questions");
  const [tab, setTab] = useState("bank");
  const { progress } = useProgress();
  const items = questions.filter(
    (q) =>
      (!params.get("question") || q.id===params.get("question")) &&
      (!params.get("lesson") || q.lesson===params.get("lesson")) &&
      (!params.get("phase") || String(q.phase)===params.get("phase")) &&
      (!query || (q.question+" "+q.answer).toLowerCase().includes(query.toLowerCase())) &&
      (category === "All topics" || q.category === category) &&
      (difficulty === "All levels" || q.difficulty === difficulty) &&
      (filter === "All questions" ||
        progress.interviews[q.id] ===
          (filter === "Needs review" ? "review" : "bookmark")),
  );
  return (
    <div className="page">
      <PageHeading
        eyebrow="KNOW IT. BUILD IT. EXPLAIN IT."
        title="Engineering judgment, under pressure."
        description="Practice the decisions behind the code. Explain tradeoffs, diagnose failures, and back your answers with evidence."
      />
      <div className="interview-summary">
        <div>
          <MessagesSquare size={22} />
          <span>
            <strong>{questions.length} curated questions</strong>
            <small>Linked interview bank · reviewed 2026-10-10</small>
          </span>
        </div>
        <div>
          <Check size={22} />
          <span>
            <strong>
              {
                Object.values(progress.interviews).filter((s) => s === "known")
                  .length
              }{" "}
              confidently known
            </strong>
            <small>Your self-assessed readiness</small>
          </span>
        </div>
        <div>
          <RotateCcw size={22} />
          <span>
            <strong>
              {
                Object.values(progress.interviews).filter((s) => s === "review")
                  .length
              }{" "}
              need review
            </strong>
            <small>Revisit and explain out loud</small>
          </span>
        </div>
      </div>
      <div className="filter-tabs">
        <button
          className={tab === "bank" ? "active" : ""}
          onClick={() => setTab("bank")}
        >
          Question bank
        </button>
        <button
          className={tab === "mock" ? "active" : ""}
          onClick={() => setTab("mock")}
        >
          Mock interview
        </button>
      </div>
      {tab === "bank" && items.length>page*20 && <button className="secondary" onClick={()=>setPage(p=>p+1)}>Show 20 more questions</button>}
      {tab === "mock" ? (
        <MockInterview />
      ) : (
        <>
          <label>Search questions<input value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}} /></label><p>{items.length} matching questions</p>
          <div className="interview-filters">
            <label>
              Topic
              <select
                aria-label="Topic"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {[
                  "All topics",
                  ...new Set(questions.map((q) => q.category)),
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Difficulty
              <select
                aria-label="Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {[
                  "All levels",
                  "Beginner",
                  "Intermediate",
                  "Advanced",
                  "Staff",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Collection
              <select
                aria-label="Collection"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {["All questions", "Needs review", "Bookmarked"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <span className="fine">{items.length} questions</span>
          </div>
          <div className="question-list">
            {items.slice(0,page*20).map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
            {items.length === 0 && (
              <div className="empty-state">
                No questions match these filters.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
function QuestionCard({ question: q }: { question: InterviewQuestion }) {
  const [thinking, setThinking] = useState(false);
  const [draft, setDraft] = useState("");
  const [hint, setHint] = useState(false);
  const [shown, setShown] = useState(false);
  const { progress, setProgress } = useProgress();
  const status = progress.interviews[q.id];
  function mark(s: "known" | "review" | "bookmark") {
    setProgress((p) => {
      const next = { ...p.interviews };
      if (next[q.id] === s) delete next[q.id];
      else next[q.id] = s;
      return { ...p, interviews: next };
    });
  }
  return (
    <article className="panel question-card">
      <div className="question-meta">
        <span className="section-label">{q.category}</span>
        <span className="badge">{q.difficulty}</span>
        {status && <span className="badge green">{status}</span>}
      </div>
      <h3>{q.question}</h3>
      <p className="fine">What the interviewer is testing: {q.testing}</p>
      <div className="exercise-actions">
        <button className="secondary" onClick={() => setThinking((v) => !v)}>
          Think
        </button>
        <button className="text-button" onClick={() => setHint((v) => !v)}>
          <Lightbulb size={15} />
          Hint
        </button>
        <button className="text-button" onClick={() => setShown((v) => !v)}>
          {shown ? "Hide answer" : "Show answer"}
        </button>
        <button
          className="icon-button"
          aria-label="Bookmark question"
          onClick={() => mark("bookmark")}
        >
          <Bookmark size={17} />
        </button>
      </div>
      {thinking && (
        <label className="draft-label">
          Draft your answer
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="State your assumptions, approach, tradeoffs, and evidence…"
          />
        </label>
      )}
      {hint && <p className="hint-box">{q.hint}</p>}
      {shown && (
        <div className="strong-answer">
          <h4>Strong answer</h4>
          <p>{q.answer}</p>
          <h4>Why this answer is strong</h4>
          <p>{q.why}</p>
          <h4>Common weak answer</h4>
          <p>“{q.weak}”</p>
          <h4>Practical example</h4>
          <p>{q.example}</p>
          <h4>Follow-up questions</h4>
          <ul>
            {q.followups.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <Link to={"/lesson/" + q.lesson}>
            Connect this to a course lesson →
          </Link>
        </div>
      )}
      <div className="question-marks">
        <button
          className={status === "known" ? "selected" : ""}
          onClick={() => mark("known")}
        >
          <Check size={14} />I know this
        </button>
        <button
          className={status === "review" ? "selected" : ""}
          onClick={() => mark("review")}
        >
          <RotateCcw size={14} />
          Needs review
        </button>
      </div>
    </article>
  );
}
function MockInterview() {
  const [role, setRole] = useState("AI-SDET");
  const [level, setLevel] = useState("Senior");
  const [duration, setDuration] = useState(15);
  const [session, setSession] = useState<InterviewQuestion[]>([]);
  const [remaining, setRemaining] = useState(0);
  const [ended, setEnded] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!session.length || ended) return;
    const timer = setInterval(
      () =>
        setRemaining((t) => {
          if (t <= 1) {
            setEnded(true);
            return 0;
          }
          return t - 1;
        }),
      1000,
    );
    return () => clearInterval(timer);
  }, [session.length, ended]);
  function start() {
    const concept =
      role === "RAG Engineer"
        ? "RAG"
        : role === "GenAI Engineer"
          ? "Embeddings / Vector DB"
          : role === "AI Engineer"
            ? "ML fundamentals"
            : "AI Testing";
    const categories = [
      "Python",
      concept,
      "Production",
      "AI System Design",
      "AI Evaluation",
    ];
    const ranks = { Beginner: 0, Intermediate: 1, Advanced: 2, Staff: 3 };
    const target = level === "Intermediate" ? 1 : level === "Senior" ? 2 : 3;
    const selected = categories
      .map(
        (c) =>
          questions
            .filter((q) => q.category === c)
            .sort(
              (a, b) =>
                Math.abs(ranks[a.difficulty] - target) -
                Math.abs(ranks[b.difficulty] - target),
            )[0],
      )
      .filter(Boolean);
    const projectQuestion: InterviewQuestion = {
      id: "project-interview",
      category: "Project deep dive",
      difficulty: target === 3 ? "Staff" : "Advanced",
      question:
        "Tell me about an engineering project where you found a failure and changed the design. What evidence showed the improvement?",
      testing: "Ownership, diagnosis, tradeoffs, and measurable outcomes.",
      hint: "Use problem, architecture, decisions, failure, improvement, and production concerns as your structure.",
      answer:
        "Explain the user problem and your specific contribution. Describe the architecture and constraints, a meaningful decision and its alternatives, a failure you reproduced, the change you made, and measured before/after evidence. Distinguish a synthetic lab result from production experience and discuss remaining risks.",
      why: "It connects individual ownership with evidence rather than tool names.",
      weak: "We used an LLM and a vector database and it worked well.",
      followups: [
        "What would you do differently at ten times the traffic?",
        "Which result was most uncertain, and how did you validate it?",
      ],
      example:
        "A synthetic triage baseline missed rare product defects; threshold tuning improved recall while explicit review controlled false alerts.",
      lesson: "stats-comparison",
    };
    setSession([...selected, projectQuestion]);
    setRemaining(duration * 60);
    setEnded(false);
    setScores({});
  }
  return (
    <section className="mock-interview">
      <div className="panel">
        <h2>Your next interview starts here.</h2>
        <p className="subtle">
          A local, timed practice session. Ratings are self-assessed against the
          rubric; no AI judge is involved.
        </p>
        
          <div className="interview-filters">
          <label>
            Role
            <select
              aria-label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {[
                "AI Engineer",
                "AI-SDET",
                "Senior SDET + AI",
                "GenAI Engineer",
                "RAG Engineer",
                "AI Quality Engineer",
                "Senior AI Engineer",
                "Staff AI Engineer",
                "AI Architect",
              ].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label>
            Level
            <select
              aria-label="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {["Intermediate", "Senior", "Staff"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label>
            Duration
            <select
              aria-label="Duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              {[15, 30, 60].map((d) => (
                <option value={d} key={d}>
                  {d} minutes
                </option>
              ))}
            </select>
          </label>
          <button className="primary" onClick={start}>
            <Play size={15} />
            Start session
          </button>
        </div>
      </div>
      {session.length > 0 && (
        <>
          <div className="session-header">
            <Clock3 size={20} />
            <strong>
              {ended
                ? "Session complete"
                : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")} remaining`}
            </strong>
            <span>
              {role} · {level}
            </span>
            <button className="secondary" onClick={() => setEnded(true)}>
              Finish & score
            </button>
          </div>
          {session.map((q, i) => (
            <div key={q.id}>
              <div className="section-label">
                ROUND {i + 1} /{" "}
                {
                  [
                    "CODING",
                    "CONCEPTUAL",
                    "DEBUGGING",
                    "SYSTEM DESIGN",
                    "AI EVALUATION",
                    "PROJECT DEEP DIVE",
                  ][i]
                }
              </div>
              <QuestionCard question={q} />
              {i === 0 && (
                <ExerciseCard
                  exercise={getLesson("python-control")!.exercise}
                  lessonId="python-control"
                />
              )}
              <label className="self-rating">
                Your rubric rating
                <select
                  value={scores[q.id] ?? 0}
                  onChange={(e) =>
                    setScores({ ...scores, [q.id]: Number(e.target.value) })
                  }
                >
                  <option value={0}>Not rated / missed</option>
                  <option value={1}>1 — Recognized the idea</option>
                  <option value={2}>2 — Explained an approach</option>
                  <option value={3}>3 — Covered tradeoffs and failures</option>
                  <option value={4}>
                    4 — Supported with evidence and examples
                  </option>
                </select>
              </label>
            </div>
          ))}
          {ended && (
            <div className="session-result">
              <h2>
                Your practice score:{" "}
                {Math.round(
                  (session.reduce((sum, q) => sum + (scores[q.id] ?? 0), 0) /
                    (session.length * 4)) *
                    100,
                )}
                %
              </h2>
              <p>
                Review rounds rated below 3. This is a self-assessment, not an
                independently verified interview result.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
