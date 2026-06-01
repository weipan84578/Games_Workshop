(function () {
  function isCellCorrect(model, userGrid, row, col) {
    const cell = model.cells[row][col];
    if (!cell || cell.isBlack) {
      return true;
    }
    const userCell = userGrid[row][col];
    return Boolean(userCell && userCell.letter && userCell.letter.toUpperCase() === cell.answer);
  }

  function validateAll(model, userGrid) {
    let mistakes = 0;
    const cells = model.playableCells || model.cells.flat().filter((cell) => !cell.isBlack);
    cells.forEach((cell) => {
      const userCell = userGrid[cell.row][cell.col];
      if (!userCell || !userCell.letter) {
        return;
      }
      const correct = isCellCorrect(model, userGrid, cell.row, cell.col);
      userCell.status = correct ? "correct" : "wrong";
      if (!correct) {
        mistakes += 1;
      }
    });
    return mistakes;
  }

  function completion(model, userGrid) {
    const cells = model.playableCells || model.cells.flat().filter((cell) => !cell.isBlack);
    let filled = 0;
    let correct = 0;
    cells.forEach((cell) => {
      const userCell = userGrid[cell.row][cell.col];
      if (userCell && userCell.letter) {
        filled += 1;
      }
      if (isCellCorrect(model, userGrid, cell.row, cell.col)) {
        correct += 1;
      }
    });
    return {
      total: cells.length,
      filled,
      correct,
      percent: cells.length ? Math.round((filled / cells.length) * 100) : 0,
    };
  }

  function isEntryComplete(model, userGrid, entryId) {
    const entry = model.entries.get(entryId);
    if (!entry) {
      return false;
    }
    return entry.cells.every((cell) => isCellCorrect(model, userGrid, cell.row, cell.col));
  }

  function isPuzzleComplete(model, userGrid) {
    const result = completion(model, userGrid);
    return result.total > 0 && result.correct === result.total;
  }

  window.Solver = {
    isCellCorrect,
    validateAll,
    completion,
    isEntryComplete,
    isPuzzleComplete,
  };
})();
