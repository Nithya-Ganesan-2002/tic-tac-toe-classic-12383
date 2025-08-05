import React, { useState } from "react";
import "./TicTacToe.css";

// Constants for styling
const ACCENT_COLOR = "#ffd600";
const PRIMARY_COLOR = "#1976d2";
const SECONDARY_COLOR = "#424242";

// PUBLIC_INTERFACE
export default function TicTacToe() {
  /** Tic Tac Toe game logic and UI.
   *  Features:
   *   - Two-player mode (X vs O)
   *   - Move highlight on last move
   *   - Show winner or draw status
   *   - Reset/Replay button
   */
  const emptyBoard = Array(9).fill(null);
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [lastMove, setLastMove] = useState(null); // index of last move
  const [gameOver, setGameOver] = useState(false);

  // Calculate winner or draw
  const winnerInfo = calculateWinner(board);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winnerInfo.winner || gameOver) {
      return;
    }
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setLastMove(idx);

    if (calculateWinner(newBoard).winner || newBoard.every(Boolean)) {
      setGameOver(true);
    }
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(emptyBoard);
    setXIsNext(true);
    setLastMove(null);
    setGameOver(false);
  }

  // Prepare status message
  let status;
  if (winnerInfo.winner) {
    status = (
      <span>
        <strong style={{ color: ACCENT_COLOR }}>
          {winnerInfo.winner} wins!
        </strong>
      </span>
    );
  } else if (board.every(Boolean)) {
    status = (
      <span>
        <strong style={{ color: SECONDARY_COLOR }}>It's a draw!</strong>
      </span>
    );
  } else {
    status = (
      <span>
        Next move:{" "}
        <strong style={{ color: xIsNext ? PRIMARY_COLOR : SECONDARY_COLOR }}>
          {xIsNext ? "X" : "O"}
        </strong>
      </span>
    );
  }

  return (
    <div className="ttt-container">
      <h1 className="ttt-title" style={{ color: PRIMARY_COLOR }}>
        Tic Tac Toe
      </h1>
      <div className="ttt-board-wrapper">
        <Board
          squares={board}
          onClick={handleClick}
          lastMove={lastMove}
          winLine={winnerInfo.line}
        />
      </div>
      <div className="ttt-info-row">
        <Status status={status} />
        <button
          className="ttt-reset-btn"
          onClick={handleReset}
          disabled={board.join("") === ""}
          aria-label="Restart game"
        >
          {gameOver ? "Play Again" : "Reset"}
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onClick, lastMove, winLine }) {
  /** Game board - 3x3 grid with move highlight and win highlight */
  function isHighlighted(idx) {
    if (winLine && winLine.includes(idx)) {
      return "win";
    }
    if (idx === lastMove) {
      return "last";
    }
    return null;
  }

  return (
    <div className="ttt-board">
      {squares.map((value, idx) => (
        <button
          key={idx}
          className={`ttt-cell ${isHighlighted(idx) ? `highlight-${isHighlighted(idx)}` : ""}`}
          onClick={() => onClick(idx)}
          aria-label={`Row ${Math.floor(idx / 3) + 1} column ${(idx % 3) + 1}`}
        >
          {value && (
            <span className={`piece piece-${value}`}>
              {value}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Status({ status }) {
  /** Displays current game status */
  return <div className="ttt-status">{status}</div>;
}

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /**
   * Returns {winner, line} if someone won, otherwise {winner: null, line: null}
   */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diags
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}
