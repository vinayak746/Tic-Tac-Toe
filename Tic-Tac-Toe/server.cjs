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
const rooms = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId, name, type }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.name = name;

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

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

  // Handle player moves
  socket.on("playerMove", ({ roomId, move }) => {
    if (roomId) {
      // Broadcast the move to other players in the room
      socket.to(roomId).emit("playerMove", move);
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

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
