import React from 'react';
import '../Ship.css'; 

const sizeShip = [5, 4, 3, 2];
const positionArray = ["horizontal", "vertical"];

function ShipSelector({ onSelect }) {
  const selectShip = (event) => {
    const shipData = event.target.className.split(" ");
    const ship = {
      position: shipData[0],
      size: sizeShip[shipData[1]],
      id: parseInt(shipData[1]) + 1 
    };
    onSelect(ship); // Llama a la función de selección pasando el objeto de barco
  };

  return (
    <div className="shipSelectorContainer">
      <h4>Tus naves:</h4>
      <div className="row" id="ships">
        {sizeShip.map((size, index) => (
          <div className="col ship" key={index}>
            <div>
              <span>{`Barco ${index + 1}`}</span><br />
              <span>{`Tamaño: ${size}`}</span>
            </div>
            <div className="position">{positionArray}</div>
          </div>
        ))}
      </div>

      {/* Botones de selección de barcos */}
      <div className="shipButtons">
        {sizeShip.map((size, index) => (
          <button key={index} className={`horizontal ${index}`} onClick={selectShip}>
            Seleccionar Barco {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ShipSelector;
