import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlayerForm() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [mode, setMode] = useState("player");
  const [aiSymbol, setAiSymbol] = useState("X");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const p1 = player1.trim() || "Player 1";
    const p2 = mode === "player" ? player2.trim() || "Player 2" : "Computer";

    if (!p1 || (mode === "player" && !p2)) {
      alert("Please enter required name(s)");
      return;
    }

    const query = new URLSearchParams({
      player1: p1,
      player2: p2,
      mode,
      playerSymbol: aiSymbol,
    }).toString();

    navigate(`/game?${query}`);
  }

  function handleMultiplayerClick(e) {
    e.preventDefault(); // prevents form submit
    navigate("/multiplayer");
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-80">
      <h2 className="text-2xl font-bold mb-4">Enter Player Info</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Player 1 Name"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        />

        {mode === "player" && (
          <input
            type="text"
            placeholder="Player 2 Name"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
        )}

        <select
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="player">Player vs Player</option>
          <option value="ai-easy">Play with AI (Easy)</option>
          <option value="ai-medium">Play with AI (Medium)</option>
          <option value="ai-hard">Play with AI (Hard)</option>
        </select>

        {mode !== "player" && (
          <div className="flex justify-center space-x-4 text-white">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="X"
                checked={aiSymbol === "X"}
                onChange={() => setAiSymbol("X")}
              />
              <span>Play as X</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="O"
                checked={aiSymbol === "O"}
                onChange={() => setAiSymbol("O")}
              />
              <span>Play as O</span>
            </label>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Start Game
        </button>

        <button
          type="button"
          onClick={handleMultiplayerClick}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700"
        >
          Multiplayer Mode
        </button>
      </form>
    </div>
  );
}
