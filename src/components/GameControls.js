// GameControls.js
import React from 'react';
import '../GameControls.css';

const GameControls = ({ onStartGame, disabled }) => {
    return (
        <div className="game-controls">
            <button onClick={onStartGame} disabled={disabled}>Iniciar Juego</button>
        </div>
    );
};

export default GameControls;
