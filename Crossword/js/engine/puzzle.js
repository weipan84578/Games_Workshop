(function () {
  function buildModel(rawPuzzle) {
    const rows = rawPuzzle.size.rows;
    const cols = rawPuzzle.size.cols;
    const cells = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => {
        const value = rawPuzzle.grid[row][col];
        return {
          row,
          col,
          answer: value === 0 ? null : String(value).toUpperCase(),
          isBlack: value === 0,
          number: null,
          entries: [],
        };
      })
    );

    const entries = new Map();
    const grouped = {
      across: [],
      down: [],
    };

    ["across", "down"].forEach((direction) => {
      rawPuzzle.clues[direction].forEach((clue) => {
        const id = `${direction}-${clue.number}-${clue.row}-${clue.col}`;
        const entry = {
          id,
          number: clue.number,
          row: clue.row,
          col: clue.col,
          direction,
          answer: clue.answer.toUpperCase(),
          clue: clue.clue,
          cells: [],
        };
        [...entry.answer].forEach((letter, index) => {
          const row = clue.row + (direction === "down" ? index : 0);
          const col = clue.col + (direction === "across" ? index : 0);
          const cell = cells[row] && cells[row][col];
          if (!cell || cell.isBlack || cell.answer !== letter) {
            throw new Error(`Puzzle ${rawPuzzle.id}: clue ${entry.answer} does not match the grid.`);
          }
          if (index === 0) {
            cell.number = cell.number || clue.number;
          }
          cell.entries.push(id);
          entry.cells.push({ row, col });
        });
        entries.set(id, entry);
        grouped[direction].push(entry);
      });
    });

    const playableCells = cells.flat().filter((cell) => !cell.isBlack);

    return {
      id: rawPuzzle.id,
      title: rawPuzzle.title,
      subtitle: rawPuzzle.subtitle,
      difficulty: rawPuzzle.difficulty,
      hints: rawPuzzle.hints,
      rows,
      cols,
      cells,
      playableCells,
      entries,
      clues: grouped,
    };
  }

  function getByDifficulty(difficulty) {
    const puzzles = getAll().filter((puzzle) => puzzle.difficulty === difficulty);
    return puzzles[0] || null;
  }

  function getById(id) {
    return getAll().find((puzzle) => puzzle.id === id) || null;
  }

  function getAll() {
    return [
      ...(window.EASY_PUZZLES || []),
      ...(window.MEDIUM_PUZZLES || []),
      ...(window.HARD_PUZZLES || []),
    ];
  }

  function createEmptyUserGrid(model) {
    return model.cells.map((row) =>
      row.map((cell) =>
        cell.isBlack
          ? null
          : {
              letter: "",
              revealed: false,
              status: "",
            }
      )
    );
  }

  function sanitizeUserGrid(model, savedGrid) {
    const fallback = createEmptyUserGrid(model);
    if (!Array.isArray(savedGrid)) {
      return fallback;
    }
    return fallback.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (!cell) {
          return null;
        }
        const saved = savedGrid[rowIndex] && savedGrid[rowIndex][colIndex];
        if (!saved) {
          return cell;
        }
        const letter = typeof saved.letter === "string" ? saved.letter.slice(0, 1).toUpperCase() : "";
        return {
          letter,
          revealed: Boolean(saved.revealed),
          status: saved.status || "",
        };
      })
    );
  }

  window.PuzzleEngine = {
    buildModel,
    getAll,
    getByDifficulty,
    getById,
    createEmptyUserGrid,
    sanitizeUserGrid,
  };
})();
