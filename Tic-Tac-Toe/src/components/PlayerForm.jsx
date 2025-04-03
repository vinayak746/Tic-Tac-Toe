import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlayerForm() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (player1.trim() && player2.trim()) {
      navigate(
        `/game?player1=${encodeURIComponent(
          player1
        )}&player2=${encodeURIComponent(player2)}`
      );
    } else {
      alert("Both players need a name!");
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-80">
      <h2 className="text-2xl font-bold mb-4">Enter Player Names</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Player 1 Name"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Player 2 Name"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
        />
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
