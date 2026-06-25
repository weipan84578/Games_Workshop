(function () {
  window.EAE = window.EAE || {};

  class SettingsUI {
    constructor(options) {
      this.screenManager = options.screenManager;
      this.saveManager = options.saveManager;
      this.i18n = options.i18n;
      this.sfx = options.sfx;
      this.applySettings = options.applySettings;
      this.showToast = options.showToast;
      this.onSaveCleared = options.onSaveCleared;
      this.backTarget = "home";
      this.controls = {};
    }

    init() {
      this.controls.bgmVolume = document.getElementById("bgm-volume");
      this.controls.sfxVolume = document.getElementById("sfx-volume");
      this.controls.bgmOutput = document.getElementById("bgm-volume-output");
      this.controls.sfxOutput = document.getElementById("sfx-volume-output");
      this.controls.bgmToggle = document.getElementById("bgm-toggle");
      this.controls.sfxToggle = document.getElementById("sfx-toggle");

      document.getElementById("btn-settings-back").addEventListener("click", () => {
        this._click();
        this.screenManager.show(this.backTarget);
      });

      this.controls.bgmVolume.addEventListener("input", () => this._update({ bgmVolume: Number(this.controls.bgmVolume.value) }));
      this.controls.sfxVolume.addEventListener("input", () => this._update({ sfxVolume: Number(this.controls.sfxVolume.value) }));
      this.controls.bgmToggle.addEventListener("click", () => {
        const settings = this.saveManager.loadSettings();
        this._update({ bgmEnabled: !settings.bgmEnabled }, true);
      });
      this.controls.sfxToggle.addEventListener("click", () => {
        const settings = this.saveManager.loadSettings();
        this._update({ sfxEnabled: !settings.sfxEnabled }, true);
      });

      document.querySelectorAll(".language-option").forEach((button) => {
        button.addEventListener("click", () => this.setLocale(button.dataset.locale, true));
      });
      document.querySelectorAll(".theme-dot").forEach((button) => {
        button.addEventListener("click", () => this._update({ theme: button.dataset.themeValue }, true));
      });
      document.getElementById("btn-reset-settings").addEventListener("click", () => {
        this._click();
        const settings = this.saveManager.resetSettings();
        this.applySettings(settings);
        this.sync();
        this.showToast(this.i18n.t("settings.toast.reset"));
      });
      document.getElementById("btn-clear-save").addEventListener("click", () => {
        this._click();
        this.saveManager.clearSave();
        if (this.onSaveCleared) this.onSaveCleared();
        this.showToast(this.i18n.t("settings.toast.clearSave"));
      });

      this.sync();
    }

    open(target) {
      this.backTarget = target || "home";
      this.sync();
      this.screenManager.show("settings");
    }

    setLocale(locale, showToast) {
      this._click();
      this._update({ locale: locale }, showToast);
    }

    sync() {
      const settings = this.saveManager.loadSettings();
      this.controls.bgmVolume.value = settings.bgmVolume;
      this.controls.sfxVolume.value = settings.sfxVolume;
      this._syncSlider(this.controls.bgmVolume, this.controls.bgmOutput, settings.bgmVolume);
      this._syncSlider(this.controls.sfxVolume, this.controls.sfxOutput, settings.sfxVolume);
      this.controls.bgmToggle.setAttribute("aria-checked", String(settings.bgmEnabled));
      this.controls.sfxToggle.setAttribute("aria-checked", String(settings.sfxEnabled));
      document.querySelectorAll("[data-locale]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.locale === settings.locale);
      });
      document.querySelectorAll(".theme-dot").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.themeValue === settings.theme);
      });
    }

    _update(partial, showToast) {
      const current = this.saveManager.loadSettings();
      const settings = this.saveManager.saveSettings(Object.assign({}, current, partial));
      this.applySettings(settings);
      this.sync();
      if (showToast) this.showToast(this.i18n.t("settings.toast.saved"));
    }

    _syncSlider(slider, output, value) {
      const percent = Math.round(Number(value) * 100);
      slider.style.setProperty("--value", percent + "%");
      output.textContent = percent + "%";
    }

    _click() {
      if (this.sfx) this.sfx.playClick();
    }
  }

  window.EAE.SettingsUI = SettingsUI;
})();
