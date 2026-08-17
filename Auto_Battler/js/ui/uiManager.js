(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};
  var screens = ["menu", "game", "help", "settings"];
  var currentScreen = "menu";

  function byScreen(name) {
    return document.querySelector('[data-screen="' + name + '"]');
  }

  app.UIManager = {
    get currentScreen() { return currentScreen; },
    show: function (name) {
      if (screens.indexOf(name) < 0) return;
      currentScreen = name;
      screens.forEach(function (screenName) {
        var element = byScreen(screenName);
        if (!element) return;
        element.hidden = screenName !== name;
        element.classList.toggle("is-active", screenName === name);
      });
      var header = document.getElementById("global-header");
      if (header) header.classList.toggle("is-hidden", name !== "game");
      document.body.classList.toggle("in-game", name === "game");
      if (name === "menu") app.AudioManager.startBgm("menu");
      if (name === "game" && app.GameState.get() && app.GameState.get().mode === "prepare") app.AudioManager.startBgm("prepare");
      if (name === "help" && app.HelpUI) app.HelpUI.render();
      if (name === "settings" && app.SettingsUI) app.SettingsUI.render();
      if (app.MainMenuUI) app.MainMenuUI.updateContinue();
      app.AudioManager.playSfx("click");
    },
    openConfirm: function (options) {
      var settings = Object.assign({ icon: "❔", title: "", copy: "", confirmText: "確定", cancelText: "取消", danger: false, onConfirm: function () {} }, options || {});
      var rootElement = document.getElementById("modal-root");
      rootElement.innerHTML = '<div class="modal-backdrop" data-modal-backdrop><div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-icon">' + settings.icon + '</div><h2 id="modal-title">' + settings.title + '</h2><p class="modal-copy">' + settings.copy + '</p><div class="modal-actions"><button class="ghost-button" type="button" data-action="close-modal">' + settings.cancelText + '</button><button class="primary-button ' + (settings.danger ? "danger-button" : "") + '" type="button" data-action="confirm-modal">' + settings.confirmText + '</button></div></div></div>';
      rootElement._confirmAction = settings.onConfirm;
      var confirmButton = rootElement.querySelector('[data-action="confirm-modal"]');
      if (confirmButton) confirmButton.focus();
    },
    closeModal: function () {
      var rootElement = document.getElementById("modal-root");
      rootElement.innerHTML = "";
      rootElement._confirmAction = null;
    },
    confirmModal: function () {
      var rootElement = document.getElementById("modal-root");
      var action = rootElement._confirmAction;
      this.closeModal();
      if (typeof action === "function") action();
    }
  };
}(window));
