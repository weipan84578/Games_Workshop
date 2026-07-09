(function exposeStorage(root, factory) {
  var api = factory(root);
  root.BBQ = root.BBQ || {};
  root.BBQ.StorageManager = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis, function storageFactory(root) {
  "use strict";

  var SETTINGS_KEY = "bbq.party.settings.v1";
  var GAME_KEY = "bbq.party.save.v1";
  var memoryStore = {};

  var DEFAULT_SETTINGS = Object.freeze({
    language: "zh-Hant",
    theme: "classic",
    bgmVolume: 0.08,
    sfxVolume: 0.72,
    largeText: false,
    highContrast: false
  });

  function getStore() {
    try {
      if (root.localStorage) {
        var probe = "__bbq_probe__";
        root.localStorage.setItem(probe, "1");
        root.localStorage.removeItem(probe);
        return root.localStorage;
      }
    } catch (error) {
      // Private browsing and locked environments can reject localStorage.
    }

    return {
      getItem: function getItem(key) {
        return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
      },
      setItem: function setItem(key, value) {
        memoryStore[key] = String(value);
      },
      removeItem: function removeItem(key) {
        delete memoryStore[key];
      }
    };
  }

  function readJson(key, fallback) {
    try {
      var value = getStore().getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    getStore().setItem(key, JSON.stringify(value));
    return value;
  }

  function clampNumber(value, min, max, fallback) {
    var number = Number(value);
    if (!Number.isFinite(number)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, number));
  }

  function normalizeSettings(settings) {
    var next = Object.assign({}, DEFAULT_SETTINGS, settings || {});
    var validThemes = ["classic", "pastel", "night", "ocean"];
    var validLanguages = ["zh-Hant", "en", "ja"];

    if (validThemes.indexOf(next.theme) === -1) {
      next.theme = DEFAULT_SETTINGS.theme;
    }

    if (validLanguages.indexOf(next.language) === -1) {
      next.language = DEFAULT_SETTINGS.language;
    }

    next.bgmVolume = clampNumber(next.bgmVolume, 0, 1, DEFAULT_SETTINGS.bgmVolume);
    next.sfxVolume = clampNumber(next.sfxVolume, 0, 1, DEFAULT_SETTINGS.sfxVolume);
    next.largeText = Boolean(next.largeText);
    next.highContrast = Boolean(next.highContrast);
    return next;
  }

  function getSettings() {
    return normalizeSettings(readJson(SETTINGS_KEY, DEFAULT_SETTINGS));
  }

  function saveSettings(settings) {
    return writeJson(SETTINGS_KEY, normalizeSettings(settings));
  }

  function loadGame() {
    var data = readJson(GAME_KEY, null);
    if (!data || data.version !== 1) {
      return null;
    }
    return data;
  }

  function saveGame(data) {
    if (!data || typeof data !== "object") {
      return null;
    }
    return writeJson(GAME_KEY, Object.assign({}, data, {
      version: 1,
      savedAt: Date.now()
    }));
  }

  function hasSaveGame() {
    return Boolean(loadGame());
  }

  function clearGame() {
    getStore().removeItem(GAME_KEY);
  }

  function resetAll() {
    getStore().removeItem(GAME_KEY);
    getStore().removeItem(SETTINGS_KEY);
  }

  return {
    DEFAULT_SETTINGS: DEFAULT_SETTINGS,
    SETTINGS_KEY: SETTINGS_KEY,
    GAME_KEY: GAME_KEY,
    getSettings: getSettings,
    saveSettings: saveSettings,
    loadGame: loadGame,
    saveGame: saveGame,
    hasSaveGame: hasSaveGame,
    clearGame: clearGame,
    resetAll: resetAll,
    normalizeSettings: normalizeSettings
  };
});
