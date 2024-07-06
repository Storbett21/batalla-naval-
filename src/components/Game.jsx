import React, { useState } from 'react';
import Board from './Board';

const Game = () => {
  const [board, setBoard] = useState(createInitialBoard());
  
  const handleCellClick = (row, col) => {
    // Lógica para manejar clics en celdas
  };

  return (
    <div className="game">
      <Board board={board} onCellClick={handleCellClick} />
    </div>
  );
};

const createInitialBoard = () => {
  // Lógica para crear el tablero inicial
  return Array(10).fill(null).map(() => Array(10).fill('empty'));
};

export default Game;
