(function (ns) {
  "use strict";

  function SettingsMenu(app) {
    this.app = app;
    this.bgmInput = ns.Helpers.$("#bgm-volume");
    this.sfxInput = ns.Helpers.$("#sfx-volume");
    this.bgmOutput = ns.Helpers.$("#bgm-volume-value");
    this.sfxOutput = ns.Helpers.$("#sfx-volume-value");
    this.muteToggle = ns.Helpers.$("#mute-toggle");
  }

  SettingsMenu.prototype.init = function () {
    var self = this;
    this.bgmInput.addEventListener("input", function () {
      self.updateSetting({ bgmVolume: Number(self.bgmInput.value) });
    });
    this.sfxInput.addEventListener("input", function () {
      self.updateSetting({ sfxVolume: Number(self.sfxInput.value) });
      self.app.audio.playSfx("button");
    });
    this.muteToggle.addEventListener("click", function () {
      var settings = ns.SaveManager.loadSettings();
      self.updateSetting({ muted: !settings.muted });
    });

    ns.Helpers.$$("[data-theme]").forEach(function (button) {
      button.addEventListener("click", function () {
        self.updateSetting({ theme: button.getAttribute("data-theme") });
      });
    });

    ns.Helpers.$$("[data-setting]").forEach(function (button) {
      button.addEventListener("click", function () {
        var key = button.getAttribute("data-setting");
        var value = button.getAttribute("data-value");
        if (key === "targetScore") {
          value = Number(value);
        }
        var patch = {};
        patch[key] = value;
        self.updateSetting(patch);
      });
    });

    ns.Helpers.$$(".language-buttons [data-language], #language-modal [data-language]").forEach(function (button) {
      button.addEventListener("click", function () {
        var language = button.getAttribute("data-language");
        self.app.i18n.setLanguage(language, true);
        self.updateSetting({ language: language }, true);
        self.app.screen.hideModal("language-modal");
      });
    });

    ns.Helpers.$("#reset-progress").addEventListener("click", function () {
      self.app.screen.showModal("confirm-modal");
    });

    document.addEventListener("click", function (event) {
      var actionButton = event.target.closest("[data-action]");
      if (!actionButton) {
        return;
      }
      var action = actionButton.getAttribute("data-action");
      if (action === "confirm-reset") {
        ns.SaveManager.clearProgress();
        self.app.mainMenu.refreshContinue();
        self.app.screen.hideModal("confirm-modal");
        self.app.screen.toast(self.app.i18n.t("actions.resetDone"));
      }
      if (action === "cancel-reset") {
        self.app.screen.hideModal("confirm-modal");
      }
    });

    this.refresh();
  };

  SettingsMenu.prototype.updateSetting = function (patch, silent) {
    var settings = ns.SaveManager.patchSettings(patch);
    this.app.applySettings(settings);
    this.refresh();
    if (!silent) {
      this.app.screen.toast(this.app.i18n.t("actions.saved"));
    }
  };

  SettingsMenu.prototype.refresh = function () {
    var settings = ns.SaveManager.loadSettings();
    this.bgmInput.value = settings.bgmVolume;
    this.sfxInput.value = settings.sfxVolume;
    this.bgmOutput.textContent = settings.bgmVolume + "%";
    this.sfxOutput.textContent = settings.sfxVolume + "%";
    this.muteToggle.setAttribute("aria-pressed", String(settings.muted));

    ns.Helpers.$$("[data-theme]").forEach(function (button) {
      button.classList.toggle("is-selected", button.getAttribute("data-theme") === settings.theme);
    });
    ns.Helpers.$$("[data-setting]").forEach(function (button) {
      button.classList.toggle("is-selected", String(settings[button.getAttribute("data-setting")]) === button.getAttribute("data-value"));
    });
    ns.Helpers.$$(".language-buttons [data-language]").forEach(function (button) {
      button.classList.toggle("is-selected", button.getAttribute("data-language") === settings.language);
    });
  };

  ns.SettingsMenu = SettingsMenu;
})(window.AirHockey = window.AirHockey || {});
