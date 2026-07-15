(function (Game) {
  "use strict";
  var memory = Object.create(null);
  var storage = null;
  var storageAvailable = false;
  try {
    storage = window.localStorage;
    var probe = "__djgame_probe__";
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    storageAvailable = true;
  } catch (error) {
    storageAvailable = false;
  }
  function getRaw(key) {
    try {
      return storageAvailable ? storage.getItem(key) : memory[key] || null;
    } catch (error) {
      return memory[key] || null;
    }
  }
  function setRaw(key, value) {
    try {
      if (storageAvailable) storage.setItem(key, value);
      else memory[key] = value;
      return true;
    } catch (error) {
      memory[key] = value;
      return false;
    }
  }
  Game.Storage = Object.freeze({
    available: function () {
      return storageAvailable;
    },
    read: function (key, validator, fallback) {
      var raw = getRaw(key);
      if (!raw) return { ok: true, value: fallback, missing: true };
      try {
        var value = JSON.parse(raw);
        if (validator && !validator(value))
          return { ok: false, value: fallback, invalid: true };
        return { ok: true, value: value };
      } catch (error) {
        return { ok: false, value: fallback, invalid: true };
      }
    },
    write: function (key, value) {
      try {
        return { ok: setRaw(key, JSON.stringify(value)) };
      } catch (error) {
        return { ok: false, error: error };
      }
    },
    remove: function (key) {
      try {
        if (storageAvailable) storage.removeItem(key);
        delete memory[key];
        return true;
      } catch (error) {
        delete memory[key];
        return false;
      }
    },
    raw: getRaw,
    ownKeys: function () {
      return [
        "djgame.settings.v1",
        "djgame.save.v1",
        "djgame.leaderboard.v1",
        "djgame.player.v1",
      ];
    },
  });
})(window.DJGame);
