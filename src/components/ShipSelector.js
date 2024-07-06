// ShipSelector.js
import React from 'react';
import '../ShipSelector.css';

const ShipSelector = ({ ships, onSelectShip }) => {
    return (
        <div className="ship-selector">
            <h2>Selecciona un barco:</h2>
            {ships.map((size, index) => (
                <div key={index} className="ship-option" onClick={() => onSelectShip(index)}>
                    Barco {size}
                </div>
            ))}
        </div>
    );
};

export default ShipSelector;
