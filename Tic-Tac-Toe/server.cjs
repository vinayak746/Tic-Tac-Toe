const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", ({ roomId, name, type }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    const player = { id: socket.id, name, type };
    rooms[roomId].push(player);
    console.log(`Player ${name} (${type}) joined room ${roomId}`);

    io.to(roomId).emit("roomUpdate", rooms[roomId]);
  });

  socket.on("startGame", (roomId) => {
    console.log(`Game started in room ${roomId}`);
    io.to(roomId).emit("startGame");
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const prevLength = rooms[roomId].length;
      rooms[roomId] = rooms[roomId].filter((p) => p.id !== socket.id);

      if (rooms[roomId].length !== prevLength) {
        io.to(roomId).emit("roomUpdate", rooms[roomId]);
        console.log(`Player disconnected from room ${roomId}`);
      }

      // Clean up empty rooms
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }

    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
