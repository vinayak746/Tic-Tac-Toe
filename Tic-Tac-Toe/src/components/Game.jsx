import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";

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

function Board({ squares, onPlay }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {squares.map((square, i) => (
        <Square key={i} value={square} onSquareClick={() => onPlay(i)} />
      ))}
    </div>
  );
}

export default function Game() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const player1 = queryParams.get("player1") || "Player X";
  const player2 = queryParams.get("player2") || "Player O";
  const mode = queryParams.get("mode") || "player"; // "player" or "ai"

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const currentSquares = history[stepNumber];

  useEffect(() => {
    if (mode === "ai" && !xIsNext && !calculateWinner(currentSquares)) {
      const bestMove = findBestMove(currentSquares, "O");
      if (bestMove !== -1) {
        setTimeout(() => handleAIMove(bestMove), 500);
      }
    }
  }, [xIsNext, history]);

  function handlePlay(i) {
    if (currentSquares[i] || calculateWinner(currentSquares)) return;

    const newSquares = currentSquares.slice();
    newSquares[i] = xIsNext ? "X" : "O";
    const newHistory = [...history.slice(0, stepNumber + 1), newSquares];

    setHistory(newHistory);
    setStepNumber(newHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function handleAIMove(i) {
    if (!currentSquares[i] && !calculateWinner(currentSquares)) {
      handlePlay(i);
    }
  }

  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setXIsNext(true);
  }

  const winner = calculateWinner(currentSquares);
  const isDraw = !winner && currentSquares.every((square) => square !== null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 to-blue-800 text-white p-8">
      {winner && <Confetti />}
      <div className="flex flex-col items-center w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          {winner
            ? `Winner: ${winner === "X" ? player1 : player2}`
            : isDraw
            ? "It's a draw!"
            : `Next player: ${xIsNext ? player1 : player2}`}
        </h2>
        <Board squares={currentSquares} onPlay={handlePlay} />

        {/* Move History Buttons */}
        <div className="mt-4">
          {history.map((_, move) => (
            <button
              key={move}
              onClick={() => jumpTo(move)}
              className="m-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              {move === 0 ? "Go to game start" : `Go to move #${move}`}
            </button>
          ))}
        </div>

        <button
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={resetGame}
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}

// 🔥 Minimax Algorithm for AI
function findBestMove(squares, aiPlayer) {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      squares[i] = aiPlayer;
      let score = minimax(squares, 0, false);
      squares[i] = null;

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(squares, depth, isMaximizing) {
  const winner = calculateWinner(squares);
  if (winner === "X") return -10 + depth;
  if (winner === "O") return 10 - depth;
  if (squares.every((square) => square !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = "O";
        bestScore = Math.max(bestScore, minimax(squares, depth + 1, false));
        squares[i] = null;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = "X";
        bestScore = Math.min(bestScore, minimax(squares, depth + 1, true));
        squares[i] = null;
      }
    }
    return bestScore;
  }
}

// Function to check for a winner
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
