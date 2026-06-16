export const TUBE_CAPACITY = 4;

export function deepCopyTubes(tubes) {
  return tubes.map((tube) => [...tube]);
}

export function getTopColor(tube) {
  return tube.length ? tube[tube.length - 1] : null;
}

export function getEmptyCount(tube) {
  return TUBE_CAPACITY - tube.length;
}

export function isComplete(tube) {
  return tube.length === TUBE_CAPACITY && tube.every((color) => color === tube[0]);
}

export function isSolved(tubes) {
  return tubes.every((tube) => tube.length === 0 || isComplete(tube));
}

export function countTopLayers(tube, color = getTopColor(tube)) {
  if (!color) return 0;
  let amount = 0;
  for (let i = tube.length - 1; i >= 0; i -= 1) {
    if (tube[i] !== color) break;
    amount += 1;
  }
  return amount;
}

export function canPour(tubes, fromIdx, toIdx, options = {}) {
  const { lockCompleted = true } = options;
  if (fromIdx === toIdx) return false;
  const from = tubes[fromIdx];
  const to = tubes[toIdx];
  if (!from || !to) return false;

  const fromTop = getTopColor(from);
  const toTop = getTopColor(to);
  const toSpace = getEmptyCount(to);

  if (!fromTop) return false;
  if (toSpace === 0) return false;
  if (toTop !== null && toTop !== fromTop) return false;
  if (lockCompleted && isComplete(from)) return false;
  return true;
}

export function pour(tubes, fromIdx, toIdx, options = {}) {
  if (!canPour(tubes, fromIdx, toIdx, options)) {
    return { tubes: deepCopyTubes(tubes), amount: 0, color: null };
  }

  const next = deepCopyTubes(tubes);
  const fromTop = getTopColor(next[fromIdx]);
  const layers = countTopLayers(next[fromIdx], fromTop);
  const space = getEmptyCount(next[toIdx]);
  const amount = Math.min(layers, space);

  for (let i = 0; i < amount; i += 1) {
    next[toIdx].push(next[fromIdx].pop());
  }

  return { tubes: next, amount, color: fromTop };
}

export function getValidMoves(tubes, options = {}) {
  const moves = [];
  for (let from = 0; from < tubes.length; from += 1) {
    for (let to = 0; to < tubes.length; to += 1) {
      if (canPour(tubes, from, to, options)) {
        moves.push({ from, to });
      }
    }
  }
  return moves;
}
