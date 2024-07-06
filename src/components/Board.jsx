import React from 'react';
import Cell from './Cell';

const Board = ({ board, onCellClick }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <Cell key={cellIndex} status={cell} onClick={() => onCellClick(rowIndex, cellIndex)} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;

