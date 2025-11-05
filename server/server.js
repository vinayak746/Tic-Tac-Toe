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
    if (!roomId) return;

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
    socket.type = type;

    if (!isAlreadyInRoom) {
      rooms[roomId].push({ id: socket.id, name, type });
    }

    // Notify joining player and everyone in the room
    socket.emit("roomJoined", { roomId, players: rooms[roomId] });
    io.to(roomId).emit("roomUpdate", rooms[roomId]);
  });

  socket.on("startGame", () => {
    const roomId = socket.roomId;
    if (roomId && rooms[roomId] && rooms[roomId].length === 2) {
      // Assign symbols deterministically: host -> X, other -> O
      const players = rooms[roomId];
      const hostIndex = players.findIndex((p) => p.type === "host");
      const first = hostIndex >= 0 ? players[hostIndex] : players[0];
      const second = players.find((p) => p.id !== first.id);

      // attach symbols (do not overwrite if already set)
      players.forEach((p) => {
        if (p.id === first.id) p.symbol = "X";
        if (second && p.id === second.id) p.symbol = "O";
      });

      io.to(roomId).emit("startGame", players);
    } else {
      socket.emit("error", { message: "Cannot start game: need 2 players." });
    }
  });

  // Accept flexible payloads: { index, symbol, squares } etc.
  socket.on("playerMove", (payload) => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;

    // compute nextTurn as the other player's socket id (if present)
    const other = rooms[roomId].find((p) => p.id !== socket.id);
    const nextTurn = other ? other.id : null;

    // Broadcast to the whole room (clients can ignore moves from themselves by checking fromSocket)
    io.to(roomId).emit("playerMove", {
      ...payload,
      fromSocket: socket.id,
      nextTurn,
    });
  });

  // allow explicit leaving
  socket.on("leaveRoom", () => {
    const roomId = socket.roomId;
    if (roomId && rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((p) => p.id !== socket.id);
      socket.leave(roomId);
      delete socket.roomId;
      delete socket.name;
      delete socket.type;
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit("roomUpdate", rooms[roomId]);
      }
    }
  });

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    const name = socket.name;

    if (roomId && rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((p) => p.id !== socket.id);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit("roomUpdate", rooms[roomId]);
      }
    }

    console.log(`🔌 Disconnected: ${socket.id} ${name || ""}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
