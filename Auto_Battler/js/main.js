(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};

  function closeLanguageMenu() {
    var menu = document.getElementById("language-menu");
    var button = document.getElementById("menu-language-button");
    if (menu) menu.hidden = true;
    if (button) button.setAttribute("aria-expanded", "false");
  }

  function toggleLanguageMenu() {
    var menu = document.getElementById("language-menu");
    var button = document.getElementById("menu-language-button");
    if (!menu || !button) return;
    var willOpen = menu.hidden;
    if (willOpen) app.MainMenuUI.renderLanguageMenu();
    menu.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
  }

  function startNewGame() {
    app.AudioManager.ensure();
    app.GameEngine.startNew();
    app.UIManager.show("game");
    app.GameUI.render();
  }

  function continueGame() {
    app.AudioManager.ensure();
    var state = app.GameEngine.continueGame();
    if (!state) return;
    app.UIManager.show("game");
    app.GameUI.render();
    if ((state.mode === "gameover" || state.awaitingContinue) && state.lastResult) app.GameUI.showResult(state.lastResult);
  }

  function requestNewGame() {
    if (!app.GameState.hasSave()) {
      startNewGame();
      return;
    }
    app.UIManager.openConfirm({
      icon: "🌱",
      title: app.I18n.t("menu.overwriteTitle"),
      copy: app.I18n.t("menu.overwriteCopy"),
      confirmText: app.I18n.t("common.yes"),
      cancelText: app.I18n.t("common.no"),
      onConfirm: startNewGame
    });
  }

  function showResultMessage(result) {
    if (!result) return;
    var message = "";
    var kind = "info";
    if (result.reason === "gold") message = app.I18n.t("game.noGold");
    else if (result.reason === "no-units") message = app.I18n.t("game.noUnits");
    else if (result.reason === "already-out") message = app.I18n.t("game.alreadyOut");
    else if (result.reason === "locked") message = app.I18n.t("game.lockedShop");
    else if (result.reason === "bench-full") message = app.I18n.t("game.bench");
    else if (result.reason === "max-level") message = app.I18n.t("game.level");
    if (message) app.GameUI.showToast(message, kind === "danger" ? "danger" : "info");
  }

  function showStarUpEvents(events) {
    (events || []).forEach(function (event) {
      var display = event.unit ? app.UnitData.getDisplay(event.unit) : null;
      if (!display) return;
      (event.starUps || []).forEach(function (star) {
        app.GameUI.showToast(app.I18n.t("game.starUp").replace("{name}", display.name).replace("{star}", star), "success");
      });
    });
  }

  function showMergeResults(merged) {
    if (!merged || !merged.length) return;
    var events = merged.events || [];
    if (!events.length) {
      app.GameUI.showToast("⭐ " + merged.map(function (unit) { return app.UnitData.getDisplay(unit).name; }).join(" / "), "success");
      return;
    }
    events.forEach(function (event) {
      var display = event.unit ? app.UnitData.getDisplay(event.unit) : null;
      if (!display) return;
      if (event.experience) {
        app.GameUI.showToast(app.I18n.t("game.unitXp").replace("{name}", display.name).replace("{amount}", event.experience), "success");
      }
      (event.starUps || []).forEach(function (star) {
        app.GameUI.showToast(app.I18n.t("game.starUp").replace("{name}", display.name).replace("{star}", star), "success");
      });
    });
  }

  function handleAction(element, event) {
    var action = element.getAttribute("data-action");
    if (!action) return;
    if (action === "toggle-language") {
      toggleLanguageMenu();
      return;
    }
    if (action === "set-language") {
      var language = element.getAttribute("data-language");
      app.I18n.setLanguage(language);
      app.GameEngine.updateSettings({ language: language });
      closeLanguageMenu();
      if (app.UIManager.currentScreen === "settings") app.SettingsUI.render();
      return;
    }
    if (action === "start-new") { requestNewGame(); return; }
    if (action === "continue") { continueGame(); return; }
    if (action === "open-help") { closeLanguageMenu(); app.UIManager.show("help"); return; }
    if (action === "open-settings") { closeLanguageMenu(); app.UIManager.show("settings"); return; }
    if (action === "go-menu") {
      app.UIManager.closeModal();
      app.GameEngine.leaveToMenu();
      return;
    }
    if (action === "close-modal") { app.UIManager.closeModal(); return; }
    if (action === "confirm-modal") { app.UIManager.confirmModal(); return; }
    if (action === "continue-round") {
      app.UIManager.closeModal();
      app.GameEngine.resumePreparation();
      app.AudioManager.startBgm("prepare");
      app.GameUI.render();
      return;
    }
    if (action === "toggle-toasts") {
      if (app.GameUI.toggleToasts) app.GameUI.toggleToasts();
      return;
    }
    if (action === "buy-unit") {
      var purchase = app.GameEngine.buyUnit(element.getAttribute("data-offer-id"));
      if (!purchase.ok) showResultMessage(purchase);
      else {
        var display = app.UnitData.getDisplay(purchase.unit);
        app.GameUI.showToast(app.I18n.t("game.bought").replace("{name}", display.name), "success");
        if (purchase.merged && purchase.merged.length) app.AudioManager.playSfx("merge");
        showMergeResults(purchase.merged);
      }
      return;
    }
    if (action === "refresh-shop") {
      var refreshed = app.GameEngine.refreshShop();
      if (!refreshed.ok) showResultMessage(refreshed);
      else app.GameUI.showToast(app.I18n.t("game.refreshed"), "success");
      return;
    }
    if (action === "toggle-lock") {
      var locked = app.GameEngine.toggleShopLock();
      app.GameUI.showToast(locked ? app.I18n.t("common.locked") : app.I18n.t("common.unlocked"));
      return;
    }
    if (action === "buy-xp") {
      var xp = app.GameEngine.buyExperience();
      if (!xp.ok) showResultMessage(xp);
      else {
        app.GameUI.showToast(app.I18n.t("game.xpBought").replace("{amount}", xp.amount), "success");
        showStarUpEvents(xp.unitExperience);
        if (xp.merged && xp.merged.length) app.AudioManager.playSfx("merge");
        showMergeResults(xp.merged);
      }
      return;
    }
    if (action === "select-unit") {
      if (element.closest && element.closest(".board-cell")) {
        var returned = app.GameEngine.returnUnit(element.getAttribute("data-unit-id"));
        if (!returned.ok) showResultMessage(returned);
        else {
          var returnedDisplay = app.UnitData.getDisplay(returned.unit);
          app.GameUI.showToast(app.I18n.t("game.removed").replace("{name}", returnedDisplay.name), "success");
          if (returned.merged && returned.merged.length) app.AudioManager.playSfx("merge");
          showMergeResults(returned.merged);
        }
        return;
      }
      var selected = app.GameEngine.selectUnit(element.getAttribute("data-unit-id"));
      if (selected && app.GameState.get()) {
        var location = app.BoardSystem.findLocation(app.GameState.get(), selected);
        if (location) app.GameUI.showToast(app.I18n.t("game.selectHint").replace("{name}", app.UnitData.getDisplay(location.unit).name));
      }
      return;
    }
    if (action === "board-slot") {
      var boardResult = app.GameEngine.clickBoardSlot(Number(element.getAttribute("data-slot")));
      if (!boardResult.ok && boardResult.reason !== "empty") showResultMessage(boardResult);
      if (boardResult.merged && boardResult.merged.length) app.AudioManager.playSfx("merge");
      showMergeResults(boardResult.merged);
      return;
    }
    if (action === "help-tab") { app.HelpUI.setChapter(element.getAttribute("data-chapter")); return; }
    if (action === "toggle-faq") { app.HelpUI.toggleFaq(element.getAttribute("data-faq-index")); return; }
    if (action === "change-theme") { app.SettingsUI.changeTheme(element.getAttribute("data-theme")); return; }
    if (action === "toggle-mute") { app.SettingsUI.toggleMute(); return; }
    if (action === "change-speed") { app.SettingsUI.setBattleSpeed(element.getAttribute("data-speed")); return; }
    if (action === "delete-save") {
      app.UIManager.openConfirm({ icon: "🗑️", title: app.I18n.t("settings.deleteTitle"), copy: app.I18n.t("settings.deleteCopy"), confirmText: app.I18n.t("settings.deleteSave"), cancelText: app.I18n.t("common.cancel"), danger: true, onConfirm: function () { app.GameEngine.deleteSave(); app.GameUI.showToast(app.I18n.t("toast.cleared"), "success"); app.SettingsUI.render(); } });
      return;
    }
    if (action === "reset-settings") {
      app.UIManager.openConfirm({ icon: "↺", title: app.I18n.t("settings.resetTitle"), copy: app.I18n.t("settings.resetCopy"), confirmText: app.I18n.t("settings.reset"), cancelText: app.I18n.t("common.cancel"), onConfirm: function () { app.GameEngine.resetSettings(); app.SettingsUI.render(); app.GameUI.showToast(app.I18n.t("settings.resetDone"), "success"); } });
      return;
    }
    if (action === "start-battle") {
      var battle = app.GameEngine.startBattle();
      if (!battle.ok) showResultMessage(battle);
      return;
    }
    if (event) event.preventDefault();
  }

  function handleInput(event) {
    var element = event.target;
    var setting = element.getAttribute && element.getAttribute("data-setting");
    if (setting === "bgm" || setting === "sfx") {
      app.SettingsUI.changeRange(setting, element.value);
    } else if (setting === "targetStrategy") {
      app.SettingsUI.setTargetStrategy(element.value);
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      var modal = document.getElementById("modal-root");
      if (modal && modal.innerHTML) app.UIManager.closeModal();
      else closeLanguageMenu();
    }
    if (event.key === "Enter" && event.target.matches && event.target.matches("[data-action=board-slot]")) {
      event.preventDefault();
      event.target.click();
    }
  }

  function init() {
    var settings = app.GameState.loadSettings();
    document.documentElement.dataset.theme = settings.theme || "cute";
    app.AudioManager.init(settings);
    if (settings.language && settings.language !== app.I18n.getLanguage()) app.I18n.setLanguage(settings.language);
    app.Device.applyHints();
    window.addEventListener("resize", function () { app.Device.applyHints(); });
    document.addEventListener("click", function (event) {
      var actionElement = event.target.closest && event.target.closest("[data-action]");
      if (actionElement) handleAction(actionElement, event);
      var languageWrap = document.querySelector(".menu-language-wrap");
      if (languageWrap && !languageWrap.contains(event.target) && !event.target.closest("[data-action=toggle-language]")) closeLanguageMenu();
    });
    document.addEventListener("input", handleInput);
    document.addEventListener("change", handleInput);
    document.addEventListener("keydown", handleKeydown);
    app.DragDrop.init();
    app.I18n.apply();
    app.MainMenuUI.renderLanguageMenu();
    app.MainMenuUI.updateContinue();
    app.UIManager.show("menu");
    if (app.Device.isNarrow()) window.setTimeout(function () { app.GameUI.showToast(app.I18n.t("game.narrowHint")); }, 450);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}(window));
