// Minimax AI with alpha-beta pruning and board evaluation heuristics.
const AIEngine = {
      depthByDifficulty: { easy: 1, normal: 4, hard: 6 },
      chooseMove(board, aiPlayer, difficulty) {
        const moves = GameEngine.getLegalMoves(board, aiPlayer);
        if (!moves.length) return null;
        if (difficulty === 'easy' && Math.random() < 0.4) {
          return moves[Math.floor(Math.random() * moves.length)];
        }
        const depth = this.depthByDifficulty[difficulty] || 4;
        let best = moves[0];
        let bestScore = -Infinity;
        const ordered = this.orderMoves(moves);
        for (const move of ordered) {
          const next = GameEngine.applyMove(board, move, aiPlayer);
          const score = this.minimax(next, depth - 1, -Infinity, Infinity, false, aiPlayer);
          if (score > bestScore) {
            bestScore = score;
            best = move;
          }
        }
        return best;
      },
      orderMoves(moves) {
        return [...moves].sort((a, b) => POSITION_WEIGHTS[b.row][b.col] - POSITION_WEIGHTS[a.row][a.col]);
      },
      minimax(board, depth, alpha, beta, maximizing, aiPlayer) {
        const player = maximizing ? aiPlayer : GameEngine.opponent(aiPlayer);
        const moves = GameEngine.getLegalMoves(board, player);
        const otherMoves = GameEngine.getLegalMoves(board, GameEngine.opponent(player));
        if (depth === 0 || (!moves.length && !otherMoves.length)) {
          return this.evaluateBoard(board, aiPlayer);
        }
        if (!moves.length) return this.minimax(board, depth - 1, alpha, beta, !maximizing, aiPlayer);
        if (maximizing) {
          let value = -Infinity;
          for (const move of this.orderMoves(moves)) {
            value = Math.max(value, this.minimax(GameEngine.applyMove(board, move, player), depth - 1, alpha, beta, false, aiPlayer));
            alpha = Math.max(alpha, value);
            if (alpha >= beta) break;
          }
          return value;
        }
        let value = Infinity;
        for (const move of this.orderMoves(moves)) {
          value = Math.min(value, this.minimax(GameEngine.applyMove(board, move, player), depth - 1, alpha, beta, true, aiPlayer));
          beta = Math.min(beta, value);
          if (alpha >= beta) break;
        }
        return value;
      },
      evaluateBoard(board, player) {
        const opponent = GameEngine.opponent(player);
        let score = 0;
        for (let r = 0; r < 8; r += 1) {
          for (let c = 0; c < 8; c += 1) {
            if (board[r][c] === player) score += POSITION_WEIGHTS[r][c];
            if (board[r][c] === opponent) score -= POSITION_WEIGHTS[r][c];
          }
        }
        const mobility = GameEngine.getLegalMoves(board, player).length - GameEngine.getLegalMoves(board, opponent).length;
        score += mobility * 10;
        score += this.cornerScore(board, player) * 35;
        const counts = GameEngine.countPieces(board);
        const total = counts.black + counts.white;
        if (total > 52) {
          const diff = (player === BLACK ? counts.black - counts.white : counts.white - counts.black);
          score += diff * 100;
        }
        return score;
      },
      cornerScore(board, player) {
        const opponent = GameEngine.opponent(player);
        const corners = [[0,0], [0,7], [7,0], [7,7]];
        return corners.reduce((sum, [r, c]) => {
          if (board[r][c] === player) return sum + 1;
          if (board[r][c] === opponent) return sum - 1;
          return sum;
        }, 0);
      }
    };
