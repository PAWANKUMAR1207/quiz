const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname);
const dataFilePath = path.join(dataDir, "quiz-data.json");

function ensureStoreFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify({ submissions: [] }, null, 2),
      "utf8"
    );
  }
}

function readStore() {
  ensureStoreFile();

  try {
    const raw = fs.readFileSync(dataFilePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.submissions)) {
      return { submissions: [] };
    }
    return parsed;
  } catch {
    return { submissions: [] };
  }
}

function writeStore(data) {
  ensureStoreFile();
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

function getAllSubmissions() {
  return readStore().submissions;
}

function saveSubmission(entry) {
  const store = readStore();
  store.submissions.push(entry);
  writeStore(store);
}

module.exports = {
  getAllSubmissions,
  saveSubmission,
};
