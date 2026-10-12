import { describe, it, expect } from "vitest";
import {
  emptyProgress,
  mastery,
  validateProgress,
  reviewIds,
  streak,
} from "../src/state/progress";
import completeLessons from "../src/course/complete-lessons.json";
import { lessons, phases } from "../src/course";
import { compareRows } from "../src/lib/runtimes";
describe("weighted mastery and review evidence", () => {
  it("reading cannot imply mastery", () => {
    expect(mastery({ complete: true })).toBe(15);
    expect(
      mastery({ complete: true, quiz: 1, checkpoint: 1, exercise: "passed" }),
    ).toBe(100);
  });
  it("skipping removes exercise credit even after reading and assessments", () => {
    expect(
      mastery({ complete: true, quiz: 1, checkpoint: 1, exercise: "skipped" }),
    ).toBe(65);
  });
  it("retains skipped, hinted, and incorrect cases in review", () => {
    const p = emptyProgress();
    p.lessons.orientation = { exercise: "skipped" };
    p.lessons.environment = {
      hints: 1,
      exercise: "passed",
      complete: true,
      quiz: 1,
      checkpoint: 1,
    };
    expect(reviewIds(p)).toEqual(["orientation", "environment"]);
  });
  it("calculates streak across calendar boundaries", () => {
    expect(
      streak(["2026-09-30", "2026-10-01", "2026-10-02"], "2026-10-02"),
    ).toBe(3);
    expect(streak(["2026-09-30", "2026-10-01"], "2026-10-02")).toBe(2);
    expect(streak(["2026-09-30"], "2026-10-03")).toBe(0);
  });
});
describe("backup validation", () => {
  it("round trips notes, scores, bookmarks, and skips", () => {
    const p = emptyProgress();
    p.lessons.orientation = {
      note: "A useful note",
      exercise: "skipped",
      bookmark: true,
      quiz: 0,
    };
    expect(
      validateProgress(JSON.parse(JSON.stringify(p))).lessons.orientation,
    ).toMatchObject(p.lessons.orientation);
  });
  it.each([
    { version: 2 },
    { ...emptyProgress(), studySeconds: -1 },
    { ...emptyProgress(), lessons: { orientation: { quiz: 99 } } },
    { ...emptyProgress(), lessons: { orientation: { hints: 5 } } },
    { ...emptyProgress(), lessons: { unknown: { complete: true } } },
    { ...emptyProgress(), interviews: { "q-1": "bad" } },
  ])("rejects malformed or unsupported data", (p) => {
    expect(() => validateProgress(p)).toThrow();
  });
});
describe("course integrity", () => {
  it("has all phases in order and unique lesson/exercise IDs", () => {
    expect(phases.map((p) => p.id)).toEqual(
      Array.from({ length: 46 }, (_, i) => i),
    );
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    expect(new Set(lessons.map((l) => l.exercise.id)).size).toBe(
      lessons.length,
    );
  });
  it("publishes genuine sections, four progressive hints, and valid answer indices", () => {
    for (const l of completeLessons) {
      expect(l.sections.length).toBeGreaterThanOrEqual(2);
      expect(l.sections.every((s) => s.paragraphs.length >= 2)).toBe(true);
      expect(l.exercise.hints).toHaveLength(4);
      expect(l.quiz.answer).toBeLessThan(l.quiz.options.length);
      expect(l.checkpoint.answer).toBeLessThan(l.checkpoint.options.length);
      expect(JSON.stringify(l)).not.toMatch(
        /Lorem ipsum|TODO add|Exercise coming soon/,
      );
    }
  });
  it("compares SQL row values independent of column serialization order", () => {
    expect(compareRows([{ a: 1, b: "x" }], [{ b: "x", a: 1 }])).toBe(true);
    expect(compareRows([{ a: 2 }], [{ a: 1 }])).toBe(false);
  });
});
