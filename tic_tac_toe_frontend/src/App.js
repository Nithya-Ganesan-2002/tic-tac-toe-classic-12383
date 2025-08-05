import React from "react";
import "./App.css";
import TicTacToe from "./TicTacToe";

// PUBLIC_INTERFACE
function App() {
  /** Main app wrapper for Tic Tac Toe game */
  return (
    <div className="App">
      <TicTacToe />
    </div>
  );
}

export default App;
