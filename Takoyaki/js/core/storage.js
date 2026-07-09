(function registerStorage(app) {
  "use strict";

  const keys = app.Config.storageKeys;

  function readJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      return false;
    }
    return true;
  }

  app.Storage = {
    getSettings() {
      return {
        ...app.Config.defaultSettings,
        ...readJson(keys.settings, {})
      };
    },

    saveSettings(settings) {
      return writeJson(keys.settings, {
        ...app.Config.defaultSettings,
        ...settings
      });
    },

    resetSettings() {
      return remove(keys.settings);
    },

    getProgress() {
      return readJson(keys.progress, null);
    },

    hasProgress() {
      return Boolean(this.getProgress());
    },

    saveProgress(progress) {
      return writeJson(keys.progress, {
        ...progress,
        savedAt: new Date().toISOString()
      });
    },

    clearProgress() {
      return remove(keys.progress);
    },

    getFlags() {
      return readJson(keys.flags, {});
    },

    setFlag(flag, value) {
      const flags = this.getFlags();
      flags[flag] = value;
      return writeJson(keys.flags, flags);
    }
  };
})(window.Takoyaki = window.Takoyaki || {});
