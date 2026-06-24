(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};
  const { DEFAULT_SETTINGS, SETTINGS_KEY, safeStorageGet, safeStorageSet, i18n } = R;

  class SettingsManager {
    constructor() {
      this.settings = { ...DEFAULT_SETTINGS };
      this.load();
    }

    load() {
      const raw = safeStorageGet(SETTINGS_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        this.settings = { ...DEFAULT_SETTINGS, ...parsed };
      } catch {
        this.settings = { ...DEFAULT_SETTINGS };
      }
    }

    save() {
      return safeStorageSet(SETTINGS_KEY, JSON.stringify(this.settings));
    }

    update(key, value) {
      this.settings[key] = value;
      this.apply();
      this.save();
    }

    apply() {
      document.documentElement.dataset.theme = this.settings.theme;
      i18n.setLang(this.settings.language);
    }
  }

  Object.assign(R, { SettingsManager });
})();
