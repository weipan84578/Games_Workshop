import { PieceType, SIDES, cloneBoard, opponent } from "./pieces.js";
import { applyMoveToBoard, getAllLegalMoves, isInCheck } from "./game.js";

const VALUES = {
  [PieceType.GENERAL]: 100000,
  [PieceType.ROOK]: 1000,
  [PieceType.CANNON]: 450,
  [PieceType.KNIGHT]: 400,
  [PieceType.BISHOP]: 200,
  [PieceType.ADVISOR]: 200,
  [PieceType.PAWN]: 100
};

const DIFFICULTY = {
  easy: { depth: 1, noise: 130, delay: 360 },
  normal: { depth: 2, noise: 30, delay: 460 },
  hard: { depth: 3, noise: 0, delay: 560 }
};

export function chooseAiMove(board, side, difficulty = "normal") {
  const config = DIFFICULTY[difficulty] || DIFFICULTY.normal;
  const legalMoves = orderMoves(getAllLegalMoves(board, side));
  if (legalMoves.length === 0) return null;

  let bestScore = -Infinity;
  let bestMoves = [];
  for (const move of legalMoves) {
    const next = cloneBoard(board);
    applyMoveToBoard(next, move.from.row, move.from.col, move.to.row, move.to.col);
    const score = -negamax(next, opponent(side), config.depth - 1, -Infinity, Infinity, side);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  const selected = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  if (config.noise > 0 && Math.random() * 1000 < config.noise) {
    return legalMoves[Math.floor(Math.random() * Math.min(legalMoves.length, 8))];
  }
  return selected;
}

export function aiDelay(difficulty = "normal") {
  return (DIFFICULTY[difficulty] || DIFFICULTY.normal).delay;
}

function negamax(board, side, depth, alpha, beta, aiSide) {
  const legalMoves = orderMoves(getAllLegalMoves(board, side));
  if (depth === 0 || legalMoves.length === 0) {
    const base = evaluate(board, aiSide);
    if (legalMoves.length === 0) {
      if (isInCheck(board, side)) return side === aiSide ? -999999 : 999999;
      return -1200;
    }
    return side === aiSide ? base : -base;
  }

  let best = -Infinity;
  for (const move of legalMoves) {
    const next = cloneBoard(board);
    applyMoveToBoard(next, move.from.row, move.from.col, move.to.row, move.to.col);
    const score = -negamax(next, opponent(side), depth - 1, -beta, -alpha, aiSide);
    best = Math.max(best, score);
    alpha = Math.max(alpha, score);
    if (alpha >= beta) break;
  }
  return best;
}

function evaluate(board, aiSide) {
  let score = 0;
  for (const row of board) {
    for (const piece of row) {
      if (!piece) continue;
      const sign = piece.side === aiSide ? 1 : -1;
      score += sign * (VALUES[piece.type] + positionalBonus(piece));
    }
  }
  score += getAllLegalMoves(board, aiSide).length * 4;
  score -= getAllLegalMoves(board, opponent(aiSide)).length * 3;
  if (isInCheck(board, opponent(aiSide))) score += 80;
  if (isInCheck(board, aiSide)) score -= 120;
  return score;
}

function positionalBonus(piece) {
  if (piece.type === PieceType.PAWN) {
    const progress = piece.side === SIDES.RED ? 9 - piece.row : piece.row;
    return progress * 14 + (piece.col >= 2 && piece.col <= 6 ? 12 : 0);
  }
  if (piece.type === PieceType.ROOK || piece.type === PieceType.CANNON) {
    return piece.col >= 2 && piece.col <= 6 ? 18 : 0;
  }
  if (piece.type === PieceType.KNIGHT) {
    return piece.row >= 2 && piece.row <= 7 && piece.col >= 1 && piece.col <= 7 ? 20 : 0;
  }
  return 0;
}

function orderMoves(moves) {
  return [...moves].sort((a, b) => movePriority(b) - movePriority(a));
}

function movePriority(move) {
  return (move.captured ? VALUES[move.captured.type] || 0 : 0) + (move.piece.type === PieceType.GENERAL ? -10 : 0);
}
