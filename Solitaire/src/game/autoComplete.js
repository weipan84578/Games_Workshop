import { canMoveToFoundation } from './rules.js';

export function checkCanAutoComplete(state) {
  for (const col of state.tableaus) {
    if (col.some(c => !c.faceUp)) return false;
  }
  return state.stock.length === 0 && state.waste.length <= 1 || state.waste.every(c => c.faceUp);
}

export function getNextAutoMove(state) {
  for (let t = 0; t < 7; t++) {
    const pile = state.tableaus[t];
    if (pile.length === 0) continue;
    const card = pile[pile.length - 1];
    for (let f = 0; f < 4; f++) {
      if (canMoveToFoundation(card, state.foundations[f])) {
        return { from: `tableau_${t}`, to: `foundation_${f}`, card };
      }
    }
  }
  if (state.waste.length > 0) {
    const card = state.waste[state.waste.length - 1];
    for (let f = 0; f < 4; f++) {
      if (canMoveToFoundation(card, state.foundations[f])) {
        return { from: 'waste', to: `foundation_${f}`, card };
      }
    }
  }
  return null;
}
