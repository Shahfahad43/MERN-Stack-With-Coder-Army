const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static("public"));

// Socket.io signaling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const relay = (event) => {
    socket.on(event, (data) => {
      socket.broadcast.emit(event, data);
    });
  };

  relay("offer");
  relay("answer");
  relay("candidate");
  relay("reject");

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
