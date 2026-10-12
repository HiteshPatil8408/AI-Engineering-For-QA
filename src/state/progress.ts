import { lessons } from "../course";
export interface LessonProgress {
  started?: boolean;
  complete?: boolean;
  exercise?: "passed" | "incorrect" | "skipped";
  attempts?: number;
  hints?: number;
  quiz?: number;
  checkpoint?: number;
  note?: string;
  bookmark?: boolean;
  history?: { date: string; score: number }[];
}
export interface Progress {
  projectEvidence?: Record<string,string>;
  finalAssessment?: { score:number; passed:boolean; date:string; weakAreas:string[]; python:boolean; sql:boolean };
  version: 1;
  lessons: Record<string, LessonProgress>;
  interviews: Record<string, "known" | "review" | "bookmark">;
  projects: string[];
  lastLesson: string;
  studySeconds: number;
  days: string[];
  name: string;
}
export const STORAGE_KEY = "sdet-path-progress-v1";
export const emptyProgress = (): Progress => ({
  version: 1,
  lessons: {},
  interviews: {},
  projects: [],
  lastLesson: "orientation",
  studySeconds: 0,
  days: [],
  name: "",
});
export function mastery(p: LessonProgress | undefined): number {
  if (!p) return 0;
  return Math.round(
    (p.complete ? 15 : 0) +
      (p.quiz ?? 0) * 20 +
      (p.exercise === "passed" ? 35 : 0) +
      (p.checkpoint ?? 0) * 30,
  );
}
export function masteryLabel(score: number) {
  return score < 50
    ? "Needs work"
    : score < 70
      ? "Developing"
      : score < 85
        ? "Proficient"
        : score < 95
          ? "Strong"
          : "Mastered";
}
export function moduleMastery(module: string, p: Progress) {
  const ls = lessons.filter((l) => l.module === module);
  return ls.length
    ? Math.round(
        ls.reduce((sum, l) => sum + mastery(p.lessons[l.id]), 0) / ls.length,
      )
    : 0;
}
export function reviewIds(p: Progress) {
  return lessons
    .filter((l) => {
      const x = p.lessons[l.id];
      return (
        x &&
        (x.exercise === "skipped" ||
          x.exercise === "incorrect" ||
          (x.hints ?? 0) > 0 ||
          x.quiz === 0 ||
          x.checkpoint === 0 ||
          (x.started && mastery(x) < 70))
      );
    })
    .map((l) => l.id);
}
export function streak(
  days: string[],
  today = new Date().toLocaleDateString("en-CA"),
) {
  const set = new Set(days);
  const d = new Date(`${today}T12:00:00`);
  if (!set.has(today)) d.setDate(d.getDate() - 1);
  let count = 0;
  while (set.has(d.toLocaleDateString("en-CA"))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}
export function validateProgress(raw: unknown): Progress {
  if (typeof raw !== "object" || raw === null)
    throw new Error("Progress must be a JSON object.");
  const p = raw as Record<string, unknown>;
  if (
    p.version !== 1 ||
    typeof p.lessons !== "object" ||
    p.lessons === null ||
    Array.isArray(p.lessons) ||
    typeof p.interviews !== "object" ||
    p.interviews === null ||
    Array.isArray(p.interviews)
  )
    throw new Error(
      "Unsupported progress format. Export a version 1 backup from this app.",
    );
  const ids = new Set(lessons.map((l) => l.id));
  const records: Record<string, LessonProgress> = {};
  for (const [id, value] of Object.entries(p.lessons)) {
    if (!ids.has(id)) throw new Error(`Unknown lesson: ${id}`);
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error("Invalid lesson record.");
    const v = value as Record<string, unknown>;
    for (const key of ["started", "complete", "bookmark"])
      if (v[key] !== undefined && typeof v[key] !== "boolean")
        throw new Error("Invalid completion flag.");
    for (const key of ["quiz", "checkpoint"])
      if (v[key] !== undefined && v[key] !== 0 && v[key] !== 1)
        throw new Error("Invalid assessment score.");
    for (const key of ["attempts", "hints"])
      if (
        v[key] !== undefined &&
        (!Number.isSafeInteger(v[key]) ||
          Number(v[key]) < 0 ||
          Number(v[key]) > 100000)
      )
        throw new Error("Invalid exercise counters.");
    if (v.hints !== undefined && Number(v.hints) > 4)
      throw new Error("Hints must be between zero and four.");
    if (
      v.exercise !== undefined &&
      !["passed", "incorrect", "skipped"].includes(String(v.exercise))
    )
      throw new Error("Invalid exercise state.");
    if (
      v.note !== undefined &&
      (typeof v.note !== "string" || v.note.length > 20000)
    )
      throw new Error("Invalid lesson note.");
    const history: NonNullable<LessonProgress["history"]> = [];
    if (v.history !== undefined) {
      if (!Array.isArray(v.history) || v.history.length > 10000)
        throw new Error("Invalid improvement history.");
      for (const h of v.history) {
        if (
          !h ||
          typeof h.date !== "string" ||
          !Number.isFinite(Date.parse(h.date)) ||
          typeof h.score !== "number" ||
          h.score < 0 ||
          h.score > 100
        )
          throw new Error("Invalid history entry.");
        history.push({ date: h.date, score: h.score });
      }
    }
    records[id] = {
      started: v.started as boolean | undefined,
      complete: v.complete as boolean | undefined,
      bookmark: v.bookmark as boolean | undefined,
      quiz: v.quiz as number | undefined,
      checkpoint: v.checkpoint as number | undefined,
      exercise: v.exercise as LessonProgress["exercise"],
      attempts: v.attempts as number | undefined,
      hints: v.hints as number | undefined,
      note: v.note as string | undefined,
      history,
    };
  }
  if (
    !Array.isArray(p.projects) ||
    !p.projects.every((v) => typeof v === "string") ||
    !Array.isArray(p.days) ||
    !p.days.every((v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v))
  )
    throw new Error("Invalid project or study-day data.");
  if (
    typeof p.studySeconds !== "number" ||
    !Number.isFinite(p.studySeconds) ||
    p.studySeconds < 0 ||
    typeof p.name !== "string" ||
    p.name.length > 200 ||
    typeof p.lastLesson !== "string" ||
    !ids.has(p.lastLesson)
  )
    throw new Error("Invalid learner metadata.");
  const interviews: Progress["interviews"] = {};
  for (const [id, status] of Object.entries(p.interviews)) {
    if (
      !/^[a-z0-9-]+$/.test(id) ||
      !["known", "review", "bookmark"].includes(String(status))
    )
      throw new Error("Invalid interview status.");
    interviews[id] = status as "known" | "review" | "bookmark";
  }
  const projectEvidence: Record<string,string> = {};
  if (p.projectEvidence !== undefined) {
    if (!p.projectEvidence || typeof p.projectEvidence !== "object" || Array.isArray(p.projectEvidence)) throw new Error("Invalid project evidence.");
    for(const [id,evidence] of Object.entries(p.projectEvidence)) {
      if(!["analyzer","rag","agent","evals","platform"].includes(id) || typeof evidence!=="string" || evidence.length>20000) throw new Error("Invalid project evidence.");
      projectEvidence[id]=evidence;
    }
  }
  let finalAssessment: Progress["finalAssessment"];
  if(p.finalAssessment!==undefined) {
    const f=p.finalAssessment as Progress["finalAssessment"];
    if(!f || typeof f!=="object" || typeof f.score!=="number" || !Number.isFinite(f.score) || f.score<0 || f.score>100 || typeof f.passed!=="boolean" || typeof f.python!=="boolean" || typeof f.sql!=="boolean" || !Number.isFinite(Date.parse(f.date)) || !Array.isArray(f.weakAreas) || !f.weakAreas.every(a=>typeof a==="string")) throw new Error("Invalid final assessment.");
    if(f.passed && (f.score<80 || !f.python || !f.sql || f.weakAreas.includes("Safety invariants"))) throw new Error("Inconsistent final assessment verdict.");
    finalAssessment={score:f.score,passed:f.passed,date:f.date,weakAreas:f.weakAreas,python:f.python,sql:f.sql};
  }
  return {
    version: 1,
    projectEvidence,
    finalAssessment,
    lessons: records,
    interviews,
    projects: [...new Set(p.projects as string[])],
    days: [...new Set(p.days as string[])],
    studySeconds: p.studySeconds,
    name: p.name,
    lastLesson: p.lastLesson,
  };
}
export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? validateProgress(JSON.parse(raw)) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}
