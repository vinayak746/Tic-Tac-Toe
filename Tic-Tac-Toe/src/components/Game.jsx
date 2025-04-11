import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket";
import Confetti from "react-confetti";

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`
        w-16 h-16 
        ${
          isWinning
            ? "bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.8)]"
            : "bg-gray-800"
        }
        border border-gray-500 
        text-3xl text-white font-bold 
        flex items-center justify-center 
        hover:bg-gray-700 
        hover:scale-105 
        active:scale-95
        transition-all duration-200 ease-out
      `}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ squares, onPlay, winningLine }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {squares.map((square, i) => (
        <Square
          key={i}
          value={square}
          onSquareClick={() => {
            onPlay(i);
          }}
          isWinning={winningLine.includes(i)}
        />
      ))}
    </div>
  );
}

export default function Game() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("room");

  const player1 = queryParams.get("player1") || "Player X";
  const player2 = queryParams.get("player2") || "Player O";
  const mode = queryParams.get("mode") || "player";

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [drawEffect, setDrawEffect] = useState(null);
  const [scoreX, setScoreX] = useState(
    () => Number(localStorage.getItem("scoreX")) || 0
  );
  const [scoreO, setScoreO] = useState(
    () => Number(localStorage.getItem("scoreO")) || 0
  );
  const [draws, setDraws] = useState(
    () => Number(localStorage.getItem("draws")) || 0
  );

  const currentSquares = history[stepNumber];
  const { winner, line: winningLine } = calculateWinner(currentSquares);
  const isDraw = !winner && currentSquares.every((square) => square !== null);

  useEffect(() => {
    if (mode.startsWith("ai") && !xIsNext && !winner) {
      const move = getAIMove(currentSquares, mode);
      if (move !== -1) {
        setTimeout(() => handleAIMove(move), 400);
      }
    }
  }, [xIsNext, history]);

  useEffect(() => {
    if (isDraw) {
      const effects = ["awkward", "glitch", "drama"];
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      setDrawEffect(randomEffect);
    } else {
      setDrawEffect(null);
    }
  }, [isDraw]);

  useEffect(() => {
    if (!winner && !isDraw) return;

    if (stepNumber === 9 || winner) {
      if (winner === "X") {
        setScoreX((prev) => {
          const updated = prev + 1;
          localStorage.setItem("scoreX", updated);
          return updated;
        });
      } else if (winner === "O") {
        setScoreO((prev) => {
          const updated = prev + 1;
          localStorage.setItem("scoreO", updated);
          return updated;
        });
      } else if (isDraw) {
        setDraws((prev) => {
          const updated = prev + 1;
          localStorage.setItem("draws", updated);
          return updated;
        });
      }
    }
  }, [winner, isDraw]);

  function handlePlay(i, fromSocket = xIsNext && !winner) {
    if (currentSquares[i] || winner) return;

    console.log({
      fromSocket,
    });

    if (mode === "multiplayer" && !fromSocket) {
      // Only allow local move if it's this player's turn
      const isMyTurn = xIsNext === (player1 === "Player X");
      if (!isMyTurn) return;
    }

    const newSquares = currentSquares.slice();
    newSquares[i] = xIsNext ? "X" : "O";
    const newHistory = [...history.slice(0, stepNumber + 1), newSquares];

    setHistory(newHistory);
    setStepNumber(newHistory.length - 1);
    setXIsNext(!xIsNext);

    if (mode === "multiplayer" && !fromSocket) {
      socket.emit("makeMove", { roomId, index: i });
    }
  }

  function handleAIMove(i) {
    if (!currentSquares[i] && !winner) {
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
    setXIsNext(history.length % 2 === 0);
    setDrawEffect(null);
  }

  useEffect(() => {
    if (mode === "multiplayer") {
      console.log("Joining room:", roomId);
      socket.emit("joinRoom", roomId);

      socket.on("opponentMove", (index) => {
        console.log("Opponent moved:", index);
        handlePlay(index, true);
      });
    }

    return () => {
      socket.off("opponentMove");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 to-blue-800 text-white p-8">
      {winner && <Confetti />}
      <div className="flex flex-col items-center w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-2">
          {winner
            ? `Winner: ${winner === "X" ? player1 : player2}`
            : isDraw
            ? "It's a draw!"
            : `Next player: ${xIsNext ? player1 : player2}`}
        </h2>

        {isDraw &&
          (drawEffect === "awkward" ? (
            <div className="text-lg text-white opacity-60 italic">
              😐 Well... that was pointless.
            </div>
          ) : drawEffect === "glitch" ? (
            <div className="text-lg text-pink-400 animate-bounce font-mono">
              💥 Reality has glitched. It's a draw.
            </div>
          ) : (
            <div className="text-xl text-red-400 font-bold animate-pulse">
              😬 DRAW: Both players failed.
            </div>
          ))}

        <table className="mb-6 w-full text-center text-white border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-blue-700">
              <th className="p-3 font-semibold border-b border-blue-300">
                {player1} (X)
              </th>
              <th className="p-3 font-semibold border-b border-blue-300">
                {player2} (O)
              </th>
              <th className="p-3 font-semibold border-b border-blue-300">
                Draws
              </th>
            </tr>
          </thead>
          <tbody className="bg-blue-950/50">
            <tr className="hover:bg-blue-800/50 transition">
              <td className="p-3 border-b border-blue-300">{scoreX}</td>
              <td className="p-3 border-b border-blue-300">{scoreO}</td>
              <td className="p-3 border-b border-blue-300">{draws}</td>
            </tr>
          </tbody>
        </table>

        <Board
          squares={currentSquares}
          onPlay={handlePlay}
          winningLine={winner ? winningLine : []}
        />

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

        <button
          className="mt-2 px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={() => {
            setScoreX(0);
            setScoreO(0);
            setDraws(0);
            localStorage.removeItem("scoreX");
            localStorage.removeItem("scoreO");
            localStorage.removeItem("draws");
          }}
        >
          Reset Scoreboard
        </button>
      </div>
    </div>
  );
}

function getAIMove(squares, mode) {
  switch (mode) {
    case "ai-easy":
      return getRandomMove(squares);
    case "ai-medium":
      return getMediumMove(squares);
    case "ai-hard":
      return findBestMove(squares, "O");
    default:
      return -1;
  }
}

function getRandomMove(squares) {
  const available = squares
    .map((val, idx) => (val === null ? idx : null))
    .filter((val) => val !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function getMediumMove(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      squares[i] = "O";
      if (calculateWinner(squares) === "O") {
        squares[i] = null;
        return i;
      }
      squares[i] = null;
    }
  }
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      squares[i] = "X";
      if (calculateWinner(squares) === "X") {
        squares[i] = null;
        return i;
      }
      squares[i] = null;
    }
  }
  return getRandomMove(squares);
}

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
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}
