(function (window) {
  'use strict';

  const DEFAULTS = {
    bgmVolume: 60,
    sfxVolume: 75,
    lang: 'zh-TW',
    muted: false
  };

  const SettingsUI = {
    settings: { ...DEFAULTS },
    confirmTimer: 0,

    load() {
      this.settings = { ...DEFAULTS, ...Storage.get('settings', {}) };
      return { ...this.settings };
    },

    save(settings) {
      this.settings = { ...DEFAULTS, ...settings };
      Storage.set('settings', this.settings);
      this.syncControls();
      return { ...this.settings };
    },

    init(onChange) {
      this.onChange = onChange;
      this.bgm = Helpers.qs('#bgm-volume');
      this.sfx = Helpers.qs('#sfx-volume');
      this.bgmOut = Helpers.qs('#bgm-output');
      this.sfxOut = Helpers.qs('#sfx-output');
      this.resetButton = Helpers.qs('#reset-data-btn');
      this.load();
      this.syncControls();

      this.bgm.addEventListener('input', () => this.updateFromControls());
      this.sfx.addEventListener('input', () => this.updateFromControls());
      Helpers.qsa('[data-lang]').forEach((button) => {
        button.addEventListener('click', () => {
          this.settings.lang = button.dataset.lang;
          this.save(this.settings);
          I18n.setLang(button.dataset.lang);
          this.emit();
        });
      });
      this.resetButton.addEventListener('click', () => this.handleReset());
    },

    updateFromControls() {
      this.settings.bgmVolume = Number(this.bgm.value);
      this.settings.sfxVolume = Number(this.sfx.value);
      Storage.set('settings', this.settings);
      this.syncControls();
      this.emit();
    },

    syncControls() {
      if (!this.bgm || !this.sfx) return;
      this.bgm.value = this.settings.bgmVolume;
      this.sfx.value = this.settings.sfxVolume;
      this.bgmOut.textContent = `${this.settings.bgmVolume}%`;
      this.sfxOut.textContent = `${this.settings.sfxVolume}%`;
      Helpers.qsa('[data-lang]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.lang === this.settings.lang);
      });
    },

    emit() {
      this.onChange?.({ ...this.settings });
    },

    handleReset() {
      if (!this.resetButton.classList.contains('is-confirming')) {
        this.resetButton.classList.add('is-confirming');
        this.resetButton.textContent = I18n.t('settings.confirmReset');
        window.clearTimeout(this.confirmTimer);
        this.confirmTimer = window.setTimeout(() => {
          this.resetButton.classList.remove('is-confirming');
          this.resetButton.textContent = I18n.t('settings.reset');
        }, 2000);
        return;
      }

      Storage.clear();
      this.settings = { ...DEFAULTS };
      Storage.set('settings', this.settings);
      I18n.setLang(this.settings.lang);
      this.syncControls();
      this.resetButton.classList.remove('is-confirming');
      this.resetButton.textContent = I18n.t('settings.reset');
      Leaderboard.render();
      ScreenManager.toast(I18n.t('settings.resetDone'));
      this.emit();
      window.dispatchEvent(new CustomEvent('settings:cleared'));
    }
  };

  window.SettingsUI = SettingsUI;
})(window);
