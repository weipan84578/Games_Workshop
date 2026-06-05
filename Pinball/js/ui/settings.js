(function (window) {
  "use strict";

  var Pinball = window.Pinball;
  var CONFIG = Pinball.CONFIG;
  var Utils = Pinball.Utils;

  function SettingsPanel() {
    this.settings = Object.assign(
      {},
      CONFIG.DEFAULT_SETTINGS,
      Utils.loadJSON(CONFIG.STORAGE.SETTINGS, {})
    );
    this.bgm = document.getElementById("setting-bgm");
    this.bgmValue = document.getElementById("setting-bgm-value");
    this.sfx = document.getElementById("setting-sfx");
    this.sfxValue = document.getElementById("setting-sfx-value");
    this.muted = document.getElementById("setting-muted");
    this.themeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-theme-choice]"));
    this.difficultyButtons = Array.prototype.slice.call(document.querySelectorAll("[data-difficulty]"));
    this.resetButton = document.getElementById("btn-reset-storage");
  }

  SettingsPanel.prototype.init = function (onChange) {
    var self = this;
    this.onChange = onChange || function () {};
    this.apply();

    this.bgm.addEventListener("input", function () {
      self.settings.bgmVolume = Number(self.bgm.value) / 100;
      self.persist();
    });

    this.sfx.addEventListener("input", function () {
      self.settings.sfxVolume = Number(self.sfx.value) / 100;
      self.persist();
      Pinball.AudioManager.playSFX("uiClick");
    });

    this.muted.addEventListener("change", function () {
      self.settings.muted = self.muted.checked;
      self.persist();
    });

    this.themeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        self.settings.theme = button.dataset.themeChoice;
        self.persist();
        Pinball.AudioManager.playSFX("uiClick");
      });
    });

    this.difficultyButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        self.settings.difficulty = button.dataset.difficulty;
        self.persist();
        Pinball.AudioManager.playSFX("uiClick");
      });
    });

    this.resetButton.addEventListener("click", function () {
      Utils.clearStorage([CONFIG.STORAGE.HIGH_SCORE, CONFIG.STORAGE.SAVED_GAME]);
      Pinball.AudioManager.playSFX("uiClick");
      if (self.onReset) self.onReset();
    });
  };

  SettingsPanel.prototype.persist = function () {
    Utils.saveJSON(CONFIG.STORAGE.SETTINGS, this.settings);
    this.apply();
    this.onChange(this.settings);
  };

  SettingsPanel.prototype.apply = function () {
    document.body.dataset.theme = this.settings.theme;
    this.bgm.value = Math.round(this.settings.bgmVolume * 100);
    this.sfx.value = Math.round(this.settings.sfxVolume * 100);
    this.bgmValue.textContent = this.bgm.value + "%";
    this.sfxValue.textContent = this.sfx.value + "%";
    this.muted.checked = this.settings.muted;

    this.themeButtons.forEach(function (button) {
      button.classList.toggle("is-selected", button.dataset.themeChoice === this.settings.theme);
    }, this);

    this.difficultyButtons.forEach(function (button) {
      button.classList.toggle("is-selected", button.dataset.difficulty === this.settings.difficulty);
    }, this);

    Pinball.AudioManager.configure(this.settings);
  };

  SettingsPanel.prototype.get = function () {
    return Object.assign({}, this.settings);
  };

  Pinball.SettingsPanel = SettingsPanel;
})(window);
