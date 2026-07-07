(function initHeuristic(global) {
  const CF = global.CF || (global.CF = {});
  const { ROWS, COLUMNS, EMPTY } = CF.constants;

  function scoreWindow(window, aiPiece, opponentPiece) {
    const aiCount = window.filter((cell) => cell === aiPiece).length;
    const opponentCount = window.filter((cell) => cell === opponentPiece).length;
    const emptyCount = window.filter((cell) => cell === EMPTY).length;

    if (aiCount === 4) return 100000;
    if (opponentCount === 4) return -100000;
    if (aiCount === 3 && emptyCount === 1) return 120;
    if (aiCount === 2 && emptyCount === 2) return 18;
    if (opponentCount === 3 && emptyCount === 1) return -150;
    if (opponentCount === 2 && emptyCount === 2) return -16;
    return 0;
  }

  function evaluateBoard(board, aiPiece, opponentPiece) {
    let score = 0;
    const centerColumn = Math.floor(COLUMNS / 2);
    const centerCount = board.map((row) => row[centerColumn]).filter((cell) => cell === aiPiece).length;
    score += centerCount * 10;

    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column <= COLUMNS - 4; column += 1) {
        score += scoreWindow(board[row].slice(column, column + 4), aiPiece, opponentPiece);
      }
    }

    for (let column = 0; column < COLUMNS; column += 1) {
      for (let row = 0; row <= ROWS - 4; row += 1) {
        score += scoreWindow([0, 1, 2, 3].map((offset) => board[row + offset][column]), aiPiece, opponentPiece);
      }
    }

    for (let row = 0; row <= ROWS - 4; row += 1) {
      for (let column = 0; column <= COLUMNS - 4; column += 1) {
        score += scoreWindow([0, 1, 2, 3].map((offset) => board[row + offset][column + offset]), aiPiece, opponentPiece);
      }
    }

    for (let row = 0; row <= ROWS - 4; row += 1) {
      for (let column = 3; column < COLUMNS; column += 1) {
        score += scoreWindow([0, 1, 2, 3].map((offset) => board[row + offset][column - offset]), aiPiece, opponentPiece);
      }
    }

    return score;
  }

  function orderedColumns(board) {
    const valid = CF.board.getValidColumns(board);
    const center = Math.floor(COLUMNS / 2);
    return valid.sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
  }

  CF.heuristic = { evaluateBoard, orderedColumns };
})(window);
