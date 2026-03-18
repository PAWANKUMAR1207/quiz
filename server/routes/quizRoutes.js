const express = require("express");
const questions = require("../questions");
const { getAllSubmissions, saveSubmission } = require("../data/store");

const router = express.Router();

const requestBuckets = new Map();

function sortLeaderboard(entries) {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
  });
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}

function rateLimit({ key, windowMs, maxRequests, message }) {
  return (req, res, next) => {
    const bucketKey = `${key}:${getClientIp(req)}`;
    const now = Date.now();
    const current = requestBuckets.get(bucketKey);

    if (!current || now >= current.resetAt) {
      requestBuckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (current.count >= maxRequests) {
      res.status(429).json({ message });
      return;
    }

    current.count += 1;
    next();
  };
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function shuffled(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

router.get(
  "/questions",
  rateLimit({
    key: "questions",
    windowMs: 60 * 1000,
    maxRequests: 400,
    message: "Too many question requests. Please slow down and try again.",
  }),
  (req, res) => {
  const randomized = shuffled(questions).map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
  }));
  res.json(randomized);
  }
);

router.post(
  "/submit",
  rateLimit({
    key: "submit",
    windowMs: 60 * 1000,
    maxRequests: 80,
    message: "Too many submissions from this network. Please wait a minute and try again.",
  }),
  (req, res) => {
  const { name, answers, attemptId } = req.body || {};
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const normalizedAttemptId =
    typeof attemptId === "string" ? attemptId.trim() : "";

  if (!trimmedName) {
    return res.status(400).json({ message: "Name is required." });
  }
  if (trimmedName.length > 30) {
    return res.status(400).json({ message: "Name must be 30 characters or fewer." });
  }
  if (!/^[a-zA-Z0-9 _-]+$/.test(trimmedName)) {
    return res.status(400).json({ message: "Name contains unsupported characters." });
  }
  if (!normalizedAttemptId || normalizedAttemptId.length > 80) {
    return res.status(400).json({ message: "Attempt ID is required." });
  }
  if (!isPlainObject(answers)) {
    return res.status(400).json({ message: "Answers are required." });
  }
  if (Object.keys(answers).length > questions.length) {
    return res.status(400).json({ message: "Too many answers were submitted." });
  }

  const submissions = getAllSubmissions();
  const existing = submissions.find((entry) => entry.attemptId === normalizedAttemptId);

  if (existing) {
    return res.json({
      attemptId: existing.attemptId,
      name: existing.name,
      score: existing.score,
      total: existing.total,
      alreadySubmitted: true,
      message: "Duplicate submission blocked.",
    });
  }

  let score = 0;
  for (const question of questions) {
    const selected = answers[question.id];
    if (Number(selected) === question.answer) {
      score += 1;
    }
  }

  const entry = {
    attemptId: normalizedAttemptId,
    name: trimmedName,
    score,
    total: questions.length,
    submittedAt: new Date().toISOString(),
  };

  saveSubmission(entry);

  return res.status(201).json({
    attemptId: entry.attemptId,
    name: entry.name,
    score: entry.score,
    total: entry.total,
    alreadySubmitted: false,
    message: "Submission accepted.",
  });
  }
);

router.get("/leaderboard", (req, res) => {
  const leaderboard = sortLeaderboard(getAllSubmissions()).slice(0, 10);
  res.json(leaderboard);
});

module.exports = router;
