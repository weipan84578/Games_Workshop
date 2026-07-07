(function initRules(global) {
  const CF = global.CF || (global.CF = {});
  const { ROWS, COLUMNS, EMPTY } = CF.constants;
  const DIRECTIONS = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];

  function inBounds(row, column) {
    return row >= 0 && row < ROWS && column >= 0 && column < COLUMNS;
  }

  function collectLine(board, row, column, piece, deltaRow, deltaColumn) {
    const line = [{ row, column }];

    for (const direction of [-1, 1]) {
      let nextRow = row + deltaRow * direction;
      let nextColumn = column + deltaColumn * direction;
      while (inBounds(nextRow, nextColumn) && board[nextRow][nextColumn] === piece) {
        line.push({ row: nextRow, column: nextColumn });
        nextRow += deltaRow * direction;
        nextColumn += deltaColumn * direction;
      }
    }

    return line;
  }

  function getWinningLine(board, row, column, piece) {
    if (!piece || piece === EMPTY) return [];
    for (const [deltaRow, deltaColumn] of DIRECTIONS) {
      const line = collectLine(board, row, column, piece, deltaRow, deltaColumn);
      if (line.length >= 4) {
        return line.slice(0, 4);
      }
    }
    return [];
  }

  function findWinner(board) {
    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLUMNS; column += 1) {
        const piece = board[row][column];
        if (piece !== EMPTY) {
          const line = getWinningLine(board, row, column, piece);
          if (line.length) {
            return { winner: piece, line };
          }
        }
      }
    }
    return null;
  }

  function isDraw(board) {
    return CF.board.getValidColumns(board).length === 0 && !findWinner(board);
  }

  CF.rules = { getWinningLine, findWinner, isDraw };
})(window);
