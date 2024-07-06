import React, { useState, useEffect } from 'react';
import '../src/App.css';
import Board from './components/Board';
import ShipSelector from './components/ShipSelector';
import GameControls from './components/GameControls';


 const sizeShip = [5, 4, 3, 2];
 const positionArray = ["horizontal", "vertical"];
 let quantityShip = [1, 1, 1, 2];
 let quantityShipPC = [1, 1, 1, 2];


const App = () => {
    const [playerMatrix, setPlayerMatrix] = useState([]);
    const [pcMatrix, setPcMatrix] = useState([]);
    const [selectedShip, setSelectedShip] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    // Crear matrices para los tableros del jugador y del PC
    useEffect(() => {
        const createMatrix = () => {
            let playerBoard = [];
            let pcBoard = [];
            for (let i = 0; i < 10; i++) {
                let playerRow = Array(10).fill('');
                let pcRow = Array(10).fill('');
                playerBoard.push(playerRow);
                pcBoard.push(pcRow);
            }
            setPlayerMatrix(playerBoard);
            setPcMatrix(pcBoard);
        };
        createMatrix();
    }, []);

    // Función para seleccionar un barco
    const selectShip = (event) => {
        let shipData = event.target.className.split(' ');
        let position = shipData[0];
        let size = sizeShip[shipData[1]];
        let quantity = quantityShip[shipData[1]];
        let id = shipData[1];

        setSelectedShip({ position, size, quantity, id });
    };

    // Función para colocar un barco en el tablero del jugador
    const placeShip = (x, y) => {
        if (selectedShip && selectedShip.quantity > 0) {
            let { position, size } = selectedShip;

            if (position === 'horizontal' && (y + size - 1) < 10) {
                let isValid = true;
                for (let i = y; i < y + size; i++) {
                    if (playerMatrix[x][i] === 'ship') {
                        isValid = false;
                        break;
                    }
                }
                if (isValid) {
                    let newMatrix = [...playerMatrix];
                    for (let i = y; i < y + size; i++) {
                        newMatrix[x][i] = 'ship';
                    }
                    setPlayerMatrix(newMatrix);
                    setSelectedShip({ ...selectedShip, quantity: selectedShip.quantity - 1 });
                } else {
                    alert('Selecciona una posición válida');
                }
            } else if (position === 'vertical' && (x + size - 1) < 10) {
                let isValid = true;
                for (let i = x; i < x + size; i++) {
                    if (playerMatrix[i][y] === 'ship') {
                        isValid = false;
                        break;
                    }
                }
                if (isValid) {
                    let newMatrix = [...playerMatrix];
                    for (let i = x; i < x + size; i++) {
                        newMatrix[i][y] = 'ship';
                    }
                    setPlayerMatrix(newMatrix);
                    setSelectedShip({ ...selectedShip, quantity: selectedShip.quantity - 1 });
                } else {
                    alert('Selecciona una posición válida');
                }
            }
        } else {
            alert('Debes seleccionar un barco disponible');
        }
    };

    // Función para iniciar el juego
    const startGame = () => {
        setGameStarted(true);
        placeShipsRandom();
    };

    // Función para colocar barcos aleatorios en el tablero del PC
    const placeShipsRandom = () => {
        let pcBoard = [...pcMatrix];
        for (let i = 0; i < quantityShipPC.length; i++) {
            while (quantityShipPC[i] > 0) {
                let shipRandom = generateRandomShip(sizeShip[i]);
                if (shipRandom) {
                    let { position, x, y } = shipRandom;
                    if (position === 'horizontal' && (y + sizeShip[i] - 1) < 10) {
                        let isValid = true;
                        for (let j = y; j < y + sizeShip[i]; j++) {
                            if (pcBoard[x][j] === 'ship') {
                                isValid = false;
                                break;
                            }
                        }
                        if (isValid) {
                            for (let j = y; j < y + sizeShip[i]; j++) {
                                pcBoard[x][j] = 'ship';
                            }
                            setPcMatrix(pcBoard);
                            quantityShipPC[i]--;
                        }
                    } else if (position === 'vertical' && (x + sizeShip[i] - 1) < 10) {
                        let isValid = true;
                        for (let j = x; j < x + sizeShip[i]; j++) {
                            if (pcBoard[j][y] === 'ship') {
                                isValid = false;
                                break;
                            }
                        }
                        if (isValid) {
                            for (let j = x; j < x + sizeShip[i]; j++) {
                                pcBoard[j][y] = 'ship';
                            }
                            setPcMatrix(pcBoard);
                            quantityShipPC[i]--;
                        }
                    }
                }
            }
        }
    };

    // Función para generar una posición aleatoria para un barco
    const generateRandomShip = (size) => {
        let position = positionArray[Math.floor(Math.random() * positionArray.length)];
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);

        if (position === 'horizontal' && (y + size - 1) < 10) {
            return { position, x, y };
        } else if (position === 'vertical' && (x + size - 1) < 10) {
            return { position, x, y };
        } else {
            return null;
        }
    };

    // Función para manejar el disparo del jugador
    const handleShot = (x, y) => {
        if (pcMatrix[x][y] === 'ship') {
            alert('Muy bien, acertaste. Vuelve a jugar');
            let newPcMatrix = [...pcMatrix];
            newPcMatrix[x][y] = 'hit';
            setPcMatrix(newPcMatrix);
            checkWinner(newPcMatrix, 'player');
        } else {
            alert('Mal! tu disparo cayó al agua');
            let newPcMatrix = [...pcMatrix];
            newPcMatrix[x][y] = 'miss';
            setPcMatrix(newPcMatrix);
            setTimeout(shotPc, 1000); // Simular disparo del PC después de un segundo
        }
    };

    // Función para manejar el disparo del PC
    const shotPc = () => {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);

        if (playerMatrix[x][y] === 'ship') {
            alert('Ops! te han disparado');
            let newPlayerMatrix = [...playerMatrix];
            newPlayerMatrix[x][y] = 'hit';
            setPlayerMatrix(newPlayerMatrix);
            checkWinner(newPlayerMatrix, 'pc');
            setTimeout(shotPc, 1000); // Simular siguiente disparo del PC después de un segundo
        } else if (playerMatrix[x][y] === 'hit' || playerMatrix[x][y] === 'miss') {
            shotPc(); // Volver a intentar si ya se disparó en ese lugar
        } else {
            alert('El disparo del pc cayó al agua');
            let newPlayerMatrix = [...playerMatrix];
            newPlayerMatrix[x][y] = 'miss';
            setPlayerMatrix(newPlayerMatrix);
        }
    };

    // Función para verificar si hay un ganador
    const checkWinner = (matrix, player) => {
        for (let i = 0; i < 10; i++) {
            let shipFound = matrix[i].findIndex(cell => cell === 'ship');
            if (shipFound !== -1) {
                return; // Todavía hay barcos, no hay ganador
            }
        }
        if (player === 'pc') {
            alert('Ha ganado el PC');
        } else {
            alert('GANASTE!!!');
        }
        setGameStarted(false);
    };

    return (
        <div className="app">
            <Board player="player" matrix={playerMatrix} onSquareClick={handleShot} />
            <ShipSelector ships={sizeShip} onSelectShip={selectShip} />
            <GameControls onStartGame={startGame} disabled={gameStarted} />
            <Board player="pc" matrix={pcMatrix} onSquareClick={() => {}} />
        </div>
    );
};

export default App;
