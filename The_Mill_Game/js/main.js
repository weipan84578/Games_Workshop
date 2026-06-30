(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;
  var GS = NMM.GameState;
  var Rules = NMM.Rules;
  var Validator = NMM.MoveValidator;
  var state = null;
  var settings = null;
  var appMode = "game";
  var replaySession = null;
  var ui = {
    selected: null,
    legalTargets: [],
    aiThinking: false
  };
  var aiTimer = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function toast(message) {
    var stack = byId("toast-stack");
    var key = encodeURIComponent(message);
    var existing = stack.querySelector('[data-toast-key="' + key + '"]');
    var item = document.createElement("div");
    var text;
    var count;

    if (existing) {
      count = Number(existing.getAttribute("data-toast-count") || "1") + 1;
      existing.setAttribute("data-toast-count", String(count));
      existing.querySelector(".toast-count").textContent = "x" + count;
      if (existing.toastTimer) {
        global.clearTimeout(existing.toastTimer);
      }
      existing.toastTimer = global.setTimeout(function () {
        existing.remove();
      }, 2600);
      stack.prepend(existing);
      return;
    }

    item.className = "toast";
    item.setAttribute("data-toast-key", key);
    item.setAttribute("data-toast-count", "1");
    text = document.createElement("span");
    text.className = "toast-text";
    text.textContent = message;
    count = document.createElement("span");
    count.className = "toast-count";
    count.textContent = "x1";
    item.appendChild(text);
    item.appendChild(count);
    stack.prepend(item);
    item.toastTimer = global.setTimeout(function () {
      item.remove();
    }, 2600);
  }

  function resetSelection() {
    ui.selected = null;
    ui.legalTargets = [];
  }

  function isReplayMode() {
    return appMode === "replay" && replaySession;
  }

  function stopReplayPlayback() {
    if (replaySession && replaySession.timer) {
      global.clearTimeout(replaySession.timer);
      replaySession.timer = null;
    }
    if (replaySession) {
      replaySession.playing = false;
    }
  }

  function renderMenu() {
    byId("menu-difficulty").textContent = NMM.I18n.t("difficulty_" + settings.difficulty);
    byId("menu-theme").textContent = NMM.ThemeManager.label(settings.theme);
    byId("menu-save-status").textContent = NMM.SaveManager.hasGame() ? NMM.I18n.t("save_available") : NMM.I18n.t("save_empty");
    byId("btn-continue-game").disabled = !NMM.SaveManager.hasGame();
  }

  function renderReplayList() {
    var root = byId("replay-list");
    var empty = byId("replay-empty");
    var replays = NMM.SaveManager.loadReplays();
    root.textContent = "";
    empty.hidden = replays.length > 0;
    for (var i = 0; i < replays.length; i += 1) {
      var replay = replays[i];
      var item = document.createElement("section");
      var info = document.createElement("div");
      var title = document.createElement("h3");
      var meta = document.createElement("p");
      var actions = document.createElement("div");
      var play = document.createElement("button");
      var del = document.createElement("button");

      item.className = "replay-item";
      info.className = "replay-info";
      title.textContent = NMM.ReplayController.replayTitle(replay);
      meta.className = "replay-meta";
      meta.textContent = NMM.ReplayController.replayMeta(replay);
      actions.className = "replay-actions";

      play.type = "button";
      play.className = "btn btn-primary";
      play.setAttribute("data-replay-open", replay.id);
      play.textContent = NMM.I18n.t("replay_play");

      del.type = "button";
      del.className = "btn btn-secondary";
      del.setAttribute("data-replay-delete", replay.id);
      del.textContent = NMM.I18n.t("replay_delete");

      info.appendChild(title);
      info.appendChild(meta);
      actions.appendChild(play);
      actions.appendChild(del);
      item.appendChild(info);
      item.appendChild(actions);
      root.appendChild(item);
    }
  }

  function renderReplayControls() {
    var controls = byId("replay-controls");
    var total;
    var current;
    var caption;

    controls.hidden = !isReplayMode();
    if (!isReplayMode()) {
      return;
    }

    total = replaySession.replay.history.length;
    current = replaySession.index;
    caption = current === 0 ? NMM.I18n.t("replay_opening") : NMM.ReplayController.formatMove(replaySession.replay.history[current - 1]);
    if (current === total) {
      caption += " · " + NMM.ReplayController.winnerLabel(replaySession.replay.winner);
    }

    byId("replay-step-label").textContent = NMM.I18n.t("replay_step", { current: current, total: total });
    byId("replay-caption").textContent = caption;
    byId("btn-replay-play").textContent = replaySession.playing ? NMM.I18n.t("replay_pause_button") : NMM.I18n.t("replay_play_button");
    byId("btn-replay-start").disabled = current === 0;
    byId("btn-replay-prev").disabled = current === 0;
    byId("btn-replay-next").disabled = current === total;
    byId("btn-replay-end").disabled = current === total;
  }

  function renderGame() {
    var replayMode = isReplayMode();
    if (!state) {
      byId("replay-controls").hidden = true;
      return;
    }
    NMM.BoardRenderer.render(state, {
      selected: ui.selected,
      legalTargets: ui.legalTargets,
      locked: replayMode || ui.aiThinking || state.currentTurn === C.PLAYERS.AI || state.gameOver
    });
    NMM.Hud.render(state, ui);
    byId("btn-undo").hidden = replayMode;
    byId("btn-reset-game").hidden = replayMode;
    byId("btn-save-replay").hidden = replayMode || !state.gameOver;
    byId("btn-save-replay").disabled = Boolean(ui.replaySaved) || !state.history.length;
    byId("btn-undo").disabled = ui.aiThinking || !state.undoStack || !state.undoStack.length;
    renderReplayControls();
    if (replayMode) {
      byId("game-status").textContent = byId("replay-caption").textContent;
    }
  }

  function renderAll() {
    NMM.I18n.apply(document);
    NMM.Howto.render();
    renderReplayList();
    renderMenu();
    renderGame();
  }

  function persistAndRender() {
    if (state) {
      NMM.SaveManager.saveGame(state);
    }
    renderAll();
  }

  function playResultSound() {
    if (!state || !state.gameOver) {
      return;
    }
    if (state.winner === C.PLAYERS.PLAYER) {
      NMM.Audio.playSfx("win");
    } else if (state.winner === C.PLAYERS.AI) {
      NMM.Audio.playSfx("lose");
    }
  }

  function handleActionSound(action, result) {
    if (result && result.formedMill) {
      NMM.Audio.playSfx("mill");
      if (typeof action.remove === "number") {
        global.setTimeout(function () {
          NMM.Audio.playSfx("remove");
        }, 90);
      }
      return;
    }
    NMM.Audio.playSfx(action.type === "place" ? "place" : "move");
  }

  function scheduleAI() {
    if (isReplayMode() || !state || state.gameOver || state.awaitingRemoval || state.currentTurn !== C.PLAYERS.AI || aiTimer) {
      return;
    }
    ui.aiThinking = true;
    renderGame();
    aiTimer = global.setTimeout(function () {
      var action;
      var result;
      aiTimer = null;
      if (!state || state.gameOver || state.currentTurn !== C.PLAYERS.AI) {
        ui.aiThinking = false;
        renderGame();
        return;
      }
      action = NMM.AI.Dispatcher.chooseMove(state, state.difficulty);
      if (!action) {
        Rules.checkGameOver(state);
      } else {
        result = Rules.applyTurnAction(state, action, C.PLAYERS.AI, {
          mutate: true,
          record: true
        });
        if (result.ok) {
          handleActionSound(action, result);
        }
      }
      ui.aiThinking = false;
      resetSelection();
      persistAndRender();
      playResultSound();
    }, NMM.AI.Dispatcher.getDelay(state.difficulty));
  }

  function startNewGame(skipConfirm) {
    function start() {
      stopReplayPlayback();
      appMode = "game";
      replaySession = null;
      if (aiTimer) {
        global.clearTimeout(aiTimer);
        aiTimer = null;
      }
      state = GS.create(settings.difficulty);
      ui.aiThinking = false;
      ui.replaySaved = false;
      resetSelection();
      NMM.Router.show("view-game");
      persistAndRender();
      NMM.Audio.playSfx("click");
    }

    if (!skipConfirm && (NMM.SaveManager.hasGame() || (state && !state.gameOver))) {
      NMM.Modal.show({
        title: NMM.I18n.t("modal_new_title"),
        body: NMM.I18n.t("modal_new_body"),
        onConfirm: start
      });
      return;
    }
    start();
  }

  function continueGame() {
    var loaded = NMM.SaveManager.loadGame();
    if (!loaded) {
      toast(NMM.I18n.t("save_empty"));
      return;
    }
    stopReplayPlayback();
    appMode = "game";
    replaySession = null;
    state = loaded;
    ui.aiThinking = false;
    ui.replaySaved = false;
    resetSelection();
    NMM.Router.show("view-game");
    renderAll();
    scheduleAI();
  }

  function restartGame() {
    NMM.Modal.show({
      title: NMM.I18n.t("modal_reset_title"),
      body: NMM.I18n.t("modal_new_body"),
      onConfirm: function () {
        startNewGame(true);
      }
    });
  }

  function undoTurn() {
    var previous;
    if (!state || ui.aiThinking) {
      return;
    }
    previous = GS.popUndo(state);
    if (!previous) {
      toast(NMM.I18n.t("toast_no_undo"));
      return;
    }
    state = previous;
    resetSelection();
    persistAndRender();
  }

  function afterPlayerAction(action, result) {
    if (!result.ok) {
      toast(NMM.I18n.t("toast_illegal"));
      return;
    }
    handleActionSound(action, result);
    resetSelection();
    persistAndRender();
    playResultSound();
    scheduleAI();
  }

  function handlePendingRemoval(index) {
    var result;
    if (!Validator.canRemoveAt(state, index)) {
      toast(NMM.I18n.t("toast_illegal"));
      return;
    }
    result = Rules.removePending(state, index);
    if (result.ok) {
      NMM.Audio.playSfx("remove");
      resetSelection();
      persistAndRender();
      playResultSound();
      scheduleAI();
    }
  }

  function handlePlace(index) {
    var action = { type: "place", to: index };
    var result;
    if (!Validator.canPlaceAt(state, C.PLAYERS.PLAYER, index)) {
      toast(NMM.I18n.t("toast_illegal"));
      return;
    }
    GS.pushUndo(state);
    result = Rules.applyTurnAction(state, action, C.PLAYERS.PLAYER, {
      mutate: true,
      allowPending: true,
      record: true
    });
    afterPlayerAction(action, result);
  }

  function handleMoveSelection(index) {
    var action;
    var result;

    if (ui.selected === null) {
      if (Validator.canSelectPiece(state, C.PLAYERS.PLAYER, index)) {
        ui.selected = index;
        ui.legalTargets = Rules.getLegalDestinations(state, C.PLAYERS.PLAYER, index);
        NMM.Audio.playSfx("click");
        renderGame();
      } else {
        toast(NMM.I18n.t("toast_illegal"));
      }
      return;
    }

    if (ui.selected === index) {
      resetSelection();
      renderGame();
      return;
    }

    if (Validator.canSelectPiece(state, C.PLAYERS.PLAYER, index)) {
      ui.selected = index;
      ui.legalTargets = Rules.getLegalDestinations(state, C.PLAYERS.PLAYER, index);
      NMM.Audio.playSfx("click");
      renderGame();
      return;
    }

    if (!Validator.canMoveTo(state, C.PLAYERS.PLAYER, ui.selected, index)) {
      toast(NMM.I18n.t("toast_illegal"));
      return;
    }

    action = { type: "move", from: ui.selected, to: index };
    GS.pushUndo(state);
    result = Rules.applyTurnAction(state, action, C.PLAYERS.PLAYER, {
      mutate: true,
      allowPending: true,
      record: true
    });
    afterPlayerAction(action, result);
  }

  function handlePointClick(index) {
    var phase;
    NMM.Audio.unlock();
    if (!state) {
      startNewGame(true);
      return;
    }
    if (ui.aiThinking || state.gameOver || state.currentTurn !== C.PLAYERS.PLAYER) {
      return;
    }
    if (state.awaitingRemoval) {
      handlePendingRemoval(index);
      return;
    }
    phase = GS.currentPhaseFor(state, C.PLAYERS.PLAYER);
    if (phase === C.PHASES.PLACING) {
      handlePlace(index);
      return;
    }
    handleMoveSelection(index);
  }

  function clearSaveWithConfirm() {
    NMM.Modal.show({
      title: NMM.I18n.t("modal_clear_title"),
      body: NMM.I18n.t("modal_clear_body"),
      onConfirm: function () {
        NMM.SaveManager.clearGame();
        if (state && !state.gameOver) {
          state = null;
        }
        renderAll();
        toast(NMM.I18n.t("toast_save_cleared"));
      }
    });
  }

  function saveCurrentReplay() {
    var result;
    if (!state || !state.gameOver) {
      toast(NMM.I18n.t("replay_save_unavailable"));
      return;
    }
    result = NMM.SaveManager.addReplay(state);
    if (!result) {
      toast(NMM.I18n.t("replay_save_unavailable"));
      return;
    }
    ui.replaySaved = true;
    renderAll();
    toast(result.overwritten ? NMM.I18n.t("replay_saved") + " " + NMM.I18n.t("replay_overwrite_notice") : NMM.I18n.t("replay_saved"));
  }

  function setReplayIndex(index) {
    if (!isReplayMode()) {
      return;
    }
    replaySession.index = Math.max(0, Math.min(index, replaySession.replay.history.length));
    state = NMM.ReplayController.buildStateAt(replaySession.replay, replaySession.index);
    resetSelection();
    renderAll();
  }

  function stepReplay(delta) {
    setReplayIndex(replaySession.index + delta);
  }

  function tickReplay() {
    if (!isReplayMode() || !replaySession.playing) {
      return;
    }
    if (replaySession.index >= replaySession.replay.history.length) {
      stopReplayPlayback();
      renderAll();
      return;
    }
    setReplayIndex(replaySession.index + 1);
    replaySession.timer = global.setTimeout(tickReplay, 900);
  }

  function toggleReplayPlayback() {
    if (!isReplayMode()) {
      return;
    }
    if (replaySession.playing) {
      stopReplayPlayback();
      renderAll();
      return;
    }
    if (replaySession.index >= replaySession.replay.history.length) {
      setReplayIndex(0);
    }
    replaySession.playing = true;
    renderAll();
    replaySession.timer = global.setTimeout(tickReplay, 450);
  }

  function openReplay(id) {
    var replays = NMM.SaveManager.loadReplays();
    var replay = null;
    for (var i = 0; i < replays.length; i += 1) {
      if (replays[i].id === id) {
        replay = replays[i];
        break;
      }
    }
    if (!replay) {
      renderReplayList();
      return;
    }
    stopReplayPlayback();
    appMode = "replay";
    replaySession = {
      replay: replay,
      index: 0,
      playing: false,
      timer: null
    };
    state = NMM.ReplayController.buildStateAt(replay, 0);
    ui.aiThinking = false;
    resetSelection();
    NMM.Router.show("view-game");
    renderAll();
  }

  function deleteReplayWithConfirm(id) {
    NMM.Modal.show({
      title: NMM.I18n.t("modal_delete_replay_title"),
      body: NMM.I18n.t("modal_delete_replay_body"),
      onConfirm: function () {
        if (NMM.SaveManager.deleteReplay(id)) {
          renderAll();
          toast(NMM.I18n.t("replay_deleted"));
        }
      }
    });
  }

  function applySettings(nextSettings) {
    settings = Object.assign({}, nextSettings);
    settings.theme = NMM.ThemeManager.apply(settings.theme);
    NMM.I18n.setLanguage(settings.language);
    NMM.Audio.applySettings(settings);
    NMM.SaveManager.saveSettings(settings);
    if (state && !state.gameOver) {
      state.difficulty = settings.difficulty;
      NMM.SaveManager.saveGame(state);
    }
    NMM.SettingsController.hydrate(settings);
    renderAll();
  }

  function bindEvents() {
    var routeButtons = document.querySelectorAll("[data-route]");
    for (var i = 0; i < routeButtons.length; i += 1) {
      routeButtons[i].addEventListener("click", function (event) {
        var target = event.currentTarget.getAttribute("data-route");
        NMM.Audio.unlock();
        NMM.Audio.playSfx("click");
        if (isReplayMode() && target !== "view-game") {
          stopReplayPlayback();
          appMode = "game";
          replaySession = null;
          state = null;
        }
        NMM.Router.show(target);
        renderAll();
      });
    }

    byId("btn-new-game").addEventListener("click", function () {
      NMM.Audio.unlock();
      if (settings.musicEnabled) {
        NMM.Audio.startBgm(0);
      }
      startNewGame(false);
    });
    byId("btn-continue-game").addEventListener("click", function () {
      NMM.Audio.unlock();
      if (settings.musicEnabled) {
        NMM.Audio.startBgm(0);
      }
      continueGame();
    });
    byId("btn-reset-game").addEventListener("click", restartGame);
    byId("btn-undo").addEventListener("click", undoTurn);
    byId("btn-save-replay").addEventListener("click", saveCurrentReplay);
    byId("btn-music-toggle").addEventListener("click", function () {
      settings.musicEnabled = !settings.musicEnabled;
      if (settings.musicEnabled) {
        NMM.Audio.startBgm(0);
      } else {
        NMM.Audio.stopBgm();
      }
      NMM.SaveManager.saveSettings(settings);
      NMM.SettingsController.hydrate(settings);
      toast(NMM.I18n.t("toast_track"));
    });

    byId("replay-list").addEventListener("click", function (event) {
      var openButton = event.target.closest("[data-replay-open]");
      var deleteButton = event.target.closest("[data-replay-delete]");
      if (openButton) {
        openReplay(openButton.getAttribute("data-replay-open"));
      }
      if (deleteButton) {
        deleteReplayWithConfirm(deleteButton.getAttribute("data-replay-delete"));
      }
    });

    byId("btn-replay-start").addEventListener("click", function () {
      stopReplayPlayback();
      setReplayIndex(0);
    });
    byId("btn-replay-prev").addEventListener("click", function () {
      stopReplayPlayback();
      stepReplay(-1);
    });
    byId("btn-replay-play").addEventListener("click", toggleReplayPlayback);
    byId("btn-replay-next").addEventListener("click", function () {
      stopReplayPlayback();
      stepReplay(1);
    });
    byId("btn-replay-end").addEventListener("click", function () {
      stopReplayPlayback();
      setReplayIndex(replaySession.replay.history.length);
    });

    document.addEventListener("pointerdown", function () {
      NMM.Audio.unlock();
      if (settings.musicEnabled) {
        NMM.Audio.startBgm(0);
      }
    }, { once: true });
  }

  function init() {
    settings = NMM.SaveManager.loadSettings();
    NMM.I18n.setLanguage(settings.language);
    NMM.ThemeManager.apply(settings.theme);
    NMM.Audio.applySettings(settings);
    NMM.Modal.init();
    NMM.BoardRenderer.init(handlePointClick);
    NMM.SettingsController.init(settings, applySettings, clearSaveWithConfirm);
    NMM.Howto.render();
    bindEvents();
    renderAll();
    NMM.SaveManager.markLaunched();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window);
