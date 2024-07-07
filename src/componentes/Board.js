import React, { useState } from 'react';
import '../Board.css'; // Importa el archivo de estilos CSS

const sizeShip = [5, 4, 3, 2];
const positionArray = ["horizontal", "vertical"];

const Board = () => {
  // Estado para los tableros y matrices
  const [matrix, setMatrix] = useState(Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => '')));
  const [matrixAttack, setMatrixAttack] = useState(Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => '')));

  // Estado para los barcos del jugador y del PC
  const [quantityShip, setQuantityShip] = useState([1, 1, 1, 2]);
  const [quantityShipPC, setQuantityShipPC] = useState([1, 1, 1, 2]);

  // Estado para el barco seleccionado por el jugador y el barco aleatorio para el PC
  const [selectedShip, setSelectedShip] = useState({});

  // Estado para controlar si se muestra el tablero del PC
  const [showPCTab, setShowPCTab] = useState(false);

  // Función para crear la matriz del tablero (jugador o PC)
  const createMatrix = (boardType, matrixType, onClick, type) => {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const cells = [];
      for (let j = 0; j < 10; j++) {
        let cellClass = '';
        if (type === 'pc') {
          // Si es el tablero de ataque del PC, mostrar solo hits y misses
          cellClass = matrixType[i][j] === 'hit' ? 'hit' : matrixType[i][j] === 'miss' ? 'miss' : '';
        } else {
          // Para el tablero del jugador, mostrar los barcos y los disparos
          cellClass = matrixType[i][j] === 'ship' ? 'ship' : matrixType[i][j] === 'hit' ? 'hit' : matrixType[i][j] === 'miss' ? 'miss' : '';
        }
        cells.push(
          <div
            key={`${i},${j}`}
            className={`grid ${cellClass}`}
            id={`${i},${j},${type}`}
            onClick={() => onClick(i, j)}
          />
        );
      }
      rows.push(<div key={i} className="myRow">{cells}</div>);
    }
    return rows;
  };

  // Función para seleccionar un barco por el jugador
  const selectShip = (event) => {
    const shipData = event.target.className.split(" ");
    setSelectedShip({
      position: shipData[0],
      size: sizeShip[shipData[1]],
      quantity: quantityShip[shipData[1]],
      id: shipData[1]
    });
  };

  // Función para seleccionar la posición de los barcos
  const selectPosition = (x, y) => {
    if (selectedShip.quantity > 0) {
      if (selectedShip.position === "horizontal") {
        if ((y + (selectedShip.size - 1)) < 10) {
          const newMatrix = [...matrix];
          for (let i = y; i < (y + selectedShip.size); i++) {
            newMatrix[x][i] = "ship";
          }
          setMatrix(newMatrix);
          setSelectedShip({});
        } else {
          alert("Selecciona una posición válida");
        }
      } else if (selectedShip.position === "vertical") {
        if ((x + (selectedShip.size - 1)) < 10) {
          const newMatrix = [...matrix];
          for (let i = x; i < (x + selectedShip.size); i++) {
            newMatrix[i][y] = "ship";
          }
          setMatrix(newMatrix);
          setSelectedShip({});
        } else {
          alert("Selecciona una posición válida");
        }
      }
    } else {
      alert("Debes seleccionar un barco disponible");
    }
  };

  // Función para iniciar el juego
  const startGame = () => {
    setShowPCTab(true); // Mostrar el tablero de ataque del PC al iniciar el juego
    selectPositionRandom();
    // Aquí puedes deshabilitar el botón de iniciar juego si es necesario
  };

  // Función para generar posiciones aleatorias para el PC
  const selectPositionRandom = () => {
    const newMatrixAttack = [...matrixAttack];
    quantityShipPC.forEach((quantity, index) => {
      let count = quantity;
      while (count > 0) {
        generateRandomShip(index, newMatrixAttack);
        count--;
      }
    });
    setMatrixAttack(newMatrixAttack);
  };

  // Función para generar un barco aleatorio para el PC
  const generateRandomShip = (shipIndex, matrix) => {
    const position = positionArray[Math.floor(Math.random() * positionArray.length)];
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    const size = sizeShip[shipIndex];

    if (position === 'horizontal' && y + size <= 10) {
      let validPosition = true;
      for (let i = y; i < y + size; i++) {
        if (matrix[x][i] === 'ship') {
          validPosition = false;
          break;
        }
      }
      if (validPosition) {
        for (let i = y; i < y + size; i++) {
          matrix[x][i] = 'ship';
        }
      } else {
        generateRandomShip(shipIndex, matrix); // Intentar de nuevo si la posición no es válida
      }
    } else if (position === 'vertical' && x + size <= 10) {
      let validPosition = true;
      for (let i = x; i < x + size; i++) {
        if (matrix[i][y] === 'ship') {
          validPosition = false;
          break;
        }
      }
      if (validPosition) {
        for (let i = x; i < x + size; i++) {
          matrix[i][y] = 'ship';
        }
      } else {
        generateRandomShip(shipIndex, matrix); // Intentar de nuevo si la posición no es válida
      }
    } else {
      generateRandomShip(shipIndex, matrix); // Intentar de nuevo si la posición no es válida
    }
  };

  // Función para verificar si el disparo del jugador alcanza un barco enemigo
  const checkShot = (x, y) => {
    if (matrixAttack[x][y] === 'ship') {
      alert("¡Muy bien, acertaste! Vuelve a jugar.");
      matrixAttack[x][y] = 'hit';
      document.getElementById(`${x},${y},pc`).classList.add('hit');
      checkWinner(matrixAttack, "player");
    } else {
      alert("¡Mal! Tu disparo cayó al agua.");
      matrixAttack[x][y] = 'miss';
      document.getElementById(`${x},${y},pc`).classList.add('miss');
      shotPc(); // Turno del PC
    }
  };

  // Función para el turno del PC
  const shotPc = () => {
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    if (matrix[x][y] === 'ship') {
      alert("¡Ops! Te han disparado.");
      matrix[x][y] = 'hit';
      document.getElementById(`${x},${y},player`).classList.add('hit');
      checkWinner(matrix, "pc"); // Verificar si el PC ganó
      return shotPc(); // El PC dispara de nuevo si acertó
    } else if (matrix[x][y] === 'hit' || matrix[x][y] === 'miss') {
      return shotPc(); // El PC dispara de nuevo si ya disparó allí antes
    } else {
      alert("¡El disparo de la maquina cayó al agua!");
      matrix[x][y] = 'miss';
      document.getElementById(`${x},${y},player`).classList.add('miss');
    }
  };

  // Función para verificar si hay un ganador
  const checkWinner = (matrix, player) => {
    for (let i = 0; i < 10; i++) {
      let arraychecked = matrix[i].filter((index) => { return index === 'ship' });
      if (arraychecked.length > 0) {
        return; // Aún hay barcos, el juego continúa
      }
    }
    if (player === "pc") {
      alert("¡Ha ganado la Maquina!");
    } else {
      alert("¡GANASTE!");
    }
  };

  return (
    <div className="boardContainer">
      <div className="boardType">
        {/* Renderiza el tablero del jugador */}
        {createMatrix(null, matrix, selectPosition, "player")}
      </div>
      <div className="shipsType">
        {/* Renderiza los barcos seleccionados por el jugador */}
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
      {/* Renderiza el tablero de ataque del PC solo si showPCTab es verdadero */}
      {showPCTab && (
        <div className="boardType">
          {createMatrix(null, matrixAttack, checkShot, "pc")}
        </div>
      )}
    </div>
  );
};

export default Board;
