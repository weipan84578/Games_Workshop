(function exposeSettingsPanel(root, factory) {
  var SettingsPanel = factory(root);
  root.BBQ = root.BBQ || {};
  root.BBQ.SettingsPanel = SettingsPanel;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = SettingsPanel;
  }
})(typeof window !== "undefined" ? window : globalThis, function settingsPanelFactory(root) {
  "use strict";

  function SettingsPanel(options) {
    this.layer = options.layer;
    this.element = options.element;
    this.storage = options.storage;
    this.i18n = options.i18n;
    this.audio = options.audio;
    this.onResetData = options.onResetData || function noop() {};
    this.controls = {
      bgm: this.element.querySelector("#bgmVolume"),
      sfx: this.element.querySelector("#sfxVolume"),
      language: this.element.querySelector("#languageSelect"),
      largeText: this.element.querySelector("#largeTextToggle"),
      contrast: this.element.querySelector("#contrastToggle"),
      reset: this.element.querySelector("#resetDataButton"),
      themeButtons: Array.from(this.element.querySelectorAll("[data-theme-choice]")),
      closeButtons: Array.from(this.element.querySelectorAll("[data-close-modal]"))
    };
  }

  SettingsPanel.prototype.bind = function bind() {
    var saveFromControls = this.saveFromControls.bind(this);
    this.controls.bgm.addEventListener("input", saveFromControls);
    this.controls.sfx.addEventListener("input", saveFromControls);
    this.controls.language.addEventListener("change", saveFromControls);
    this.controls.largeText.addEventListener("change", saveFromControls);
    this.controls.contrast.addEventListener("change", saveFromControls);
    this.controls.themeButtons.forEach(function bindTheme(button) {
      button.addEventListener("click", function selectTheme() {
        this.audio.playSfx("click");
        var settings = this.storage.getSettings();
        settings.theme = button.getAttribute("data-theme-choice");
        this.storage.saveSettings(settings);
        this.apply(settings);
      }.bind(this));
    }, this);
    this.controls.closeButtons.forEach(function bindClose(button) {
      button.addEventListener("click", this.close.bind(this));
    }, this);
    this.controls.reset.addEventListener("click", function resetData() {
      this.storage.clearGame();
      this.audio.playSfx("warning");
      this.onResetData();
    }.bind(this));

    this.apply(this.storage.getSettings());
  };

  SettingsPanel.prototype.fillControls = function fillControls(settings) {
    this.controls.bgm.value = settings.bgmVolume;
    this.controls.sfx.value = settings.sfxVolume;
    this.controls.language.value = settings.language;
    this.controls.largeText.checked = settings.largeText;
    this.controls.contrast.checked = settings.highContrast;
    this.controls.themeButtons.forEach(function setThemeButton(button) {
      button.classList.toggle("active", button.getAttribute("data-theme-choice") === settings.theme);
    });
  };

  SettingsPanel.prototype.saveFromControls = function saveFromControls() {
    var settings = this.storage.getSettings();
    settings.bgmVolume = Number(this.controls.bgm.value);
    settings.sfxVolume = Number(this.controls.sfx.value);
    settings.language = this.controls.language.value;
    settings.largeText = this.controls.largeText.checked;
    settings.highContrast = this.controls.contrast.checked;
    this.storage.saveSettings(settings);
    this.apply(settings);
  };

  SettingsPanel.prototype.apply = function apply(settings) {
    settings = this.storage.normalizeSettings(settings);
    root.document.body.setAttribute("data-theme", settings.theme);
    root.document.body.setAttribute("data-large-text", String(settings.largeText));
    root.document.body.setAttribute("data-high-contrast", String(settings.highContrast));
    this.fillControls(settings);
    if (this.audio) {
      this.audio.applySettings(settings);
    }
    if (this.i18n) {
      this.i18n.setLanguage(settings.language);
    }
  };

  SettingsPanel.prototype.open = function open() {
    this.fillControls(this.storage.getSettings());
    this.layer.hidden = false;
    this.element.hidden = false;
    this.controls.bgm.focus();
  };

  SettingsPanel.prototype.close = function close() {
    this.element.hidden = true;
    this.layer.hidden = true;
  };

  return SettingsPanel;
});
