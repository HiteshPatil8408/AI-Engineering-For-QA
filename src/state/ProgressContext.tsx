import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  loadProgress,
  mastery,
  STORAGE_KEY,
  type Progress,
  type LessonProgress,
} from "./progress";
interface Context {
  progress: Progress;
  setProgress: React.Dispatch<React.SetStateAction<Progress>>;
  updateLesson: (id: string, patch: Partial<LessonProgress>) => void;
  storageError: boolean;
}
const ProgressContext = createContext<Context | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(loadProgress);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [progress]);
  const updateLesson = useCallback(
    (id: string, patch: Partial<LessonProgress>) =>
      setProgress((p) => {
        const old = p.lessons[id] ?? {};
        const next = { ...old, ...patch };
        const before = mastery(old),
          after = mastery(next);
        if (before !== after)
          next.history = [
            ...(old.history ?? []),
            { date: new Date().toISOString(), score: after },
          ];
        return { ...p, lessons: { ...p.lessons, [id]: next } };
      }),
    [],
  );
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible")
        setProgress((p) => ({
          ...p,
          studySeconds: p.studySeconds + 30,
          days: [
            ...new Set([...p.days, new Date().toLocaleDateString("en-CA")]),
          ],
        }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <ProgressContext.Provider
      value={{ progress, setProgress, updateLesson, storageError }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("Missing progress provider");
  return context;
}
