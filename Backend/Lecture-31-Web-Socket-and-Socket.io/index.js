const express = require("express");
const app = express();

// getting the socket.io
const { Server } = require("socket.io");

const http = require("http");
const path = require("path");

const expressServer = http.createServer(app);
const io = new Server(expressServer);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  // ...

  // Sending the message to all those who are connected to the server.
  // socket.on("message", (data) => {
  //   socket.broadcast.emit("new-message", data); // using this you will not see your messges reflecting back to you.
  //   // io.emit("new-message", data);
  // });

  socket.on("message", ({ room, msg }) => {
    socket.to(room).emit("new-message", msg);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("Diconnect from the server!");
  });
});

expressServer.listen(3000, () => {
  console.log("App is listening at 3000!");
});

// But the below is not the best way of writing this.

// const expressServer = app.listen(3000, () => {
//   console.log("App is listening at 3000!");
// });

// // for the upgradation of the normal server to the websocket.io, we have to do:

// const io = new Server(expressServer);
