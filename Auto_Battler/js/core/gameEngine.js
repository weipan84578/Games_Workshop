(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};
  var battleBusy = false;
  var currentSettings = null;
  var preparationTimer = null;

  function stopPreparationClock() {
    if (preparationTimer) window.clearTimeout(preparationTimer);
    preparationTimer = null;
  }

  function startPreparationClock() {
    stopPreparationClock();
    var state = app.GameState.get();
    if (!state || state.mode !== "prepare") return;
    if (!Number.isFinite(Number(state.phaseTime)) || state.phaseTime <= 0) state.phaseTime = 30;
    function tick() {
      var currentState = app.GameState.get();
      if (!currentState || currentState.mode !== "prepare") return;
      currentState.phaseTime = Math.max(0, currentState.phaseTime - 1);
      if (app.GameUI) app.GameUI.render();
      if (currentState.phaseTime <= 0) {
        app.GameEngine.startBattle();
        return;
      }
      preparationTimer = window.setTimeout(tick, 1000);
      if (preparationTimer && typeof preparationTimer.unref === "function") preparationTimer.unref();
    }
    preparationTimer = window.setTimeout(tick, 1000);
    if (preparationTimer && typeof preparationTimer.unref === "function") preparationTimer.unref();
  }

  function settings() {
    if (!currentSettings) currentSettings = app.GameState.loadSettings();
    return currentSettings;
  }

  function configureState(state) {
    var nextSettings = settings();
    state.targetStrategy = nextSettings.targetStrategy || "nearest";
    state.battleSpeed = nextSettings.battleSpeed || 1;
    app.ShopSystem.ensure(state);
    return state;
  }

  function render() {
    if (app.GameUI) app.GameUI.render();
    if (app.MainMenuUI) app.MainMenuUI.updateContinue();
  }

  app.GameEngine = {
    isBattleBusy: function () { return battleBusy; },
    getSettings: function () { return settings(); },
    updateSettings: function (patch) {
      currentSettings = app.GameState.saveSettings(Object.assign(settings(), patch || {}));
      var state = app.GameState.get();
      if (state) {
        if (patch.targetStrategy) state.targetStrategy = patch.targetStrategy;
        if (patch.battleSpeed) state.battleSpeed = patch.battleSpeed;
      }
      return currentSettings;
    },
    resetSettings: function () {
      var defaults = app.GameState.SETTINGS_DEFAULTS();
      defaults.language = "zh-TW";
      currentSettings = app.GameState.saveSettings(defaults);
      document.documentElement.dataset.theme = currentSettings.theme;
      if (app.I18n.getLanguage() !== currentSettings.language) app.I18n.setLanguage(currentSettings.language);
      if (app.AudioManager) app.AudioManager.applySettings(currentSettings);
      return currentSettings;
    },
    startNew: function () {
      var state = configureState(app.GameState.createNew());
      state.shop = app.ShopSystem.generate(state.level);
      state.lastResult = null;
      app.GameState.save();
      battleBusy = false;
      startPreparationClock();
      render();
      return state;
    },
    continueGame: function () {
      var state = app.GameState.load();
      if (!state) return null;
      configureState(state);
      var migratedMerge = app.BoardSystem.autoMerge(state);
      if (migratedMerge.length) app.GameState.save();
      battleBusy = false;
      if (!state.awaitingContinue) startPreparationClock();
      render();
      return state;
    },
    resumePreparation: function () {
      var state = app.GameState.get();
      if (!state || state.mode !== "prepare" || battleBusy) return false;
      state.awaitingContinue = false;
      if (state.phaseTime <= 0) state.phaseTime = 30;
      app.GameState.save();
      startPreparationClock();
      render();
      return true;
    },
    leaveToMenu: function () {
      stopPreparationClock();
      if (app.GameState.get()) app.GameState.save();
      battleBusy = false;
      if (app.UIManager) app.UIManager.show("menu");
      render();
    },
    buyUnit: function (offerId) {
      var state = app.GameState.get();
      if (!state || state.mode !== "prepare") return { ok: false, reason: "busy" };
      var result = app.ShopSystem.buy(state, offerId);
      if (result.ok) {
        app.AudioManager.playSfx("buy");
        app.GameState.save();
      }
      render();
      return result;
    },
    refreshShop: function () {
      var state = app.GameState.get();
      if (!state || state.mode !== "prepare") return { ok: false, reason: "busy" };
      var result = app.ShopSystem.refresh(state, false);
      if (result.ok) {
        app.AudioManager.playSfx("click");
        app.GameState.save();
      }
      render();
      return result;
    },
    toggleShopLock: function () {
      var state = app.GameState.get();
      if (!state || state.mode !== "prepare") return false;
      var locked = app.ShopSystem.toggleLock(state);
      app.AudioManager.playSfx("click");
      app.GameState.save();
      render();
      return locked;
    },
    buyExperience: function () {
      var state = app.GameState.get();
      if (!state || state.mode !== "prepare") return { ok: false, reason: "busy" };
      var result = app.EconomySystem.buyExperience(state);
      if (result.ok) {
        app.AudioManager.playSfx("click");
        app.GameState.save();
      }
      render();
      return result;
    },
    selectUnit: function (instanceId) {
      var state = app.GameState.get();
      if (!state || state.mode !== "prepare") return null;
      var location = app.BoardSystem.findLocation(state, instanceId);
      if (!location) return null;
      app.BoardSystem.setSelection(state, state.selectedId === instanceId ? null : instanceId);
      render();
      return state.selectedId;
    },
    clickBoardSlot: function (slotIndex) {
      var state = app.GameState.get();
      if (!state || state.mode !== "prepare") return { ok: false, reason: "busy" };
      var target = state.board[slotIndex];
      if (state.selectedId) {
        var result = app.BoardSystem.placeSelected(state, slotIndex);
        if (result.ok) {
          app.AudioManager.playSfx("place");
          var merged = app.BoardSystem.autoMerge(state);
          result.merged = merged;
          app.GameState.save();
        }
        render();
        return result;
      }
      if (target) {
        var removed = app.BoardSystem.returnToBench(state, slotIndex);
        if (removed.ok) {
          app.AudioManager.playSfx("place");
          removed.merged = app.BoardSystem.autoMerge(state);
          app.GameState.save();
        }
        render();
        return removed;
      }
      return { ok: false, reason: "empty" };
    },
    returnUnit: function (instanceId) {
      var state = app.GameState.get();
      if (!state || state.mode !== "prepare") return { ok: false, reason: "busy" };
      var location = app.BoardSystem.findLocation(state, instanceId);
      if (!location || location.area !== "board") return { ok: false, reason: "not-on-board" };
      var result = app.BoardSystem.returnToBench(state, location.index);
      if (result.ok) {
        result.merged = app.BoardSystem.autoMerge(state);
        app.AudioManager.playSfx("place");
        app.GameState.save();
      }
      render();
      return result;
    },
    dropUnit: function (instanceId, slotIndex) {
      var state = app.GameState.get();
      if (!state || state.mode !== "prepare") return { ok: false, reason: "busy" };
      app.BoardSystem.setSelection(state, instanceId);
      return this.clickBoardSlot(slotIndex);
    },
    startBattle: function () {
      var state = app.GameState.get();
      if (!state || state.mode !== "prepare" || battleBusy) return { ok: false, reason: "busy" };
      if (state.health <= 0) return { ok: false, reason: "already-out" };
      if (app.BoardSystem.boardCount(state) === 0) return { ok: false, reason: "no-units" };
      stopPreparationClock();
      battleBusy = true;
      state.mode = "battle";
      state.selectedId = null;
      var playerSnapshot = app.Helpers.clone(state.board.filter(Boolean));
      var result = app.BattleSystem.simulate(state, playerSnapshot);
      app.AudioManager.startBgm("battle");
      render();
      if (app.GameUI && app.GameUI.playBattle) {
        app.GameUI.playBattle(result, function () {
          app.GameEngine.finishBattle(result);
        });
      } else {
        this.finishBattle(result);
      }
      return { ok: true, result: result };
    },
    finishBattle: function (result) {
      if (!battleBusy) return;
      var state = app.GameState.get();
      if (!state) return;
      var settled = app.EconomySystem.settle(state, result);
      settled.events = result.events;
      state.lastResult = settled;
      state.mode = settled.gameOver ? "gameover" : "prepare";
      state.phaseTime = 30;
      state.awaitingContinue = !settled.gameOver;
      if (!settled.gameOver && !state.shopLocked) app.ShopSystem.refresh(state, true);
      app.GameState.save();
      battleBusy = false;
      if (settled.winner === "player") app.AudioManager.playSfx("victory");
      else if (settled.winner === "enemy") app.AudioManager.playSfx("defeat");
      else app.AudioManager.playSfx("click");
      render();
      if (app.GameUI && app.GameUI.showResult) app.GameUI.showResult(settled);
      app.GameState.emit("round-settled", settled);
    },
    deleteSave: function () {
      app.GameState.clearSave();
      render();
    }
  };
}(window));
