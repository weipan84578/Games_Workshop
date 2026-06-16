import { isSolved } from './PourLogic.js';

export function checkWin(tubes) {
  return isSolved(tubes);
}

export function calculateStars({ difficulty, moves, time, optimalMoves, timeBenchmark, hintsUsed, undoCount }) {
  const moveRatio = optimalMoves > 0 ? moves / optimalMoves : 1;
  const timeRatio = timeBenchmark > 0 ? time / timeBenchmark : 1;

  if (difficulty === 'easy') {
    if (moveRatio <= 1.3) return 3;
    if (moveRatio <= 1.8) return 2;
    return 1;
  }

  if (difficulty === 'hard') {
    if (moveRatio <= 1.2 && timeRatio <= 1.3 && undoCount === 0 && hintsUsed === 0) return 3;
    if (moveRatio <= 1.5 && timeRatio <= 2.0) return 2;
    return 1;
  }

  if (moveRatio <= 1.3 && timeRatio <= 1.5) return 3;
  if (moveRatio <= 1.8 && timeRatio <= 2.0) return 2;
  return 1;
}
