(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;
  var GS = NMM.GameState;
  var Rules = NMM.Rules;
  var Validator = NMM.MoveValidator;
  var state = null;
  var settings = null;
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
    var item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    stack.appendChild(item);
    global.setTimeout(function () {
      item.remove();
    }, 2600);
  }

  function resetSelection() {
    ui.selected = null;
    ui.legalTargets = [];
  }

  function renderMenu() {
    byId("menu-difficulty").textContent = NMM.I18n.t("difficulty_" + settings.difficulty);
    byId("menu-theme").textContent = NMM.ThemeManager.label(settings.theme);
    byId("menu-save-status").textContent = NMM.SaveManager.hasGame() ? NMM.I18n.t("save_available") : NMM.I18n.t("save_empty");
    byId("btn-continue-game").disabled = !NMM.SaveManager.hasGame();
  }

  function renderGame() {
    if (!state) {
      return;
    }
    NMM.BoardRenderer.render(state, {
      selected: ui.selected,
      legalTargets: ui.legalTargets,
      locked: ui.aiThinking || state.currentTurn === C.PLAYERS.AI || state.gameOver
    });
    NMM.Hud.render(state, ui);
    byId("btn-undo").disabled = ui.aiThinking || !state.undoStack || !state.undoStack.length;
  }

  function renderAll() {
    NMM.I18n.apply(document);
    NMM.Howto.render();
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
    if (!state || state.gameOver || state.awaitingRemoval || state.currentTurn !== C.PLAYERS.AI || aiTimer) {
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
      if (aiTimer) {
        global.clearTimeout(aiTimer);
        aiTimer = null;
      }
      state = GS.create(settings.difficulty);
      ui.aiThinking = false;
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
    state = loaded;
    ui.aiThinking = false;
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
        NMM.Audio.unlock();
        NMM.Audio.playSfx("click");
        NMM.Router.show(event.currentTarget.getAttribute("data-route"));
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
