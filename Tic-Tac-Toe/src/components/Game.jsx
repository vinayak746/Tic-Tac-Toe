import { useState } from "react";
import { useLocation } from "react-router-dom";

function Square({ value, onSquareClick }) {
  return (
    <button
      className="w-16 h-16 bg-gray-800 border border-gray-500 text-3xl text-white font-bold flex items-center justify-center hover:bg-gray-700"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, players }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? players.player1Symbol : players.player2Symbol;
    onPlay(nextSquares);
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {squares.map((square, i) => (
        <Square key={i} value={square} onSquareClick={() => handleClick(i)} />
      ))}
    </div>
  );
}

export default function Game() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const player1 = params.get("player1") || "Player 1";
  const player2 = params.get("player2") || "Player 2";

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    setHistory([...history.slice(0, currentMove + 1), nextSquares]);
    setCurrentMove((prev) => prev + 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const winner = calculateWinner(currentSquares);
  const isDraw = !winner && currentSquares.every((square) => square !== null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 to-blue-800 text-white p-8">
      <div className="flex flex-col md:flex-row items-center w-full max-w-4xl">
        <div className="md:w-1/3 w-full bg-gray-900 p-4 rounded-lg shadow-lg mb-4 md:mb-0">
          <h3 className="text-xl font-semibold mb-2">Game History</h3>
          <ul className="list-disc pl-5 space-y-2">
            {history.map((_, move) => (
              <li key={move}>
                <button
                  className="text-blue-300 hover:underline"
                  onClick={() => jumpTo(move)}
                >
                  {move > 0 ? `Go to move #${move}` : "Go to game start"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:w-2/3 flex flex-col items-center">
          <div className="w-1/2 bg-gray-900 p-4 rounded-lg shadow-lg text-center mb-4">
            <h2 className="text-2xl font-semibold">
              {winner
                ? `Winner: ${winner === "X" ? player1 : player2}`
                : isDraw
                ? "It's a Draw!"
                : `Next player: ${xIsNext ? player1 : player2}`}
            </h2>
          </div>
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            players={{ player1Symbol: "X", player2Symbol: "O" }}
          />
          <button
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={resetGame}
          >
            Restart Game
          </button>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
