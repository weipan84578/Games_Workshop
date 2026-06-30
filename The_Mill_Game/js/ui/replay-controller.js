(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;
  var GS = NMM.GameState;
  var Rules = NMM.Rules;

  function actorLabel(actor) {
    return actor === C.PLAYERS.PLAYER ? NMM.I18n.t("player_label") : NMM.I18n.t("ai_label");
  }

  function winnerLabel(winner) {
    if (winner === C.PLAYERS.PLAYER) {
      return NMM.I18n.t("status_player_win");
    }
    if (winner === C.PLAYERS.AI) {
      return NMM.I18n.t("status_ai_win");
    }
    return NMM.I18n.t("status_draw");
  }

  function formatMove(entry) {
    var text;
    if (!entry) {
      return NMM.I18n.t("replay_opening");
    }
    if (entry.type === "place") {
      text = NMM.I18n.t("log_place", { actor: actorLabel(entry.by), to: Number(entry.to) + 1 });
    } else if (entry.type === "move") {
      text = NMM.I18n.t("log_move", { actor: actorLabel(entry.by), from: Number(entry.from) + 1, to: Number(entry.to) + 1 });
    } else {
      text = actorLabel(entry.by);
    }
    if (typeof entry.removed === "number") {
      text += NMM.I18n.t("log_remove", { removed: Number(entry.removed) + 1 });
    }
    return text;
  }

  function formatDate(timestamp) {
    var date = new Date(timestamp);
    try {
      return date.toLocaleString();
    } catch (error) {
      return date.toISOString();
    }
  }

  function buildStateAt(replay, stepIndex) {
    var state = GS.create(replay.difficulty || "normal");
    var limit = Math.max(0, Math.min(stepIndex, replay.history.length));
    var i;

    state.history = [];
    state.undoStack = [];
    state.lastMove = null;

    for (i = 0; i < limit; i += 1) {
      var entry = replay.history[i];
      var action = {
        type: entry.type,
        from: typeof entry.from === "number" ? entry.from : undefined,
        to: typeof entry.to === "number" ? entry.to : undefined
      };
      if (typeof entry.removed === "number") {
        action.remove = entry.removed;
      }
      Rules.applyTurnAction(state, action, entry.by, { mutate: true });
    }

    state.history = replay.history.slice(0, limit);
    state.awaitingRemoval = null;
    if (limit === replay.history.length) {
      state.gameOver = true;
      state.winner = replay.winner || null;
    } else {
      state.gameOver = false;
      state.winner = null;
    }
    return state;
  }

  function replayTitle(replay) {
    return NMM.I18n.t("replay_item_title", {
      date: formatDate(replay.savedAt),
      moves: replay.moveCount
    });
  }

  function replayMeta(replay) {
    return NMM.I18n.t("replay_item_meta", {
      difficulty: NMM.I18n.t("difficulty_" + replay.difficulty),
      result: winnerLabel(replay.winner)
    });
  }

  NMM.ReplayController = {
    buildStateAt: buildStateAt,
    formatMove: formatMove,
    formatDate: formatDate,
    replayTitle: replayTitle,
    replayMeta: replayMeta,
    winnerLabel: winnerLabel
  };
})(window);
