(function (ns) {
  "use strict";

  ns.AINormal = {
    chooseMove: function (model) {
      var scoringMoves = ns.RulesValidator.getScoringMoves(model);
      if (scoringMoves.length) {
        return scoringMoves.sort(function (a, b) {
          return ns.RulesValidator.getBoxesCompletedByMove(model, b).length - ns.RulesValidator.getBoxesCompletedByMove(model, a).length;
        })[0];
      }

      var safeMoves = ns.RulesValidator.getSafeMoves(model);
      if (safeMoves.length) {
        return ns.MathUtils.pickRandom(safeMoves);
      }

      return ns.BoardModel.getLegalMoves(model).sort(function (a, b) {
        return ns.RulesValidator.getDangerCost(model, a) - ns.RulesValidator.getDangerCost(model, b);
      })[0] || null;
    }
  };
})(window.DAB = window.DAB || {});
