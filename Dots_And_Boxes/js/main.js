(function (ns) {
  "use strict";

  function bindModalClosers() {
    ns.$$("[data-close-modal]").forEach(function (button) {
      button.addEventListener("click", function () {
        ns.closeModal(button.getAttribute("data-close-modal"));
      });
    });
    ns.$$(".modal-backdrop").forEach(function (backdrop) {
      backdrop.addEventListener("click", function (event) {
        if (backdrop.dataset.dismissible === "false") {
          return;
        }
        if (event.target === backdrop) {
          ns.closeModal(backdrop.id);
        }
      });
    });
  }

  function bindGlobalButtons() {
    document.addEventListener("click", function (event) {
      if (event.target.closest("button")) {
        ns.AudioManager.playSfx("buttonTap");
      }
    });
    document.addEventListener("pointerdown", function () {
      ns.AudioManager.ensureContext();
      if (ns.Router.current() === "game") {
        ns.AudioManager.playBgm("gameplay");
      } else {
        ns.AudioManager.playBgm("menu");
      }
    }, { once: true });
    ns.$$("[data-route-back]").forEach(function (button) {
      button.addEventListener("click", function () {
        ns.Router.back();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    ns.appSettings = ns.SaveManager.loadSettings();
    ns.ThemeSwitcher.apply(ns.appSettings.theme);
    ns.I18n.init(ns.appSettings.language);
    ns.AudioManager.init(ns.appSettings);
    ns.AudioManager.updateGains();

    bindModalClosers();
    bindGlobalButtons();
    ns.MainMenuUI.init();
    ns.GameUI.init();
    ns.SettingsUI.init();
    ns.HowToPlayUI.init();
    ns.ResultModalUI.init();
    ns.Router.show("menu");
  });
})(window.DAB = window.DAB || {});
