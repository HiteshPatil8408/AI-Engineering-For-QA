import { lazy, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout, EmptyState } from "./components/Layout";
import { ProgressProvider } from "./state/ProgressContext";
import Dashboard from "./pages/Dashboard";
const Diagrams = lazy(() => import("./pages/Diagrams"));
const FinalAssessment = lazy(() => import("./pages/FinalAssessment"));
const PhasePage = lazy(() => import("./pages/PhasePage"));
const Lesson = lazy(() => import("./pages/LessonPage"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Review = lazy(() => import("./pages/Review"));
const Labs = lazy(() => import("./pages/Labs"));
const Interviews = lazy(() => import("./pages/Interviews"));
const Projects = lazy(() => import("./pages/Projects"));
const Glossary = lazy(() => import("./pages/Glossary"));
const Settings = lazy(() => import("./pages/Settings"));
export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Suspense
          fallback={
            <div className="loading" role="status">
              Opening your workspace…
            </div>
          }
        >
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="diagrams" element={<Diagrams />} />
              <Route path="assessment" element={<FinalAssessment />} />
              <Route path="phase/:id" element={<PhasePage />} />
              <Route path="lesson/:id" element={<Lesson />} />
              <Route path="labs" element={<Labs />} />
              <Route path="review" element={<Review />} />
              <Route path="interviews" element={<Interviews />} />
              <Route path="projects" element={<Projects />} />
              <Route path="glossary" element={<Glossary />} />
              <Route path="settings" element={<Settings />} />
              <Route
                path="*"
                element={
                  <div className="page">
                    <EmptyState
                      title="Page not found"
                      description="Return to the learning path to find your next lesson."
                    />
                  </div>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </ProgressProvider>
  );
}
