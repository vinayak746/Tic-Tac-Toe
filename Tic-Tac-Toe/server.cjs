const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// In-memory room tracking
const rooms = {};

io.on("connection", (socket) => {
  console.log(`🔌 New connection: ${socket.id}`);

  socket.on("joinRoom", ({ roomId, name, type }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    const isAlreadyInRoom = rooms[roomId].some(
      (player) => player.id === socket.id
    );
    const isRoomFull = rooms[roomId].length >= 2;

    if (isRoomFull && !isAlreadyInRoom) {
      socket.emit("error", { message: "Room is full." });
      return;
    }

    socket.join(roomId);
    socket.roomId = roomId;
    socket.name = name;

    if (!isAlreadyInRoom) {
      rooms[roomId].push({ id: socket.id, name, type });
    }

    // Notify joining player
    socket.emit("roomJoined", { roomId, players: rooms[roomId] });

    // Notify everyone in room
    io.to(roomId).emit("roomUpdate", rooms[roomId]);
  });

  socket.on("startGame", () => {
    const roomId = socket.roomId;
    if (roomId && rooms[roomId]) {
      io.to(roomId).emit("startGame", rooms[roomId]);
    }
  });

  socket.on("playerMove", ({ move }) => {
    const roomId = socket.roomId;
    if (roomId) {
      // Send move to the opponent only
      socket.to(roomId).emit("playerMove", move);
    }
  });

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    const name = socket.name;

    if (roomId && rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((player) => player.id !== socket.id);

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit("roomUpdate", rooms[roomId]);
      }
    }

    console.log(`❌ Disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
