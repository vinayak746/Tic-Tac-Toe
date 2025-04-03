import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlayerForm() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [gameMode, setGameMode] = useState("pvp"); // "pvp" or "ai"
  const [playerSymbol, setPlayerSymbol] = useState("X"); // Default player plays "X"
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (gameMode === "pvp" && player1.trim() && player2.trim()) {
      navigate(
        `/game?mode=pvp&player1=${encodeURIComponent(
          player1
        )}&player2=${encodeURIComponent(player2)}`
      );
    } else if (gameMode === "ai" && player1.trim()) {
      navigate(
        `/game?mode=ai&player1=${encodeURIComponent(
          player1
        )}&playerSymbol=${encodeURIComponent(playerSymbol)}`
      );
    } else {
      alert("Please enter player name(s).");
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-80">
      <h2 className="text-2xl font-bold mb-4">Enter Player Names</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-white">Game Mode:</label>
          <select
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
          >
            <option value="pvp">Player vs. Player</option>
            <option value="ai">Player vs. Computer</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Player 1 Name"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        />

        {gameMode === "pvp" ? (
          <input
            type="text"
            placeholder="Player 2 Name"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
        ) : (
          <div>
            <label className="text-white">Choose Your Symbol:</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white"
              value={playerSymbol}
              onChange={(e) => setPlayerSymbol(e.target.value)}
            >
              <option value="X">X</option>
              <option value="O">O</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Start Game
        </button>
      </form>
    </div>
  );
}
