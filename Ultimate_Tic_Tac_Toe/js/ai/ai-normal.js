(function () {
  "use strict";

  function canWinSmall(state, move, player) {
    var board = window.GameState.clone(state.boards[move.br][move.bc]);
    board[move.cr][move.cc] = player;
    return !!window.BoardUtils.checkSmallWinner(board);
  }

  function getMove(state) {
    var moves = window.BoardUtils.getValidMoves(state);
    var player = "O";
    var other = "X";
    var bestMove = null;
    var bestScore = -Infinity;

    if (!moves.length) return null;

    for (var i = 0; i < moves.length; i += 1) {
      var move = moves[i];
      var next = window.BoardUtils.applyMove(state, move.br, move.bc, move.cr, move.cc, { player: player });
      if (next.winner === player) return move;
    }

    for (var j = 0; j < moves.length; j += 1) {
      if (canWinSmall(state, moves[j], player)) return moves[j];
    }

    moves.forEach(function (move) {
      var score = window.AIEvaluator.scoreMove(state, move, player);
      if (canWinSmall(state, move, other)) score += 95;
      if (move.cr === 1 && move.cc === 1 && state.megaBoard[1][1]) score -= 18;
      if (Math.random() < 0.08) score += 4;
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });

    return bestMove || moves[0];
  }

  window.AINormal = {
    getMove: getMove
  };
})();
