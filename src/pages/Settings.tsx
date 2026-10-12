import { Link } from "react-router-dom";
import { completionGaps } from "../state/completion";
import { phases } from "../course";
import { useRef, useState } from "react";
import { Download, Upload, RotateCcw, ShieldCheck } from "lucide-react";
import { useProgress } from "../state/ProgressContext";
import { emptyProgress, validateProgress, mastery } from "../state/progress";
import { lessons } from "../course";
import { PageHeading } from "../components/Layout";
export default function Settings() {
  const { progress, setProgress } = useProgress();
  const [message, setMessage] = useState("");
  const [reset, setReset] = useState(false);
  const [pending, setPending] = useState<ReturnType<
    typeof validateProgress
  > | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const gaps = completionGaps(progress);
  const eligible = gaps.length===0;
  function exportProgress() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(progress, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-sdet-progress.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Progress backup exported.");
  }
  async function importFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    try {
      if (selected.size > 20_000_000)
        throw new Error("The backup exceeds the 20 MB limit.");
      setPending(validateProgress(JSON.parse(await selected.text())));
      setMessage("Backup validated. Review and confirm replacement below.");
    } catch (error) {
      setMessage("Import rejected: " + String(error));
    }
    event.target.value = "";
  }
  return (
    <div className="page settings-page">
      <PageHeading
        eyebrow="YOUR WORKSPACE. YOUR PROGRESS."
        title="Keep your learning with you."
        description="Everything is stored in your browser. Back it up, take it to another device, or start a fresh chapter."
      />
      <section className="panel settings-card">
        <h2>Learner profile</h2>
        <label htmlFor="learner-name">
          Your name
          <input
            id="learner-name"
            maxLength={200}
            value={progress.name}
            onChange={(e) =>
              setProgress((p) => ({ ...p, name: e.target.value }))
            }
            placeholder="How should we greet you?"
          />
        </label>
        <p className="fine">
          Used locally for your dashboard and course completion record.
        </p>
      </section>
      <section className="panel settings-card">
        <h2>Portable progress</h2>
        <p>
          Export lessons, exercises, hints, assessments, notes, bookmarks, study
          time, and project progress as JSON.
        </p>
        <div className="exercise-actions">
          <button className="primary" onClick={exportProgress}>
            <Download size={16} />
            Export progress
          </button>
          <button className="secondary" onClick={() => file.current?.click()}>
            <Upload size={16} />
            Import progress
          </button>
          <input
            ref={file}
            className="sr-only"
            type="file"
            accept="application/json,.json"
            aria-label="Import progress file"
            onChange={(e) => void importFile(e)}
          />
        </div>
        {pending && (
          <div className="hint-box">
            <p>
              This backup has {Object.keys(pending.lessons).length} lesson
              records and belongs to {pending.name || "an unnamed learner"}.
              Importing replaces the current progress.
            </p>
            <button
              className="primary"
              onClick={() => {
                setProgress(pending);
                setPending(null);
                setMessage("Progress imported successfully.");
              }}
            >
              Replace with validated backup
            </button>
            <button className="text-button" onClick={() => setPending(null)}>
              Cancel
            </button>
          </div>
        )}
        {message && <p role="status">{message}</p>}
      </section>
      <section className="panel settings-card">
        <h2>Achievements</h2>
        <div className="achievement-grid">
          {phases.map(p=>p.id).map((phase) => {
            const unlocked = lessons
              .filter((l) => l.phase === phase)
              .every((l) => mastery(progress.lessons[l.id]) >= 85);
            return (
              <div
                key={phase}
                className={"achievement " + (unlocked ? "unlocked" : "")}
              >
                <ShieldCheck size={23} />
                <span>
                  {
                    [
                      "Orientation complete",
                      "Python foundations",
                      "NumPy practitioner",
                      "CI data analyst",
                      "SQL practitioner",
                      "Evaluation statistics",
                    ][phase] ?? phases[phase].title
                  }
                </span>
                <small>{unlocked ? "Earned" : "85% mastery required"}</small>
              </div>
            );
          })}
        </div>
      </section>
      <section className="panel settings-card">
        <h2>Course completion certificate</h2>
        <p>
          Available after 85% mastery with passed exercises and checkpoints, all five capstone evidence entries, and the final applied assessment. This is a course completion certificate generated by this application. It is not an accredited certification.
        </p>
        <button
          className="secondary"
          disabled={!eligible || !progress.name.trim()}
          onClick={() => window.print()}
        >
          <Download size={16} />
          Print completion certificate
        </button>
        <Link className="secondary" to="/assessment">Final applied assessment</Link><ul>{gaps.map(g=><li key={g}>{g}</li>)}</ul>
        {eligible && <div className="certificate">
          <h1>AI Engineering for SDET</h1>
          <h2>Applied AI & AI Quality Engineering</h2>
          <p>{progress.name}</p>
          <p>
            {new Date().toLocaleDateString()} ·{" "}
            {Math.round(
              lessons.reduce((s, l) => s + mastery(progress.lessons[l.id]), 0) /
                lessons.length,
            )}
            % course mastery
          </p>
          <p>{progress.projects.length} capstone evidence entries · Final assessment {progress.finalAssessment?.score ?? 0}/100</p>
          <p>
            Course completion artifact generated locally by this application.
            Not an accredited certification. Learner-reported portfolio evidence.
          </p>
        </div>}
      </section>
      <section className="panel settings-card">
        <h2>Start over</h2>
        <p>
          Reset removes all saved progress on this device. Export a backup first
          if you want to keep it.
        </p>
        {reset ? (
          <div className="hint-box">
            <p>
              Confirm that you want to clear lessons, notes, assessments, and
              project progress.
            </p>
            <button
              className="danger-button"
              onClick={() => {
                setProgress(emptyProgress());
                setReset(false);
                setMessage("Progress reset.");
              }}
            >
              Confirm reset
            </button>
            <button className="text-button" onClick={() => setReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="secondary" onClick={() => setReset(true)}>
            <RotateCcw size={16} />
            Reset progress
          </button>
        )}
      </section>
    </div>
  );
}
