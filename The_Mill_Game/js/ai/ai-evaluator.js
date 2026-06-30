(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;
  var GS = NMM.GameState;
  var Rules = NMM.Rules;
  NMM.AI = NMM.AI || {};

  function countLinePatterns(board, actor) {
    var mills = 0;
    var openTwo = 0;
    var openOne = 0;
    for (var i = 0; i < C.MILLS.length; i += 1) {
      var line = C.MILLS[i];
      var mine = 0;
      var empty = 0;
      for (var j = 0; j < 3; j += 1) {
        if (board[line[j]] === actor) {
          mine += 1;
        } else if (board[line[j]] === null) {
          empty += 1;
        }
      }
      if (mine === 3) {
        mills += 1;
      }
      if (mine === 2 && empty === 1) {
        openTwo += 1;
      }
      if (mine === 1 && empty === 2) {
        openOne += 1;
      }
    }
    return { mills: mills, openTwo: openTwo, openOne: openOne };
  }

  function mobility(state, actor) {
    if (GS.getHand(state, actor) > 0) {
      return Rules.getEmptyPositions(state).length;
    }
    return Rules.getBaseActions(state, actor).length;
  }

  function removalPressure(state, actor) {
    var actions = Rules.getLegalTurnActions(state, actor);
    var pressure = 0;
    for (var i = 0; i < actions.length; i += 1) {
      if (typeof actions[i].remove === "number") {
        pressure += 1;
      }
    }
    return pressure;
  }

  function evaluate(state) {
    var ai = C.PLAYERS.AI;
    var player = C.PLAYERS.PLAYER;
    var aiLines;
    var playerLines;
    var score = 0;

    if (state.gameOver) {
      if (state.winner === ai) {
        return 100000;
      }
      if (state.winner === player) {
        return -100000;
      }
      return 0;
    }

    aiLines = countLinePatterns(state.board, ai);
    playerLines = countLinePatterns(state.board, player);

    score += (GS.getOnBoard(state, ai) - GS.getOnBoard(state, player)) * 120;
    score += (GS.getHand(state, ai) - GS.getHand(state, player)) * 18;
    score += (aiLines.mills - playerLines.mills) * 95;
    score += (aiLines.openTwo - playerLines.openTwo) * 42;
    score += (aiLines.openOne - playerLines.openOne) * 8;
    score += (mobility(state, ai) - mobility(state, player)) * 5;
    score += (removalPressure(state, ai) - removalPressure(state, player)) * 18;

    if (state.currentTurn === ai) {
      score += 8;
    } else {
      score -= 8;
    }

    return score;
  }

  function actionScoreHint(state, action, actor) {
    var score = 0;
    if (typeof action.remove === "number") {
      score += 1000;
    }
    if (Rules.wouldFormMill(state, action, actor)) {
      score += 500;
    }
    if (action.type === "move") {
      score += (C.ADJACENCY[action.to] || []).length;
    }
    return score;
  }

  function orderActions(state, actions, actor) {
    return actions.slice().sort(function (a, b) {
      return actionScoreHint(state, b, actor) - actionScoreHint(state, a, actor);
    });
  }

  NMM.AI.Evaluator = {
    evaluate: evaluate,
    countLinePatterns: countLinePatterns,
    mobility: mobility,
    orderActions: orderActions
  };
})(window);
