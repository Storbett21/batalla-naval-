import React from 'react';
import { useGameContext } from './GameContext';

const ShipSelection = () => {
  const { state, dispatch } = useGameContext();

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

  return (
    <div className="ship-selection">
      <h2>Selecciona tu barco:</h2>
      {state.quantityShip.map((quantity, index) => (
        <div key={index}>
          {quantity > 0 && (
            <div>
              <button className={`horizontal ${index}`} onClick={selectShip}>
                Barco {index + 1} (Horizontal)
              </button>
              <button className={`vertical ${index}`} onClick={selectShip}>
                Barco {index + 1} (Vertical)
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShipSelection;
