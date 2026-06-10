(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function App() {
    this.saveManager = new Mancala.SaveManager();
    this.settings = this.saveManager.loadSettings();
    this.i18n = new Mancala.I18n(this.settings.language);
    Mancala.i18n = this.i18n;
    this.themeManager = new Mancala.ThemeManager();
    this.audio = new Mancala.AudioEngine(this.settings);
    this.toast = new Mancala.ToastManager(document.getElementById("toast-container"));
    this.screen = new Mancala.ScreenManager();
    this.state = null;
    this.engine = null;
    this.aiController = new Mancala.AIController(this.settings.defaultDifficulty);
    this.animation = new Mancala.AnimationManager(this.audio);
    this.timerId = null;
    this.isAnimating = false;
    this.aiTimeout = null;
    this.settingsReturnScreen = "screen-main-menu";
    this.lastDifficulty = this.settings.defaultDifficulty;

    this.renderer = new Mancala.BoardRenderer({
      aiPits: document.getElementById("ai-pits"),
      playerPits: document.getElementById("player-pits"),
      aiStore: document.getElementById("ai-store"),
      playerStore: document.getElementById("player-store"),
      onPitClick: this.handlePitClick.bind(this)
    });
  }

  App.prototype.t = function(key, params) {
    return this.i18n.t(key, params);
  };

  App.prototype.init = function() {
    this.themeManager.apply(this.settings.theme);
    this.i18n.apply();
    this.bindControls();
    this.syncSettingsForm();
    this.updateContinueButton();
    this.updateControlButtons();
    this.audio.switchMusic("music_menu");
    this.bindAudioUnlock();
  };

  App.prototype.bindAudioUnlock = function() {
    var self = this;
    document.addEventListener("pointerdown", function() {
      self.audio.init();
    }, { once: true });
  };

  App.prototype.bindControls = function() {
    var self = this;
    on("btn-start", "click", function() { self.openDifficultyModal(); });
    on("btn-continue", "click", function() { self.continueGame(); });
    on("btn-instructions", "click", function() { self.openInstructions(); });
    on("btn-settings", "click", function() { self.openSettings("screen-main-menu"); });
    on("btn-game-settings", "click", function() { self.openSettings("screen-game"); });
    on("btn-learned-start", "click", function() { self.openDifficultyModal(); });
    on("btn-toggle-sfx", "click", function() { self.toggleSfx(); });
    on("btn-toggle-music", "click", function() { self.toggleMusic(); });
    on("btn-pause", "click", function() { self.togglePause(); });
    on("btn-return-menu", "click", function() { self.confirmReturnMenu(); });
    on("btn-play-again", "click", function() { self.openDifficultyModal(); });
    on("btn-result-menu", "click", function() { self.goMainMenu(); });

    document.querySelectorAll(".js-back-menu").forEach(function(button) {
      button.addEventListener("click", function() {
        self.leaveSubscreen();
      });
    });

    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape") {
        if (!document.getElementById("modal-overlay").classList.contains("hidden")) {
          self.closeModal();
        } else if (self.screen.current === "screen-game") {
          self.togglePause();
        }
      }
    });

    document.querySelectorAll("button").forEach(function(button) {
      button.addEventListener("pointerenter", function() {
        if (!button.disabled) {
          self.audio.play("sfx_button_hover");
        }
      });
      button.addEventListener("click", function() {
        if (!button.disabled) {
          self.audio.play("sfx_button_click");
        }
      });
    });

    this.bindSettingsControls();
  };

  App.prototype.bindSettingsControls = function() {
    var self = this;
    var form = document.getElementById("settings-form");
    var musicRange = document.getElementById("setting-music-volume");
    var sfxRange = document.getElementById("setting-sfx-volume");
    var timerToggle = document.getElementById("setting-show-timer");

    musicRange.addEventListener("input", function() {
      self.settings.musicVolume = Number(musicRange.value) / 100;
      document.getElementById("music-volume-value").textContent = musicRange.value + "%";
      self.audio.applySettings(self.settings);
    });

    sfxRange.addEventListener("input", function() {
      self.settings.sfxVolume = Number(sfxRange.value) / 100;
      document.getElementById("sfx-volume-value").textContent = sfxRange.value + "%";
      self.audio.applySettings(self.settings);
    });

    timerToggle.addEventListener("change", function() {
      self.settings.showTimer = timerToggle.checked;
      self.updateHud();
    });

    document.querySelectorAll("[data-theme-choice]").forEach(function(button) {
      button.addEventListener("click", function() {
        self.settings.theme = button.getAttribute("data-theme-choice");
        self.themeManager.apply(self.settings.theme);
        self.syncSettingsForm();
      });
    });

    document.querySelectorAll("[data-difficulty-choice]").forEach(function(button) {
      button.addEventListener("click", function() {
        self.settings.defaultDifficulty = button.getAttribute("data-difficulty-choice");
        self.syncSettingsForm();
      });
    });

    document.querySelectorAll("[data-stones-choice]").forEach(function(button) {
      button.addEventListener("click", function() {
        self.settings.initialStones = Number(button.getAttribute("data-stones-choice"));
        self.syncSettingsForm();
      });
    });

    document.querySelectorAll("[data-language-choice]").forEach(function(button) {
      button.addEventListener("click", function() {
        self.settings.language = button.getAttribute("data-language-choice");
        self.i18n.setLanguage(self.settings.language);
        self.syncSettingsForm();
        self.updateContinueButton();
        if (self.state) {
          self.renderGame();
        }
      });
    });

    form.addEventListener("submit", function(event) {
      event.preventDefault();
      self.saveManager.saveSettings(self.settings);
      self.audio.applySettings(self.settings);
      self.i18n.apply();
      self.updateControlButtons();
      self.toast.show(self.t("settingsSaved"));
      document.dispatchEvent(new CustomEvent("mancala:settingsSave", {
        detail: { settings: self.settings }
      }));
      if (self.settingsReturnScreen === "screen-game" && self.state) {
        self.screen.show("screen-game");
        self.renderGame();
        if (self.state.currentTurn === "ai" && !self.state.isGameOver && !self.state.isPaused) {
          self.scheduleAiMove();
        }
      }
    });
  };

  App.prototype.syncSettingsForm = function() {
    document.getElementById("setting-music-volume").value = Math.round(this.settings.musicVolume * 100);
    document.getElementById("setting-sfx-volume").value = Math.round(this.settings.sfxVolume * 100);
    document.getElementById("music-volume-value").textContent = Math.round(this.settings.musicVolume * 100) + "%";
    document.getElementById("sfx-volume-value").textContent = Math.round(this.settings.sfxVolume * 100) + "%";
    document.getElementById("setting-show-timer").checked = Boolean(this.settings.showTimer);

    setSelected("[data-theme-choice]", "data-theme-choice", this.settings.theme);
    setSelected("[data-difficulty-choice]", "data-difficulty-choice", this.settings.defaultDifficulty);
    setSelected("[data-stones-choice]", "data-stones-choice", String(this.settings.initialStones));
    setSelected("[data-language-choice]", "data-language-choice", this.settings.language);
  };

  App.prototype.openDifficultyModal = function() {
    var self = this;
    this.showModal(
      '<div class="modal__header">' +
        '<div><p class="eyebrow">New Game</p><h2 id="modal-title">' + this.t("chooseDifficulty") + '</h2></div>' +
        '<button class="icon-button js-modal-close" type="button" aria-label="' + this.t("close") + '"><svg class="icon"><use href="#icon-close"></use></svg></button>' +
      '</div>' +
      '<div class="difficulty-grid">' +
        difficultyCard("easy", this.t("easy"), this.t("easyDescription"), "icon-play") +
        difficultyCard("normal", this.t("normal"), this.t("normalDescription"), "icon-settings") +
        difficultyCard("hard", this.t("hard"), this.t("hardDescription"), "icon-trophy") +
      '</div>'
    );

    document.querySelectorAll("[data-start-difficulty]").forEach(function(button) {
      button.addEventListener("click", function() {
        var difficulty = button.getAttribute("data-start-difficulty");
        self.closeModal();
        self.startNewGame(difficulty);
      });
    });
  };

  App.prototype.showModal = function(html) {
    var overlay = document.getElementById("modal-overlay");
    var content = document.getElementById("modal-content");
    content.innerHTML = html;
    overlay.classList.remove("hidden");
    this.audio.play("sfx_modal_open");
    var self = this;
    overlay.addEventListener("click", function(event) {
      if (event.target === overlay) {
        self.closeModal();
      }
    }, { once: true });
    content.querySelectorAll(".js-modal-close").forEach(function(button) {
      button.addEventListener("click", function() {
        self.closeModal();
      });
    });
    var firstButton = content.querySelector("button");
    if (firstButton) {
      firstButton.focus();
    }
  };

  App.prototype.closeModal = function() {
    var overlay = document.getElementById("modal-overlay");
    if (!overlay.classList.contains("hidden")) {
      overlay.classList.add("hidden");
      this.audio.play("sfx_modal_close");
    }
  };

  App.prototype.startNewGame = function(difficulty) {
    this.clearAiTimeout();
    this.lastDifficulty = difficulty || this.settings.defaultDifficulty;
    this.state = new Mancala.GameState({
      difficulty: this.lastDifficulty,
      initialStones: this.settings.initialStones
    });
    this.engine = new Mancala.GameEngine(this.state);
    this.aiController.setDifficulty(this.state.difficulty);
    this.screen.show("screen-game");
    this.audio.switchMusic(this.state.difficulty === "hard" ? "music_game_intense" : "music_game_normal");
    this.audio.play("sfx_board_reset");
    this.startTimer();
    this.saveManager.saveGame(this.state);
    this.renderGame();
  };

  App.prototype.continueGame = function() {
    var saved = this.saveManager.loadGame();
    if (!saved) {
      this.toast.show(this.t("noSaveToast"));
      return;
    }

    this.clearAiTimeout();
    this.state = Mancala.GameState.fromSave(saved);
    this.engine = new Mancala.GameEngine(this.state);
    this.aiController.setDifficulty(this.state.difficulty);
    this.lastDifficulty = this.state.difficulty;
    this.screen.show("screen-game");
    this.audio.switchMusic(this.state.difficulty === "hard" ? "music_game_intense" : "music_game_normal");
    this.startTimer();
    this.renderGame();
    if (this.state.currentTurn === "ai") {
      this.scheduleAiMove();
    }
  };

  App.prototype.openInstructions = function() {
    this.screen.show("screen-instructions");
    this.audio.switchMusic("music_menu");
  };

  App.prototype.openSettings = function(returnScreen) {
    this.settingsReturnScreen = returnScreen || "screen-main-menu";
    if (this.settingsReturnScreen === "screen-game" && this.state && this.state.currentTurn === "ai") {
      this.clearAiTimeout();
    }
    this.syncSettingsForm();
    this.screen.show("screen-settings");
    if (this.settingsReturnScreen !== "screen-game") {
      this.audio.switchMusic("music_menu");
    }
  };

  App.prototype.leaveSubscreen = function() {
    if (this.screen.current === "screen-settings" && this.settingsReturnScreen === "screen-game" && this.state) {
      this.screen.show("screen-game");
      this.renderGame();
      if (this.state.currentTurn === "ai" && !this.state.isGameOver && !this.state.isPaused) {
        this.scheduleAiMove();
      }
      return;
    }
    this.goMainMenu();
  };

  App.prototype.goMainMenu = function() {
    this.clearAiTimeout();
    if (this.state && !this.state.isGameOver) {
      this.saveManager.saveGame(this.state);
    }
    this.updateContinueButton();
    this.screen.show("screen-main-menu");
    this.audio.switchMusic("music_menu");
  };

  App.prototype.confirmReturnMenu = function() {
    var self = this;
    this.showModal(
      '<div class="modal__header">' +
        '<div><p class="eyebrow">Leave Game</p><h2 id="modal-title">' + this.t("leaveTitle") + '</h2></div>' +
        '<button class="icon-button js-modal-close" type="button" aria-label="' + this.t("close") + '"><svg class="icon"><use href="#icon-close"></use></svg></button>' +
      '</div>' +
      '<p>' + this.t("leaveBody") + '</p>' +
      '<div class="modal-actions">' +
        '<button class="button js-modal-close" type="button">' + this.t("cancel") + '</button>' +
        '<button id="confirm-return-menu" class="button button--primary" type="button"><svg class="icon"><use href="#icon-home"></use></svg>' + this.t("back") + '</button>' +
      '</div>'
    );
    document.getElementById("confirm-return-menu").addEventListener("click", function() {
      self.closeModal();
      self.goMainMenu();
    });
  };

  App.prototype.toggleSfx = function() {
    this.settings.isSfxMuted = !this.settings.isSfxMuted;
    this.saveManager.saveSettings(this.settings);
    this.audio.applySettings(this.settings);
    this.updateControlButtons();
  };

  App.prototype.toggleMusic = function() {
    this.settings.isMusicMuted = !this.settings.isMusicMuted;
    this.saveManager.saveSettings(this.settings);
    this.audio.applySettings(this.settings);
    if (this.settings.isMusicMuted) {
      this.audio.stopMusic();
    } else {
      this.audio.switchMusic(this.audio.currentTrack || "music_menu");
    }
    this.updateControlButtons();
  };

  App.prototype.togglePause = function() {
    if (!this.state || this.state.isGameOver) {
      return;
    }
    this.state.isPaused = !this.state.isPaused;
    if (this.state.isPaused) {
      this.clearAiTimeout();
    }
    document.getElementById("btn-pause").classList.toggle("is-active", this.state.isPaused);
    this.toast.show(this.state.isPaused ? this.t("pausedToast") : this.t("resumedToast"));
    this.renderGame();
    if (!this.state.isPaused && this.state.currentTurn === "ai") {
      this.scheduleAiMove();
    }
  };

  App.prototype.handlePitClick = function(index) {
    var self = this;
    if (!this.state || this.isAnimating || this.state.currentTurn !== "player" || this.state.aiThinking || this.state.isPaused) {
      this.audio.play("sfx_invalid_move");
      return;
    }

    var result = this.engine.makeMove(index);
    if (!result.valid) {
      this.audio.play("sfx_invalid_move");
      return;
    }

    this.processMove(result).then(function() {
      if (self.state && self.state.currentTurn === "ai" && !self.state.isGameOver) {
        self.scheduleAiMove();
      }
    });
  };

  App.prototype.processMove = function(result) {
    var self = this;
    this.isAnimating = true;
    this.renderer.setLocked(true);
    this.renderGame();
    dispatch("mancala:move", {
      pitIndex: result.pitIndex,
      stonesCount: result.stonesCount,
      extraTurn: result.extraTurn
    });
    if (result.capture) {
      dispatch("mancala:capture", result.capture);
    }
    if (result.extraTurn) {
      dispatch("mancala:extraTurn", { player: result.player });
    }

    return this.animation.animateMove(result).then(function() {
      self.isAnimating = false;
      self.renderer.setLocked(false);

      if (result.capture) {
        self.toast.show(self.t("captureToast", {
          player: self.t(result.player),
          count: result.capture.capturedCount
        }));
      } else if (result.extraTurn) {
        self.toast.show(self.t("extraTurnToast", {
          player: self.t(result.player)
        }));
      }

      if (self.state.isGameOver) {
        self.endGame();
        return;
      }

      self.saveManager.saveGame(self.state);
      self.renderGame();
    });
  };

  App.prototype.scheduleAiMove = function() {
    var self = this;
    if (!this.state || this.state.isGameOver || this.state.isPaused) {
      return;
    }

    this.clearAiTimeout();
    this.state.aiThinking = true;
    this.renderer.setLocked(true);
    this.renderGame();
    if (this.state.difficulty === "hard") {
      this.audio.play("sfx_ai_thinking");
    }

    this.aiTimeout = global.setTimeout(function() {
      if (!self.state || self.screen.current !== "screen-game" || self.state.isGameOver || self.state.isPaused) {
        return;
      }

      var move = self.aiController.getMove(self.state);
      self.state.aiThinking = false;

      if (move === null) {
        self.renderGame();
        return;
      }

      var result = self.engine.makeMove(move);
      self.processMove(result).then(function() {
        if (self.state && self.state.currentTurn === "ai" && !self.state.isGameOver) {
          self.scheduleAiMove();
        }
      });
    }, this.aiController.getThinkingDelay());
  };

  App.prototype.clearAiTimeout = function() {
    if (this.aiTimeout) {
      global.clearTimeout(this.aiTimeout);
      this.aiTimeout = null;
    }
    if (this.state) {
      this.state.aiThinking = false;
    }
  };

  App.prototype.startTimer = function() {
    var self = this;
    if (this.timerId) {
      global.clearInterval(this.timerId);
    }
    this.timerId = global.setInterval(function() {
      if (self.state && self.screen.current === "screen-game" && !self.state.isPaused && !self.state.isGameOver) {
        self.state.gameTime += 1;
        self.updateHud();
      }
    }, 1000);
  };

  App.prototype.renderGame = function() {
    if (!this.state) {
      return;
    }
    this.renderer.render(this.state);
    this.updateHud();
    this.updateStatus();
    this.updateControlButtons();
  };

  App.prototype.updateHud = function() {
    if (!this.state) {
      return;
    }
    text("hud-difficulty", this.t(this.state.difficulty));
    text("hud-timer", formatTime(this.state.gameTime));
    text("hud-ai-score", String(this.state.board[13]));
    text("hud-player-score", String(this.state.board[6]));
    document.getElementById("timer-panel").hidden = !this.settings.showTimer;
  };

  App.prototype.updateStatus = function() {
    if (!this.state) {
      return;
    }
    var line = document.getElementById("status-line");
    line.classList.toggle("is-thinking", this.state.aiThinking);
    if (this.state.isGameOver) {
      line.textContent = this.t("gameOverStatus");
    } else if (this.state.isPaused) {
      line.textContent = this.t("pausedStatus");
    } else if (this.state.aiThinking) {
      line.textContent = this.t("aiThinking");
    } else if (this.state.currentTurn === "player") {
      line.textContent = this.t("playerTurn");
    } else {
      line.textContent = this.t("aiTurn");
    }
  };

  App.prototype.updateControlButtons = function() {
    var sfxButton = document.getElementById("btn-toggle-sfx");
    var musicButton = document.getElementById("btn-toggle-music");
    if (!sfxButton || !musicButton) {
      return;
    }
    sfxButton.classList.toggle("is-active", !this.settings.isSfxMuted);
    musicButton.classList.toggle("is-active", !this.settings.isMusicMuted);
    sfxButton.querySelector("use").setAttribute("href", this.settings.isSfxMuted ? "#icon-muted" : "#icon-volume");
  };

  App.prototype.updateContinueButton = function() {
    var button = document.getElementById("btn-continue");
    var meta = document.getElementById("continue-meta");
    var save = this.saveManager.loadGame();
    if (!save) {
      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
      meta.textContent = this.t("noSave");
      return;
    }

    button.disabled = false;
    button.setAttribute("aria-disabled", "false");
    meta.textContent = this.t("lastPlayed", {
      time: this.saveManager.formatSaveTime(save)
    });
  };

  App.prototype.endGame = function() {
    if (!this.state) {
      return;
    }
    this.saveManager.clearGame();
    this.updateContinueButton();
    dispatch("mancala:gameOver", {
      winner: this.state.winner,
      playerScore: this.state.board[6],
      aiScore: this.state.board[13]
    });

    this.renderResult();
    this.audio.stopMusic();
    if (this.state.winner === "player") {
      this.audio.play("sfx_game_win");
    } else if (this.state.winner === "ai") {
      this.audio.play("sfx_game_lose");
    } else {
      this.audio.play("sfx_game_draw");
    }
    this.screen.show("screen-game-over");
  };

  App.prototype.renderResult = function() {
    var title = document.getElementById("game-over-title");
    var resultLayout = document.querySelector(".result-layout");
    resultLayout.classList.toggle("is-win", this.state.winner === "player");
    title.textContent = this.state.winner === "player"
      ? this.t("playerWin")
      : this.state.winner === "ai"
        ? this.t("aiWin")
        : this.t("draw");
    text("result-player-score", String(this.state.board[6]));
    text("result-ai-score", String(this.state.board[13]));
    text("result-time", formatTime(this.state.gameTime));
    text("result-moves", String(this.state.moveCount));
  };

  function difficultyCard(id, title, description, iconId) {
    return '<button class="difficulty-card" type="button" data-start-difficulty="' + id + '">' +
      '<svg class="icon"><use href="#' + iconId + '"></use></svg>' +
      '<span><strong>' + title + '</strong><p>' + description + '</p></span>' +
    '</button>';
  }

  function setSelected(selector, attr, value) {
    document.querySelectorAll(selector).forEach(function(button) {
      button.classList.toggle("is-selected", button.getAttribute(attr) === value);
      button.setAttribute("aria-checked", button.getAttribute(attr) === value ? "true" : "false");
    });
  }

  function on(id, eventName, handler) {
    var node = document.getElementById(id);
    if (node) {
      node.addEventListener(eventName, handler);
    }
  }

  function text(id, value) {
    var node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  }

  function formatTime(totalSeconds) {
    var seconds = Math.max(0, Number(totalSeconds) || 0);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var remainderMinutes = minutes % 60;
    var remainderSeconds = seconds % 60;
    var pad = function(value) {
      return String(value).padStart(2, "0");
    };
    return hours > 0
      ? hours + ":" + pad(remainderMinutes) + ":" + pad(remainderSeconds)
      : pad(remainderMinutes) + ":" + pad(remainderSeconds);
  }

  function dispatch(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  document.addEventListener("DOMContentLoaded", function() {
    var app = new App();
    app.init();
    Mancala.app = app;
  });
})(window);
