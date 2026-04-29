import { createDeck, shuffle, dealInitialState } from '../game/deck.js';

let _state = null;

export function getState() { return _state; }

export function initGame(drawMode = 1) {
  const deck = shuffle(createDeck());
  const { tableaus, stock } = dealInitialState(deck);
  _state = {
    stock, waste: [],
    foundations: [[], [], [], []],
    tableaus, score: 0, time: 0,
    moves: 0, drawMode,
    isWon: false, canAutoComplete: false,
    recycleCount: 0,
  };
  return _state;
}

export function setState(newState) {
  _state = JSON.parse(JSON.stringify(newState));
}

export function updateState(partial) {
  _state = { ..._state, ...partial };
}
