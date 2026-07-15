(function (Game) {
  "use strict";

  function App() {
    this.bus = new Game.EventBus();
    this.settings = this.loadInitialSettings();
    this.router = new Game.Router(
      document.getElementById("page-container"),
      this.bus,
    );
    this.modal = new Game.Modal(
      document.getElementById("modal-root"),
      Game.I18n,
    );
    this.toast = new Game.Toast(document.getElementById("toast-root"));
    this.session = new Game.GameSession(this.bus);
    this.audio = new Game.AudioManager(this.getSettings.bind(this), this.bus);
    this.canvasView = new Game.CanvasView(
      document.getElementById("game-canvas"),
    );
    this.renderer = new Game.Renderer(this.canvasView);
    this.hud = new Game.HudRenderer(document);
    this.gameScreen = new Game.GameScreen(document.getElementById("game-page"));
    this.performance = new Game.PerformanceMonitor(
      this.onQualityChange.bind(this),
    );
    this.returnToPause = false;
    this.pendingResult = null;
    this.runtimeFailed = false;
    this.bindPages();
    this.bindNavigation();
    this.bindGameEvents();
    this.bindVisibility();
    this.bindAudioBootstrap();
    this.applySettings();
    this.loop = this.createLoop();
    this.input = this.createInput();
    this.router.go("home", { noFocus: true });
    this.refreshHome();
    var version = document.getElementById("app-version");
    if (version) version.textContent = Game.version;
    Game.App = this;
    this.audio.startBgm();
    this.bus.emit(Game.Events.READY);
  }

  App.prototype.loadInitialSettings = function () {
    var saved = Game.Storage.read(
      Game.SettingsStore.key,
      function (value) {
        return (
          Game.Validation.isPlainObject(value) && value.schemaVersion === 1
        );
      },
      null,
    ).value;
    var settings = Game.SettingsStore.sanitize(
      saved || Game.SettingsStore.defaults(),
    );
    if (!saved) {
      settings.language = Game.I18n.detect(null);
      Game.SettingsStore.save(settings);
    }
    Game.I18n.setLocale(settings.language);
    return settings;
  };

  App.prototype.getSettings = function () {
    return this.settings;
  };

  App.prototype.bindPages = function () {
    var self = this;
    document.querySelectorAll("[data-route]").forEach(function (page) {
      self.router.register(page);
    });

    this.home = new Game.HomeScreen(document.getElementById("home-page"), {
      start: function () {
        self.startNewGameWithGuard();
      },
      continue: function () {
        self.continueGame();
      },
      help: function () {
        self.openPage("help");
      },
      settings: function () {
        self.openSettings(false);
      },
      leaderboard: function () {
        self.openLeaderboard();
      },
    });

    this.settingsScreen = new Game.SettingsScreen(
      document.getElementById("settings-page"),
      {
        changed: function (settings) {
          self.onSettingsChanged(settings);
        },
        language: function (language) {
          self.changeLanguage(language);
        },
        theme: function (theme) {
          self.changeTheme(theme);
        },
        previewSfx: function () {
          self.audio.previewSfx();
        },
        previewBgm: function () {
          self.audio.previewBgm();
        },
        enableTilt: function () {
          self.enableTilt();
        },
        disableTilt: function () {
          self.input && self.input.disableTilt();
        },
        "clear-save-button": function () {
          self.clearSave();
        },
        "clear-board-button": function () {
          self.clearLeaderboard();
        },
        "reset-settings-button": function () {
          self.resetSettings();
        },
      },
    );

    this.leaderboardScreen = new Game.LeaderboardScreen(
      document.getElementById("leaderboard-page"),
    );
    Game.HelpScreen.init(document.getElementById("help-page"));
  };

  App.prototype.bindNavigation = function () {
    var self = this;
    document.querySelectorAll("[data-back-button]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (self.returnToPause) {
          self.returnToPause = false;
          self.openGamePause();
        } else {
          self.openPage("home");
        }
      });
    });

    document
      .querySelector(".brand-mark")
      .addEventListener("click", function (event) {
        event.preventDefault();
        self.openPage("home");
      });

    document
      .getElementById("pause-button")
      .addEventListener("click", function () {
        self.togglePause();
      });
    document
      .getElementById("resume-button")
      .addEventListener("click", function () {
        self.resumeGame();
      });
    document
      .getElementById("restart-pause-button")
      .addEventListener("click", function () {
        self.confirmRestart();
      });
    document
      .getElementById("pause-settings-button")
      .addEventListener("click", function () {
        self.openSettings(true);
      });
    document
      .getElementById("home-pause-button")
      .addEventListener("click", function () {
        self.confirmReturnHome();
      });
    document
      .getElementById("play-again-button")
      .addEventListener("click", function () {
        self.startGame();
      });
    document
      .getElementById("result-leaderboard-button")
      .addEventListener("click", function () {
        self.openLeaderboard();
      });
    document
      .getElementById("result-home-button")
      .addEventListener("click", function () {
        self.openPage("home");
      });
    document
      .getElementById("score-form")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        self.submitScore();
      });

    document
      .getElementById("clear-leaderboard-button")
      .addEventListener("click", function () {
        self.clearLeaderboard();
      });
  };

  App.prototype.bindGameEvents = function () {
    var self = this;
    this.bus.on(Game.Events.LANDED, function (event) {
      if (self.session.state && self.shouldUseParticles()) {
        Game.Particles.add(
          self.session.state.particles,
          event.platform.x + event.platform.width / 2,
          event.platform.y,
          event.platform.color,
          7,
        );
      }
      self.audio.playSfx(event.platform.type === "spring" ? "spring" : "land");
    });
    this.bus.on(Game.Events.COLLECTED, function (item) {
      if (self.session.state && self.shouldUseParticles())
        Game.Particles.add(
          self.session.state.particles,
          item.x,
          item.y,
          "#ffd45c",
          12,
        );
      self.audio.playSfx(
        item.type === "star" || item.type === "lucky" ? "collect" : "power",
      );
    });
    this.bus.on(Game.Events.DEFEATED, function (enemy) {
      if (self.session.state && self.shouldUseParticles())
        Game.Particles.add(
          self.session.state.particles,
          enemy.x,
          enemy.y,
          "#ff9db8",
          10,
        );
      self.audio.playSfx("hit");
    });
    this.bus.on(Game.Events.DAMAGED, function () {
      self.audio.playSfx("shield");
      self.announce(Game.I18n.t("game.damaged"));
    });
    this.bus.on(Game.Events.MILESTONE, function (height) {
      self.audio.playSfx("record");
      self.announce(
        Game.I18n.t("game.height") + " " + Game.I18n.number(height) + " m",
      );
    });
    this.bus.on(Game.Events.PAUSED, function () {
      self.audio.pauseBgm();
      self.gameScreen.showPause(true);
      self.saveProgress();
      self.announce(Game.I18n.t("pause.title"));
    });
    this.bus.on(Game.Events.RESUMED, function () {
      self.gameScreen.showPause(false);
      self.audio.resumeBgm();
      self.announce(Game.I18n.t("pause.resume"));
    });
    this.bus.on(Game.Events.OVER, function (state) {
      self.handleGameOver(state);
    });
  };

  App.prototype.bindVisibility = function () {
    var self = this;
    document.addEventListener("visibilitychange", function () {
      var hidden = document.visibilityState === "hidden";
      self.audio.onVisibility(hidden);
      if (hidden && self.session.isActive() && self.router.current === "game") {
        self.session.pause();
        self.saveProgress();
      }
    });
  };

  App.prototype.bindAudioBootstrap = function () {
    var self = this;
    function unlockFromGesture() {
      self.unlockAudio();
    }
    document.addEventListener("pointerdown", unlockFromGesture, {
      capture: true,
      passive: true,
    });
    document.addEventListener("keydown", unlockFromGesture, true);
  };

  App.prototype.createInput = function () {
    var self = this;
    var input = new Game.InputManager({
      getSettings: this.getSettings.bind(this),
      leftButton: document.getElementById("touch-left"),
      rightButton: document.getElementById("touch-right"),
      onPause: function () {
        if (self.router.current === "game") self.togglePause();
      },
      onInteract: function () {
        self.unlockAudio();
      },
      onMode: function (mode) {
        self.updateInputMode(mode);
      },
      onTiltDenied: function () {
        self.settings.controls.tiltEnabled = false;
        Game.SettingsStore.save(self.settings);
        self.settingsScreen.render(self.settings);
        self.toast.show(Game.I18n.t("toast.tiltDenied"), "warning");
      },
    });
    input.setTouchSwap(this.settings.controls.swapTouchButtons);
    return input;
  };

  App.prototype.createLoop = function () {
    var self = this;
    return new Game.GameLoop({
      step: function (dt) {
        if (!self.session.isActive() || self.session.paused) return;
        self.session.update(self.input.getState(), dt);
        if (self.session.state)
          Game.Particles.update(self.session.state.particles, dt);
      },
      render: function (alpha) {
        if (self.session.state) {
          self.renderer.render(self.session.state, alpha);
          self.hud.update(self.session.state);
        }
      },
      onFrame: function (timestamp, frameMs) {
        self.performance.sample(frameMs, timestamp);
      },
    });
  };

  App.prototype.applySettings = function () {
    var themeClasses = Game.Themes.map(function (theme) {
      return "theme-" + theme;
    });
    document.body.classList.remove.apply(document.body.classList, themeClasses);
    document.body.classList.add("theme-" + this.settings.theme);
    document.body.classList.toggle(
      "high-contrast",
      this.settings.accessibility.highContrast,
    );
    document.body.classList.remove("reduced-motion", "motion-override-off");
    var systemReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var reduced =
      this.settings.accessibility.reducedMotion === "on" ||
      (this.settings.accessibility.reducedMotion === "system" && systemReduced);
    if (reduced) document.body.classList.add("reduced-motion");
    if (this.settings.accessibility.reducedMotion === "off")
      document.body.classList.add("motion-override-off");
    Game.I18n.setLocale(this.settings.language);
    Game.I18n.apply(document);
    this.audio.setSettings();
    if (this.input) {
      this.input.setTouchSwap(this.settings.controls.swapTouchButtons);
      if (!this.settings.controls.tiltEnabled) this.input.disableTilt();
    }
  };

  App.prototype.onSettingsChanged = function (settings) {
    this.settings = Game.SettingsStore.sanitize(settings);
    this.applySettings();
    this.settingsScreen.render(this.settings);
    this.refreshHome();
    if (this.router.current === "leaderboard") this.renderLeaderboard();
  };

  App.prototype.changeLanguage = function (language) {
    this.settings.language = language;
    Game.I18n.setLocale(language);
    Game.I18n.apply(document);
    this.refreshHome();
    if (this.router.current === "leaderboard") this.renderLeaderboard();
  };

  App.prototype.changeTheme = function (theme) {
    this.settings.theme = theme;
    this.applySettings();
  };

  App.prototype.updateInputMode = function (mode) {
    var label = document.getElementById("input-mode-label");
    if (!label) return;
    label.textContent = Game.I18n.t(
      mode === "touch"
        ? "game.touch"
        : mode === "tilt"
          ? "settings.tilt"
          : "game.keyboard",
    );
  };

  App.prototype.shouldUseParticles = function () {
    if (this.settings.accessibility.particles === "low") return false;
    return (
      this.performance.quality !== "low" ||
      this.settings.accessibility.particles === "high"
    );
  };

  App.prototype.unlockAudio = function () {
    if (!this.audio.supported) return;
    this.audio.startBgm();
  };

  App.prototype.openPage = function (route) {
    this.returnToPause = false;
    if (route !== "game") {
      this.loop.stop();
    }
    this.router.go(route);
    if (route === "home") this.refreshHome();
    if (route === "leaderboard") this.renderLeaderboard();
    if (route === "settings") this.settingsScreen.render(this.settings);
    this.audio.startBgm();
  };

  App.prototype.openSettings = function (fromPause) {
    this.returnToPause = Boolean(fromPause);
    this.router.go("settings");
    this.settingsScreen.render(this.settings);
  };

  App.prototype.openGamePause = function () {
    this.router.go("game", { noFocus: true });
    this.gameScreen.showPause(true);
  };

  App.prototype.openLeaderboard = function () {
    this.renderLeaderboard();
    this.openPage("leaderboard");
  };

  App.prototype.refreshHome = function () {
    this.home.updateSave(Game.SaveStore.load());
  };

  App.prototype.startNewGameWithGuard = function () {
    var self = this;
    if (!Game.SaveStore.load()) {
      this.startGame();
      return;
    }
    this.modal
      .confirm({
        body: Game.I18n.t("modal.restart"),
      })
      .then(function (confirmed) {
        if (confirmed) {
          Game.SaveStore.clear();
          self.startGame();
        }
      });
  };

  App.prototype.startGame = function () {
    this.pendingResult = null;
    this.runtimeFailed = false;
    this.session.start();
    this.returnToPause = false;
    this.gameScreen.showPause(false);
    this.router.go("game", { noFocus: true });
    this.loop.start();
    this.unlockAudio();
    document.getElementById("game-canvas").focus({ preventScroll: true });
  };

  App.prototype.continueGame = function () {
    var snapshot = Game.SaveStore.load();
    if (!snapshot) {
      this.toast.show(Game.I18n.t("home.noSave"), "warning");
      this.refreshHome();
      return;
    }
    if (!this.session.restore(snapshot)) {
      Game.SaveStore.clear();
      this.toast.show(Game.I18n.t("toast.saveUnavailable"), "warning");
      this.refreshHome();
      return;
    }
    this.runtimeFailed = false;
    this.pendingResult = null;
    this.gameScreen.showPause(false);
    this.router.go("game", { noFocus: true });
    this.loop.start();
    this.unlockAudio();
  };

  App.prototype.togglePause = function () {
    if (!this.session.isActive()) return;
    if (this.session.paused) this.resumeGame();
    else this.session.pause();
  };

  App.prototype.resumeGame = function () {
    if (this.session.paused) this.session.resume();
  };

  App.prototype.confirmRestart = function () {
    var self = this;
    this.modal
      .confirm({ body: Game.I18n.t("modal.restart") })
      .then(function (confirmed) {
        if (confirmed) {
          Game.SaveStore.clear();
          self.startGame();
        }
      });
  };

  App.prototype.confirmReturnHome = function () {
    var self = this;
    this.modal
      .confirm({ body: Game.I18n.t("modal.home") })
      .then(function (confirmed) {
        if (confirmed) {
          self.saveProgress();
          self.openPage("home");
        }
      });
  };

  App.prototype.saveProgress = function () {
    if (!this.session.isActive()) return false;
    var snapshot = this.session.snapshot();
    if (!snapshot) return false;
    snapshot.updatedAt = new Date().toISOString();
    var result = Game.SaveStore.save(snapshot);
    if (result.ok) {
      this.toast.show(Game.I18n.t("toast.saved"), "success");
      this.bus.emit(Game.Events.SAVE, snapshot);
    } else {
      this.toast.show(Game.I18n.t("toast.saveUnavailable"), "warning");
      this.bus.emit(Game.Events.SAVE_FAILED, result);
    }
    return result.ok;
  };

  App.prototype.handleGameOver = function (state) {
    this.loop.stop();
    Game.SaveStore.clear();
    var entries = Game.LeaderboardStore.load();
    var best = entries[0];
    var isNewRecord = !best || state.score.total > best.score;
    this.pendingResult = {
      state: state,
      newRecord: isNewRecord,
      submitted: false,
      submissionId: "local-" + Date.now() + "-" + state.seed,
    };
    this.gameScreen.showGameOver({
      score: state.score,
      newRecord: isNewRecord,
      submitted: false,
    });
    this.audio.stop();
    this.audio.playSfx(isNewRecord ? "record" : "over");
    this.announce(Game.I18n.t("over.title"));
  };

  App.prototype.submitScore = function () {
    if (!this.pendingResult || this.pendingResult.submitted) return;
    var input = document.getElementById("player-name");
    var message = document.getElementById("score-form-message");
    var fallback = Game.I18n.t("over.namePlaceholder");
    var name = Game.Validation.cleanName(input.value, fallback);
    if (!Game.LeaderboardStore.isValidName(input.value) && input.value.trim()) {
      message.textContent = Game.I18n.t("over.invalidName");
      return;
    }
    var state = this.pendingResult.state;
    var entry = {
      id: this.pendingResult.submissionId,
      name: name,
      score: Math.max(0, Math.floor(state.score.total)),
      height: Math.max(0, Math.floor(state.score.maxHeight)),
      bestCombo: Math.max(0, Math.floor(state.score.bestCombo)),
      collected: Math.max(0, Math.floor(state.score.collected)),
      theme: this.settings.theme,
      createdAt: new Date().toISOString(),
    };
    var result = Game.LeaderboardStore.add(entry);
    if (!result.ok) {
      message.textContent = Game.I18n.t("toast.saveUnavailable");
      return;
    }
    Game.Storage.write("djgame.player.v1", { name: name });
    this.pendingResult.submitted = true;
    document.getElementById("score-form").hidden = true;
    message.textContent = Game.I18n.t("over.submitted");
    this.toast.show(Game.I18n.t("over.submitted"), "success");
    this.announce(Game.I18n.t("over.submitted"));
  };

  App.prototype.renderLeaderboard = function () {
    this.leaderboardScreen.render(
      Game.LeaderboardStore.load(),
      this.pendingResult && this.pendingResult.submitted
        ? this.pendingResult.submissionId
        : null,
    );
  };

  App.prototype.clearLeaderboard = function () {
    var self = this;
    this.modal
      .confirm({ body: Game.I18n.t("modal.clearBoard") })
      .then(function (confirmed) {
        if (!confirmed) return;
        Game.LeaderboardStore.clear();
        self.renderLeaderboard();
        self.toast.show(Game.I18n.t("toast.boardCleared"), "success");
      });
  };

  App.prototype.clearSave = function () {
    var self = this;
    this.modal
      .confirm({ body: Game.I18n.t("modal.clearSave") })
      .then(function (confirmed) {
        if (!confirmed) return;
        Game.SaveStore.clear();
        self.refreshHome();
        self.toast.show(Game.I18n.t("toast.saveCleared"), "success");
      });
  };

  App.prototype.resetSettings = function () {
    var self = this;
    this.modal
      .confirm({ body: Game.I18n.t("modal.reset") })
      .then(function (confirmed) {
        if (!confirmed) return;
        self.settings = Game.SettingsStore.reset();
        self.applySettings();
        self.settingsScreen.render(self.settings);
        self.toast.show(Game.I18n.t("toast.reset"), "success");
      });
  };

  App.prototype.enableTilt = function () {
    var self = this;
    if (!this.input) return;
    this.input.enableTilt().then(function (enabled) {
      if (!enabled) return;
      self.settings.controls.tiltEnabled = true;
      Game.SettingsStore.save(self.settings);
      self.toast.show(Game.I18n.t("settings.tilt"), "success");
    });
  };

  App.prototype.onQualityChange = function (quality) {
    this.renderer.setQuality(quality);
    if (quality === "low") this.toast.show(Game.I18n.t("settings.low"), "info");
  };

  App.prototype.announce = function (message) {
    var region = document.getElementById("live-region");
    region.textContent = "";
    window.setTimeout(function () {
      region.textContent = message;
    }, 20);
  };

  window.addEventListener("error", function () {
    if (!Game.App || Game.App.runtimeFailed) return;
    Game.App.runtimeFailed = true;
    if (Game.App.loop) Game.App.loop.stop();
    if (Game.App.session && Game.App.session.isActive()) {
      Game.App.session.paused = true;
      Game.App.gameScreen.showPause(true);
      Game.App.audio.pauseBgm();
    }
    if (Game.App.toast)
      Game.App.toast.show(Game.I18n.t("errors.generic"), "warning");
  });

  document.addEventListener("DOMContentLoaded", function () {
    try {
      new App();
    } catch (error) {
      var root = document.getElementById("toast-root");
      if (root) root.textContent = "Cloudbound could not start.";
      if (window.console && console.error) console.error(error);
      throw error;
    }
  });
})(window.DJGame);
