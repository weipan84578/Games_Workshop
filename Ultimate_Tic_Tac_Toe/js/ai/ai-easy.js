(function () {
  "use strict";

  function getMove(state) {
    var moves = window.BoardUtils.getValidMoves(state);
    if (!moves.length) return null;
    return moves[Math.floor(Math.random() * moves.length)];
  }

  window.AIEasy = {
    getMove: getMove
  };
})();
