import { Server } from "socket.io";

const io = new Server(9000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userData, socketId) => {
  if (!userData?.sub) return;
  // Agar user pehle se array mein hai toh uski socketId update karo, warna naya add karo:
  const existingIndex = users.findIndex((user) => user.sub === userData.sub);
  if (existingIndex !== -1) {
    users[existingIndex].socketId = socketId;
  } else {
    users.push({ ...userData, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.sub === userId);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", (data) => {
    const user = getUser(data.recieverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", data);
    } else {
      console.log("Receiver offline ya nahi mila:", data.recieverId);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
