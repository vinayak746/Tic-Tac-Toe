// Multiplayer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MultiplayerSetup() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  function generateRoomID() {
    return Math.random().toString(36).substring(2, 8);
  }

  function handleCreateRoom(e) {
    e.preventDefault();
    const trimmedName = name.trim() || "Player 1";
    const roomId = generateRoomID();
    navigate(`/lobby?room=${roomId}&name=${trimmedName}&type=host`);
  }

  function handleJoinRoom(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedRoom = room.trim();

    if (!trimmedName || !trimmedRoom) {
      alert("Please enter both name and room ID");
      return;
    }

    navigate(`/lobby?room=${trimmedRoom}&name=${trimmedName}&type=guest`);
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-80">
      <h2 className="text-2xl font-bold mb-4 text-white">Multiplayer Mode</h2>

      <input
        type="text"
        placeholder="Your Name"
        className="w-full p-2 rounded bg-gray-700 text-white mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={handleCreateRoom}
        className="bg-blue-600 w-full py-2 mb-3 rounded-lg hover:bg-blue-700 text-white"
      >
        Create Room
      </button>

      <div className="text-white my-2">or</div>

      <input
        type="text"
        placeholder="Room ID"
        className="w-full p-2 rounded bg-gray-700 text-white mb-2"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      <button
        onClick={handleJoinRoom}
        className="bg-purple-600 w-full py-2 rounded-lg hover:bg-purple-700 text-white"
      >
        Join Room
      </button>

      <p className="text-sm text-gray-300 mt-4">
        To play with a friend: One creates a room, then shares the Room ID with
        the other who joins using it.
      </p>
    </div>
  );
}
