import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import '../Board.css';

import hitSound from '../sounds/hit.mp3';
import missSound from '../sounds/miss.mp3';
import backgroundMusic from '../sounds/background.mp3';

const sizeShip = [4, 5, 3, 2];
const positionArray = ['horizontal', 'vertical'];

const Board = () => {
  const initialMatrix = () => Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ''));

  const [matrix, setMatrix] = useState(initialMatrix());
  const [matrixAttack, setMatrixAttack] = useState(initialMatrix());
  const [quantityShip, setQuantityShip] = useState([1, 1, 1, 2]);
  const [selectedShip, setSelectedShip] = useState({});
  const [showMaquinaTab, setShowMaquinaTab] = useState(false);

  const [playHit] = useSound(hitSound);
  const [playMiss] = useSound(missSound);
  const [playBackground, { stop }] = useSound(backgroundMusic, { volume: 0.25, loop: true });

  useEffect(() => {
    playBackground();
    return () => {
      stop();
    };
  }, [playBackground, stop]);

  const createMatrix = (matrixType, onClick, type) => (
    matrixType.map((row, x) => (
      <div key={x} className="myRow">
        {row.map((cell, y) => (
          <div
            key={`${x},${y}`}
            className={`grid ${type === 'maquina' ? (cell === 'hit' ? 'hit' : cell === 'miss' ? 'miss' : '') : (cell === 'ship' ? 'ship' : cell === 'hit' ? 'hit' : cell === 'miss' ? 'miss' : '')}`}
            onClick={() => onClick(x, y)}
          />
        ))}
      </div>
    ))
  );

  const selectShip = (event) => {
    const shipData = event.target.className.split(' ');
    setSelectedShip({
      position: shipData[0],
      size: sizeShip[shipData[1]],
      quantity: quantityShip[shipData[1]],
      id: shipData[1]
    });
  };

  const selectPosition = (x, y) => {
    if (selectedShip.quantity > 0) {
      const newMatrix = [...matrix];
      if (selectedShip.position === 'horizontal' && y + selectedShip.size <= 10) {
        for (let i = y; i < y + selectedShip.size; i++) newMatrix[x][i] = 'ship';
      } else if (selectedShip.position === 'vertical' && x + selectedShip.size <= 10) {
        for (let i = x; i < x + selectedShip.size; i++) newMatrix[i][y] = 'ship';
      } else {
        alert('Selecciona una posición válida');
        return;
      }
      setMatrix(newMatrix);
      setSelectedShip({});
    } else {
      alert('Debes seleccionar un barco disponible');
    }
  };

  const startGame = () => {
    setShowMaquinaTab(true);
    selectPositionRandom();
    alert('¡Comienza el juego!');
  };

  const selectPositionRandom = () => {
    const newMatrixAttack = [...matrixAttack];
    quantityShip.forEach((quantity, index) => {
      let count = quantity;
      while (count > 0) {
        generateRandomShip(index, newMatrixAttack);
        count--;
      }
    });
    setMatrixAttack(newMatrixAttack);
  };

  const generateRandomShip = (shipIndex, matrix) => {
    const position = positionArray[Math.floor(Math.random() * positionArray.length)];
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    const size = sizeShip[shipIndex];

    if (position === 'horizontal' && y + size <= 10) {
      for (let i = y; i < y + size; i++) {
        if (matrix[x][i] === 'ship') {
          generateRandomShip(shipIndex, matrix);
          return;
        }
      }
      for (let i = y; i < y + size; i++) matrix[x][i] = 'ship';
    } else if (position === 'vertical' && x + size <= 10) {
      for (let i = x; i < x + size; i++) {
        if (matrix[i][y] === 'ship') {
          generateRandomShip(shipIndex, matrix);
          return;
        }
      }
      for (let i = x; i < x + size; i++) matrix[i][y] = 'ship';
    } else {
      generateRandomShip(shipIndex, matrix);
      return;
    }
  };

  const checkShot = (x, y) => {
    const newMatrixAttack = [...matrixAttack];
    if (newMatrixAttack[x][y] === 'hit' || newMatrixAttack[x][y] === 'miss') {
      alert('Ya has disparado en esta posición.');
      return;
    }
    if (matrixAttack[x][y] === 'ship') {
      newMatrixAttack[x][y] = 'hit';
      playHit(); // Reproducir sonido de acierto
      setMatrixAttack(newMatrixAttack);
      checkWinner(newMatrixAttack, 'player');
      alert('¡Acertaste! Has golpeado un barco.');
    } else {
      alert('¡Mal! Tu disparo cayó al agua.');
      newMatrixAttack[x][y] = 'miss';
      playMiss(); // Reproducir sonido de fallo
      setMatrixAttack(newMatrixAttack);
      shotMaquina();
    }
  };

  const shotMaquina = () => {
    let x, y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (matrix[x][y] === 'hit' || matrix[x][y] === 'miss');

    if (matrix[x][y] === 'ship') {
      alert('¡Ops! Te han disparado.');
      const newMatrix = [...matrix];
      newMatrix[x][y] = 'hit';
      playHit(); // Reproducir sonido de acierto
      setMatrix(newMatrix);
      checkWinner(newMatrix, 'maquina');
      alert('¡Acerté! He golpeado tu barco.');
    } else {
      alert('¡El disparo de la maquina cayó al agua!');
      const newMatrix = [...matrix];
      newMatrix[x][y] = 'miss';
      playMiss(); // Reproducir sonido de fallo
      setMatrix(newMatrix);
    }
  };

  const checkWinner = (matrix, player) => {
    for (let i = 0; i < 10; i++) {
      if (matrix[i].includes('ship')) return;
    }
    alert(player === 'maquina' ? '¡Ha ganado la Maquina!' : confetti(), '¡GANASTE!');
    resetGame();
  };

  const resetGame = () => {
    setMatrix(initialMatrix());
    setMatrixAttack(initialMatrix());
    setQuantityShip([1, 1, 1, 2]);
    setSelectedShip({});
    setShowMaquinaTab(false);
  };

  return (
    <div className="boardContainer">
      <div className="boardType">
        {createMatrix(matrix, selectPosition, 'player')}
      </div>
      <div className="shipsType">
        <h4>Tus barcos:</h4>
        <div className="shipSelector">
          {sizeShip.map((size, index) => (
            <div key={index}>
              <button className={`horizontal ${index}`} onClick={selectShip}>Horizontal {size}</button>
              <button className={`vertical ${index}`} onClick={selectShip}>Vertical {size}</button>
            </div>
          ))}
        </div>
      </div>
      <div className="row">
        <button id="button" onClick={startGame}>Empezar juego</button>
      </div>
      {showMaquinaTab && (
        <div className="boardType">
          {createMatrix(matrixAttack, checkShot, 'maquina')}
        </div>
      )}
    </div>
  );
};

export default Board;
