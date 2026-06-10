(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function AINormal() {}

  AINormal.prototype.getMove = function(gameState) {
    var moves = Mancala.MoveValidator.getValidMoves(gameState, "ai");
    if (!moves.length) {
      return null;
    }

    var scored = moves.map(function(index) {
      return {
        index: index,
        score: scoreMove(gameState, index)
      };
    });

    var bestScore = Math.max.apply(null, scored.map(function(item) {
      return item.score;
    }));

    var bestMoves = scored.filter(function(item) {
      return item.score === bestScore;
    });

    return bestMoves[Math.floor(Math.random() * bestMoves.length)].index;
  };

  function scoreMove(gameState, index) {
    var boardBefore = gameState.board;
    var result = Mancala.GameEngine.previewMove(gameState, "ai", index);
    var boardAfter = result.board;
    var score = 0;

    score += (boardAfter[13] - boardBefore[13]) * 12;
    score += result.extraTurn ? 100 : 0;
    score += result.capture ? result.capture.capturedCount * 18 : 0;
    score += boardAfter[index] === 0 ? 4 : 0;
    score += (Mancala.MoveValidator.sumSide(boardAfter, "ai") - Mancala.MoveValidator.sumSide(boardAfter, "player")) * 1.5;

    var playerReplies = Mancala.MoveValidator.getPitsForPlayer("player").filter(function(playerPit) {
      return boardAfter[playerPit] > 0;
    }).map(function(playerPit) {
      return Mancala.GameEngine.applyMove(boardAfter.slice(), "player", playerPit);
    });

    var dangerousReply = playerReplies.some(function(reply) {
      return reply.capture && reply.capture.capturedCount >= 4;
    });
    if (dangerousReply) {
      score -= 20;
    }

    return score;
  }

  Mancala.AINormal = AINormal;
})(window);
