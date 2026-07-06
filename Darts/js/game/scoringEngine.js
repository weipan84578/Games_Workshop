(function () {
  "use strict";

  window.Darts = window.Darts || {};

  var BOARD_NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
  var CRICKET_TARGETS = [20, 19, 18, 17, 16, 15, 25];
  var AROUND_TARGETS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25];
  var PLAYER_COLORS = ["#d54045", "#2f80ed", "#7c3aed", "#c77d1d"];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function playerName(index) {
    if (index === 0) {
      return window.Darts.I18n.t("player.human");
    }
    return window.Darts.I18n.t("ai.name", { number: index });
  }

  function modeStartScore(settings) {
    if (settings.mode === "701") {
      return 701;
    }
    if (settings.mode === "301") {
      return 301;
    }
    return 501;
  }

  function createMarks() {
    var marks = {};
    CRICKET_TARGETS.forEach(function (target) {
      marks[target] = 0;
    });
    return marks;
  }

  function createPlayer(index, settings) {
    return {
      id: "p" + (index + 1),
      name: playerName(index),
      isAi: index > 0,
      difficulty: index > 0 ? settings.aiDifficulty : "human",
      color: PLAYER_COLORS[index],
      score: settings.mode === "cricket" ? 0 : modeStartScore(settings),
      marks: createMarks(),
      aroundIndex: 0
    };
  }

  function makeHistoryFrame(state) {
    return {
      players: clone(state.players),
      currentPlayer: state.currentPlayer,
      dartsRemaining: state.dartsRemaining,
      turnStartScore: state.turnStartScore,
      turnThrows: clone(state.turnThrows),
      log: clone(state.log),
      markers: clone(state.markers),
      winnerIndex: state.winnerIndex
    };
  }

  function restoreHistoryFrame(state, frame) {
    state.players = clone(frame.players);
    state.currentPlayer = frame.currentPlayer;
    state.dartsRemaining = frame.dartsRemaining;
    state.turnStartScore = frame.turnStartScore;
    state.turnThrows = clone(frame.turnThrows);
    state.log = clone(frame.log);
    state.markers = clone(frame.markers);
    state.winnerIndex = frame.winnerIndex;
  }

  function currentPlayer(state) {
    return state.players[state.currentPlayer];
  }

  function endTurn(state, message) {
    if (message) {
      state.log.unshift(message);
    }
    state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
    state.dartsRemaining = 3;
    state.turnThrows = [];
    state.turnStartScore = currentPlayer(state).score;
  }

  function hitScore(hit) {
    if (!hit || hit.segment === "miss") {
      return 0;
    }
    if (hit.segment === "bull") {
      return 50;
    }
    if (hit.segment === "outerBull") {
      return 25;
    }
    return hit.value * hit.multiplier;
  }

  function hitMarkCount(hit) {
    if (!hit || hit.segment === "miss") {
      return 0;
    }
    if (hit.segment === "bull") {
      return 2;
    }
    if (hit.segment === "outerBull") {
      return 1;
    }
    return hit.multiplier || 1;
  }

  function isDoubleOut(hit) {
    return hit && (hit.segment === "double" || hit.segment === "bull");
  }

  function allOpponentsClosed(state, target, playerIndex) {
    return state.players.every(function (player, index) {
      return index === playerIndex || player.marks[target] >= 3;
    });
  }

  function cricketValue(target) {
    return Number(target) === 25 ? 25 : Number(target);
  }

  function hasClosedCricket(player) {
    return CRICKET_TARGETS.every(function (target) {
      return player.marks[target] >= 3;
    });
  }

  function hasCricketLead(state, player) {
    return state.players.every(function (other) {
      return player.score >= other.score;
    });
  }

  function describeHit(hit) {
    if (!hit || hit.segment === "miss") {
      return window.Darts.I18n.t("game.miss");
    }
    if (hit.segment === "bull") {
      return window.Darts.I18n.t("game.bull");
    }
    if (hit.segment === "outerBull") {
      return window.Darts.I18n.t("game.outerBull");
    }
    var key = hit.segment === "double" ? "game.double" : hit.segment === "triple" ? "game.triple" : "game.single";
    return window.Darts.I18n.t(key, { number: hit.value });
  }

  function scoreX01(state, hit) {
    var player = currentPlayer(state);
    var before = player.score;
    var score = hitScore(hit);
    var nextScore = before - score;
    var throwLabel = describeHit(hit);
    var requiresDoubleOut = state.mode !== "701";
    state.turnThrows.push({ label: throwLabel, score: score });

    if (nextScore < 0 || (requiresDoubleOut && (nextScore === 1 || (nextScore === 0 && !isDoubleOut(hit))))) {
      player.score = state.turnStartScore;
      state.dartsRemaining = 0;
      state.log.unshift(window.Darts.I18n.t("game.bust") + ": " + player.name + " (" + throwLabel + ")");
      endTurn(state);
      return "bust";
    }

    player.score = nextScore;
    state.log.unshift(player.name + ": " + throwLabel + " -" + score);

    if (nextScore === 0) {
      state.winnerIndex = state.currentPlayer;
      return "win";
    }

    if (state.dartsRemaining <= 0) {
      endTurn(state, window.Darts.I18n.t("game.turnEnded", { player: player.name }));
    }
    return "hit";
  }

  function scoreCricket(state, hit) {
    var playerIndex = state.currentPlayer;
    var player = currentPlayer(state);
    var target = hit && (hit.value === 25 ? 25 : hit.value);
    var count = CRICKET_TARGETS.indexOf(target) !== -1 ? hitMarkCount(hit) : 0;
    var scoreAdded = 0;
    var label = describeHit(hit);

    if (count > 0) {
      var openMarks = Math.max(0, 3 - player.marks[target]);
      var closingMarks = Math.min(openMarks, count);
      var extraMarks = count - closingMarks;
      player.marks[target] += closingMarks;
      if (extraMarks > 0 && !allOpponentsClosed(state, target, playerIndex)) {
        scoreAdded = extraMarks * cricketValue(target);
        player.score += scoreAdded;
      }
    }

    state.turnThrows.push({ label: label, score: scoreAdded });
    state.log.unshift(player.name + ": " + label + (scoreAdded ? " +" + scoreAdded : ""));

    if (hasClosedCricket(player) && hasCricketLead(state, player)) {
      state.winnerIndex = playerIndex;
      return "win";
    }

    if (state.dartsRemaining <= 0) {
      endTurn(state, window.Darts.I18n.t("game.turnEnded", { player: player.name }));
    }
    return count > 0 ? "hit" : "miss";
  }

  function scoreAround(state, hit) {
    var player = currentPlayer(state);
    var target = AROUND_TARGETS[player.aroundIndex];
    var count = 0;
    if (hit && hit.segment !== "miss" && hit.value === target) {
      count = target === 25 ? 1 : Math.max(1, hit.multiplier || 1);
    }

    var label = describeHit(hit);
    if (count > 0) {
      player.aroundIndex = Math.min(AROUND_TARGETS.length, player.aroundIndex + count);
      state.log.unshift(player.name + ": " + label + " → " + nextAroundLabel(player));
    } else {
      state.log.unshift(player.name + ": " + label);
    }
    state.turnThrows.push({ label: label, score: count });

    if (player.aroundIndex >= AROUND_TARGETS.length) {
      state.winnerIndex = state.currentPlayer;
      return "win";
    }

    if (state.dartsRemaining <= 0) {
      endTurn(state, window.Darts.I18n.t("game.turnEnded", { player: player.name }));
    }
    return count > 0 ? "hit" : "miss";
  }

  function nextAroundLabel(player) {
    var target = AROUND_TARGETS[player.aroundIndex];
    if (!target) {
      return window.Darts.I18n.t("game.win", { player: player.name });
    }
    return target === 25 ? "Bull" : String(target);
  }

  function registerThrow(state, hit, normalizedPoint) {
    if (!state || state.winnerIndex !== null) {
      return { state: state, result: "ignored" };
    }
    state.history.push(makeHistoryFrame(state));
    if (state.history.length > 40) {
      state.history.shift();
    }
    state.dartsRemaining -= 1;
    state.markers.push({
      x: normalizedPoint.x,
      y: normalizedPoint.y,
      color: currentPlayer(state).color,
      label: describeHit(hit)
    });
    if (state.markers.length > 18) {
      state.markers.shift();
    }

    var result;
    if (state.mode === "cricket") {
      result = scoreCricket(state, hit);
    } else if (state.mode === "around") {
      result = scoreAround(state, hit);
    } else {
      result = scoreX01(state, hit);
    }
    state.updatedAt = new Date().toISOString();
    return { state: state, result: result };
  }

  window.Darts.Scoring = {
    BOARD_NUMBERS: BOARD_NUMBERS,
    CRICKET_TARGETS: CRICKET_TARGETS,
    AROUND_TARGETS: AROUND_TARGETS,
    PLAYER_COLORS: PLAYER_COLORS,
    newGame: function (settings) {
      var mode = settings.mode || "501";
      if (mode === "701") {
        settings.startScore = 701;
      } else if (mode === "301") {
        settings.startScore = 301;
      }
      var players = [];
      var playerCount = Math.max(1, Math.min(4, Number(settings.playerCount) || ((Number(settings.aiCount) || 0) + 1)));
      for (var index = 0; index < playerCount; index += 1) {
        players.push(createPlayer(index, settings));
      }
      return {
        version: 1,
        id: "game-" + Date.now(),
        mode: mode,
        startScore: modeStartScore(settings),
        aiCount: Math.max(0, playerCount - 1),
        aiDifficulty: settings.aiDifficulty || "normal",
        players: players,
        currentPlayer: 0,
        dartsRemaining: 3,
        turnStartScore: players[0].score,
        turnThrows: [],
        log: [],
        markers: [],
        history: [],
        winnerIndex: null,
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },
    registerThrow: registerThrow,
    endTurn: function (state) {
      if (!state || state.winnerIndex !== null) {
        return state;
      }
      state.history.push(makeHistoryFrame(state));
      endTurn(state, window.Darts.I18n.t("game.turnEnded", { player: currentPlayer(state).name }));
      return state;
    },
    undo: function (state) {
      if (!state || !state.history || !state.history.length) {
        return state;
      }
      var frame = state.history.pop();
      restoreHistoryFrame(state, frame);
      state.updatedAt = new Date().toISOString();
      return state;
    },
    describeHit: describeHit,
    hitScore: hitScore,
    nextAroundLabel: nextAroundLabel
  };
})();
