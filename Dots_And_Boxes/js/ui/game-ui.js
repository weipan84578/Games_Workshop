(function (ns) {
  "use strict";

  var engine = new ns.GameEngine();
  var aiTimer = null;
  var aiThinking = false;
  var lastOptions = { size: 4, difficulty: "normal", firstPlayer: "player" };

  function vibrate(pattern) {
    if (ns.appSettings && ns.appSettings.vibration && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  function updateHud() {
    var model = engine.getState();
    if (!model) {
      return;
    }
    document.getElementById("player-score").textContent = model.scores.player;
    document.getElementById("ai-score").textContent = model.scores.ai;
    var difficultyKey = "game.difficultyBadge." + model.difficulty;
    document.getElementById("ai-difficulty-label").textContent = ns.I18n.t(difficultyKey);
    var playerPill = document.getElementById("player-score-pill");
    var aiPill = document.getElementById("ai-score-pill");
    playerPill.classList.toggle("is-current", model.currentTurn === "player");
    aiPill.classList.toggle("is-current", model.currentTurn === "ai");
    document.getElementById("turn-status").textContent = model.currentTurn === "player" ? ns.I18n.t("game.yourTurn") : ns.I18n.t(model.difficulty === "hard" ? "game.aiDeepThinking" : "game.aiThinking");
  }

  function render() {
    var model = engine.getState();
    if (!model) {
      return;
    }
    var disabled = model.currentTurn !== "player" || aiThinking || model.status !== "playing";
    document.getElementById("board-shell").classList.toggle("is-disabled", disabled);
    document.getElementById("board-overlay").hidden = !aiThinking;
    ns.BoardRenderer.render(model, { disabled: disabled });
    updateHud();
  }

  function showToast(text) {
    var toast = document.getElementById("game-toast");
    toast.textContent = text;
    toast.hidden = false;
    toast.classList.remove("toast");
    void toast.offsetWidth;
    toast.classList.add("toast");
    window.setTimeout(function () {
      toast.hidden = true;
    }, 2000);
  }

  function persistAndFinish(result) {
    var model = engine.getState();
    if (model.status === "finished") {
      ns.SaveManager.clearGame();
      render();
      ns.ResultModalUI.show(model);
      return;
    }
    ns.SaveManager.saveGame(model);
    if (result.completedBoxes.length) {
      showToast(result.actor === "player" ? ns.I18n.t("game.scoreGained") : ns.I18n.t("game.aiScoreGained"));
    }
    render();
    if (model.currentTurn === "ai") {
      requestAiMove();
    }
  }

  function requestAiMove() {
    var model = engine.getState();
    if (!model || model.status !== "playing" || model.currentTurn !== "ai") {
      return;
    }
    aiThinking = true;
    render();
    window.clearTimeout(aiTimer);
    aiTimer = window.setTimeout(function () {
      var activeModel = engine.getState();
      var move = ns.AIController.chooseMove(activeModel, activeModel.difficulty);
      aiThinking = false;
      if (!move) {
        render();
        return;
      }
      var result = engine.playMove(move, "ai");
      ns.AudioManager.playSfx(result.completedBoxes.length ? "boxComplete" : "lineDraw");
      persistAndFinish(result);
    }, ns.AIController.getDelay(model.difficulty));
  }

  ns.GameUI = {
    init: function () {
      ns.BoardRenderer.mount(document.getElementById("board-root"), this.handlePlayerMove.bind(this));
      document.getElementById("game-back-button").addEventListener("click", function () {
        ns.MainMenuUI.refresh();
        ns.Router.show("menu");
      });
      document.getElementById("game-settings-button").addEventListener("click", function () {
        ns.Router.show("settings");
      });
      document.getElementById("pause-button").addEventListener("click", function () {
        ns.openModal("pause-modal");
      });
      document.getElementById("game-mute-button").addEventListener("click", function () {
        ns.AudioManager.toggleMuted();
        ns.appSettings.muted = ns.AudioManager.settings.muted;
        ns.SaveManager.saveSettings(ns.appSettings);
        ns.MainMenuUI.refresh();
      });
      document.getElementById("pause-settings-button").addEventListener("click", function () {
        ns.closeModal("pause-modal");
        ns.Router.show("settings");
      });
      document.getElementById("pause-menu-button").addEventListener("click", function () {
        ns.closeModal("pause-modal");
        ns.MainMenuUI.refresh();
        ns.Router.show("menu");
      });
      ns.events.on("languagechange", updateHud);
    },

    startNewGame: function (options) {
      lastOptions = Object.assign({}, options);
      window.clearTimeout(aiTimer);
      aiThinking = false;
      engine.startNew(options);
      ns.SaveManager.saveGame(engine.getState());
      ns.Router.show("game");
      render();
      if (engine.getState().currentTurn === "ai") {
        requestAiMove();
      }
    },

    continueSavedGame: function () {
      var saved = ns.SaveManager.loadGame();
      if (!saved) {
        ns.MainMenuUI.refresh();
        return;
      }
      lastOptions = {
        size: saved.rows,
        difficulty: saved.difficulty,
        firstPlayer: saved.currentTurn
      };
      window.clearTimeout(aiTimer);
      aiThinking = false;
      engine.restore(saved);
      ns.Router.show("game");
      render();
      if (engine.getState().currentTurn === "ai") {
        requestAiMove();
      }
    },

    handlePlayerMove: function (move) {
      var model = engine.getState();
      if (!model || model.currentTurn !== "player" || aiThinking) {
        return;
      }
      var result = engine.playMove(move, "player");
      if (!result.ok) {
        return;
      }
      ns.AudioManager.playSfx(result.completedBoxes.length ? "boxComplete" : "lineDraw");
      vibrate(result.completedBoxes.length ? [25, 30, 25] : 12);
      persistAndFinish(result);
    },

    playAgain: function () {
      this.startNewGame(lastOptions);
    },

    getCurrentModel: function () {
      return engine.getState();
    },

    refresh: render
  };
})(window.DAB = window.DAB || {});
