import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import socket from "../socket";

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`w-16 h-16 ${
        isWinning
          ? "bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.8)]"
          : "bg-gray-800"
      } border border-gray-500 text-3xl text-white font-bold flex items-center justify-center hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-200 ease-out`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ squares, onPlay, winningLine = [] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {squares.map((square, i) => (
        <Square
          key={i}
          value={square}
          onSquareClick={() => onPlay(i)}
          isWinning={winningLine.includes(i)}
        />
      ))}
    </div>
  );
}

export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const mode = query.get("mode") || "player";
  const roomId = query.get("room") || "";
  const player1 = query.get("player1") || "Player X";
  const player2 = query.get("player2") || "Player O";
  const p1id = query.get("p1id") || "";
  const p2id = query.get("p2id") || "";

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [scoreX, setScoreX] = useState(
    () => Number(localStorage.getItem("scoreX")) || 0
  );
  const [scoreO, setScoreO] = useState(
    () => Number(localStorage.getItem("scoreO")) || 0
  );
  const [draws, setDraws] = useState(
    () => Number(localStorage.getItem("draws")) || 0
  );
  const [drawEffect, setDrawEffect] = useState(null);

  const [myId, setMyId] = useState("");
  const [currentTurnId, setCurrentTurnId] = useState(p1id || "");
  const [players, setPlayers] = useState([]);

  const historyRef = useRef(history);
  const stepRef = useRef(stepNumber);
  const lastResultRef = useRef(-1);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    stepRef.current = stepNumber;
  }, [stepNumber]);

  const currentSquares = history[stepNumber] || Array(9).fill(null);
  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(currentSquares),
    [currentSquares]
  );
  const isDraw = !winner && currentSquares.every((square) => square !== null);
  const xIsNext = stepNumber % 2 === 0;

  const mySymbol = useMemo(() => {
    if (mode !== "multiplayer" || !myId) return null;
    if (myId === p1id) return "X";
    if (myId === p2id) return "O";
    const found = players.find((p) => p.id === myId);
    return found?.symbol || null;
  }, [mode, myId, p1id, p2id, players]);

  const opponentId = useMemo(() => {
    if (mode !== "multiplayer" || !mySymbol) return "";
    if (mySymbol === "X")
      return p2id || players.find((p) => p.symbol === "O")?.id || "";
    return p1id || players.find((p) => p.symbol === "X")?.id || "";
  }, [mode, mySymbol, p1id, p2id, players]);

  const isMyTurn =
    mode === "multiplayer" ? !currentTurnId || currentTurnId === myId : xIsNext;

  const makeMove = useCallback((index, symbol) => {
    const baseHistory = historyRef.current.slice(0, stepRef.current + 1);
    const board = baseHistory[baseHistory.length - 1];
    if (!board || board[index] || calculateWinner(board).winner) return null;

    const nextBoard = board.slice();
    nextBoard[index] = symbol;
    const nextHistory = [...baseHistory, nextBoard];

    setHistory(nextHistory);
    setStepNumber(nextHistory.length - 1);
    return nextBoard;
  }, []);

  const handleSquareClick = useCallback(
    (index) => {
      if (winner || currentSquares[index]) return;

      if (mode === "multiplayer") {
        if (!myId || !isMyTurn) return;
        const symbol = mySymbol || (xIsNext ? "X" : "O");
        const nextBoard = makeMove(index, symbol);
        if (!nextBoard) return;

        const nextTurn = opponentId || "";
        setCurrentTurnId(nextTurn);

        socket.emit("playerMove", {
          roomId,
          index,
          symbol,
          board: nextBoard,
          nextTurnId: nextTurn,
          from: socket.id,
        });
      } else {
        const symbol = xIsNext ? "X" : "O";
        makeMove(index, symbol);
      }
    },
    [
      winner,
      currentSquares,
      mode,
      myId,
      isMyTurn,
      mySymbol,
      xIsNext,
      makeMove,
      opponentId,
      roomId,
    ]
  );

  const jumpTo = useCallback(
    (move) => {
      setStepNumber(move);
      setCurrentTurnId((prev) => (mode === "multiplayer" ? prev : ""));
    },
    [mode]
  );

  const resetGame = useCallback(() => {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setDrawEffect(null);
    lastResultRef.current = -1;
    if (mode === "multiplayer") {
      setCurrentTurnId(p1id || "");
    }
  }, [mode, p1id]);

  const resetScoreboard = useCallback(() => {
    setScoreX(0);
    setScoreO(0);
    setDraws(0);
    localStorage.removeItem("scoreX");
    localStorage.removeItem("scoreO");
    localStorage.removeItem("draws");
  }, []);

  useEffect(() => {
    if (!winner && !isDraw) return;
    if (lastResultRef.current === stepNumber) return;
    lastResultRef.current = stepNumber;

    if (winner === "X") {
      setScoreX((prev) => {
        const updated = prev + 1;
        localStorage.setItem("scoreX", String(updated));
        return updated;
      });
    } else if (winner === "O") {
      setScoreO((prev) => {
        const updated = prev + 1;
        localStorage.setItem("scoreO", String(updated));
        return updated;
      });
    } else if (isDraw) {
      setDraws((prev) => {
        const updated = prev + 1;
        localStorage.setItem("draws", String(updated));
        return updated;
      });
    }
  }, [winner, isDraw, stepNumber]);

  useEffect(() => {
    if (!isDraw) return;
    const effects = ["awkward", "glitch", "drama"];
    setDrawEffect(effects[Math.floor(Math.random() * effects.length)]);
  }, [isDraw]);

  useEffect(() => {
    if (!mode.startsWith("ai")) return;
    if (
      winner ||
      !currentSquares.every((square) => (square !== null ? true : true))
    )
      return;

    if (xIsNext) return; // player is X, AI is O

    const timeout = setTimeout(() => {
      const aiMove = getAIMove(currentSquares, mode);
      if (aiMove !== -1) makeMove(aiMove, "O");
    }, 400);

    return () => clearTimeout(timeout);
  }, [mode, currentSquares, xIsNext, winner, makeMove]);

  useEffect(() => {
    if (mode !== "multiplayer") return;

    const handleConnect = () => {
      setMyId(socket.id);
      if (!currentTurnId && p1id) {
        setCurrentTurnId(p1id);
      }
      if (roomId) {
        socket.emit("joinRoom", { roomId });
      }
    };

    const handlePlayerList = (payload) => {
      const list = Array.isArray(payload) ? payload : payload?.players;
      if (!list) return;
      setPlayers(list);
      const starter = list.find((p) => p.symbol === "X");
      if (starter) {
        setCurrentTurnId((prev) => prev || starter.id);
      }
    };

    const handleMove = (payload) => {
      if (!payload) return;
      if (payload.from && payload.from === socket.id) return;

      if (Array.isArray(payload.board) && payload.board.length === 9) {
        const baseHistory = historyRef.current.slice(0, stepRef.current + 1);
        const nextHistory = [...baseHistory, payload.board];
        setHistory(nextHistory);
        setStepNumber(nextHistory.length - 1);
      } else if (typeof payload.index === "number" && payload.symbol) {
        makeMove(payload.index, payload.symbol);
      }

      if (payload.nextTurnId) {
        setCurrentTurnId(payload.nextTurnId);
      } else if (payload.from) {
        setCurrentTurnId(payload.from === p1id ? p2id : p1id);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("startGame", handlePlayerList);
    socket.on("lobbyPlayers", handlePlayerList);
    socket.on("playerMove", handleMove);
    socket.on("opponentMove", handleMove);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("startGame", handlePlayerList);
      socket.off("lobbyPlayers", handlePlayerList);
      socket.off("playerMove", handleMove);
      socket.off("opponentMove", handleMove);
    };
  }, [mode, roomId, p1id, p2id, currentTurnId, makeMove]);

  const winnerName = winner === "X" ? player1 : player2;
  const nextLabel =
    mode === "multiplayer"
      ? isMyTurn
        ? "Your turn!"
        : "Opponent is thinking..."
      : `Next player: ${xIsNext ? player1 : player2}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 to-blue-800 text-white p-8">
      {winner && <Confetti />}
      <div className="flex flex-col items-center w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="self-end mb-4 rounded-lg bg-slate-900/70 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
        >
          Home
        </button>
        <h2 className="text-2xl font-semibold mb-2">
          {winner
            ? `Winner: ${winnerName}`
            : isDraw
            ? "It's a draw!"
            : nextLabel}
        </h2>

        {mode === "multiplayer" && (
          <div className="text-sm mb-4 text-gray-300">
            Room: {roomId || "N/A"} • You: {mySymbol || "Spectator"} • Turn:{" "}
            {isMyTurn ? "Your turn" : "Opponent"}
          </div>
        )}

        {isDraw && (
          <div className="mb-3 text-center">
            {drawEffect === "awkward" && (
              <div className="text-lg opacity-70 italic">
                😐 That was anticlimactic.
              </div>
            )}
            {drawEffect === "glitch" && (
              <div className="text-lg text-pink-400 animate-pulse font-mono">
                💥 The universe glitched—nobody wins.
              </div>
            )}
            {drawEffect === "drama" && (
              <div className="text-xl text-red-300 font-bold animate-bounce">
                😬 DRAW! Both players stalled out.
              </div>
            )}
          </div>
        )}

        <table className="mb-6 w-full text-center text-white border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-blue-700">
              <th className="p-3 border-b">{player1} (X)</th>
              <th className="p-3 border-b">{player2} (O)</th>
              <th className="p-3 border-b">Draws</th>
            </tr>
          </thead>
          <tbody className="bg-blue-950/60">
            <tr className="hover:bg-blue-800/40 transition">
              <td className="p-3 border-b">{scoreX}</td>
              <td className="p-3 border-b">{scoreO}</td>
              <td className="p-3 border-b">{draws}</td>
            </tr>
          </tbody>
        </table>

        <Board
          squares={currentSquares}
          onPlay={handleSquareClick}
          winningLine={winner ? winningLine : []}
        />

        {mode !== "multiplayer" && (
          <div className="mt-4 flex flex-wrap justify-center">
            {history.map((_, move) => (
              <button
                key={move}
                onClick={() => jumpTo(move)}
                className="m-1 px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 transition"
              >
                {move === 0 ? "Start" : `Move #${move}`}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-red-500 rounded hover:bg-red-600 transition"
          >
            Restart Game
          </button>
          <button
            onClick={resetScoreboard}
            className="px-6 py-2 bg-yellow-500 rounded hover:bg-yellow-600 transition text-black font-semibold"
          >
            Reset Scoreboard
          </button>
        </div>
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
    .map((val, idx) => (val == null ? idx : null))
    .filter((val) => val != null);
  if (available.length === 0) return -1;
  return available[Math.floor(Math.random() * available.length)];
}

function getMediumMove(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      squares[i] = "O";
      if (calculateWinner(squares).winner === "O") {
        squares[i] = null;
        return i;
      }
      squares[i] = null;
    }
  }
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      squares[i] = "X";
      if (calculateWinner(squares).winner === "X") {
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
      const score = minimax(squares, 0, false);
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
  const { winner } = calculateWinner(squares);
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
  if (!Array.isArray(squares) || squares.length !== 9) {
    return { winner: null, line: [] };
  }

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
