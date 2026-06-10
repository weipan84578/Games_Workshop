(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function AIHard(options) {
    options = options || {};
    this.depth = options.depth || 7;
  }

  AIHard.prototype.getMove = function(gameState) {
    var moves = Mancala.MoveValidator.getValidMoves(gameState, "ai");
    if (!moves.length) {
      return null;
    }

    var bestMove = moves[0];
    var bestScore = -Infinity;
    var alpha = -Infinity;
    var beta = Infinity;

    moves = orderMoves(gameState.board, "ai", moves);

    for (var i = 0; i < moves.length; i += 1) {
      var result = Mancala.GameEngine.applyMove(gameState.board.slice(), "ai", moves[i]);
      var score = minimax(result.board, result.nextTurn, this.depth - 1, alpha, beta);
      if (score > bestScore) {
        bestScore = score;
        bestMove = moves[i];
      }
      alpha = Math.max(alpha, bestScore);
    }

    return bestMove;
  };

  function minimax(board, turn, depth, alpha, beta) {
    if (depth <= 0 || turn === null) {
      return evaluate(board);
    }

    var moves = Mancala.MoveValidator.getPitsForPlayer(turn).filter(function(index) {
      return board[index] > 0;
    });

    if (!moves.length) {
      return evaluate(board);
    }

    moves = orderMoves(board, turn, moves);

    if (turn === "ai") {
      var maxEval = -Infinity;
      for (var i = 0; i < moves.length; i += 1) {
        var aiResult = Mancala.GameEngine.applyMove(board.slice(), "ai", moves[i]);
        var aiEval = minimax(aiResult.board, aiResult.nextTurn, depth - 1, alpha, beta);
        maxEval = Math.max(maxEval, aiEval);
        alpha = Math.max(alpha, aiEval);
        if (beta <= alpha) {
          break;
        }
      }
      return maxEval;
    }

    var minEval = Infinity;
    for (var j = 0; j < moves.length; j += 1) {
      var playerResult = Mancala.GameEngine.applyMove(board.slice(), "player", moves[j]);
      var playerEval = minimax(playerResult.board, playerResult.nextTurn, depth - 1, alpha, beta);
      minEval = Math.min(minEval, playerEval);
      beta = Math.min(beta, playerEval);
      if (beta <= alpha) {
        break;
      }
    }
    return minEval;
  }

  function evaluate(board) {
    var storeDiff = (board[13] - board[6]) * 3;
    var pitDiff = (Mancala.MoveValidator.sumSide(board, "ai") - Mancala.MoveValidator.sumSide(board, "player")) * 1;
    var extraTurnBonus = countExtraTurnMoves(board, "ai") * 4 - countExtraTurnMoves(board, "player") * 3;
    var captureBonus = bestCaptureValue(board, "ai") * 2 - bestCaptureValue(board, "player") * 2.4;
    return storeDiff + pitDiff + extraTurnBonus + captureBonus;
  }

  function countExtraTurnMoves(board, player) {
    return Mancala.MoveValidator.getPitsForPlayer(player).filter(function(index) {
      return board[index] > 0 && Mancala.GameEngine.applyMove(board.slice(), player, index).extraTurn;
    }).length;
  }

  function bestCaptureValue(board, player) {
    var best = 0;
    Mancala.MoveValidator.getPitsForPlayer(player).forEach(function(index) {
      if (board[index] <= 0) {
        return;
      }
      var result = Mancala.GameEngine.applyMove(board.slice(), player, index);
      if (result.capture) {
        best = Math.max(best, result.capture.capturedCount);
      }
    });
    return best;
  }

  function orderMoves(board, player, moves) {
    return moves.slice().sort(function(a, b) {
      var resultA = Mancala.GameEngine.applyMove(board.slice(), player, a);
      var resultB = Mancala.GameEngine.applyMove(board.slice(), player, b);
      return moveOrderingScore(resultB) - moveOrderingScore(resultA);
    });
  }

  function moveOrderingScore(result) {
    return (result.extraTurn ? 100 : 0) + (result.capture ? result.capture.capturedCount * 10 : 0);
  }

  Mancala.AIHard = AIHard;
})(window);
