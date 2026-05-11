class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.board = createInitialBoard();
    this.currentTurn = SIDES.RED;
    this.moveHistory = [];
    this.capturedPieces = [];
    this.status = "playing";
    this.winner = null;
    this.reason = "";
    this.moveCount = 0;
    this.timer = { red: 0, black: 0 };
    this.lastMove = null;
    this.isCheck = false;
  }

  legalMovesFor(row, col) {
    const piece = this.board[row]?.[col];
    if (!piece || piece.side !== this.currentTurn || this.status !== "playing") return [];
    return getLegalMoves(this.board, piece);
  }

  move(fromRow, fromCol, toRow, toCol) {
    if (this.status !== "playing") return { ok: false, reason: "對局已結束" };
    const piece = this.board[fromRow]?.[fromCol];
    if (!piece || piece.side !== this.currentTurn) return { ok: false, reason: "不是目前行棋方" };

    const legal = getLegalMoves(this.board, piece);
    if (!legal.some((move) => move.row === toRow && move.col === toCol)) {
      return { ok: false, reason: "不合法的走法" };
    }

    const captured = this.board[toRow][toCol];
    const record = {
      piece: { ...piece },
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      captured: captured ? { ...captured } : null,
      side: piece.side,
      notation: formatMove(piece, fromRow, fromCol, toRow, toCol, captured)
    };

    applyMoveToBoard(this.board, fromRow, fromCol, toRow, toCol);
    this.moveHistory.push(record);
    if (captured) this.capturedPieces.push(captured);
    this.lastMove = record;
    this.moveCount += 1;

    if (captured?.type === PieceType.GENERAL) {
      this.endGame(piece.side, `${sideText(piece.side)}吃掉主帥`);
      return { ok: true, move: record, captured, gameOver: true };
    }

    const nextSide = opponent(this.currentTurn);
    this.currentTurn = nextSide;
    this.isCheck = isInCheck(this.board, nextSide);

    if (!hasAnyLegalMoves(this.board, nextSide)) {
      this.endGame(opponent(nextSide), this.isCheck ? "將死" : "困斃");
      return { ok: true, move: record, captured, gameOver: true };
    }

    return { ok: true, move: record, captured, check: this.isCheck };
  }

  undoPair() {
    if (this.moveHistory.length === 0 || this.status !== "playing") return false;
    const count = this.moveHistory.length >= 2 && this.currentTurn === SIDES.RED ? 2 : 1;
    for (let i = 0; i < count; i += 1) {
      const move = this.moveHistory.pop();
      undoMoveOnBoard(this.board, move);
      if (move.captured) this.capturedPieces.pop();
      this.currentTurn = move.side;
      this.moveCount = Math.max(0, this.moveCount - 1);
    }
    this.lastMove = this.moveHistory.at(-1) || null;
    this.isCheck = isInCheck(this.board, this.currentTurn);
    return true;
  }

  endGame(winner, reason) {
    this.status = winner === SIDES.RED ? "red_win" : "black_win";
    this.winner = winner;
    this.reason = reason;
  }
}

function inBounds(row, col) {
  return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
}

function isPalace(side, row, col) {
  const rows = side === SIDES.RED ? row >= 7 && row <= 9 : row >= 0 && row <= 2;
  return rows && col >= 3 && col <= 5;
}

function crossedRiver(side, row) {
  return side === SIDES.RED ? row <= 4 : row >= 5;
}

function addMove(board, piece, moves, row, col) {
  if (!inBounds(row, col)) return;
  const target = board[row][col];
  if (!target || target.side !== piece.side) moves.push({ row, col, captured: target || null });
}

