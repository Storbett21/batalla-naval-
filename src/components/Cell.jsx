import React from 'react';

const Cell = ({ status, onClick }) => {
  return (
    <div className={`cell ${status}`} onClick={onClick}></div>
  );
};

export default Cell;
