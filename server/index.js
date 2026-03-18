const express = require("express");
const path = require("path");
const fs = require("fs");
const quizRoutes = require("./routes/quizRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const clientDistPath = path.join(__dirname, "..", "client", "dist");

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
