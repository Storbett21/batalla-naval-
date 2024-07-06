import React from 'react';
import Row from '../components/Row';

const Board = ({ type, handleClick }) => {
  return (
    <div id={type === "Player" ? "board" : "boardAttack"} className="board">
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <Row key={rowIndex} rowIndex={rowIndex} type={type} handleClick={handleClick} />
      ))}
    </div>
  );
};

export default Board;