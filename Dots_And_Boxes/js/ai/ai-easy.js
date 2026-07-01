(function (ns) {
  "use strict";

  ns.AIEasy = {
    chooseMove: function (model) {
      var legalMoves = ns.BoardModel.getLegalMoves(model);
      var scoringMoves = ns.RulesValidator.getScoringMoves(model);
      if (scoringMoves.length && Math.random() < 0.3) {
        return ns.MathUtils.pickRandom(scoringMoves);
      }
      return ns.MathUtils.pickRandom(legalMoves);
    }
  };
})(window.DAB = window.DAB || {});
