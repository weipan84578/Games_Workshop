(function (global) {
  "use strict";

  function rowOf(index) {
    return Math.floor(index / 9);
  }

  function colOf(index) {
    return index % 9;
  }

  function boxOf(index) {
    return Math.floor(rowOf(index) / 3) * 3 + Math.floor(colOf(index) / 3);
  }

  function peersOf(index) {
    const peers = new Set();
    const row = rowOf(index);
    const col = colOf(index);
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 9; i += 1) {
      peers.add(row * 9 + i);
      peers.add(i * 9 + col);
    }

    for (let r = boxRow; r < boxRow + 3; r += 1) {
      for (let c = boxCol; c < boxCol + 3; c += 1) {
        peers.add(r * 9 + c);
      }
    }

    peers.delete(index);
    return Array.from(peers);
  }

  function isMoveValid(board, index, value) {
    if (!value) {
      return true;
    }

    return peersOf(index).every((peer) => board[peer] !== value);
  }

  function conflictsFor(board, index) {
    const value = board[index];
    if (!value) {
      return [];
    }

    return peersOf(index).filter((peer) => board[peer] === value);
  }

  function isComplete(board, solution) {
    if (!board || !solution || board.length !== 81 || solution.length !== 81) {
      return false;
    }

    return board.every((value, index) => value === solution[index]);
  }

  function completedUnits(board, solution) {
    const units = [];

    for (let row = 0; row < 9; row += 1) {
      const indexes = Array.from({ length: 9 }, (_, col) => row * 9 + col);
      if (indexes.every((index) => board[index] === solution[index])) {
        units.push({ type: "row", index: row, cells: indexes });
      }
    }

    for (let col = 0; col < 9; col += 1) {
      const indexes = Array.from({ length: 9 }, (_, row) => row * 9 + col);
      if (indexes.every((index) => board[index] === solution[index])) {
        units.push({ type: "col", index: col, cells: indexes });
      }
    }

    for (let box = 0; box < 9; box += 1) {
      const startRow = Math.floor(box / 3) * 3;
      const startCol = (box % 3) * 3;
      const indexes = [];
      for (let r = startRow; r < startRow + 3; r += 1) {
        for (let c = startCol; c < startCol + 3; c += 1) {
          indexes.push(r * 9 + c);
        }
      }
      if (indexes.every((index) => board[index] === solution[index])) {
        units.push({ type: "box", index: box, cells: indexes });
      }
    }

    return units;
  }

  global.SudokuValidator = {
    rowOf,
    colOf,
    boxOf,
    peersOf,
    isMoveValid,
    conflictsFor,
    isComplete,
    completedUnits,
  };
})(window);
