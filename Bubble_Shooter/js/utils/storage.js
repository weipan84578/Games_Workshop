(function (BS) {
  var prefix = "bubbleShooter.";
  var memory = {};
  var available = false;

  try {
    var probe = prefix + "probe";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    available = true;
  } catch (error) {
    available = false;
  }

  function read(key) {
    if (available) {
      return window.localStorage.getItem(prefix + key);
    }
    return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null;
  }

  function write(key, value) {
    if (available) {
      window.localStorage.setItem(prefix + key, value);
    } else {
      memory[key] = value;
    }
  }

  function remove(key) {
    if (available) {
      window.localStorage.removeItem(prefix + key);
    } else {
      delete memory[key];
    }
  }

  BS.Storage = {
    get: function (key, fallback) {
      try {
        var raw = read(key);
        if (raw === null || raw === undefined) {
          return fallback;
        }
        return JSON.parse(raw);
      } catch (error) {
        return fallback;
      }
    },

    set: function (key, value) {
      try {
        write(key, JSON.stringify(value));
        return true;
      } catch (error) {
        return false;
      }
    },

    remove: function (key) {
      try {
        remove(key);
      } catch (error) {
        memory[key] = null;
      }
    },

    getSettings: function () {
      var defaults = {
        theme: "classic",
        difficulty: "normal",
        bgmVolume: 0.45,
        sfxVolume: 0.9,
        muted: false
      };
      var settings = this.get("settings", {});

      return {
        theme: settings.theme || defaults.theme,
        difficulty: settings.difficulty || defaults.difficulty,
        bgmVolume: typeof settings.bgmVolume === "number" ? settings.bgmVolume : defaults.bgmVolume,
        sfxVolume: typeof settings.sfxVolume === "number" ? settings.sfxVolume : defaults.sfxVolume,
        muted: typeof settings.muted === "boolean" ? settings.muted : defaults.muted
      };
    },

    saveSettings: function (settings) {
      return this.set("settings", settings);
    },

    loadGame: function () {
      return this.get("saveGame", null);
    },

    saveGame: function (state) {
      return this.set("saveGame", state);
    },

    clearGame: function () {
      this.remove("saveGame");
    },

    hasSavedGame: function () {
      return !!this.loadGame();
    },

    getHighScore: function () {
      return this.get("highScore", 0) || 0;
    },

    setHighScore: function (score) {
      var value = Math.max(this.getHighScore(), score || 0);
      this.set("highScore", value);
      return value;
    }
  };
})(window.BubbleShooter);
