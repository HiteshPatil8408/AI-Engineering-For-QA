import rawPhases from './phases.json';
import legacy from './lessons.json';
import index from './lesson-index.json';
import type { Phase, Lesson, LessonSummary } from '../types/course';
export const phases = rawPhases as Phase[];
// Lightweight navigation metadata. Teaching content loads by phase.
export const lessons = index as LessonSummary[];
const cache = new Map<string, Lesson>((legacy as Lesson[]).map(l => [l.id, l]));
const chunks = import.meta.glob<Lesson[]>('./phases/*.json', { import: 'default' });
const pending = new Map<number, Promise<void>>();
export const getLesson = (id: string) => cache.get(id);
export async function loadLesson(id: string): Promise<Lesson | undefined> {
  const meta = lessons.find(l => l.id === id);
  if (!meta) return undefined;
  if (!pending.has(meta.phase)) {
    const key = `./phases/${String(meta.phase).padStart(2, '0')}.json`;
    pending.set(meta.phase, chunks[key]().then(items => { items.forEach(l => cache.set(l.id, l)); }).catch(error=>{pending.delete(meta.phase);throw error;}));
  }
  await pending.get(meta.phase);
  return cache.get(id);
}
export const modules = [...new Set(lessons.map(l => l.module))];
