(function () {
  "use strict";

  var TIMEOUT_MS = 1300;
  var startedAt = 0;

  function assertTime() {
    if (Date.now() - startedAt > TIMEOUT_MS) {
      throw new Error("AI_TIMEOUT");
    }
  }

  function orderedMoves(state, player, limit) {
    return window.BoardUtils.getValidMoves(state)
      .map(function (move) {
        return {
          move: move,
          score: window.AIEvaluator.scoreMove(state, move, player)
        };
      })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, limit || 18)
      .map(function (entry) { return entry.move; });
  }

  function minimax(state, depth, alpha, beta, maximizing) {
    assertTime();
    if (depth === 0 || state.phase === "ended") {
      return window.AIEvaluator.scoreState(state, "O");
    }

    var player = maximizing ? "O" : "X";
    var moves = orderedMoves(state, player, state.moveCount < 12 ? 18 : 14);
    var i;
    var next;
    var score;

    if (!moves.length) return window.AIEvaluator.scoreState(state, "O");

    if (maximizing) {
      var best = -Infinity;
      for (i = 0; i < moves.length; i += 1) {
        next = window.BoardUtils.applyMove(state, moves[i].br, moves[i].bc, moves[i].cr, moves[i].cc, { player: player });
        score = minimax(next, depth - 1, alpha, beta, false);
        best = Math.max(best, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
      return best;
    }

    var worst = Infinity;
    for (i = 0; i < moves.length; i += 1) {
      next = window.BoardUtils.applyMove(state, moves[i].br, moves[i].bc, moves[i].cr, moves[i].cc, { player: player });
      score = minimax(next, depth - 1, alpha, beta, true);
      worst = Math.min(worst, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return worst;
  }

  function getMove(state) {
    startedAt = Date.now();
    var depth = state.moveCount < 12 ? 3 : 4;
    var moves = orderedMoves(state, "O", 20);
    var bestMove = moves[0] || null;
    var bestScore = -Infinity;

    moves.forEach(function (move) {
      var next = window.BoardUtils.applyMove(state, move.br, move.bc, move.cr, move.cc, { player: "O" });
      var score = minimax(next, depth - 1, -Infinity, Infinity, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });

    return bestMove || window.AINormal.getMove(state);
  }

  window.AIHard = {
    getMove: getMove
  };
})();
