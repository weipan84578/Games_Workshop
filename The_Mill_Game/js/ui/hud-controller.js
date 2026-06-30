(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;
  var GS = NMM.GameState;

  function byId(id) {
    return document.getElementById(id);
  }

  function phaseLabel(state, actor) {
    var phase = GS.currentPhaseFor(state, actor || state.currentTurn);
    return NMM.I18n.t("phase_" + phase);
  }

  function statusText(state, ui) {
    var phase;
    if (state.gameOver) {
      if (state.winner === C.PLAYERS.PLAYER) {
        return NMM.I18n.t("status_player_win");
      }
      if (state.winner === C.PLAYERS.AI) {
        return NMM.I18n.t("status_ai_win");
      }
      return NMM.I18n.t("status_draw");
    }
    if (ui && ui.aiThinking) {
      return NMM.I18n.t("status_ai_thinking");
    }
    if (state.awaitingRemoval && state.awaitingRemoval.by === C.PLAYERS.PLAYER) {
      return NMM.I18n.t("status_remove");
    }
    if (state.currentTurn === C.PLAYERS.AI) {
      return NMM.I18n.t("status_ai_thinking");
    }
    phase = GS.currentPhaseFor(state, C.PLAYERS.PLAYER);
    if (phase === C.PHASES.PLACING) {
      return NMM.I18n.t("status_player_place");
    }
    if (phase === C.PHASES.FLYING) {
      return NMM.I18n.t("status_player_fly");
    }
    return NMM.I18n.t("status_player_move");
  }

  function actorLabel(actor) {
    return actor === C.PLAYERS.PLAYER ? NMM.I18n.t("player_label") : NMM.I18n.t("ai_label");
  }

  function formatLog(entry) {
    var text;
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

  function renderLog(state) {
    var list = byId("move-log");
    var count = byId("move-count");
    var entries = state.history.slice(-16).reverse();
    list.textContent = "";
    count.textContent = String(state.history.length);
    for (var i = 0; i < entries.length; i += 1) {
      var item = document.createElement("li");
      item.textContent = formatLog(entries[i]);
      list.appendChild(item);
    }
  }

  function render(state, ui) {
    byId("player-hand").textContent = String(state.playerPiecesInHand);
    byId("player-board").textContent = String(state.playerPiecesOnBoard);
    byId("ai-hand").textContent = String(state.aiPiecesInHand);
    byId("ai-board").textContent = String(state.aiPiecesOnBoard);
    byId("phase-label").textContent = phaseLabel(state, state.currentTurn);
    byId("turn-label").textContent = state.currentTurn === C.PLAYERS.PLAYER ? NMM.I18n.t("turn_player") : NMM.I18n.t("turn_ai");
    byId("game-status").textContent = statusText(state, ui);
    byId("panel-player").classList.toggle("is-active", state.currentTurn === C.PLAYERS.PLAYER && !state.gameOver);
    byId("panel-ai").classList.toggle("is-active", state.currentTurn === C.PLAYERS.AI && !state.gameOver);
    renderLog(state);
  }

  NMM.Hud = {
    render: render,
    statusText: statusText
  };
})(window);
