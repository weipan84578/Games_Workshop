(function initMinimax(global) {
  const CF = global.CF || (global.CF = {});
  const { PLAYER_ONE, PLAYER_TWO } = CF.constants;

  function terminalScore(board, aiPiece, opponentPiece, depth) {
    const winner = CF.rules.findWinner(board);
    if (!winner) {
      if (CF.rules.isDraw(board)) return 0;
      return null;
    }
    if (winner.winner === aiPiece) return 1000000 + depth;
    if (winner.winner === opponentPiece) return -1000000 - depth;
    return 0;
  }

  function minimax(board, depth, alpha, beta, maximizing, aiPiece, opponentPiece, deadline) {
    const terminal = terminalScore(board, aiPiece, opponentPiece, depth);
    if (terminal !== null) return { score: terminal, timedOut: false };
    if (depth === 0 || Date.now() > deadline) {
      return {
        score: CF.heuristic.evaluateBoard(board, aiPiece, opponentPiece),
        timedOut: Date.now() > deadline
      };
    }

    const columns = CF.heuristic.orderedColumns(board);
    let bestScore = maximizing ? -Infinity : Infinity;
    let timedOut = false;

    for (const column of columns) {
      if (Date.now() > deadline) {
        timedOut = true;
        break;
      }

      const copy = CF.board.cloneBoard(board);
      CF.board.dropPiece(copy, column, maximizing ? aiPiece : opponentPiece);
      const result = minimax(copy, depth - 1, alpha, beta, !maximizing, aiPiece, opponentPiece, deadline);
      timedOut = timedOut || result.timedOut;

      if (maximizing) {
        bestScore = Math.max(bestScore, result.score);
        alpha = Math.max(alpha, bestScore);
      } else {
        bestScore = Math.min(bestScore, result.score);
        beta = Math.min(beta, bestScore);
      }

      if (alpha >= beta) break;
    }

    return { score: bestScore, timedOut };
  }

  function chooseMinimax(board, depth, timeLimitMs, aiPiece, opponentPiece) {
    const validColumns = CF.heuristic.orderedColumns(board);
    if (!validColumns.length) return null;

    const immediateWin = CF.easyRandom.winningColumn(board, aiPiece);
    if (immediateWin !== null) return immediateWin;
    const immediateBlock = CF.easyRandom.winningColumn(board, opponentPiece);
    if (immediateBlock !== null && depth < 5) return immediateBlock;

    const deadline = Date.now() + timeLimitMs;
    let bestColumn = validColumns[0];
    let bestScore = -Infinity;

    for (const column of validColumns) {
      const copy = CF.board.cloneBoard(board);
      CF.board.dropPiece(copy, column, aiPiece);
      const result = minimax(copy, depth - 1, -Infinity, Infinity, false, aiPiece, opponentPiece, deadline);

      if (result.score > bestScore) {
        bestScore = result.score;
        bestColumn = column;
      }

      if (result.timedOut || Date.now() > deadline) break;
    }

    return bestColumn;
  }

  CF.minimax = { chooseMinimax, minimax, terminalScore };
})(window);
