(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function AIEasy() {}

  AIEasy.prototype.getMove = function(gameState) {
    var moves = Mancala.MoveValidator.getValidMoves(gameState, "ai");
    if (!moves.length) {
      return null;
    }
    return moves[Math.floor(Math.random() * moves.length)];
  };

  Mancala.AIEasy = AIEasy;
})(window);
