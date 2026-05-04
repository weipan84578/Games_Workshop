(function () {
  const { PLAYER, AI, PLAYER_KING, AI_KING, ownerOf, isKing } = window.CheckersRules;

  class AIEngine {
    constructor(game) {
      this.game = game;
    }

    depthFor(difficulty) {
      if (difficulty === 'easy') return 2;
      if (difficulty === 'hard') return 6;
      return 4;
    }

    getMove(board, difficulty) {
      const moves = this.game.getAllMoves('ai', board);
      if (!moves.length) return null;
      if (difficulty === 'easy' && Math.random() < 0.15) {
        return moves[Math.floor(Math.random() * moves.length)];
      }
      const depth = this.depthFor(difficulty);
      return this.getBestMove(board, depth);
    }

    getBestMove(board, depth) {
      const moves = this.game.getAllMoves('ai', board);
      let best = moves[0];
      let bestScore = -Infinity;
      for (const move of this.orderMoves(moves)) {
        const next = this.game.applyMove(move, board, false).board;
        const score = this.minimax(next, depth - 1, -Infinity, Infinity, false);
        if (score > bestScore) {
          bestScore = score;
          best = move;
        }
      }
      return best;
    }

    minimax(board, depth, alpha, beta, maximizing) {
      const aiMoves = this.game.getAllMoves('ai', board);
      const playerMoves = this.game.getAllMoves('player', board);
      if (depth <= 0 || !aiMoves.length || !playerMoves.length) return this.evaluate(board);
      if (maximizing) {
        let value = -Infinity;
        for (const move of this.orderMoves(aiMoves)) {
          value = Math.max(value, this.minimax(this.game.applyMove(move, board, false).board, depth - 1, alpha, beta, false));
          alpha = Math.max(alpha, value);
          if (alpha >= beta) break;
        }
        return value;
      }
      let value = Infinity;
      for (const move of this.orderMoves(playerMoves)) {
        value = Math.min(value, this.minimax(this.game.applyMove(move, board, false).board, depth - 1, alpha, beta, true));
        beta = Math.min(beta, value);
        if (alpha >= beta) break;
      }
      return value;
    }

    orderMoves(moves) {
      return moves.slice().sort((a, b) => b.captured.length - a.captured.length);
    }

    evaluate(board) {
      let score = 0;
      for (let row = 0; row < 8; row += 1) {
        for (let col = 0; col < 8; col += 1) {
          const piece = board[row][col];
          if (!piece) continue;
          const value = isKing(piece) ? 10 : 5;
          const center = col >= 2 && col <= 5 ? 0.5 : 0;
          const owner = ownerOf(piece);
          if (owner === 'ai') {
            score += value + center;
            if (piece === AI) score += row * 0.3;
            if (piece === AI && row === 0) score += 1;
          } else {
            score -= value + center;
            if (piece === PLAYER) score -= (7 - row) * 0.3;
            if (piece === PLAYER && row === 7) score -= 1;
          }
        }
      }
      const aiMobility = this.game.getAllMoves('ai', board).length;
      const playerMobility = this.game.getAllMoves('player', board).length;
      score += (aiMobility - playerMobility) * 0.15;
      return score;
    }
  }

  window.AIEngine = AIEngine;
})();
