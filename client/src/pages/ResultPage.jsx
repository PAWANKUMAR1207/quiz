import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../config";
import { getLocalItem, getSessionItem } from "../utils/storage";

export default function ResultPage() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [boardError, setBoardError] = useState("");

  const resultRaw = getSessionItem("quizResult");
  const result = resultRaw ? JSON.parse(resultRaw) : null;
  const placement =
    result && leaderboard.length
      ? leaderboard.findIndex((entry) => entry.attemptId === result.attemptId) + 1
      : 0;

  useEffect(() => {
    const username = getLocalItem("quizUsername");
    if (!username) {
      navigate("/");
      return;
    }

    fetch(apiUrl("/leaderboard"))
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load leaderboard.");
        return res.json();
      })
      .then((data) => {
        setLeaderboard(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setBoardError(err.message);
      })
      .finally(() => {
        setLoadingBoard(false);
      });
  }, [navigate]);

  return (
    <main className="page-shell">
      <section className="result-layout">
        <div className="result-summary card-shell">
          <div>
            <p className="eyebrow">Mission Complete</p>
            <h1>Run summary</h1>

            {result ? (
              <>
                <div className="score-orb">
                  <span className="score-value">{result.score}</span>
                  <span className="score-total">/ {result.total}</span>
                </div>

                <div className="result-meta-grid">
                  <div className="result-meta-card">
                    <span className="result-label">Pilot</span>
                    <span className="result-data">{result.name}</span>
                  </div>
                  <div className="result-meta-card">
                    <span className="result-label">Leaderboard</span>
                    <span className="result-data">{placement ? `#${placement}` : "Pending"}</span>
                  </div>
                </div>

                <p className="note">
                  {result.alreadySubmitted
                    ? "This name had already been used, so the previous score was preserved."
                    : "Submission accepted and pushed to the live board."}
                </p>
              </>
            ) : (
              <p className="error">Result not found. Please attempt the quiz first.</p>
            )}
          </div>

          <div className="quiz-actions">
            <Link className="button-link" to="/">
              Run Again
            </Link>
          </div>
        </div>

        <div className="leaderboard-shell card-shell">
          <div className="leaderboard-header">
            <div>
              <p className="eyebrow">Global Board</p>
              <h2>Top 10 operators</h2>
            </div>
          </div>

          {loadingBoard ? (
            <p className="subtitle">Loading leaderboard...</p>
          ) : boardError ? (
            <p className="error">{boardError}</p>
          ) : leaderboard.length ? (
            <ol className="leaderboard-list">
              {leaderboard.map((entry, index) => (
                <li className="leaderboard-row" key={`${entry.name}-${entry.submittedAt}`}>
                  <span className="leaderboard-rank">#{index + 1}</span>
                  <span className="leaderboard-name">{entry.name}</span>
                  <span className="leaderboard-score">
                    {entry.score}/{entry.total}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="subtitle">No submissions yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
