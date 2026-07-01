(function (ns) {
  "use strict";

  function scoreMove(model, move) {
    var completed = ns.RulesValidator.getBoxesCompletedByMove(model, move).length;
    var danger = ns.RulesValidator.getDangerCost(model, move);
    var chain = ns.ChainAnalyzer.analyzeAfterMove(model, move);
    return completed * 100 - danger * 18 - chain.shortChains * 9 + chain.longestChain * 2;
  }

  ns.AIHard = {
    chooseMove: function (model) {
      var scoringMoves = ns.RulesValidator.getScoringMoves(model);
      if (scoringMoves.length) {
        var allChains = ns.ChainAnalyzer.getChains(model);
        var nonScoringSafe = ns.RulesValidator.getSafeMoves(model);
        var shouldLeaveDouble = scoringMoves.length <= 2 && allChains.some(function (chain) {
          return chain.length >= 4;
        }) && nonScoringSafe.length;

        if (shouldLeaveDouble) {
          return nonScoringSafe.sort(function (a, b) {
            return scoreMove(model, b) - scoreMove(model, a);
          })[0];
        }

        return scoringMoves.sort(function (a, b) {
          return scoreMove(model, b) - scoreMove(model, a);
        })[0];
      }

      var safeMoves = ns.RulesValidator.getSafeMoves(model);
      if (safeMoves.length) {
        return safeMoves.sort(function (a, b) {
          return scoreMove(model, b) - scoreMove(model, a);
        })[0];
      }

      return ns.BoardModel.getLegalMoves(model).sort(function (a, b) {
        var aChain = ns.ChainAnalyzer.analyzeAfterMove(model, a);
        var bChain = ns.ChainAnalyzer.analyzeAfterMove(model, b);
        var aCost = ns.RulesValidator.getDangerCost(model, a) * 100 + aChain.longestChain;
        var bCost = ns.RulesValidator.getDangerCost(model, b) * 100 + bChain.longestChain;
        return aCost - bCost;
      })[0] || null;
    }
  };
})(window.DAB = window.DAB || {});
