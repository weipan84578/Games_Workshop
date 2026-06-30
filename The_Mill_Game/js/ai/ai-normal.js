(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;
  var Rules = NMM.Rules;
  var Eval = NMM.AI.Evaluator;
  NMM.AI = NMM.AI || {};

  function minimax(state, depth, alpha, beta, deadline) {
    if (Date.now() > deadline || depth <= 0 || state.gameOver) {
      return Eval.evaluate(state);
    }

    var actor = state.currentTurn;
    var actions = Eval.orderActions(state, Rules.getLegalTurnActions(state, actor), actor);
    var i;
    var result;
    var score;

    if (!actions.length) {
      Rules.checkGameOver(state);
      return Eval.evaluate(state);
    }

    if (actor === C.PLAYERS.AI) {
      var best = -Infinity;
      for (i = 0; i < actions.length; i += 1) {
        result = Rules.applyTurnAction(state, actions[i], actor, { mutate: false });
        score = minimax(result.state, depth - 1, alpha, beta, deadline);
        if (score > best) {
          best = score;
        }
        alpha = Math.max(alpha, score);
        if (beta <= alpha || Date.now() > deadline) {
          break;
        }
      }
      return best;
    }

    var worst = Infinity;
    for (i = 0; i < actions.length; i += 1) {
      result = Rules.applyTurnAction(state, actions[i], actor, { mutate: false });
      score = minimax(result.state, depth - 1, alpha, beta, deadline);
      if (score < worst) {
        worst = score;
      }
      beta = Math.min(beta, score);
      if (beta <= alpha || Date.now() > deadline) {
        break;
      }
    }
    return worst;
  }

  function chooseBySearch(state, depth, timeLimitMs) {
    var deadline = Date.now() + timeLimitMs;
    var actions = Eval.orderActions(state, Rules.getLegalTurnActions(state, C.PLAYERS.AI), C.PLAYERS.AI);
    var best = actions[0] || null;
    var bestScore = -Infinity;

    for (var i = 0; i < actions.length; i += 1) {
      var result = Rules.applyTurnAction(state, actions[i], C.PLAYERS.AI, { mutate: false });
      var score = minimax(result.state, depth - 1, -Infinity, Infinity, deadline);
      if (score > bestScore) {
        bestScore = score;
        best = actions[i];
      }
      if (Date.now() > deadline) {
        break;
      }
    }

    return best;
  }

  function choose(state) {
    var phase = NMM.GameState.currentPhaseFor(state, C.PLAYERS.AI);
    var depth = phase === C.PHASES.PLACING ? 2 : 3;
    return chooseBySearch(state, depth, 650);
  }

  NMM.AI.Search = {
    minimax: minimax,
    chooseBySearch: chooseBySearch
  };

  NMM.AI.Normal = {
    choose: choose
  };
})(window);
