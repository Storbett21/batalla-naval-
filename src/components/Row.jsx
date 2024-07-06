import React from 'react';
import Grid from './../components/Grid';

const Row = ({ rowIndex, type, handleClick }) => {
  return (
    <div className="myRow">
      {Array.from({ length: 10 }).map((_, colIndex) => (
        <Grid key={colIndex} rowIndex={rowIndex} colIndex={colIndex} type={type} handleClick={handleClick} />
      ))}
    </div>
  );
};

export default Row;
