const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const traits = require("./traits.json");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Random identity generator
function generateIdentity() {
  return {
    age: traits.age[Math.floor(Math.random() * traits.age.length)],
    job: traits.job[Math.floor(Math.random() * traits.job.length)],
    personality: traits.personality[Math.floor(Math.random() * traits.personality.length)],
    quirk: traits.quirk[Math.floor(Math.random() * traits.quirk.length)],
  };
}

app.get("/generate", (req, res) => {
  res.json(generateIdentity());
});

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Backend running on http://localhost:5000"));

// Simple root route (just for testing backend is working)
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