function getPseudoMoves(board, piece) {
  const moves = [];
  const { row, col, side, type } = piece;

  if (type === PieceType.GENERAL) {
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
      const r = row + dr;
      const c = col + dc;
      if (isPalace(side, r, c)) addMove(board, piece, moves, r, c);
    });
    const dir = side === SIDES.RED ? -1 : 1;
    for (let r = row + dir; inBounds(r, col); r += dir) {
      const target = board[r][col];
      if (!target) continue;
      if (target.type === PieceType.GENERAL && target.side !== side) {
        moves.push({ row: r, col, captured: target });
      }
      break;
    }
    return moves;
  }

  if (type === PieceType.ADVISOR) {
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, dc]) => {
      const r = row + dr;
      const c = col + dc;
      if (isPalace(side, r, c)) addMove(board, piece, moves, r, c);
    });
    return moves;
  }

  if (type === PieceType.BISHOP) {
    [[2, 2], [2, -2], [-2, 2], [-2, -2]].forEach(([dr, dc]) => {
      const r = row + dr;
      const c = col + dc;
      const eyeR = row + dr / 2;
      const eyeC = col + dc / 2;
      const staysHome = side === SIDES.RED ? r >= 5 : r <= 4;
      if (inBounds(r, c) && staysHome && !board[eyeR][eyeC]) addMove(board, piece, moves, r, c);
    });
    return moves;
  }

  if (type === PieceType.KNIGHT) {
    [
      [-2, -1, -1, 0], [-2, 1, -1, 0],
      [2, -1, 1, 0], [2, 1, 1, 0],
      [-1, -2, 0, -1], [1, -2, 0, -1],
      [-1, 2, 0, 1], [1, 2, 0, 1]
    ].forEach(([dr, dc, legR, legC]) => {
      if (!board[row + legR]?.[col + legC]) addMove(board, piece, moves, row + dr, col + dc);
    });
    return moves;
  }

  if (type === PieceType.ROOK || type === PieceType.CANNON) {
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
      let screenSeen = false;
      for (let r = row + dr, c = col + dc; inBounds(r, c); r += dr, c += dc) {
        const target = board[r][c];
        if (type === PieceType.ROOK) {
          if (!target) {
            moves.push({ row: r, col: c, captured: null });
            continue;
          }
          if (target.side !== side) moves.push({ row: r, col: c, captured: target });
          break;
        }

        if (!screenSeen) {
          if (!target) moves.push({ row: r, col: c, captured: null });
          else screenSeen = true;
        } else if (target) {
          if (target.side !== side) moves.push({ row: r, col: c, captured: target });
          break;
        }
      }
    });
    return moves;
  }

  if (type === PieceType.PAWN) {
    const forward = side === SIDES.RED ? -1 : 1;
    addMove(board, piece, moves, row + forward, col);
    if (crossedRiver(side, row)) {
      addMove(board, piece, moves, row, col - 1);
      addMove(board, piece, moves, row, col + 1);
    }
  }

  return moves;
}

function getLegalMoves(board, piece) {
  return getPseudoMoves(board, piece).filter((move) => {
    const next = cloneBoard(board);
    applyMoveToBoard(next, piece.row, piece.col, move.row, move.col);
    return !isInCheck(next, piece.side);
  });
}

function getAllLegalMoves(board, side) {
  const moves = [];
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const piece = board[row][col];
      if (!piece || piece.side !== side) continue;
      getLegalMoves(board, piece).forEach((move) => {
        moves.push({ from: { row, col }, to: { row: move.row, col: move.col }, piece, captured: move.captured });
      });
    }
  }
  return moves;
}

function applyMoveToBoard(board, fromRow, fromCol, toRow, toCol) {
  const piece = board[fromRow][fromCol];
  board[toRow][toCol] = piece;
  board[fromRow][fromCol] = null;
  piece.row = toRow;
  piece.col = toCol;
}

function undoMoveOnBoard(board, move) {
  const piece = board[move.to.row][move.to.col];
  board[move.from.row][move.from.col] = piece;
  if (piece) {
    piece.row = move.from.row;
    piece.col = move.from.col;
  }
  board[move.to.row][move.to.col] = move.captured ? { ...move.captured } : null;
}

function applyMoveImmutable(board, move) {
  const next = cloneBoard(board);
  applyMoveToBoard(next, move.from.row, move.from.col, move.to.row, move.to.col);
  return next;
}

function findGeneral(board, side) {
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const piece = board[row][col];
      if (piece?.side === side && piece.type === PieceType.GENERAL) return piece;
    }
  }
  return null;
}

function isInCheck(board, side) {
  const general = findGeneral(board, side);
  if (!general) return true;
  const enemy = opponent(side);
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let col = 0; col < BOARD_COLS; col += 1) {
      const piece = board[row][col];
      if (!piece || piece.side !== enemy) continue;
      if (getPseudoMoves(board, piece).some((move) => move.row === general.row && move.col === general.col)) {
        return true;
      }
    }
  }
  return false;
}

function hasAnyLegalMoves(board, side) {
  return getAllLegalMoves(board, side).length > 0;
}

function formatMove(piece, fromRow, fromCol, toRow, toCol, captured = null) {
  const capture = captured ? `吃${pieceText(captured)}` : "至";
  return `${sideText(piece.side)} ${pieceText(piece)} ${coordText(fromRow, fromCol)} ${capture} ${coordText(toRow, toCol)}`;
}

function coordText(row, col) {
  return `${String.fromCharCode(97 + col)}${row + 1}`;
}
