(function () {
  const SAVE_KEY = "uno_save_v1";
  const SETTINGS_KEY = "uno_settings_v1";

  const defaultSettings = {
    lang: "zh-TW",
    theme: "classic",
    bgmVolume: 0.35,
    sfxVolume: 0.7,
    difficulty: "normal",
  };

  function readJson(key) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Unable to read localStorage", error);
      return null;
    }
  }

  function writeJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("Unable to write localStorage", error);
      return false;
    }
  }

  const UnoStorage = {
    SAVE_KEY,
    SETTINGS_KEY,
    defaultSettings,

    getSettings() {
      return Object.assign({}, defaultSettings, readJson(SETTINGS_KEY) || {});
    },

    saveSettings(nextSettings) {
      const merged = Object.assign({}, this.getSettings(), nextSettings || {});
      writeJson(SETTINGS_KEY, merged);
      return merged;
    },

    saveGame(state) {
      if (!state) return false;
      const payload = Helpers.deepClone(state);
      payload.version = "1.0.0";
      payload.savedAt = new Date().toISOString();
      return writeJson(SAVE_KEY, payload);
    },

    loadGame() {
      const payload = readJson(SAVE_KEY);
      if (!payload || payload.version !== "1.0.0") return null;
      if (!Array.isArray(payload.deck) || !Array.isArray(payload.playerHand) || !Array.isArray(payload.aiHand)) {
        return null;
      }
      return payload;
    },

    hasSave() {
      return Boolean(this.loadGame());
    },

    clearSave() {
      try {
        window.localStorage.removeItem(SAVE_KEY);
      } catch (error) {
        console.warn("Unable to clear save", error);
      }
    },
  };

  window.UnoStorage = UnoStorage;
})();
