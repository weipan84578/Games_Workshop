(function () {
  "use strict";

  var PREFIX = "asteroids.";
  var settingsKey = PREFIX + "settings";
  var highscoreKey = PREFIX + "highscore";
  var saveKey = PREFIX + "save";

  var defaults = {
    theme: "neon",
    musicVolume: 60,
    sfxVolume: 80,
    muted: false,
    particles: true,
    screenShake: true,
    showFps: false,
    touchLayout: "default",
    touchOpacity: 70,
    startLives: 3
  };

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  Game.Storage = {
    defaults: defaults,

    loadSettings: function () {
      return Object.assign({}, defaults, readJson(settingsKey, {}));
    },

    saveSettings: function (settings) {
      return writeJson(settingsKey, Object.assign({}, defaults, settings));
    },

    getHighscore: function () {
      var value = Number(localStorage.getItem(highscoreKey));
      return Number.isFinite(value) ? value : 0;
    },

    setHighscore: function (score) {
      try {
        localStorage.setItem(highscoreKey, String(Math.max(0, Math.floor(score))));
      } catch (error) {
        return false;
      }
      return true;
    },

    loadSave: function () {
      return readJson(saveKey, null);
    },

    saveGame: function (snapshot) {
      return writeJson(saveKey, Object.assign({}, snapshot, { timestamp: Date.now() }));
    },

    clearSave: function () {
      try {
        localStorage.removeItem(saveKey);
      } catch (error) {
        return false;
      }
      return true;
    }
  };
}());
