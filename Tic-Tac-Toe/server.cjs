const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = require("socket.io")(3000, {
  cors: {
    origin: "*",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId, name, type }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.name = name;

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    // Avoid duplicate entries
    const isAlreadyInRoom = rooms[roomId].some(
      (player) => player.name === name
    );
    if (!isAlreadyInRoom) {
      rooms[roomId].push({ id: socket.id, name, type });
    }

    io.to(roomId).emit("roomUpdate", rooms[roomId]);
  });

  socket.on("startGame", (players) => {
    const roomId = socket.roomId;
    if (roomId) {
      io.to(roomId).emit("startGame", players);
    }
  });

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    const name = socket.name;
    if (roomId && rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((player) => player.name !== name);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit("roomUpdate", rooms[roomId]);
      }
    }
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
