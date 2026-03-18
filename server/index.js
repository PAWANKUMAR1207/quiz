const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const quizRoutes = require("./routes/quizRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const clientDistPath = path.join(__dirname, "..", "client", "dist");
const frontendOrigin = (
  process.env.FRONTEND_ORIGIN || "https://quiz-2-9px8.onrender.com"
).trim();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !frontendOrigin || origin === frontendOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use("/", quizRoutes);

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Frontend build not found. Run client with 'npm run dev' or build with 'npm run build'.",
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
