import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLocalItem,
  getOrCreateLocalItem,
  removeSessionItem,
  setLocalItem,
} from "../utils/storage";

export default function HomePage() {
  const navigate = useNavigate();
  const [name, setName] = useState(() => getLocalItem("quizUsername"));
  const [error, setError] = useState("");

  const startQuiz = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name before starting.");
      return;
    }

    setLocalItem("quizUsername", trimmed);
    getOrCreateLocalItem("quizAttemptId", () => createAttemptId());
    removeSessionItem("quizResult");
    setError("");
    navigate("/quiz");
  };

  return (
    <main className="page-shell page-home">
      <section className="hero-grid">
        <div className="hero-panel hero-copy">
          <div>
            <p className="eyebrow">Cloud + DevOps Arena</p>
            <h1>Ship fast. Debug under pressure. Prove the fundamentals.</h1>
            <p className="subtitle">
              A timed challenge built around Docker, Kubernetes, Linux, AWS, and CI/CD.
              You get one submission, one leaderboard slot, and ten minutes to land clean.
            </p>
          </div>

          <div className="hero-metrics">
            <div className="metric-tile">
              <span className="metric-value">20</span>
              <span className="metric-label">Questions</span>
            </div>
            <div className="metric-tile">
              <span className="metric-value">10m</span>
              <span className="metric-label">Countdown</span>
            </div>
            <div className="metric-tile">
              <span className="metric-value">Top 10</span>
              <span className="metric-label">Leaderboard</span>
            </div>
          </div>
        </div>

        <div className="hero-panel launch-panel">
          <div className="panel-badge">Enter The Queue</div>
          <h2 className="panel-title">Start your run</h2>
          <p className="panel-copy">
            Your name locks your submission. Use the same one you want shown on the leaderboard.
          </p>

          <label htmlFor="username">Pilot name</label>
          <input
            id="username"
            type="text"
            maxLength={30}
            placeholder="e.g. KubeNinja"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button type="button" onClick={startQuiz}>
            Launch Quiz
          </button>
          {error ? <p className="error">{error}</p> : null}

          <div className="panel-footer">
            <span>Single attempt per name</span>
            <span>Live scoring on submit</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function createAttemptId() {
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
