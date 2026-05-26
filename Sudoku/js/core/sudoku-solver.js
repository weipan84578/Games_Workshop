(function (global) {
  "use strict";

  const SIZE = 9;
  const CELL_COUNT = 81;
  const FULL_MASK = 0b1111111110;

  function boxIndex(row, col) {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  }

  function bitCount(mask) {
    let count = 0;
    while (mask) {
      mask &= mask - 1;
      count += 1;
    }
    return count;
  }

  function shuffle(values) {
    const copy = values.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function valuesFromMask(mask, randomize) {
    const values = [];
    for (let value = 1; value <= 9; value += 1) {
      if (mask & (1 << value)) {
        values.push(value);
      }
    }
    return randomize ? shuffle(values) : values;
  }

  function createMasks(board) {
    const rows = Array(SIZE).fill(0);
    const cols = Array(SIZE).fill(0);
    const boxes = Array(SIZE).fill(0);

    for (let index = 0; index < CELL_COUNT; index += 1) {
      const value = board[index];
      if (!value) {
        continue;
      }

      const row = Math.floor(index / SIZE);
      const col = index % SIZE;
      const box = boxIndex(row, col);
      const bit = 1 << value;

      if ((rows[row] & bit) || (cols[col] & bit) || (boxes[box] & bit)) {
        return null;
      }

      rows[row] |= bit;
      cols[col] |= bit;
      boxes[box] |= bit;
    }

    return { rows, cols, boxes };
  }

  function candidateMask(row, col, masks) {
    return FULL_MASK & ~(masks.rows[row] | masks.cols[col] | masks.boxes[boxIndex(row, col)]);
  }

  function findBestCell(board, masks) {
    let bestIndex = -1;
    let bestMask = 0;
    let bestCount = 10;

    for (let index = 0; index < CELL_COUNT; index += 1) {
      if (board[index]) {
        continue;
      }

      const row = Math.floor(index / SIZE);
      const col = index % SIZE;
      const mask = candidateMask(row, col, masks);
      const count = bitCount(mask);

      if (count === 0) {
        return { index, mask: 0, count: 0 };
      }

      if (count < bestCount) {
        bestIndex = index;
        bestMask = mask;
        bestCount = count;
        if (count === 1) {
          break;
        }
      }
    }

    return { index: bestIndex, mask: bestMask, count: bestCount };
  }

  function setValue(board, masks, index, value) {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const box = boxIndex(row, col);
    const bit = 1 << value;

    board[index] = value;
    masks.rows[row] |= bit;
    masks.cols[col] |= bit;
    masks.boxes[box] |= bit;
  }

  function unsetValue(board, masks, index, value) {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const box = boxIndex(row, col);
    const bit = ~(1 << value);

    board[index] = 0;
    masks.rows[row] &= bit;
    masks.cols[col] &= bit;
    masks.boxes[box] &= bit;
  }

  function solve(board, options) {
    const randomize = Boolean(options && options.randomize);
    const working = board.slice();
    const masks = createMasks(working);

    if (!masks) {
      return null;
    }

    function search() {
      const best = findBestCell(working, masks);
      if (best.index === -1) {
        return true;
      }
      if (best.count === 0) {
        return false;
      }

      const values = valuesFromMask(best.mask, randomize);
      for (const value of values) {
        setValue(working, masks, best.index, value);
        if (search()) {
          return true;
        }
        unsetValue(working, masks, best.index, value);
      }
      return false;
    }

    return search() ? working : null;
  }

  function countSolutions(board, limit) {
    const maxSolutions = limit || 2;
    const working = board.slice();
    const masks = createMasks(working);
    let count = 0;

    if (!masks) {
      return 0;
    }

    function search() {
      if (count >= maxSolutions) {
        return;
      }

      const best = findBestCell(working, masks);
      if (best.index === -1) {
        count += 1;
        return;
      }
      if (best.count === 0) {
        return;
      }

      const values = valuesFromMask(best.mask, false);
      for (const value of values) {
        setValue(working, masks, best.index, value);
        search();
        unsetValue(working, masks, best.index, value);
        if (count >= maxSolutions) {
          return;
        }
      }
    }

    search();
    return count;
  }

  function generateSolvedBoard() {
    return solve(Array(CELL_COUNT).fill(0), { randomize: true });
  }

  global.SudokuSolver = {
    CELL_COUNT,
    SIZE,
    boxIndex,
    solve,
    countSolutions,
    generateSolvedBoard,
    candidateMask,
  };
})(window);
