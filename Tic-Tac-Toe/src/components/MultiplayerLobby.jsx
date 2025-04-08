import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Backend WebSocket server

export default function MultiplayerRoom() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const roomId = params.get("room");
  const name = params.get("name");
  const type = params.get("type"); // 'host' or 'guest'

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!roomId || !name || !type) return;

    // Join the room
    socket.emit("joinRoom", { roomId, name, type });

    // Update player list when server sends an update
    socket.on("roomUpdate", (roomPlayers) => {
      setPlayers(roomPlayers);
    });

    // Start game when host triggers it
    socket.on("startGame", () => {
      const [player1, player2] = players;
      navigate(
        `/game?mode=multiplayer&player1=${encodeURIComponent(
          player1.name
        )}&player2=${encodeURIComponent(player2.name)}&room=${roomId}`
      );
    });

    // Cleanup
    return () => {
      socket.off("roomUpdate");
      socket.off("startGame");
    };
  }, [roomId, name, type, navigate, players]);

  const handleStartGame = () => {
    if (players.length < 2) return alert("Waiting for the second player...");
    socket.emit("startGame", roomId);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Multiplayer Room</h1>
      <p className="mb-6 text-gray-300">
        Room ID:{" "}
        <span className="font-mono bg-gray-700 px-2 py-1 rounded">
          {roomId}
        </span>
      </p>

      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold mb-2">Players</h2>
        {players.map((player, index) => (
          <div
            key={index}
            className="flex justify-between px-2 py-1 bg-gray-700 rounded"
          >
            <span>{player.name}</span>
            <span className="text-sm text-gray-400">
              {player.type === type ? "You" : "Opponent"}
            </span>
          </div>
        ))}

        {players.length < 2 ? (
          <p className="text-yellow-400 mt-4">
            Waiting for another player to join...
          </p>
        ) : (
          type === "host" && (
            <button
              onClick={handleStartGame}
              className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 mt-4 rounded"
            >
              Start Game
            </button>
          )
        )}
      </div>
    </div>
  );
}
