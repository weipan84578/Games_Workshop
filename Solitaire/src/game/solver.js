import { canMoveToTableau, canMoveToFoundation, getMovableCards } from './rules.js';

export function findHint(state, freeEmpty = false) {
  const { tableaus, foundations, waste, stock } = state;

  // Priority 1: Move to foundation
  if (waste.length > 0) {
    const card = waste[waste.length - 1];
    for (let f = 0; f < 4; f++) {
      if (canMoveToFoundation(card, foundations[f])) {
        return { type: 'move', from: 'waste', to: `foundation_${f}`, cards: [card] };
      }
    }
  }
  for (let t = 0; t < 7; t++) {
    if (tableaus[t].length === 0) continue;
    const card = tableaus[t][tableaus[t].length - 1];
    if (!card.faceUp) continue;
    for (let f = 0; f < 4; f++) {
      if (canMoveToFoundation(card, foundations[f])) {
        return { type: 'move', from: `tableau_${t}`, to: `foundation_${f}`, cards: [card] };
      }
    }
  }

  // Priority 2: Tableau moves that reveal face-down cards
  for (let from = 0; from < 7; from++) {
    const pile = tableaus[from];
    const movable = getMovableCards(tableaus, from);
    if (movable.length === 0) continue;
    const wouldReveal = pile.length > movable.length && !pile[pile.length - movable.length - 1].faceUp;
    if (!wouldReveal) continue;
    for (let to = 0; to < 7; to++) {
      if (from === to) continue;
      if (canMoveToTableau(movable[0], tableaus[to], freeEmpty)) {
        return { type: 'move', from: `tableau_${from}`, to: `tableau_${to}`, cards: movable };
      }
    }
  }

  // Priority 3: Any tableau-to-tableau
  for (let from = 0; from < 7; from++) {
    const movable = getMovableCards(tableaus, from);
    if (movable.length === 0) continue;
    for (let to = 0; to < 7; to++) {
      if (from === to) continue;
      if (canMoveToTableau(movable[0], tableaus[to], freeEmpty)) {
        if (tableaus[from].length === movable.length && tableaus[to].length === 0) continue;
        return { type: 'move', from: `tableau_${from}`, to: `tableau_${to}`, cards: movable };
      }
    }
  }

  // Priority 4: Waste to tableau
  if (waste.length > 0) {
    const card = waste[waste.length - 1];
    for (let t = 0; t < 7; t++) {
      if (canMoveToTableau(card, tableaus[t], freeEmpty)) {
        return { type: 'move', from: 'waste', to: `tableau_${t}`, cards: [card] };
      }
    }
  }

  // Priority 5: Draw from stock
  if (stock.length > 0) {
    return { type: 'draw' };
  }

  return null;
}
