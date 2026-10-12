import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ProgressProvider, useProgress } from "../src/state/ProgressContext";
import { ExerciseCard } from "../src/exercises/ExerciseCard";
import { QuizCard } from "../src/components/QuizCard";
import { getLesson } from "../src/course";
function State() {
  const { progress } = useProgress();
  return (
    <output data-testid="state">{JSON.stringify(progress.lessons)}</output>
  );
}
it("unlocks solution after all four hints and persists a skip", () => {
  const lesson = getLesson("python-values")!;
  render(
    <ProgressProvider>
      <ExerciseCard exercise={lesson.exercise} lessonId={lesson.id} />
      <State />
    </ProgressProvider>,
  );
  expect(
    screen.getByText("Use all four hints to unlock the solution"),
  ).toBeDisabled();
  for (let n = 1; n <= 4; n++)
    fireEvent.click(screen.getByRole("button", { name: `Hint ${n}/4` }));
  expect(screen.getByRole("button", { name: "Show solution" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Skip" }));
  expect(screen.getByTestId("state")).toHaveTextContent('"exercise":"skipped"');
});
it("validates answers and records retries", () => {
  const lesson = getLesson("python-values")!;
  render(
    <ProgressProvider>
      <ExerciseCard exercise={lesson.exercise} lessonId={lesson.id} />
      <State />
    </ProgressProvider>,
  );
  fireEvent.click(screen.getByLabelText("failed"));
  fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
  expect(screen.getByTestId("state")).toHaveTextContent("incorrect");
  fireEvent.click(screen.getByLabelText("passed"));
  fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
  expect(screen.getByTestId("state")).toHaveTextContent('"exercise":"passed"');
  expect(screen.getByTestId("state")).toHaveTextContent('"attempts":2');
});
it("scores quiz answers independently of reading", () => {
  const lesson = getLesson("python-values")!;
  render(
    <ProgressProvider>
      <QuizCard quiz={lesson.quiz} lessonId={lesson.id} />
      <State />
    </ProgressProvider>,
  );
  fireEvent.click(screen.getByLabelText("Set"));
  fireEvent.click(screen.getByRole("button", { name: "Check quiz" }));
  expect(screen.getByTestId("state")).toHaveTextContent('"quiz":1');
  expect(screen.getByTestId("state")).not.toHaveTextContent('"complete":true');
});
