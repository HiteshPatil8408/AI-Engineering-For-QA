import { useEffect, useRef, useState } from "react";
import {
  Lightbulb,
  Play,
  Check,
  ChevronUp,
  ChevronDown,
  SkipForward,
  Code2,
} from "lucide-react";
import type { Exercise } from "../types/course";
import { useProgress } from "../state/ProgressContext";
import { compareRows, runPython, runSQL } from "../lib/runtimes";
export function ExerciseCard({
  exercise,
  lessonId,
}: {
  exercise: Exercise;
  lessonId: string;
}) {
  const { progress, updateLesson } = useProgress();
  const state = progress.lessons[lessonId] ?? {};
  const [answer, setAnswer] = useState("");
  const [code, setCode] = useState(exercise.starter ?? "");
  const [order, setOrder] = useState(exercise.options ?? []);
  const [classes, setClasses] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [solution, setSolution] = useState(false);
  const cancel = useRef<(() => void) | null>(null);
  useEffect(
    () => () => {
      cancel.current?.();
    },
    [],
  );
  async function check(runOnly = false) {
    if (busy) return;
    setBusy(true);
    setFeedback("");
    let passed = false;
    try {
      if (exercise.kind === "python") {
        const run = runPython(code, runOnly ? undefined : exercise.tests);
        cancel.current = run.cancel;
        const result = await run.result;
        setFeedback(result.output || "Execution finished with no output.");
        passed = result.ok;
      } else if (exercise.kind === "sql") {
        const result = await runSQL(code);
        passed =
          result.ok &&
          compareRows(result.rows ?? [], JSON.parse(exercise.tests!));
        setFeedback(
          result.output +
            (runOnly
              ? ""
              : passed
                ? "\nCorrect result."
                : "\nResult differs from the expected rows. Check the grouping and ordering."),
        );
      } else if (exercise.kind === "rubric") {
        const text = answer.toLowerCase();
        const missing = exercise.criteria?.filter(c => !c.terms.every(t => text.includes(t.toLowerCase()))) ?? [];
        passed = answer.trim().length >= 120 && missing.length === 0;
        setFeedback(passed ? "Required evidence topics present. This is a checklist assessment, not semantic verification. Compare your reasoning with the worked approach." : "Add specific evidence (at least 120 characters). Missing topics: " + missing.map(c=>c.label).join(", "));
      } else {
        passed =
          exercise.kind === "order"
            ? order.join("|") === exercise.answer
            : exercise.kind === "classification"
              ? exercise.tasks!.every((task, i) => classes[i] === task.answer)
              : answer === exercise.answer;
        setFeedback(
          passed
            ? "Correct. " + exercise.explanation
            : "Not quite. Try a smaller example or use the next hint.",
        );
      }
      if (!runOnly)
        updateLesson(lessonId, {
          attempts: (state.attempts ?? 0) + 1,
          exercise: passed
            ? "passed"
            : state.exercise === "passed"
              ? "passed"
              : "incorrect",
        });
    } catch (error) {
      setFeedback(String(error));
    } finally {
      setBusy(false);
      cancel.current = null;
    }
  }
  const hints = state.hints ?? 0;
  const coding = ["python", "sql"].includes(exercise.kind);
  function move(i: number, direction: number) {
    setOrder((items) => {
      const next = [...items];
      [next[i], next[i + direction]] = [next[i + direction], next[i]];
      return next;
    });
  }
  return (
    <section className="exercise-card" id="exercise">
      <div className="section-label">
        <Code2 size={16} /> PUT IT INTO PRACTICE{" "}
        <span
          className={"badge " + (state.exercise === "passed" ? "green" : "")}
        >
          {state.exercise ?? exercise.kind}
        </span>
      </div>
      <h3>Your turn</h3>
      <p>{exercise.prompt}</p>
      {coding ? (
        <>
          <div className="editor-header">
            <span>
              {exercise.kind === "python" ? "solution.py" : "query.sql"}
            </span>
            <span>Runs in your browser</span>
          </div>
          <textarea
            className="code-editor"
            aria-label={`${exercise.kind} code`}
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <p className="fine">
            {exercise.kind === "python"
              ? "First run downloads Python and packages. No API key required."
              : "Tables: test_runs, test_cases, builds, failures, defects. A fresh database is used for each run."}
          </p>
        </>
      ) : exercise.kind === "rubric" ? (
        <div><label htmlFor={exercise.id}>Your evidence memo</label><textarea id={exercise.id} className="code-editor" value={answer} onChange={e=>setAnswer(e.target.value)} /><p className="fine">Checks required topic words and minimum length; review technical correctness against the worked approach.</p><ul>{exercise.criteria?.map(c=><li key={c.label}>{c.label}: {c.terms.join(", ")}</li>)}</ul></div>
      ) : exercise.kind === "order" ? (
        <ol className="order-list">
          {order.map((item, i) => (
            <li key={item}>
              <span>{item}</span>
              <button
                aria-label={`Move ${item} up`}
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                <ChevronUp size={16} />
              </button>
              <button
                aria-label={`Move ${item} down`}
                disabled={i === order.length - 1}
                onClick={() => move(i, 1)}
              >
                <ChevronDown size={16} />
              </button>
            </li>
          ))}
        </ol>
      ) : exercise.kind === "classification" ? (
        <div className="classifications">
          {exercise.tasks?.map((task, i) => (
            <label key={task.text}>
              <span>
                {i + 1}. {task.text}
              </span>
              <select
                value={classes[i] ?? ""}
                onChange={(e) =>
                  setClasses({ ...classes, [i]: e.target.value })
                }
              >
                <option value="">Choose a track</option>
                {exercise.options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      ) : (
        <fieldset className="options">
          <legend className="sr-only">Choose your answer</legend>
          {exercise.options?.map((option) => (
            <label className={answer === option ? "selected" : ""} key={option}>
              <input
                type="radio"
                name={exercise.id}
                checked={answer === option}
                onChange={() => setAnswer(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>
      )}
      <div className="exercise-actions">
        {coding && (
          <button
            className="secondary"
            disabled={busy}
            onClick={() => void check(true)}
          >
            <Play size={15} />
            Run code
          </button>
        )}
        <button
          className="primary"
          disabled={busy}
          onClick={() => void check()}
        >
          <Check size={16} />
          {busy ? "Running…" : "Check answer"}
        </button>
        {busy && cancel.current && (
          <button onClick={() => cancel.current?.()}>Stop</button>
        )}
        <button
          className="secondary"
          disabled={hints >= 4 || busy}
          onClick={() => updateLesson(lessonId, { hints: hints + 1 })}
        >
          <Lightbulb size={15} />
          Hint {Math.min(hints + 1, 4)}/4
        </button>
        <button
          className="text-button"
          disabled={busy || state.exercise === "passed"}
          onClick={() => {
            updateLesson(lessonId, { exercise: "skipped" });
            setFeedback("Skipped. This exercise is now in your review queue.");
          }}
        >
          <SkipForward size={15} />
          Skip
        </button>
      </div>
      <button className="text-button" disabled={busy} onClick={()=>{setFeedback("");setSolution(false);}}>Try again</button>
      {hints > 0 && (
        <div className="hint-box">
          <strong>Hint {hints}</strong>
          <p>{exercise.hints[hints - 1]}</p>
        </div>
      )}
      {feedback && (
        <pre className="output" role="status">
          {feedback}
        </pre>
      )}
      <button
        className="text-button"
        disabled={hints < 4}
        onClick={() => setSolution((v) => !v)}
      >
        {hints < 4
          ? "Use all four hints to unlock the solution"
          : solution
            ? "Hide solution"
            : "Show solution"}
      </button>
      {solution && (
        <div className="solution">
          <strong>Approach</strong>
          <p>{exercise.explanation}</p>
          {exercise.solution && (
            <pre className="output">
              <code>{exercise.solution}</code>
            </pre>
          )}
          {exercise.answer && <p>{exercise.answer.replaceAll("|", " → ")}</p>}
          {exercise.tasks &&
            exercise.tasks.map((t) => (
              <p key={t.text}>
                {t.text} → {t.answer}
              </p>
            ))}
        </div>
      )}
    </section>
  );
}
