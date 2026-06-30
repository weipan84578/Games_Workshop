(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;
  var Rules = NMM.Rules;
  var Eval = NMM.AI.Evaluator;
  NMM.AI = NMM.AI || {};

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function pickBestByEval(state, actions) {
    var best = actions[0];
    var bestScore = -Infinity;
    for (var i = 0; i < actions.length; i += 1) {
      var result = Rules.applyTurnAction(state, actions[i], C.PLAYERS.AI, { mutate: false });
      var score = Eval.evaluate(result.state);
      if (score > bestScore) {
        bestScore = score;
        best = actions[i];
      }
    }
    return best;
  }

  function playerThreatCount(state) {
    var actions = Rules.getLegalTurnActions(state, C.PLAYERS.PLAYER);
    var threats = 0;
    for (var i = 0; i < actions.length; i += 1) {
      if (typeof actions[i].remove === "number") {
        threats += 1;
      }
    }
    return threats;
  }

  function choose(state) {
    var actions = Rules.getLegalTurnActions(state, C.PLAYERS.AI);
    var captures = [];
    var safest = [];
    var lowestThreat = Infinity;

    if (!actions.length) {
      return null;
    }

    for (var i = 0; i < actions.length; i += 1) {
      if (typeof actions[i].remove === "number") {
        captures.push(actions[i]);
      }
    }

    if (captures.length && Math.random() < 0.7) {
      return Math.random() < 0.75 ? pickBestByEval(state, captures) : randomItem(captures);
    }

    for (var j = 0; j < actions.length; j += 1) {
      var result = Rules.applyTurnAction(state, actions[j], C.PLAYERS.AI, { mutate: false });
      var threat = playerThreatCount(result.state);
      if (threat < lowestThreat) {
        lowestThreat = threat;
        safest = [actions[j]];
      } else if (threat === lowestThreat) {
        safest.push(actions[j]);
      }
    }

    if (safest.length && Math.random() < 0.55) {
      return randomItem(safest);
    }

    return Math.random() < 0.35 ? randomItem(actions) : pickBestByEval(state, actions);
  }

  NMM.AI.Easy = {
    choose: choose
  };
})(window);
