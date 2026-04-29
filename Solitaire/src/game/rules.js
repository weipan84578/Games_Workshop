export function canMoveToTableau(card, targetPile, freeEmpty = false) {
  if (targetPile.length === 0) return freeEmpty || card.rank === 13;
  const top = targetPile[targetPile.length - 1];
  if (!top.faceUp) return false;
  return top.rank === card.rank + 1 && top.color !== card.color;
}

export function canMoveToFoundation(card, foundationPile) {
  if (foundationPile.length === 0) return card.rank === 1;
  const top = foundationPile[foundationPile.length - 1];
  return top.suit === card.suit && top.rank === card.rank - 1;
}

export function getMovableCards(tableau, colIndex) {
  const pile = tableau[colIndex];
  if (pile.length === 0) return [];
  let startIdx = pile.length - 1;
  while (startIdx > 0 && pile[startIdx - 1].faceUp) {
    const upper = pile[startIdx - 1];
    const lower = pile[startIdx];
    if (upper.rank === lower.rank + 1 && upper.color !== lower.color) {
      startIdx--;
    } else {
      break;
    }
  }
  if (!pile[startIdx].faceUp) return [];
  return pile.slice(startIdx);
}

export function hasAnyMove(state, freeEmpty = false) {
  const { tableaus, foundations, waste, stock } = state;
  if (stock.length > 0) return true;
  const allCards = [];
  if (waste.length > 0) allCards.push({ card: waste[waste.length - 1], from: 'waste' });
  for (let t = 0; t < 7; t++) {
    const movable = getMovableCards(tableaus, t);
    if (movable.length > 0) allCards.push({ card: movable[0], from: `tableau_${t}`, cards: movable });
  }
  for (const { card, from, cards } of allCards) {
    for (let f = 0; f < 4; f++) {
      if (canMoveToFoundation(card, foundations[f])) return true;
    }
    const moveCards = cards || [card];
    for (let t = 0; t < 7; t++) {
      if (from === `tableau_${t}`) continue;
      if (canMoveToTableau(moveCards[0], tableaus[t], freeEmpty)) return true;
    }
  }
  return false;
}
