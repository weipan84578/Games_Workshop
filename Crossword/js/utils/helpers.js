(function () {
  const DIRECTIONS = {
    ACROSS: "across",
    DOWN: "down",
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function formatTime(totalSeconds) {
    const safe = Math.max(0, Number(totalSeconds) || 0);
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${pad2(minutes)}:${pad2(seconds)}`;
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function cellKey(row, col) {
    return `${row}:${col}`;
  }

  function directionLabel(direction) {
    return direction === DIRECTIONS.DOWN ? "縱向" : "橫向";
  }

  function calcCellSize(puzzleSize, containerWidth) {
    const minCell = 32;
    const maxCell = 60;
    const calculated = Math.floor(containerWidth / puzzleSize);
    return clamp(calculated, minCell, maxCell);
  }

  function createPuzzle(config) {
    const rows = config.size.rows;
    const cols = config.size.cols;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    const clues = {
      across: normalizeClues(config.clues.across || [], DIRECTIONS.ACROSS),
      down: normalizeClues(config.clues.down || [], DIRECTIONS.DOWN),
    };

    [...clues.across, ...clues.down].forEach((entry) => {
      const answer = entry.answer.toUpperCase();
      [...answer].forEach((letter, index) => {
        const row = entry.row + (entry.direction === DIRECTIONS.DOWN ? index : 0);
        const col = entry.col + (entry.direction === DIRECTIONS.ACROSS ? index : 0);
        if (row < 0 || row >= rows || col < 0 || col >= cols) {
          throw new Error(`Puzzle ${config.id}: ${answer} is outside the grid.`);
        }
        const current = grid[row][col];
        if (current !== 0 && current !== letter) {
          throw new Error(`Puzzle ${config.id}: conflict at ${row},${col}.`);
        }
        grid[row][col] = letter;
      });
    });

    assignNumbers(clues);

    return {
      id: config.id,
      difficulty: config.difficulty,
      title: config.title,
      subtitle: config.subtitle || "",
      hints: config.hints,
      size: { rows, cols },
      grid,
      clues,
    };
  }

  function normalizeClues(list, direction) {
    return list.map((entry) => ({
      number: entry.number || null,
      row: entry.row,
      col: entry.col,
      direction,
      answer: entry.answer.toUpperCase(),
      clue: entry.clue,
    }));
  }

  function assignNumbers(clues) {
    const starts = new Map();
    [...clues.across, ...clues.down]
      .sort((a, b) => a.row - b.row || a.col - b.col || a.direction.localeCompare(b.direction))
      .forEach((entry) => {
        const key = cellKey(entry.row, entry.col);
        if (!starts.has(key)) {
          starts.set(key, starts.size + 1);
        }
        entry.number = starts.get(key);
      });
  }

  window.Helpers = {
    DIRECTIONS,
    $,
    $all,
    clamp,
    formatTime,
    deepClone,
    cellKey,
    directionLabel,
    calcCellSize,
  };

  window.CrosswordDataTools = {
    createPuzzle,
  };
})();
