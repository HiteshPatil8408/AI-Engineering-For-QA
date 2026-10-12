export interface Exercise {
  id: string;
  kind: "choice" | "python" | "sql" | "order" | "classification" | "rubric";
  prompt: string;
  options?: string[];
  answer: string;
  hints: string[];
  explanation: string;
  solution?: string;
  starter?: string;
  tests?: string;
  criteria?: { label: string; terms: string[] }[];
  tasks?: { text: string; answer: string }[];
}
export interface Quiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}
export interface Section {
  title: string;
  paragraphs: string[];
  code?: string;
  language?: string;
}
export interface Lesson {
  id: string;
  phase: number;
  module: string;
  title: string;
  minutes: number;
  objectives: string[];
  relevance: string;
  sections: Section[];
  mistake: string;
  takeaway: string;
  exercise: Exercise;
  quiz: Quiz;
  checkpoint: Quiz;
  sources: string[];
  reviewed?: string;
  prerequisites?: string[];
  isPhaseCheckpoint?: boolean;
  glossaryTerms?: string[];
  interviewIds?: string[];
  demo?: string;
}
export interface Phase {
  id: number;
  title: string;
  description: string;
  topics: string[];
}
export interface InterviewQuestion {
  id: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Staff";
  question: string;
  phase?: number;
  testing: string;
  hint: string;
  answer: string;
  why: string;
  weak: string;
  followups: string[];
  example: string;
  lesson: string;
}

export type LessonSummary = Pick<Lesson, "id" | "phase" | "module" | "title" | "minutes" | "objectives" | "prerequisites" | "isPhaseCheckpoint"> & { exercise: Pick<Exercise,"id" | "kind" | "prompt"> };
