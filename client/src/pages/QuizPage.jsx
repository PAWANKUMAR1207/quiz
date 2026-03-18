import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalItem, getOrCreateLocalItem, setSessionItem } from "../utils/storage";

const QUIZ_SECONDS = 10 * 60;

export default function QuizPage() {
  const navigate = useNavigate();
  const username = useMemo(() => getLocalItem("quizUsername"), []);
  const attemptId = useMemo(
    () => getOrCreateLocalItem("quizAttemptId", () => createAttemptId()),
    []
  );

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(QUIZ_SECONDS);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }

    let active = true;
    fetch("/questions")
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load quiz questions.");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setQuestions(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate, username]);

  const submitQuiz = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, answers, attemptId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit quiz.");
      }
      setSessionItem("quizResult", JSON.stringify(data));
      navigate("/result");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }, [answers, attemptId, navigate, submitting, username]);

  useEffect(() => {
    if (loading || !questions.length || submitting) return undefined;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, questions.length, submitQuiz, submitting]);

  const question = questions[currentIndex];
  const selected = question ? answers[question.id] : undefined;
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length
    ? Math.round(((currentIndex + 1) / questions.length) * 100)
    : 0;

  const onSelect = (optionIndex) => {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const next = async () => {
    if (!question) return;
    if (selected === undefined) {
      setError("Please select an option to continue.");
      return;
    }

    setError("");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    await submitQuiz();
  };

  const previous = () => {
    setError("");
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  if (loading) {
    return (
      <main className="page-shell">
        <section className="quiz-layout">
          <div className="quiz-main card-shell status-shell">
            <p className="eyebrow">Live Mission</p>
            <h1>Loading question set...</h1>
            <p className="subtitle">Syncing the challenge board and preparing the timer.</p>
          </div>
        </section>
      </main>
    );
  }

  if (!questions.length) {
    return (
      <main className="page-shell">
        <section className="quiz-layout">
          <div className="quiz-main card-shell status-shell">
            <p className="eyebrow">Live Mission</p>
            <h1>Quiz unavailable</h1>
            <p className="error">{error || "No questions available."}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="quiz-layout">
        <aside className="quiz-sidebar card-shell">
          <p className="eyebrow">Mission Control</p>
          <h1>DevOps Sprint</h1>
          <p className="sidebar-copy">
            {username ? `Operator: ${username}` : "Stay sharp. One attempt only."}
          </p>

          <div className="stat-stack">
            <div className="stat-card accent-teal">
              <span className="stat-label">Time Left</span>
              <span className="stat-value">{formatTime(secondsLeft)}</span>
            </div>
            <div className="stat-card accent-orange">
              <span className="stat-label">Answered</span>
              <span className="stat-value">
                {answeredCount}/{questions.length}
              </span>
            </div>
          </div>

          <div className="progress-meta">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <p className="sidebar-note">
            Choose one answer per question. The timer auto-submits when it hits zero.
          </p>
        </aside>

        <div className="quiz-main card-shell">
          <div className="quiz-topline">
            <div>
              <p className="eyebrow">Question {currentIndex + 1}</p>
              <p className="question-counter">of {questions.length} total prompts</p>
            </div>
            <div className="timer-chip">{formatTime(secondsLeft)}</div>
          </div>

          <h2 className="question-title">{question.question}</h2>

          <div className="options-grid">
            {question.options.map((option, optionIndex) => (
              <label
                className={`answer-card ${selected === optionIndex ? "selected" : ""}`}
                key={option}
              >
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  checked={selected === optionIndex}
                  onChange={() => onSelect(optionIndex)}
                />
                <span className="answer-index">{String.fromCharCode(65 + optionIndex)}</span>
                <span className="answer-copy">{option}</span>
              </label>
            ))}
          </div>

          {error ? <p className="error inline-error">{error}</p> : null}

          <div className="quiz-actions split-actions">
            <button
              type="button"
              className="ghost-button"
              disabled={currentIndex === 0 || submitting}
              onClick={previous}
            >
              Previous
            </button>
            <button type="button" disabled={submitting} onClick={next}>
              {submitting
                ? "Submitting..."
                : currentIndex === questions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function createAttemptId() {
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatTime(totalSeconds) {
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}
