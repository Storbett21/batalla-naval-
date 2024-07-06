import React from 'react';
import '../App.css';
import Square from './Square';

const Board = ({ player, matrix, onSquareClick }) => {
    return (
        <div className={`board ${player}`}>
            {matrix.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, colIndex) => (
                        <Square key={`${rowIndex}-${colIndex}`} value={cell} onClick={() => onSquareClick(rowIndex, colIndex)} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;