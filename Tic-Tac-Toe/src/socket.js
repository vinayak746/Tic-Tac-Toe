import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://tic-tac-toe-3iod.onrender.com";
const socket = io(backendUrl, {
  autoConnect: false,
});

export default socket;
