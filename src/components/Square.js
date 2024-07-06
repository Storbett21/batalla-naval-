// Square.js
import React from 'react';
import '../App.css';

const Square = ({ value, onClick }) => {
    let className = 'square';
    if (value) {
        className += ` ${value}`;
    }
    return <div className={className} onClick={onClick}></div>;
};

export default Square;
