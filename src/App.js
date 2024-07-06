import React, { useEffect } from 'react';
import { GameProvider, useGameContext } from './components/GameContext';
import ShipSelection from '../src/components/ShipSelection';
import Board from '../src/components/Board';



const Game = () => {
  const { state, dispatch } = useGameContext();

  useEffect(() => {
    createMatrix("player");
  }, []);

  const createMatrix = (type) => {
    let newMatrix = Array.from({ length: 10 }, () => Array(10).fill(""));
    dispatch({ type: type === "player" ? 'SET_MATRIX' : 'SET_MATRIX_ATTACK', payload: newMatrix });
  };

  const selectShip = (event) => {
    const shipData = event.target.className.split(" ");
    dispatch({
      type: 'SET_SHIP',
      payload: {
        position: shipData[0],
        size: [5, 4, 3, 2][shipData[1]],
        quantity: state.quantityShip[shipData[1]],
        id: shipData[1],
      },
    });
  };

  const selectPosition = (event) => {
    if (state.ship.quantity > 0) {
      const grid = event.target;
      const [x, y] = grid.id.split(",").map(Number);

      const newMatrix = [...state.matrix];
      if (state.ship.position === "horizontal" && (y + (state.ship.size - 1)) < 10) {
        for (let i = y; i < y + state.ship.size; i++) {
          newMatrix[x][i] = "ship";
        }
        dispatch({ type: 'SET_MATRIX', payload: newMatrix });
        dispatch({ type: 'DECREMENT_QUANTITY_SHIP', payload: state.ship.id });
        dispatch({ type: 'SET_SHIP', payload: {} });
      } else if (state.ship.position === "vertical" && (x + (state.ship.size - 1)) < 10) {
        for (let i = x; i < x + state.ship.size; i++) {
          newMatrix[i][y] = "ship";
        }
        dispatch({ type: 'SET_MATRIX', payload: newMatrix });
        dispatch({ type: 'DECREMENT_QUANTITY_SHIP', payload: state.ship.id });
        dispatch({ type: 'SET_SHIP', payload: {} });
      } else {
        alert("Selecciona una posición válida");
      }
    } else {
      alert("Debes seleccionar un barco disponible");
    }
  };

  const startGame = () => {
    createMatrix("pc");
    selectPositionRandom();
    document.querySelector("#button").disabled = true;
  };

  const selectPositionRandom = () => {
    const newMatrixAttack = [...state.matrixAttack];
    for (let i = 0; i < state.quantityShipPC.length; i++) {
      while (state.quantityShipPC[i] > 0) {
        random(newMatrixAttack, i);
        dispatch({ type: 'DECREMENT_QUANTITY_SHIP_PC', payload: i });
      }
    }
    dispatch({ type: 'SET_MATRIX_ATTACK', payload: newMatrixAttack });
  };

  const checkPosition = (pos, axis, size) => {
    if (state.ship.position === pos) {
      if ((axis + (size - 1)) < 10) {
        return true;
      } else {
        return false;
      }
    }
  };

  const random = (matrix, i) => {
    const positionArray = ["horizontal", "vertical"];
    const shipRandom = {
      position: positionArray[Math.floor(Math.random() * positionArray.length)],
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10)
    };

    if (checkPosition("horizontal", shipRandom.y, [5, 4, 3, 2][i])) {
      for (let j = shipRandom.y; j < shipRandom.y + [5, 4, 3, 2][i]; j++) {
        if (matrix[shipRandom.x][j] === "ship") {
          return random(matrix, i);
        }
      }
      for (let j = shipRandom.y; j < shipRandom.y + [5, 4, 3, 2][i]; j++) {
        matrix[shipRandom.x][j] = "ship";
      }
    } else if (checkPosition("vertical", shipRandom.x, [5, 4, 3, 2][i])) {
      for (let j = shipRandom.x; j < shipRandom.x + [5, 4, 3, 2][i]; j++) {
        if (matrix[j][shipRandom.y] === "ship") {
          return random(matrix, i);
        }
      }
      for (let j = shipRandom.x; j < shipRandom.x + [5, 4, 3, 2][i]; j++) {
        matrix[j][shipRandom.y] = "ship";
      }
    } else {
      return random(matrix, i);
    }
  };

  const checkShot = (event) => {
    const grid = event.target;
    const [x, y] = grid.id.split(",").map(Number);

    if (state.matrixAttack[x][y] === "ship") {
      alert("Muy bien, acertaste. Vuelve a jugar");
      const newMatrixAttack = [...state.matrixAttack];
      newMatrixAttack[x][y] = "hit";
      dispatch({ type: 'SET_MATRIX_ATTACK', payload: newMatrixAttack });
      checkWinner(newMatrixAttack, "player");
    } else {
      alert("Mal! tu disparo cayó al agua");
      const newMatrixAttack = [...state.matrixAttack];
      newMatrixAttack[x][y] = "miss";
      dispatch({ type: 'SET_MATRIX_ATTACK', payload: newMatrixAttack });
      shotPc();
    }
  };

  const shotPc = () => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    if (state.matrix[x][y] === "ship") {
      alert("Ops! te han disparado");
      const newMatrix = [...state.matrix];
      newMatrix[x][y] = "hit";
      dispatch({ type: 'SET_MATRIX', payload: newMatrix });
      checkWinner(newMatrix, "pc");
      shotPc();
    } else if (state.matrix[x][y] === "hit" || state.matrix[x][y] === "miss") {
      shotPc();
    } else {
      alert("El disparo del pc cayó al agua");
      const newMatrix = [...state.matrix];
      newMatrix[x][y] = "miss";
      dispatch({ type: 'SET_MATRIX', payload: newMatrix });
    }
  };

  const checkWinner = (matrix, player) => {
    for (let i = 0; i < 10; i++) {
      if (matrix[i].includes("ship")) {
        return;
      }
    }
    if (player === "pc") {
      alert("Ha ganado el PC");
    } else {
      alert("GANASTE!!!");
    }
  };

  return (
    <div className="container">
      <h1>BattleShip</h1>
      <h3>Selecciona la posición de tus naves</h3>
      <div className="row">
        <div className="col">
          <div id="board">
            <Board type="Player" />
          </div>
        </div>
        <div className="col">
          <div id="boardAttack">
            <Board type="PC" />
          </div>
        </div>
      </div>
      <h4>Tus naves:</h4>
      <div id="ships" className="row">
        <ShipSelection />
      </div>
      <div className="row">
        <button id="button" onClick={startGame}>Empezar juego</button>
      </div>
    </div>
  );
};

const App = () => (
  <GameProvider>
    <Game />
  </GameProvider>
);

export default App;