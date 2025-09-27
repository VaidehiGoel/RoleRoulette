import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Load traits.json (make sure this file exists in backend/)
const traits = JSON.parse(fs.readFileSync("./traits.json", "utf-8"));

// Helper → pick random item
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// API → Generate Identity Card
app.get("/api/generate", (req, res) => {
  const identity = {
    id: Date.now(),
    hackerName: getRandom(traits.hackerNames),   // ✅ added hackerNames
    personality: getRandom(traits.personality),
    profession: getRandom(traits.profession),
    hobby: getRandom(traits.hobby),
    quirk: getRandom(traits.quirk)
  };

  res.json(identity);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
