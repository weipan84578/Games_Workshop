window.YZ = window.YZ || {};

YZ.Save = (function () {
  var keys = YZ.Constants.STORAGE_KEYS;

  function storageAvailable() {
    try {
      var test = "__yz_test__";
      localStorage.setItem(test, "1");
      localStorage.removeItem(test);
      return true;
    } catch (err) {
      return false;
    }
  }

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      return false;
    }
  }

  function safeRemove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      return false;
    }
  }

  function saveGame(state) {
    var payload = state || (YZ.State && YZ.State.serialize());
    if (!payload || payload.turn === "result") return false;
    payload.savedAt = Date.now();
    return safeSet(keys.game, JSON.stringify(payload));
  }

  function loadGame() {
    var raw = safeGet(keys.game);
    if (!raw) return null;
    try {
      var parsed = JSON.parse(raw);
      if (parsed.version !== YZ.Constants.VERSION) return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function exists() {
    return !!loadGame();
  }

  function clearGame() {
    return safeRemove(keys.game);
  }

  function prefKey(name) {
    return keys.prefPrefix + name;
  }

  function savePref(name, value) {
    return safeSet(prefKey(name), JSON.stringify(value));
  }

  function loadPref(name) {
    var raw = safeGet(prefKey(name));
    if (raw === null) return null;
    try {
      return JSON.parse(raw);
    } catch (err) {
      return raw;
    }
  }

  return {
    storageAvailable: storageAvailable,
    saveGame: saveGame,
    loadGame: loadGame,
    exists: exists,
    clearGame: clearGame,
    savePref: savePref,
    loadPref: loadPref
  };
})();
