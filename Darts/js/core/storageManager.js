(function () {
  "use strict";

  window.Darts = window.Darts || {};

  var SETTINGS_KEY = "darts.settings.v1";
  var SAVE_KEY = "darts.save.v1";

  var defaultSettings = {
    language: "zh-TW",
    theme: "classic",
    bgmEnabled: true,
    sfxEnabled: true,
    bgmVolume: 6,
    sfxVolume: 7,
    animation: true,
    aiCount: 1,
    aiDifficulty: "normal",
    mode: "501",
    startScore: 501
  };

  function safeRead(key) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Unable to read localStorage key:", key, error);
      return null;
    }
  }

  function safeWrite(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("Unable to write localStorage key:", key, error);
      return false;
    }
  }

  function safeRemove(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn("Unable to remove localStorage key:", key, error);
      return false;
    }
  }

  function clampNumber(value, min, max, fallback) {
    var parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, parsed));
  }

  function normalizeSettings(input) {
    var settings = Object.assign({}, defaultSettings, input || {});
    if (typeof settings.aiCount === "undefined" && typeof settings.playerCount !== "undefined") {
      settings.aiCount = clampNumber(Number(settings.playerCount) - 1, 1, 3, defaultSettings.aiCount);
    }
    settings.aiCount = clampNumber(settings.aiCount, 1, 3, defaultSettings.aiCount);
    settings.bgmVolume = clampNumber(settings.bgmVolume, 0, 10, defaultSettings.bgmVolume);
    settings.sfxVolume = clampNumber(settings.sfxVolume, 0, 10, defaultSettings.sfxVolume);
    if (["501", "301", "701", "cricket", "around"].indexOf(settings.mode) === -1) {
      settings.mode = defaultSettings.mode;
    }
    if (settings.mode === "701") {
      settings.startScore = 701;
    } else if (settings.mode === "301") {
      settings.startScore = 301;
    } else {
      settings.startScore = 501;
    }
    if (["classic", "neon", "sakura", "dark"].indexOf(settings.theme) === -1) {
      settings.theme = defaultSettings.theme;
    }
    if (["zh-TW", "en-US", "ja-JP"].indexOf(settings.language) === -1) {
      settings.language = defaultSettings.language;
    }
    if (["easy", "normal", "hard"].indexOf(settings.aiDifficulty) === -1) {
      settings.aiDifficulty = defaultSettings.aiDifficulty;
    }
    settings.bgmEnabled = Boolean(settings.bgmEnabled);
    settings.sfxEnabled = Boolean(settings.sfxEnabled);
    settings.animation = Boolean(settings.animation);
    settings.playerCount = settings.aiCount + 1;
    return settings;
  }

  window.Darts.Storage = {
    defaults: defaultSettings,
    getSettings: function () {
      return normalizeSettings(safeRead(SETTINGS_KEY));
    },
    saveSettings: function (patch) {
      var next = normalizeSettings(Object.assign({}, this.getSettings(), patch || {}));
      safeWrite(SETTINGS_KEY, next);
      return next;
    },
    getSave: function () {
      var save = safeRead(SAVE_KEY);
      if (!save || !save.version || !save.players || !save.mode) {
        return null;
      }
      return save;
    },
    saveGame: function (gameState) {
      if (!gameState) {
        return false;
      }
      var snapshot = JSON.parse(JSON.stringify(gameState));
      snapshot.updatedAt = new Date().toISOString();
      return safeWrite(SAVE_KEY, snapshot);
    },
    clearSave: function () {
      return safeRemove(SAVE_KEY);
    }
  };
})();
