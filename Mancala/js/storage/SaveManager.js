(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};
  var SAVE_KEY = "mancala_save";
  var SETTINGS_KEY = "mancala_settings";

  var DEFAULT_SETTINGS = {
    version: "1.0.0",
    musicVolume: 0.5,
    sfxVolume: 0.7,
    isMusicMuted: false,
    isSfxMuted: false,
    theme: "classic",
    language: "zh-Hant",
    showTimer: true,
    defaultDifficulty: "normal",
    initialStones: 4
  };

  function SaveManager(storage) {
    this.storage = storage || global.localStorage;
  }

  SaveManager.prototype.loadSettings = function() {
    var saved = readJson(this.storage, SETTINGS_KEY);
    return merge(DEFAULT_SETTINGS, saved || {});
  };

  SaveManager.prototype.saveSettings = function(settings) {
    this.storage.setItem(SETTINGS_KEY, JSON.stringify(merge(DEFAULT_SETTINGS, settings || {})));
  };

  SaveManager.prototype.saveGame = function(gameState) {
    if (!gameState || gameState.isGameOver) {
      this.clearGame();
      return;
    }
    this.storage.setItem(SAVE_KEY, JSON.stringify(gameState.toJSON()));
  };

  SaveManager.prototype.loadGame = function() {
    return readJson(this.storage, SAVE_KEY);
  };

  SaveManager.prototype.hasSave = function() {
    return Boolean(this.loadGame());
  };

  SaveManager.prototype.clearGame = function() {
    this.storage.removeItem(SAVE_KEY);
  };

  SaveManager.prototype.formatSaveTime = function(saveData) {
    if (!saveData || !saveData.timestamp) {
      return "";
    }
    var date = new Date(saveData.timestamp);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    var pad = function(value) {
      return String(value).padStart(2, "0");
    };
    return date.getFullYear() + "-" +
      pad(date.getMonth() + 1) + "-" +
      pad(date.getDate()) + " " +
      pad(date.getHours()) + ":" +
      pad(date.getMinutes());
  };

  function readJson(storage, key) {
    try {
      var raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function merge(base, override) {
    var result = {};
    Object.keys(base).forEach(function(key) {
      result[key] = base[key];
    });
    Object.keys(override || {}).forEach(function(key) {
      result[key] = override[key];
    });
    result.musicVolume = clamp(Number(result.musicVolume), 0, 1);
    result.sfxVolume = clamp(Number(result.sfxVolume), 0, 1);
    result.initialStones = Math.min(6, Math.max(3, Number(result.initialStones) || 4));
    if (["easy", "normal", "hard"].indexOf(result.defaultDifficulty) === -1) {
      result.defaultDifficulty = "normal";
    }
    if (["classic", "ocean", "forest", "sunset", "night", "candy"].indexOf(result.theme) === -1) {
      result.theme = "classic";
    }
    if (["zh-Hant", "en", "ja"].indexOf(result.language) === -1) {
      result.language = "zh-Hant";
    }
    return result;
  }

  function clamp(value, min, max) {
    if (Number.isNaN(value)) {
      return min;
    }
    return Math.min(max, Math.max(min, value));
  }

  Mancala.SaveManager = SaveManager;
})(window);
