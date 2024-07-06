import React, { createContext, useReducer, useContext } from 'react';

const GameContext = createContext();

const initialState = {
  matrix: Array.from({ length: 10 }, () => Array(10).fill("")),
  matrixAttack: Array.from({ length: 10 }, () => Array(10).fill("")),
  ship: {},
  quantityShip: [1, 1, 1, 2],
  quantityShipPC: [1, 1, 1, 2],
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SHIP':
      return { ...state, ship: action.payload };
    case 'SET_MATRIX':
      return { ...state, matrix: action.payload };
    case 'SET_MATRIX_ATTACK':
      return { ...state, matrixAttack: action.payload };
    case 'DECREMENT_QUANTITY_SHIP':
      const newQuantityShip = [...state.quantityShip];
      newQuantityShip[action.payload] -= 1;
      return { ...state, quantityShip: newQuantityShip };
    case 'DECREMENT_QUANTITY_SHIP_PC':
      const newQuantityShipPC = [...state.quantityShipPC];
      newQuantityShipPC[action.payload] -= 1;
      return { ...state, quantityShipPC: newQuantityShipPC };
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);