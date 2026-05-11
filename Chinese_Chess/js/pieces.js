const BOARD_ROWS = 10;
const BOARD_COLS = 9;

const PieceType = {
  GENERAL: "general",
  ADVISOR: "advisor",
  BISHOP: "bishop",
  KNIGHT: "knight",
  ROOK: "rook",
  CANNON: "cannon",
  PAWN: "pawn"
};

const SIDES = {
  RED: "red",
  BLACK: "black"
};

const PIECE_LABELS = {
  red: {
    general: "帥",
    advisor: "仕",
    bishop: "相",
    knight: "傌",
    rook: "俥",
    cannon: "炮",
    pawn: "兵"
  },
  black: {
    general: "將",
    advisor: "士",
    bishop: "象",
    knight: "馬",
    rook: "車",
    cannon: "砲",
    pawn: "卒"
  }
};

const PIECE_NAMES = {
  general: "將帥",
  advisor: "士仕",
  bishop: "象相",
  knight: "馬",
  rook: "車",
  cannon: "炮",
  pawn: "兵卒"
};

let nextPieceId = 1;

class Piece {
  constructor(type, side, row, col, id = null) {
    this.type = type;
    this.side = side;
    this.row = row;
    this.col = col;
    this.id = id || `${side}_${type}_${nextPieceId++}`;
  }
}

function opponent(side) {
  return side === SIDES.RED ? SIDES.BLACK : SIDES.RED;
}

function createEmptyBoard() {
  return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null));
}

function place(board, type, side, row, col) {
  board[row][col] = new Piece(type, side, row, col);
}

function createInitialBoard() {
  const board = createEmptyBoard();
  const T = PieceType;

  place(board, T.ROOK, SIDES.BLACK, 0, 0);
  place(board, T.KNIGHT, SIDES.BLACK, 0, 1);
  place(board, T.BISHOP, SIDES.BLACK, 0, 2);
  place(board, T.ADVISOR, SIDES.BLACK, 0, 3);
  place(board, T.GENERAL, SIDES.BLACK, 0, 4);
  place(board, T.ADVISOR, SIDES.BLACK, 0, 5);
  place(board, T.BISHOP, SIDES.BLACK, 0, 6);
  place(board, T.KNIGHT, SIDES.BLACK, 0, 7);
  place(board, T.ROOK, SIDES.BLACK, 0, 8);
  place(board, T.CANNON, SIDES.BLACK, 2, 1);
  place(board, T.CANNON, SIDES.BLACK, 2, 7);
  [0, 2, 4, 6, 8].forEach((col) => place(board, T.PAWN, SIDES.BLACK, 3, col));

  place(board, T.ROOK, SIDES.RED, 9, 0);
  place(board, T.KNIGHT, SIDES.RED, 9, 1);
  place(board, T.BISHOP, SIDES.RED, 9, 2);
  place(board, T.ADVISOR, SIDES.RED, 9, 3);
  place(board, T.GENERAL, SIDES.RED, 9, 4);
  place(board, T.ADVISOR, SIDES.RED, 9, 5);
  place(board, T.BISHOP, SIDES.RED, 9, 6);
  place(board, T.KNIGHT, SIDES.RED, 9, 7);
  place(board, T.ROOK, SIDES.RED, 9, 8);
  place(board, T.CANNON, SIDES.RED, 7, 1);
  place(board, T.CANNON, SIDES.RED, 7, 7);
  [0, 2, 4, 6, 8].forEach((col) => place(board, T.PAWN, SIDES.RED, 6, col));

  return board;
}

function clonePiece(piece) {
  return piece ? new Piece(piece.type, piece.side, piece.row, piece.col, piece.id) : null;
}

function cloneBoard(board) {
  return board.map((row) => row.map(clonePiece));
}

function pieceText(piece) {
  return PIECE_LABELS[piece.side][piece.type];
}

function sideText(side) {
  return side === SIDES.RED ? "紅方" : "黑方";
}
