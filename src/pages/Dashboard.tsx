import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  CheckCheck,
  Flame,
  Target,
  Check,
  Code2,
  FlaskConical,
  Compass,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { lessons, modules } from "../course";
import { useProgress } from "../state/ProgressContext";
import { mastery, moduleMastery, reviewIds, streak } from "../state/progress";
import { PhaseIcon, PageHeading } from "../components/Layout";
const groups = [
  {
    title: "Build your foundations",
    description: "Python, data, SQL, and statistical thinking.",
    phases: [0, 1, 2, 3, 4, 5],
    range: "PHASES 00–05",
    tone: "sage",
  },
  {
    title: "Engineer intelligent systems",
    description: "From machine learning to LLMs, RAG, and agents.",
    phases: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    range: "PHASES 06–22",
    tone: "blue",
  },
  {
    title: "Evaluate. Secure. Ship.",
    description: "AI quality, production systems, and your portfolio.",
    phases: Array.from({ length: 23 }, (_, i) => i + 23),
    range: "PHASES 23–45",
    tone: "sand",
  },
];
export default function Dashboard() {
  const { progress } = useProgress();
  const next =
    lessons.find(
      (l) => l.id === progress.lastLesson && !progress.lessons[l.id]?.complete,
    ) ??
    lessons.find((l) => !progress.lessons[l.id]?.complete) ??
    lessons[0];
  const completed = lessons.filter(
    (l) => progress.lessons[l.id]?.complete,
  ).length;
  const passed = lessons.filter(
    (l) => progress.lessons[l.id]?.exercise === "passed",
  ).length;
  const score = Math.round(
    lessons.reduce((s, l) => s + mastery(progress.lessons[l.id]), 0) /
      lessons.length,
  );
  const review = reviewIds(progress).length;
  const known = Object.values(progress.interviews).filter(
    (v) => v === "known",
  ).length;
  return (
    <div className="page dashboard">
      <PageHeading
        eyebrow="YOUR PATH TO AI QUALITY ENGINEERING"
        title={
          progress.name
            ? `Welcome back, ${progress.name.split(" ")[0]}.`
            : "A new chapter in your engineering journey."
        }
        description="Build on what you know. Learn what’s next. Engineer with confidence."
        action={
          <Link to="/roadmap" className="secondary">
            View learning path <ArrowUpRight size={16} />
          </Link>
        }
      />
      <section className="hero-card">
        <div className="hero-copy">
          <div className="hero-tag">
            <span /> LEARN BY BUILDING
          </div>
          <h2>
            From testing software.
            <br />
            To engineering <em>AI.</em>
          </h2>
          <p>
            A hands-on path from Python foundations to production AI systems.
            Built for the SDET mindset.
          </p>
          <Link to={"/lesson/" + next.id} className="hero-button">
            {completed ? "Continue learning" : "Start your journey"}
            <ArrowRight size={18} />
          </Link>
          <div className="hero-details">
            <span>
              <Check size={13} />
              No API keys needed
            </span>
            <span>
              <Check size={13} />
              Browser-based labs
            </span>
            <span>
              <Check size={13} />
              At your own pace
            </span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="visual-label label-code">
            <Code2 size={17} />
            BUILD
          </div>
          <div className="visual-label label-eval">
            <FlaskConical size={17} />
            EVALUATE
          </div>
          <div className="visual-label label-ship">
            <CheckCheck size={17} />
            SHIP
          </div>
          <div className="core-cube">
            <div className="cube-face cube-top" />
            <div className="cube-face cube-left" />
            <div className="cube-face cube-right" />
            <Sparkles size={34} />
          </div>
          <span className="visual-dot dot-one" />
          <span className="visual-dot dot-two" />
          <span className="visual-caption">
            THE NEXT EVOLUTION OF YOUR SKILLSET
          </span>
        </div>
      </section>
      <div className="stats-grid">
        {[
          {
            icon: Compass,
            label: "Course progress",
            value: `${Math.round((completed / lessons.length) * 100)}%`,
            caption: `${completed} / ${lessons.length} published lessons`,
            color: "sage",
          },
          {
            icon: CheckCheck,
            label: "Exercises completed",
            value: String(passed).padStart(2, "0"),
            caption: `${lessons.filter((l) => progress.lessons[l.id]?.exercise === "skipped").length} skipped · revisit anytime`,
            color: "blue",
          },
          {
            icon: Clock3,
            label: "Time invested",
            value: `${(progress.studySeconds / 3600).toFixed(1)}h`,
            caption: "Every session moves you forward",
            color: "sand",
          },
          {
            icon: Flame,
            label: "Learning streak",
            value: `${streak(progress.days)} days`,
            caption: "Consistency builds confidence",
            color: "rose",
          },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-top">
              <span>{s.label}</span>
              <span className={"stat-icon " + s.color}>
                <s.icon size={17} />
              </span>
            </div>
            <strong>{s.value}</strong>
            <small>{s.caption}</small>
          </div>
        ))}
      </div>
      <div className="dashboard-columns">
        <section>
          <div className="section-heading">
            <h2>Your next step</h2>
            <span className="subtle">A little progress, every day</span>
          </div>
          <Link to={"/lesson/" + next.id} className="next-card">
            <div className="next-icon">
              <PhaseIcon phase={next.phase} size={25} />
            </div>
            <div className="next-info">
              <div className="section-label">
                PHASE {String(next.phase).padStart(2, "0")} <span>·</span>{" "}
                {next.module.toUpperCase()}
              </div>
              <h3>{next.title}</h3>
              <p>{next.objectives[0]}.</p>
              <div className="lesson-meta">
                <Clock3 size={14} />
                {next.minutes} min<span>•</span>
                <Code2 size={14} />
                Interactive exercise
              </div>
            </div>
            <span className="round-arrow">
              <ArrowRight size={20} />
            </span>
          </Link>
          <div className="section-heading path-heading">
            <h2>The big picture</h2>
            <Link to="/roadmap">
              Explore all 46 phases <ArrowRight size={14} />
            </Link>
          </div>
          <div className="path-cards">
            {groups.map((g) => (
              <Link to="/roadmap" className="path-card" key={g.title}>
                <div className={"path-icon " + g.tone}>
                  <PhaseIcon phase={g.phases[1]} size={21} />
                </div>
                <div className="section-label">{g.range}</div>
                <h3>{g.title}</h3>
                <p>{g.description}</p>
                <div className="path-card-bottom">
                  <span>
                    {lessons.filter(l=>g.phases.includes(l.phase)).length + " lessons and checkpoints"}
                  </span>
                  <ArrowUpRight size={17} />
                </div>
              </Link>
            ))}
          </div>
          <section className="two-tracks">
            <div>
              <span className="section-label">
                TWO TRACKS. ONE STRONGER ENGINEER.
              </span>
              <h3>Test with AI. Test AI itself.</h3>
              <p>
                Use AI to improve your testing workflows, and apply your quality
                mindset to the systems you build.
              </p>
            </div>
            <Link to="/lesson/orientation">
              Understand the difference <ArrowRight size={16} />
            </Link>
          </section>
        </section>
        <aside className="dashboard-right">
          <section className="panel mastery-panel">
            <div className="section-heading">
              <h3>Your skill compass</h3>
              <Target size={18} />
            </div>
            <p className="subtle">Competency grows through practice.</p>
            <div
              className="mastery-circle"
              style={{ "--score": score + "%" } as React.CSSProperties}
            >
              <div>
                <strong>
                  {score}
                  <span>%</span>
                </strong>
                <small>overall mastery</small>
              </div>
            </div>
            {modules
              .filter((m) =>
                [
                  "Python fundamentals",
                  "Numerical computing",
                  "CI data analysis",
                  "Relational analysis",
                  "Statistics for quality",
                ].includes(m),
              )
              .map((m) => (
                <div className="skill-row" key={m}>
                  <div>
                    <span>
                      {
                        (
                          {
                            "Python fundamentals": "Python",
                            "Numerical computing": "NumPy",
                            "CI data analysis": "Data analysis",
                            "Relational analysis": "SQL",
                            "Statistics for quality": "Statistics",
                          } as Record<string, string>
                        )[m]
                      }
                    </span>
                    <strong>{moduleMastery(m, progress)}%</strong>
                  </div>
                  <div className="progress-bar">
                    <i style={{ width: moduleMastery(m, progress) + "%" }} />
                  </div>
                </div>
              ))}
            <Link to="/roadmap" className="panel-link">
              View subject mastery <ArrowRight size={15} />
            </Link>
          </section>
          <section className="review-panel">
            <div className="review-top">
              <span className="stat-icon sand">
                <Target size={18} />
              </span>
              <span className="badge">{review} to review</span>
            </div>
            <h3>Make your knowledge stick.</h3>
            <p>
              Revisit skipped exercises and concepts that need another look.
            </p>
            <Link to="/review">
              Review today <ArrowRight size={16} />
            </Link>
          </section>
          <Link to="/interviews" className="interview-teaser">
            <span className="section-label">BUILD CAREER CONFIDENCE</span>
            <h3>Think like an AI engineer.</h3>
            <p>
              {known} answers marked known. Practice explaining your decisions.
            </p>
            <span>
              Open interview center <ChevronRight size={15} />
            </span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
