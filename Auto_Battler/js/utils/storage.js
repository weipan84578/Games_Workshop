(function (root) {
  "use strict";

  root.AutoBattler = root.AutoBattler || {};

  var memoryFallback = {};

  function readRaw(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return Object.prototype.hasOwnProperty.call(memoryFallback, key) ? memoryFallback[key] : null;
    }
  }

  function writeRaw(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      memoryFallback[key] = value;
    }
  }

  function remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      delete memoryFallback[key];
    }
  }

  root.AutoBattler.Storage = {
    SAVE_KEY: "autobattler_save",
    SETTINGS_KEY: "autobattler_settings",
    save: function (key, value) {
      writeRaw(key, JSON.stringify(value));
      return true;
    },
    load: function (key, fallback) {
      var raw = readRaw(key);
      if (!raw) return fallback;
      try {
        return JSON.parse(raw);
      } catch (error) {
        return fallback;
      }
    },
    remove: remove,
    has: function (key) {
      return readRaw(key) !== null;
    }
  };
}(window));
