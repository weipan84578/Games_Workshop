export function canMoveToTableau(card, targetPile, opts = {}) {
  const { freeEmpty = false, stackMode = 'alt-color' } = opts;
  if (targetPile.length === 0) return freeEmpty || card.rank === 13;
  const top = targetPile[targetPile.length - 1];
  if (!top.faceUp) return false;
  if (top.rank !== card.rank + 1) return false;
  if (stackMode === 'same-suit') return top.suit === card.suit;
  if (stackMode === 'any') return true;
  return top.color !== card.color; // alt-color (default)
}

export function canMoveToFoundation(card, foundationPile) {
  if (foundationPile.length === 0) return card.rank === 1;
  const top = foundationPile[foundationPile.length - 1];
  return top.suit === card.suit && top.rank === card.rank - 1;
}

export function getMovableCards(tableau, colIndex, opts = {}) {
  const { stackMode = 'alt-color' } = opts;
  const pile = tableau[colIndex];
  if (pile.length === 0) return [];
  let startIdx = pile.length - 1;
  while (startIdx > 0 && pile[startIdx - 1].faceUp) {
    const upper = pile[startIdx - 1];
    const lower = pile[startIdx];
    if (upper.rank !== lower.rank + 1) break;
    if (stackMode === 'same-suit' && upper.suit !== lower.suit) break;
    if (stackMode === 'alt-color' && upper.color === lower.color) break;
    // stackMode === 'any': 只需遞減 rank，不限花色
    startIdx--;
  }
  if (!pile[startIdx].faceUp) return [];
  return pile.slice(startIdx);
}

export function hasAnyMove(state, opts = {}) {
  const { tableaus, foundations, waste, stock } = state;
  if (stock.length > 0) return true;
  const allCards = [];
  if (waste.length > 0) allCards.push({ card: waste[waste.length - 1], from: 'waste' });
  for (let t = 0; t < 7; t++) {
    const movable = getMovableCards(tableaus, t, opts);
    if (movable.length > 0) allCards.push({ card: movable[0], from: `tableau_${t}`, cards: movable });
  }
  for (const { card, from, cards } of allCards) {
    for (let f = 0; f < 4; f++) {
      if (canMoveToFoundation(card, foundations[f])) return true;
    }
    const moveCards = cards || [card];
    for (let t = 0; t < 7; t++) {
      if (from === `tableau_${t}`) continue;
      if (canMoveToTableau(moveCards[0], tableaus[t], opts)) return true;
    }
  }
  return false;
}
