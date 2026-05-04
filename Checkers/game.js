(function () {
  const EMPTY = 0;
  const PLAYER = 1;
  const AI = 2;
  const PLAYER_KING = 3;
  const AI_KING = 4;

  function cloneBoard(board) {
    return board.map(row => row.slice());
  }

  function ownerOf(piece) {
    if (piece === PLAYER || piece === PLAYER_KING) return 'player';
    if (piece === AI || piece === AI_KING) return 'ai';
    return null;
  }

  function isKing(piece) {
    return piece === PLAYER_KING || piece === AI_KING;
  }

  function directionsFor(piece, capturesOnly) {
    if (isKing(piece)) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    if (piece === PLAYER) return [[-1, -1], [-1, 1]];
    if (piece === AI) return [[1, -1], [1, 1]];
    return capturesOnly ? [] : [];
  }

  function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  class GameEngine {
    constructor() {
      this.reset();
    }

    reset() {
      this.board = Array.from({ length: 8 }, () => Array(8).fill(EMPTY));
      for (let row = 0; row < 3; row += 1) {
        for (let col = 0; col < 8; col += 1) {
          if ((row + col) % 2 === 1) this.board[row][col] = AI;
        }
      }
      for (let row = 5; row < 8; row += 1) {
        for (let col = 0; col < 8; col += 1) {
          if ((row + col) % 2 === 1) this.board[row][col] = PLAYER;
        }
      }
      this.currentTurn = 'player';
      this.capturedByPlayer = 0;
      this.capturedByAI = 0;
      this.turns = 0;
      this.noCaptureHalfMoves = 0;
      this.lastMove = null;
      this.gameOver = false;
      this.winner = null;
      this.startedAt = Date.now();
      return this.board;
    }

    getPieceMoves(row, col, board = this.board, chainOnly = false) {
      const piece = board[row]?.[col];
      const owner = ownerOf(piece);
      if (!owner) return [];
      const captures = this.getCaptureMoves(row, col, board, []);
      if (captures.length || chainOnly) return captures;
      return directionsFor(piece).map(([dr, dc]) => {
        const toRow = row + dr;
        const toCol = col + dc;
        if (!inBounds(toRow, toCol) || board[toRow][toCol] !== EMPTY) return null;
        return { fromRow: row, fromCol: col, toRow, toCol, captured: [] };
      }).filter(Boolean);
    }

    getCaptureMoves(row, col, board = this.board, trail = []) {
      const piece = board[row]?.[col];
      const owner = ownerOf(piece);
      if (!owner) return [];
      const moves = [];
      for (const [dr, dc] of directionsFor(piece, true)) {
        const midRow = row + dr;
        const midCol = col + dc;
        const toRow = row + dr * 2;
        const toCol = col + dc * 2;
        if (!inBounds(toRow, toCol) || !inBounds(midRow, midCol)) continue;
        const middle = board[midRow][midCol];
        if (middle === EMPTY || ownerOf(middle) === owner || board[toRow][toCol] !== EMPTY) continue;

        const nextBoard = cloneBoard(board);
        nextBoard[toRow][toCol] = piece;
        nextBoard[row][col] = EMPTY;
        nextBoard[midRow][midCol] = EMPTY;
        const captured = trail.concat({ row: midRow, col: midCol });
        const promoted = (piece === PLAYER && toRow === 0) || (piece === AI && toRow === 7);
        const continuations = promoted ? [] : this.getCaptureMoves(toRow, toCol, nextBoard, captured);
        if (continuations.length) {
          moves.push(...continuations.map(move => ({
            fromRow: row,
            fromCol: col,
            toRow: move.toRow,
            toCol: move.toCol,
            captured: move.captured,
            path: [{ row: toRow, col: toCol }].concat(move.path || [])
          })));
        } else {
          moves.push({ fromRow: row, fromCol: col, toRow, toCol, captured, path: [{ row: toRow, col: toCol }] });
        }
      }
      return moves;
    }

    getAllMoves(side, board = this.board) {
      const captures = [];
      const quiet = [];
      for (let row = 0; row < 8; row += 1) {
        for (let col = 0; col < 8; col += 1) {
          if (ownerOf(board[row][col]) !== side) continue;
          const moves = this.getPieceMoves(row, col, board);
          for (const move of moves) {
            if (move.captured.length) captures.push(move);
            else quiet.push(move);
          }
        }
      }
      return captures.length ? captures : quiet;
    }

    applyMove(move, board = this.board, commit = board === this.board) {
      const nextBoard = commit ? this.board : cloneBoard(board);
      const piece = nextBoard[move.fromRow][move.fromCol];
      nextBoard[move.fromRow][move.fromCol] = EMPTY;
      for (const cap of move.captured) nextBoard[cap.row][cap.col] = EMPTY;
      let placed = piece;
      let promoted = false;
      if (piece === PLAYER && move.toRow === 0) {
        placed = PLAYER_KING;
        promoted = true;
      } else if (piece === AI && move.toRow === 7) {
        placed = AI_KING;
        promoted = true;
      }
      nextBoard[move.toRow][move.toCol] = placed;

      if (commit) {
        const mover = ownerOf(piece);
        if (move.captured.length) {
          if (mover === 'player') this.capturedByPlayer += move.captured.length;
          else this.capturedByAI += move.captured.length;
          this.noCaptureHalfMoves = 0;
        } else {
          this.noCaptureHalfMoves += 1;
        }
        if (mover === 'ai') this.turns += 1;
        this.lastMove = move;
        this.currentTurn = mover === 'player' ? 'ai' : 'player';
        this.checkGameOver();
      }
      return { board: nextBoard, promoted };
    }

    countPieces(board = this.board) {
      const counts = { player: 0, ai: 0 };
      for (const row of board) {
        for (const piece of row) {
          const owner = ownerOf(piece);
          if (owner) counts[owner] += 1;
        }
      }
      return counts;
    }

    checkGameOver(board = this.board) {
      const counts = this.countPieces(board);
      let winner = null;
      if (counts.player === 0) winner = 'ai';
      else if (counts.ai === 0) winner = 'player';
      else if (this.getAllMoves('player', board).length === 0) winner = 'ai';
      else if (this.getAllMoves('ai', board).length === 0) winner = 'player';
      else if (this.noCaptureHalfMoves >= 80) winner = 'draw';

      if (winner) {
        this.gameOver = true;
        this.winner = winner;
      }
      return winner;
    }
  }

  window.CheckersRules = { EMPTY, PLAYER, AI, PLAYER_KING, AI_KING, cloneBoard, ownerOf, isKing };
  window.GameEngine = GameEngine;
})();
