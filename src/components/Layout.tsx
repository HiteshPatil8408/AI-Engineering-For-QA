import { lazy, Suspense, useEffect, useState } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  LayoutDashboard,
  Route,
  FlaskConical,
  MessagesSquare,
  FolderKanban,
  BookOpen,
  RotateCcw,
  Settings2,
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { phases, lessons } from "../course";
import { useProgress } from "../state/ProgressContext";
import { reviewIds } from "../state/progress";
import { PhaseIcon } from "./Icons";
const SearchDialog = lazy(() => import("./SearchDialog").then(m=>({default:m.SearchDialog})));
const nav = [
  ["/", "Overview", LayoutDashboard],
  ["/roadmap", "Learning path", Route],
  ["/labs", "Practice labs", FlaskConical],
  ["/interviews", "Interview center", MessagesSquare],
  ["/projects", "Portfolio projects", FolderKanban],
  ["/glossary", "Glossary", BookOpen],
  ["/review", "Review today", RotateCcw],
] as const;
export function Layout() {
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [expanded, setExpanded] = useState<number[]>([0, 1]);
  const { progress, storageError } = useProgress();
  const location = useLocation();
  useEffect(() => {
    setMobile(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === "Escape") {
        setSearch(false);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const completed = lessons.filter(
    (l) => progress.lessons[l.id]?.complete,
  ).length;
  const percent = Math.round((completed / lessons.length) * 100);
  const review = reviewIds(progress).length;
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      {mobile && (
        <button
          className="nav-overlay"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        className={"sidebar " + (mobile ? "mobile-open" : "")}
        aria-label="Main navigation"
      >
        <Link to="/" className="brand">
          <span className="brand-mark">
            <LayersLogo />
          </span>
          <span>
            AI Engineering<span className="brand-sub">FOR SDET</span>
          </span>
        </Link>
        <div className="sidebar-scroll">
          <div className="workspace-label">YOUR ENGINEERING WORKSPACE</div>
          <nav className="main-nav">
            {nav.map(([path, label, Icon]) => (
              <NavLink key={path} to={path} end={path === "/"}>
                <Icon size={18} />
                <span>{label}</span>
                {label === "Review today" && review > 0 && (
                  <span className="nav-count">{review}</span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-divider" />
          <div className="sidebar-heading">
            COURSE CONTENT{" "}
            <Link to="/roadmap" aria-label="View all phases">
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <nav className="course-nav">
            {phases.map((phase) => (
              <div key={phase.id}>
                <button
                  className="phase-toggle"
                  aria-expanded={expanded.includes(phase.id)}
                  onClick={() =>
                    setExpanded((e) =>
                      e.includes(phase.id)
                        ? e.filter((x) => x !== phase.id)
                        : [...e, phase.id],
                    )
                  }
                >
                  <span className="phase-number">
                    {String(phase.id).padStart(2, "0")}
                  </span>
                  <span>
                    {
                      [
                        "Orientation",
                        "Python foundations",
                        "NumPy & vectors",
                        "Pandas & analysis",
                        "SQL for engineers",
                        "Statistics & experiments",
                      ][phase.id] ?? phase.title
                    }
                  </span>
                  {expanded.includes(phase.id) ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
                {expanded.includes(phase.id) && (
                  <div className="lesson-nav">
                    {[
                      ...new Set(
                        lessons
                          .filter((l) => l.phase === phase.id)
                          .map((l) => l.module),
                      ),
                    ].map((module) => (
                      <details key={module} open>
                        <summary>{module}</summary>
                        {lessons
                          .filter(
                            (l) => l.phase === phase.id && l.module === module,
                          )
                          .map((l) => (
                            <NavLink to={"/lesson/" + l.id} key={l.id}>
                              <span
                                className={
                                  "lesson-dot " +
                                  (progress.lessons[l.id]?.complete
                                    ? "done"
                                    : "")
                                }
                              />
                              {l.title}
                            </NavLink>
                          ))}
                      </details>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="sidebar-bottom">
          <div className="progress-mini">
            <div>
              <strong>Your learning progress</strong>
              <span>{percent}%</span>
            </div>
            <div className="progress-bar">
              <i style={{ width: percent + "%" }} />
            </div>
            <small>
              {completed} of {lessons.length} published lessons
            </small>
          </div>
          <NavLink to="/settings" className="settings-link">
            <Settings2 size={17} />
            Progress & settings
          </NavLink>
          <div className="profile">
            <span className="avatar">
              {progress.name ? progress.name.slice(0, 2).toUpperCase() : "ME"}
            </span>
            <div>
              <strong>{progress.name || "Your personal workspace"}</strong>
              <small>Learn at your own pace</small>
            </div>
            <Leaf size={17} />
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              className="mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu size={21} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>
              {location.pathname === "/"
                ? "Overview"
                : location.pathname.startsWith("/lesson")
                  ? "Course lesson"
                  : (nav.find((x) => x[0] === location.pathname)?.[1] ??
                    "Settings")}
            </strong>
          </div>
          <div className="header-actions">
            <button
              aria-label="Search anything"
              className="search-trigger"
              onClick={() => setSearch(true)}
            >
              <Search size={16} />
              <span>Search anything</span>
              <kbd>⌘ K</kbd>
            </button>
            <span className="safe-mode">
              <span />
              Static safe mode
            </span>
            <Link
              to="/settings"
              className="header-avatar"
              aria-label="Learner settings"
            >
              {progress.name ? progress.name.slice(0, 1) : "S"}
            </Link>
          </div>
        </header>
        {storageError && (
          <div role="alert" className="storage-warning">
            Browser storage is unavailable. Export your progress before leaving
            this page.
          </div>
        )}
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="footer">
          <span>
            <ShieldCheck size={14} />
            Your progress stays on this device.
          </span>
          <span>Built for engineers who care about quality.</span>
        </footer>
      </div>
      {search && <Suspense fallback={<div role="status">Loading search…</div>}><SearchDialog onClose={() => setSearch(false)} /></Suspense>}
    </div>
  );
}
function LayersLogo() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12.5 3 3 8.5l9.5 5.5 9.5-5.5L12.5 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m3 13 9.5 5.5L22 13M3 17.5l9.5 5.5 9.5-5.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state">
      <BookOpen size={30} />
      <h3>{title}</h3>
      <p>{description}</p>
      <Link className="secondary" to="/roadmap">
        Explore the learning path <ArrowRight size={16} />
      </Link>
    </div>
  );
}
export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="icon-button" onClick={onClick} aria-label="Close">
      <X size={20} />
    </button>
  );
}
export { PhaseIcon };
