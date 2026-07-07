(function initEasyRandom(global) {
  const CF = global.CF || (global.CF = {});

  function winningColumn(board, piece) {
    const validColumns = CF.board.getValidColumns(board);
    for (const column of validColumns) {
      const copy = CF.board.cloneBoard(board);
      const move = CF.board.dropPiece(copy, column, piece);
      if (move && CF.rules.getWinningLine(copy, move.row, move.column, piece).length) {
        return column;
      }
    }
    return null;
  }

  function chooseEasy(board, aiPiece, opponentPiece) {
    const win = winningColumn(board, aiPiece);
    if (win !== null) return win;

    const block = winningColumn(board, opponentPiece);
    if (block !== null) return block;

    const weighted = [];
    const valid = CF.board.getValidColumns(board);
    const center = Math.floor(CF.constants.COLUMNS / 2);
    valid.forEach((column) => {
      const weight = CF.constants.COLUMNS - Math.abs(column - center);
      for (let index = 0; index < weight; index += 1) weighted.push(column);
    });
    return CF.helpers.sample(weighted.length ? weighted : valid);
  }

  CF.easyRandom = { chooseEasy, winningColumn };
})(window);
