import { MechanismDemo } from "./MechanismDemo";
import { useState } from "react";
export function LessonDemo({ id, demo }: { id: string; demo?: string }) {
  const [x, setX] = useState(2);
  const [y, setY] = useState(1);
  const [outlier, setOutlier] = useState(900);
  if (id === "numpy-cosine" || demo === "cosine") {
    const norm = Math.hypot(x, y);
    const score = norm ? x / norm : null;
    return (
      <section className="demo-card">
        <div className="section-label">EXPLORE THE GEOMETRY</div>
        <h3>Same magnitude? Same direction?</h3>
        <p>
          Compare a fixed vector [1, 0] with your vector [x, y]. Move the
          coordinates and watch the cosine change.
        </p>
        <div className="vector-demo">
          <svg
            viewBox="0 0 240 200"
            role="img"
            aria-label={`Vector x ${x}, y ${y}; cosine ${score?.toFixed(3) ?? "undefined"}`}
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0 0L6 3L0 6" fill="#64864d" />
              </marker>
            </defs>
            <path d="M20 100H220M120 10V190" stroke="#d2dec7" />
            <circle
              cx="120"
              cy="100"
              r="72"
              fill="none"
              stroke="#e1ead7"
              strokeDasharray="4 4"
            />
            <path
              d="M120 100L156 100"
              stroke="#95ad83"
              strokeWidth="3"
              markerEnd="url(#arrow)"
            />
            <path
              d={`M120 100L${120 + x * 18} ${100 - y * 18}`}
              stroke="#315443"
              strokeWidth="3"
              markerEnd="url(#arrow)"
            />
            <text x="164" y="94" fontSize="10" fill="#728e60">
              [1, 0]
            </text>
            <text x="20" y="190" fontSize="10" fill="#728e60">
              direction matters
            </text>
          </svg>
          <div>
            <label>
              x = {x}
              <input
                type="range"
                min={-4}
                max={4}
                step={0.5}
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
              />
            </label>
            <label>
              y = {y}
              <input
                type="range"
                min={-4}
                max={4}
                step={0.5}
                value={y}
                onChange={(e) => setY(Number(e.target.value))}
              />
            </label>
            <div className="demo-score">
              {score?.toFixed(3) ?? "Undefined"}
              <small>cosine similarity</small>
            </div>
            <p className="fine">
              {norm === 0
                ? "The zero vector has no direction."
                : score === 1
                  ? "Changing positive x with y=0 preserves direction."
                  : "Cosine compares the angle, not raw vector length."}
            </p>
          </div>
        </div>
      </section>
    );
  }
  if (id === "stats-descriptive") {
    const mean = (100 + 110 + 120 + 125 + outlier) / 5;
    return (
      <section className="demo-card">
        <div className="section-label">EXPLORE THE DISTRIBUTION</div>
        <h3>One slow request changes the story.</h3>
        <p>
          Four requests take 100, 110, 120, and 125 ms. Adjust the fifth and
          compare the summaries.
        </p>
        <label className="outlier-slider">
          Fifth request: {outlier} ms
          <input
            type="range"
            min={125}
            max={2000}
            step={25}
            value={outlier}
            onChange={(e) => setOutlier(Number(e.target.value))}
          />
        </label>
        <div className="demo-metrics">
          <div>
            <strong>{mean.toFixed(0)} ms</strong>
            <span>mean</span>
          </div>
          <div>
            <strong>120 ms</strong>
            <span>median</span>
          </div>
        </div>
        <p className="fine">
          The median stays fixed while the mean moves. Neither alone describes
          the full tail.
        </p>
      </section>
    );
  }
  return demo ? <MechanismDemo kind={demo} /> : null;
}
