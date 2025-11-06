// Game logic utilities

export function calculateWinner(squares) {
  if (!Array.isArray(squares) || squares.length !== 9) {
    return { winner: null, line: [] };
  }
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

export function getAIMove(squares, mode) {
  switch (mode) {
    case "ai-easy": return getRandomMove(squares);
    case "ai-medium": return getMediumMove(squares);
    case "ai-hard": return findBestMove(squares, "O");
    default: return -1;
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
