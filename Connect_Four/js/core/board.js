(function initBoard(global) {
  const CF = global.CF || (global.CF = {});
  const { ROWS, COLUMNS, EMPTY } = CF.constants;

  function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(EMPTY));
  }

  function cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  function getAvailableRow(board, column) {
    if (column < 0 || column >= COLUMNS) return -1;
    for (let row = ROWS - 1; row >= 0; row -= 1) {
      if (board[row][column] === EMPTY) return row;
    }
    return -1;
  }

  function getValidColumns(board) {
    return Array.from({ length: COLUMNS }, (_, column) => column)
      .filter((column) => getAvailableRow(board, column) !== -1);
  }

  function dropPiece(board, column, piece) {
    const row = getAvailableRow(board, column);
    if (row === -1) return null;
    board[row][column] = piece;
    return { row, column, piece };
  }

  function boardFromMoves(moves) {
    const board = createBoard();
    moves.forEach((move) => {
      if (Number.isInteger(move.row) && Number.isInteger(move.column)) {
        board[move.row][move.column] = move.piece;
      }
    });
    return board;
  }

  CF.board = { createBoard, cloneBoard, getAvailableRow, getValidColumns, dropPiece, boardFromMoves };
})(window);
