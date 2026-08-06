(function (root, factory) {
  var api = factory(root.WormsGame || {});
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.App = api.App;
})(typeof window !== "undefined" ? window : globalThis, function (WG) {
  "use strict";
  var SCREEN_IDS = Object.freeze({
    boot: "boot-screen",
    menu: "menu-screen",
    setup: "setup-screen",
    tutorial: "tutorial-screen",
    battle: "battle-screen",
    result: "result-screen",
    stats: "stats-screen",
    settings: "settings-screen",
  });

  function randomSeed() {
    if (window.crypto && window.crypto.getRandomValues) {
      var values = new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return values[0] || 1;
    }
    return (Date.now() ^ (performance.now() * 1000)) >>> 0;
  }

  function formatDuration(seconds) {
    var minutes = Math.floor(seconds / 60);
    return minutes + ":" + String(Math.floor(seconds % 60)).padStart(2, "0");
  }

  /** Application screen state, service wiring, and UI event coordinator. */
  function App() {
    this.storage = new WG.StorageService();
    this.detectInitialLanguage();
    this.i18n = new WG.I18n(this.storage.data.settings.language);
    this.audio = new WG.AudioManager(this.storage.data.settings);
    this.hud = new WG.BattleHUD(this.i18n, {
      selectWeapon: this.selectWeapon.bind(this),
    });
    this.state = "boot";
    this.battle = null;
    this.loop = null;
    this.input = null;
    this.camera = null;
    this.renderer = null;
    this.tutorial = null;
    this.lastBattleConfig = null;
    this.hiddenPaused = false;
    this.touchHolds = new Set();
    this.confirmAction = null;
    this.listeners = [];
  }

  App.prototype.detectInitialLanguage = function () {
    try {
      if (
        this.storage.adapter &&
        this.storage.adapter.getItem(WG.StorageService.KEY) == null
      ) {
        var language = String(navigator.language || "").toLowerCase();
        var selected =
          language.indexOf("ja") === 0
            ? "ja"
            : language.indexOf("en") === 0
              ? "en"
              : "zh-Hant";
        this.storage.updateSettings({ language: selected });
      }
    } catch (_) {}
  };

  App.prototype.listen = function (target, event, handler, options) {
    target.addEventListener(event, handler, options);
    this.listeners.push(function () {
      target.removeEventListener(event, handler, options);
    });
  };

  App.prototype.init = function () {
    this.i18n.apply(document);
    this.applySettingsToDocument();
    this.populateForms();
    this.bindUI();
    this.show("menu");
    return this;
  };

  // -------------------------------------------------------------------------
  // Global UI bindings and screen navigation
  // -------------------------------------------------------------------------

  App.prototype.bindUI = function () {
    var self = this;
    this.listen(
      document,
      "pointerdown",
      function unlock() {
        self.audio.unlock();
      },
      { once: true },
    );
    this.listen(
      document,
      "keydown",
      function unlock() {
        self.audio.unlock();
      },
      { once: true },
    );
    this.listen(document, "click", function (event) {
      var action = event.target.closest("[data-action]");
      if (action) {
        self.audio.sfx("click");
        self.handleAction(action.dataset.action);
      }
      var command = event.target.closest("[data-command]");
      if (command && !command.dataset.hold)
        self.handleCommand({ type: command.dataset.command });
      var confirm = event.target.closest("[data-confirm]");
      if (confirm) self.resolveConfirm(confirm.dataset.confirm === "yes");
    });
    this.listen(
      document.getElementById("setup-form"),
      "submit",
      function (event) {
        event.preventDefault();
        self.startFromSetup(new FormData(event.currentTarget));
      },
    );
    this.listen(
      document.getElementById("settings-form"),
      "input",
      function (event) {
        self.updateSettings(event);
      },
    );
    this.listen(
      document.getElementById("weapon-current"),
      "click",
      function () {
        self.hud.toggleWeapons();
      },
    );
    this.bindTouchControls();
    this.listen(document, "visibilitychange", function () {
      self.handleVisibility();
    });
    this.listen(window, "resize", function () {
      if (self.renderer) self.renderer.resize();
    });
  };

  App.prototype.bindTouchControls = function () {
    var self = this;
    document.querySelectorAll("[data-hold]").forEach(function (button) {
      self.listen(button, "pointerdown", function (event) {
        event.preventDefault();
        var command = button.dataset.hold;
        self.touchHolds.add(command);
        if (command === "charge") self.handleCommand({ type: "chargeStart" });
      });
      ["pointerup", "pointercancel", "pointerleave"].forEach(
        function (eventName) {
          self.listen(button, eventName, function () {
            var command = button.dataset.hold;
            if (self.touchHolds.delete(command) && command === "charge")
              self.handleCommand({ type: "fire" });
          });
        },
      );
    });
  };

  App.prototype.handleAction = function (action) {
    if (action === "menu") return this.returnToMenu();
    if (action === "setup") return this.showSetup();
    if (action === "tutorial") return this.startTutorial();
    if (action === "tutorial-next" || action === "tutorial-skip")
      return this.tutorial && this.tutorial.next();
    if (action === "tutorial-exit") return this.stopTutorial(false);
    if (action === "stats") {
      this.renderCareerStats();
      return this.show("stats");
    }
    if (action === "settings") {
      this.populateForms();
      return this.show("settings");
    }
    if (action === "resume") return this.resumeBattle();
    if (action === "restart")
      return this.startBattle(Object.assign({}, this.lastBattleConfig));
    if (action === "quit")
      return this.askConfirm("confirm.quit", this.returnToMenu.bind(this));
    if (action === "rematch-same")
      return this.startBattle(Object.assign({}, this.lastBattleConfig));
    if (action === "rematch-new")
      return this.startBattle(
        Object.assign({}, this.lastBattleConfig, { seed: randomSeed() }),
      );
    if (action === "clear-stats")
      return this.askConfirm("confirm.clear", this.clearStats.bind(this));
  };

  App.prototype.show = function (name) {
    Object.keys(SCREEN_IDS).forEach(function (screenName) {
      var element = document.getElementById(SCREEN_IDS[screenName]);
      var active = screenName === name;
      element.hidden = !active;
      element.classList.toggle("is-active", active);
    });
    this.state = name;
    var track =
      name === "battle" || name === "tutorial"
        ? "battle"
        : name === "result"
          ? "result"
          : "menu";
    this.audio.playTrack(track);
    var activeScreen = document.getElementById(SCREEN_IDS[name]);
    var focusable =
      activeScreen &&
      activeScreen.querySelector(
        "button:not([disabled]), input:not([disabled]), select:not([disabled]), canvas[tabindex]",
      );
    if (focusable && name !== "battle")
      requestAnimationFrame(function () {
        focusable.focus({ preventScroll: true });
      });
  };

  App.prototype.showSetup = function () {
    if (this.state === "battle") this.stopBattle();
    this.populateSetupForm();
    this.show("setup");
  };

  App.prototype.returnToMenu = function () {
    if (this.tutorial) this.tutorial.stop();
    this.tutorial = null;
    this.stopBattle();
    document.getElementById("pause-screen").hidden = true;
    this.show("menu");
    document.getElementById("tutorial-badge").hidden =
      this.storage.data.settings.tutorialCompleted;
  };

  App.prototype.populateForms = function () {
    this.populateSetupForm();
    var form = document.getElementById("settings-form");
    var settings = this.storage.data.settings;
    form.elements.language.value = settings.language;
    form.elements.bgmVolume.value = Math.round(settings.bgmVolume * 100);
    form.elements.sfxVolume.value = Math.round(settings.sfxVolume * 100);
    form.elements.muted.checked = settings.muted;
    form.elements.reducedMotion.checked = settings.reducedMotion;
    form.elements.bgmOutput.value = Math.round(settings.bgmVolume * 100) + "%";
    form.elements.sfxOutput.value = Math.round(settings.sfxVolume * 100) + "%";
    document.getElementById("tutorial-badge").hidden =
      settings.tutorialCompleted;
  };

  // -------------------------------------------------------------------------
  // Match setup and battle lifecycle
  // -------------------------------------------------------------------------

  App.prototype.populateSetupForm = function () {
    var form = document.getElementById("setup-form");
    var last = this.storage.data.settings.lastMatch;
    form.elements.aiDifficulty.value = last.aiDifficulty;
    form.elements.theme.value = last.theme;
    form.elements.turnSeconds.value = String(last.turnSeconds);
    form.elements.playerTeamName.value = last.playerTeamName;
    var color = form.querySelector(
      "[name=playerColor][value='" + last.playerColor + "']",
    );
    if (color) color.checked = true;
  };

  App.prototype.startFromSetup = function (formData) {
    var teamName =
      Array.from(String(formData.get("playerTeamName") || "").trim())
        .slice(0, 12)
        .join("") || "蹦蹦隊";
    var config = {
      seed: randomSeed(),
      aiDifficulty: String(formData.get("aiDifficulty")),
      theme: String(formData.get("theme")),
      turnSeconds: Number(formData.get("turnSeconds")),
      playerTeamName: teamName,
      playerColor: String(formData.get("playerColor")),
    };
    this.storage.updateSettings({
      lastMatch: {
        aiDifficulty: config.aiDifficulty,
        theme: config.theme,
        turnSeconds: config.turnSeconds,
        playerTeamName: config.playerTeamName,
        playerColor: config.playerColor,
      },
    });
    this.startBattle(config);
  };

  App.prototype.startBattle = function (config) {
    this.stopBattle();
    document.getElementById("pause-screen").hidden = true;
    this.lastBattleConfig = Object.assign({}, config);
    var self = this;
    var canvas = document.getElementById("game-canvas");
    this.battle = new WG.GameState(config, function (type, detail) {
      self.handleBattleEvent(type, detail);
    });
    this.camera = new WG.CameraController(
      canvas.clientWidth,
      canvas.clientHeight,
    );
    this.camera.focus(this.battle.currentCharacter(), true);
    this.renderer = new WG.Renderer(canvas, this.camera);
    this.hud = new WG.BattleHUD(this.i18n, {
      selectWeapon: this.selectWeapon.bind(this),
    });
    this.input = new WG.InputManager(canvas, this.camera, {
      command: this.handleCommand.bind(this),
      canStartAim: function (world) {
        if (
          !self.battle ||
          self.battle.turn.state !== "PLAYER_CONTROL" ||
          self.battle.targetMode
        )
          return false;
        var actor = self.battle.currentCharacter();
        return Math.hypot(world.x - actor.x, world.y - actor.y) < 115;
      },
    });
    this.input.attach();
    this.loop = new WG.GameLoop(
      this.updateBattle.bind(this),
      this.renderBattle.bind(this),
    );
    this.show("battle");
    this.renderer.resize();
    this.hud.update(this.battle.snapshot());
    this.hud.showTurnBanner(0, this.battle.currentCharacter().name);
    this.loop.start();
    canvas.focus();
  };

  App.prototype.stopBattle = function () {
    if (this.loop) this.loop.stop();
    if (this.input) this.input.detach();
    this.loop = null;
    this.input = null;
    this.renderer = null;
    this.camera = null;
    this.battle = null;
    this.touchHolds.clear();
  };

  App.prototype.updateBattle = function (dt) {
    if (!this.battle) return;
    var axis = this.input ? this.input.axis() : 0;
    if (this.touchHolds.has("moveLeft")) axis -= 1;
    if (this.touchHolds.has("moveRight")) axis += 1;
    this.battle.setMoveAxis(axis);
    if (this.touchHolds.has("aimUp")) this.battle.adjustAim(45 * dt);
    if (this.touchHolds.has("aimDown")) this.battle.adjustAim(-45 * dt);
    this.battle.update(dt);
    var snapshot = this.battle.snapshot();
    var follow =
      snapshot.projectiles.find(function (projectile) {
        return projectile.delay <= 0;
      }) || snapshot.current;
    if (follow && !this.camera.manual) this.camera.target = follow;
    this.camera.update(dt, this.storage.data.settings.reducedMotion);
  };

  App.prototype.renderBattle = function () {
    if (!this.battle || !this.renderer) return;
    var snapshot = this.battle.snapshot();
    this.renderer.render(snapshot);
    this.hud.update(snapshot);
  };

  App.prototype.handleCommand = function (command) {
    if (!this.battle) return;
    if (command.type === "pause") return this.togglePause();
    if (command.type === "focus")
      return this.camera.focus(this.battle.currentCharacter(), false);
    if (command.type === "weapons") return this.hud.toggleWeapons();
    if (command.type === "cancelTarget") return this.battle.cancelTargeting();
    if (command.type === "chargeCancel") return this.battle.cancelCharge();
    if (this.battle.turn.activeTeam !== 0) return;
    if (command.type === "jump") {
      this.battle.queueMove("jump");
      this.audio.sfx("jump");
    }
    if (command.type === "backflip") {
      this.battle.queueMove("backflip");
      this.audio.sfx("backflip");
    }
    if (command.type === "aimUp") this.battle.adjustAim(2);
    if (command.type === "aimDown") this.battle.adjustAim(-2);
    if (command.type === "aimPointer")
      this.battle.aimFromPointer(command.world);
    if (command.type === "chargeStart") this.battle.startCharge();
    if (command.type === "fire") this.battle.fire();
    if (command.type === "previousWeapon") this.battle.cycleWeapon(-1);
    if (command.type === "nextWeapon") this.battle.cycleWeapon(1);
    if (command.type === "selectTarget")
      this.battle.selectTarget(command.world);
    if (command.type === "previewTarget")
      this.battle.updateTargetPreview(command.world);
  };

  App.prototype.selectWeapon = function (weaponId) {
    if (!this.battle || this.battle.turn.activeTeam !== 0) return;
    if (this.battle.selectWeapon(weaponId)) this.hud.toggleWeapons(false);
  };

  App.prototype.handleBattleEvent = function (type, detail) {
    if (!this.battle) return;
    if (type === "turnStart") {
      var actor = this.battle.currentCharacter();
      this.camera && this.camera.focus(actor, false);
      this.hud.showTurnBanner(this.battle.turn.activeTeam, actor && actor.name);
      this.audio.sfx(detail.sudden ? "sudden" : "turn");
      if (detail.sudden) this.hud.announce(this.i18n.t("battle.sudden"));
    }
    if (type === "countdown") this.audio.sfx("countdown");
    if (type === "timeout") this.hud.announce(this.i18n.t("battle.timeout"));
    if (type === "invalidTarget") {
      this.audio.sfx("error");
      this.hud.announce(this.i18n.t("battle.invalid"));
    }
    if (type === "noAmmo") {
      this.audio.sfx("error");
      this.hud.announce(this.i18n.t("battle.noAmmo"));
    }
    if (type === "weaponLocked")
      this.hud.announce(this.i18n.t("battle.weaponLocked"));
    if (type === "secondShot") this.hud.announce(this.i18n.t("battle.shotTwo"));
    if (type === "fired")
      this.audio.sfx(
        detail.weaponId === "shotgun"
          ? "shotgun"
          : detail.weaponId === "bat"
            ? "bat"
            : detail.weaponId === "mine"
              ? "mine"
              : detail.weaponId === "sheep"
                ? "sheep"
                : "rocket",
      );
    if (type === "mineArmed" || type === "holyWarning") this.audio.sfx("fuse");
    if (type === "explosion")
      this.audio.sfx(detail.large ? "bigExplosion" : "explosion");
    if (type === "fallDamage") this.audio.sfx("hurt");
    if (type === "landed") this.audio.sfx("land");
    if (type === "drowned") this.audio.sfx("splash");
    if (type === "damageSummary") this.hud.showDamage(detail.events || []);
    if (type === "result") {
      var result = detail;
      setTimeout(
        function () {
          this.showResult(result);
        }.bind(this),
        0,
      );
    }
  };

  App.prototype.togglePause = function () {
    if (!this.battle || this.state !== "battle") return;
    if (this.battle.turn.paused) this.resumeBattle();
    else this.pauseBattle(false);
  };

  App.prototype.pauseBattle = function (hidden) {
    if (!this.battle) return;
    this.battle.turn.setPaused(true);
    if (this.loop) this.loop.pause();
    this.hiddenPaused = !!hidden;
    if (!hidden) document.getElementById("pause-screen").hidden = false;
  };

  App.prototype.resumeBattle = function () {
    if (!this.battle) return;
    document.getElementById("pause-screen").hidden = true;
    this.hiddenPaused = false;
    this.battle.turn.setPaused(false);
    if (this.loop) this.loop.resume();
    document.getElementById("game-canvas").focus();
  };

  App.prototype.handleVisibility = function () {
    this.audio.setHidden(document.hidden);
    if (this.state !== "battle" || !this.battle) return;
    if (document.hidden && !this.battle.turn.paused) this.pauseBattle(true);
    else if (!document.hidden && this.hiddenPaused) this.resumeBattle();
  };

  // -------------------------------------------------------------------------
  // Results, statistics, settings, tutorial, and dialogs
  // -------------------------------------------------------------------------

  App.prototype.showResult = function (result) {
    if (!this.battle) return;
    this.storage.recordMatch({
      result: result.outcome,
      shotsFired: result.shotsFired,
      shotsHit: result.shotsHit,
      damageDealt: result.damageDealt,
      damageTaken: result.damageTaken,
      weaponUses: result.weaponUses,
      recentWeapon: result.recentWeapon,
    });
    var titleKey =
      result.outcome === "win"
        ? "result.win"
        : result.outcome === "loss"
          ? "result.lose"
          : "result.draw";
    var kickerKey =
      result.outcome === "win"
        ? "result.victory"
        : result.outcome === "loss"
          ? "result.defeat"
          : "result.drawKicker";
    document.getElementById("result-title").textContent = this.i18n.t(titleKey);
    document.getElementById("result-kicker").textContent =
      this.i18n.t(kickerKey);
    document.getElementById("result-survivors").textContent =
      result.survivors
        .map(function () {
          return "🐛";
        })
        .join("") || "💫";
    var favorite = Object.keys(result.weaponUses).sort(function (a, b) {
      var difference = result.weaponUses[b] - result.weaponUses[a];
      if (difference) return difference;
      if (a === result.recentWeapon) return -1;
      if (b === result.recentWeapon) return 1;
      return 0;
    })[0];
    var values = [
      ["result.survivors", String(result.survivors.length)],
      ["result.duration", formatDuration(result.duration)],
      ["result.damage", String(result.damageDealt)],
      [
        "result.accuracy",
        result.shotsFired
          ? Math.round((result.shotsHit / result.shotsFired) * 100) + "%"
          : "0%",
      ],
      ["result.favorite", favorite ? this.i18n.t("weapon." + favorite) : "—"],
      ["result.seed", String(result.seed)],
    ];
    var list = document.getElementById("result-stats");
    list.textContent = "";
    values.forEach(function (entry) {
      var wrapper = document.createElement("div");
      var term = document.createElement("dt");
      var detail = document.createElement("dd");
      term.textContent = this.i18n.t(entry[0]);
      detail.textContent = entry[1];
      wrapper.append(term, detail);
      list.appendChild(wrapper);
    }, this);
    this.audio.sfx(result.outcome === "win" ? "victory" : "defeat");
    if (this.loop) this.loop.stop();
    if (this.input) this.input.detach();
    this.show("result");
  };

  App.prototype.renderCareerStats = function () {
    var stats = this.storage.data.stats;
    var values = [
      ["stats.matches", stats.matches],
      ["stats.wins", stats.wins],
      ["stats.losses", stats.losses],
      ["stats.draws", stats.draws],
      [
        "stats.accuracy",
        stats.shotsFired
          ? Math.round((stats.shotsHit / stats.shotsFired) * 100) + "%"
          : "0%",
      ],
      ["stats.damage", stats.totalDamageDealt],
    ];
    var container = document.getElementById("career-stats");
    container.textContent = "";
    values.forEach(function (entry) {
      var tile = document.createElement("div");
      tile.className = "stat-tile";
      var value = document.createElement("b");
      var label = document.createElement("span");
      value.textContent = entry[1];
      label.textContent = this.i18n.t(entry[0]);
      tile.append(value, label);
      container.appendChild(tile);
    }, this);
  };

  App.prototype.updateSettings = function (event) {
    var form = event.currentTarget;
    var partial = {
      language: form.elements.language.value,
      bgmVolume: Number(form.elements.bgmVolume.value) / 100,
      sfxVolume: Number(form.elements.sfxVolume.value) / 100,
      muted: form.elements.muted.checked,
      reducedMotion: form.elements.reducedMotion.checked,
    };
    form.elements.bgmOutput.value = Math.round(partial.bgmVolume * 100) + "%";
    form.elements.sfxOutput.value = Math.round(partial.sfxVolume * 100) + "%";
    this.storage.updateSettings(partial);
    this.i18n.setLanguage(partial.language);
    this.i18n.apply(document);
    this.hud.refreshLanguage();
    this.audio.setSettings(partial);
    this.applySettingsToDocument();
  };

  App.prototype.applySettingsToDocument = function () {
    document.body.classList.toggle(
      "reduced-motion",
      this.storage.data.settings.reducedMotion,
    );
  };

  App.prototype.startTutorial = function () {
    var self = this;
    this.show("tutorial");
    this.tutorial = new WG.TutorialController(
      document.getElementById("tutorial-canvas"),
      this.i18n,
      {
        complete: function () {
          self.stopTutorial(true);
        },
      },
    );
    this.tutorial.start();
  };

  App.prototype.stopTutorial = function (completed) {
    if (this.tutorial) this.tutorial.stop();
    this.tutorial = null;
    if (completed) {
      this.storage.updateSettings({ tutorialCompleted: true });
      this.audio.sfx("confirm");
    }
    this.returnToMenu();
  };

  App.prototype.askConfirm = function (copyKey, action) {
    this.confirmAction = action;
    document.getElementById("confirm-copy").textContent = this.i18n.t(copyKey);
    var dialog = document.getElementById("confirm-dialog");
    dialog.hidden = false;
    dialog.querySelector("button").focus();
  };

  App.prototype.resolveConfirm = function (accepted) {
    document.getElementById("confirm-dialog").hidden = true;
    var action = this.confirmAction;
    this.confirmAction = null;
    if (accepted && action) {
      this.audio.sfx("confirm");
      action();
    }
  };

  App.prototype.clearStats = function () {
    this.storage.clearStats();
    this.renderCareerStats();
    document.getElementById("aria-live").textContent =
      this.i18n.t("settings.cleared");
  };

  return { App: App, randomSeed: randomSeed, formatDuration: formatDuration };
});
