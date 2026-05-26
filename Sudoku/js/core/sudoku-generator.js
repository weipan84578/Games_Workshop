(function (global) {
  "use strict";

  const DIFFICULTY_BLANKS = {
    easy: 36,
    medium: 46,
    hard: 52,
    expert: 58,
  };

  function shuffle(values) {
    const copy = values.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function generate(difficulty) {
    const targetBlanks = typeof difficulty === "number"
      ? difficulty
      : DIFFICULTY_BLANKS[difficulty] || DIFFICULTY_BLANKS.easy;

    let best = null;

    for (let attempt = 0; attempt < 60; attempt += 1) {
      const solution = global.SudokuSolver.generateSolvedBoard();
      const puzzle = solution.slice();
      const order = shuffle(Array.from({ length: 81 }, (_, index) => index));
      let blanks = 0;

      for (const index of order) {
        const previous = puzzle[index];
        puzzle[index] = 0;

        if (global.SudokuSolver.countSolutions(puzzle, 2) === 1) {
          blanks += 1;
          if (blanks >= targetBlanks) {
            return { puzzle, solution, blanks };
          }
        } else {
          puzzle[index] = previous;
        }
      }

      if (!best || blanks > best.blanks) {
        best = { puzzle: puzzle.slice(), solution, blanks };
      }
    }

    return best;
  }

  global.SudokuGenerator = {
    DIFFICULTY_BLANKS,
    generate,
  };
})(window);
