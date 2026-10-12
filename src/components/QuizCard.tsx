import { useState } from "react";
import type { Quiz } from "../types/course";
import { useProgress } from "../state/ProgressContext";
export function QuizCard({
  quiz,
  lessonId,
  checkpoint = false,
}: {
  quiz: Quiz;
  lessonId: string;
  checkpoint?: boolean;
}) {
  const { progress, updateLesson } = useProgress();
  const [choice, setChoice] = useState(-1);
  const [feedback, setFeedback] = useState("");
  const field = checkpoint ? "checkpoint" : "quiz";
  const score = progress.lessons[lessonId]?.[field];
  return (
    <section className="quiz-card">
      <div className="section-label">
        {checkpoint ? "MODULE CHECKPOINT" : "QUICK KNOWLEDGE CHECK"}
        {score !== undefined && (
          <span className="badge">
            {score === 1 ? "Passed" : "Retry needed"}
          </span>
        )}
      </div>
      <h3>{quiz.question}</h3>
      <fieldset className="options">
        <legend className="sr-only">Select an answer</legend>
        {quiz.options.map((o, i) => (
          <label key={o} className={choice === i ? "selected" : ""}>
            <input
              type="radio"
              name={`${lessonId}-${field}`}
              checked={choice === i}
              onChange={() => {
                setChoice(i);
                setFeedback("");
              }}
            />
            {o}
          </label>
        ))}
      </fieldset>
      <button
        className="secondary"
        disabled={choice < 0}
        onClick={() => {
          const correct = choice === quiz.answer;
          updateLesson(lessonId, { [field]: correct ? 1 : 0 });
          setFeedback(
            (correct ? "Correct. " : "Try again. ") + quiz.explanation,
          );
        }}
      >
        Check {checkpoint ? "checkpoint" : "quiz"}
      </button>
      {feedback && (
        <p role="status" className="hint-box">
          {feedback}
        </p>
      )}
    </section>
  );
}
