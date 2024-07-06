import React from 'react';

const Grid = ({ rowIndex, colIndex, type, handleClick }) => {
  return (
    <div
      id={`${rowIndex},${colIndex},${type.toLowerCase()}`}
      className="grid"
      onClick={handleClick}
    />
  );
};

export default Grid;