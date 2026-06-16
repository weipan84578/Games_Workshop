import { canPour, getTopColor, getValidMoves, isComplete, isSolved, pour } from './PourLogic.js';

const MAX_DEPTH = 12;

function key(tubes) {
  return JSON.stringify(tubes);
}

function scoreMove(tubes, move) {
  const from = tubes[move.from];
  const to = tubes[move.to];
  const color = getTopColor(from);
  let score = 0;
  if (getTopColor(to) === color) score += 8;
  if (to.length === 0) score += 2;
  const result = pour(tubes, move.from, move.to).tubes;
  if (isComplete(result[move.to])) score += 14;
  if (result[move.from].length === 0) score += 5;
  return score;
}

function orderedMoves(tubes) {
  return getValidMoves(tubes).sort((a, b) => scoreMove(tubes, b) - scoreMove(tubes, a));
}

export function findHint(tubes, maxDepth = MAX_DEPTH) {
  if (isSolved(tubes)) return null;

  const startKey = key(tubes);
  const queue = [{ tubes, depth: 0, firstMove: null }];
  const visited = new Set([startKey]);
  let bestFallback = null;
  let bestScore = -Infinity;

  while (queue.length) {
    const node = queue.shift();
    if (node.depth >= maxDepth) continue;

    for (const move of orderedMoves(node.tubes)) {
      if (!canPour(node.tubes, move.from, move.to)) continue;
      const next = pour(node.tubes, move.from, move.to).tubes;
      const nextKey = key(next);
      if (visited.has(nextKey)) continue;
      visited.add(nextKey);

      const firstMove = node.firstMove ?? move;
      const moveScore = scoreMove(node.tubes, move);
      if (!bestFallback || moveScore > bestScore) {
        bestFallback = firstMove;
        bestScore = moveScore;
      }

      if (isSolved(next)) return firstMove;
      queue.push({ tubes: next, depth: node.depth + 1, firstMove });
    }
  }

  return bestFallback;
}
