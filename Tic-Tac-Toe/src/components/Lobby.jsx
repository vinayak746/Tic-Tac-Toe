import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { autoConnect: false }); // Backend WebSocket server

export default function Lobby() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const roomId = params.get("room");
  const name = params.get("name");
  const type = params.get("type"); // 'host' or 'guest'

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!roomId || !name || !type) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinRoom", { roomId, name, type });

    socket.on("roomUpdate", (roomPlayers) => {
      setPlayers(roomPlayers);
    });

    socket.on("startGame", (finalPlayers) => {
      const [p1, p2] = finalPlayers;
      navigate(
        `/game?mode=multiplayer&player1=${encodeURIComponent(
          p1.name
        )}&player2=${encodeURIComponent(p2.name)}&room=${roomId}`
      );
    });

    return () => {
      socket.off("roomUpdate");
      socket.off("startGame");
    };
  }, [roomId, name, type, navigate]);

  const handleStartGame = () => {
    if (players.length < 2) return alert("Waiting for second player...");
    socket.emit("startGame", players); // Send current players
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Multiplayer Room</h1>
      <p className="mb-6 text-gray-300 text-center">
        Share the Room ID below with your friend to join:
        <br />
        <span className="text-lg font-mono bg-gray-700 px-3 py-1 mt-2 inline-block rounded">
          {roomId}
        </span>
      </p>

      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold">Players</h2>
        {players.map((player, index) => (
          <div
            key={index}
            className="flex justify-between px-2 py-1 bg-gray-700 rounded"
          >
            <span>{player.name}</span>
            <span className="text-sm text-gray-400">
              {player.name === name ? "You" : "Opponent"}
            </span>
          </div>
        ))}

        {players.length < 2 && (
          <p className="text-yellow-400 text-center">
            Waiting for another player to join with the Room ID above...
          </p>
        )}

        {type === "host" && players.length === 2 && (
          <button
            onClick={handleStartGame}
            className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 mt-4 rounded"
          >
            Start Game
          </button>
        )}

        {type === "guest" && players.length < 2 && (
          <p className="text-gray-400 text-sm text-center">
            You have joined the room. Waiting for host to start the game...
          </p>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-400 max-w-md text-center">
        <p>
          🧠 To play with a friend:
          <br />
          1. One person clicks "Multiplayer" & chooses "Create Room".
          <br />
          2. Share the Room ID with your friend.
          <br />
          3. They go to "Multiplayer" & choose "Join Room".
          <br />
          4. Host can click "Start Game" when both are connected!
        </p>
      </div>
    </div>
  );
}
