(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};
  var storageAvailable = true;

  function defaultData() {
    return {
      version: 1,
      settings: {
        bgmVolume: 90,
        sfxVolume: 100,
        muted: false,
        theme: app.Config.defaultTheme,
        language: app.Config.defaultLanguage
      },
      progression: {
        unlockedLevel: 1,
        stars: {},
        bestTimes: {}
      },
      activeBattle: null
    };
  }

  function readRaw() {
    if (!storageAvailable) {
      return null;
    }
    try {
      return global.localStorage.getItem(app.Config.storageKey);
    } catch (error) {
      storageAvailable = false;
      return null;
    }
  }

  function writeData(data) {
    try {
      global.localStorage.setItem(app.Config.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      storageAvailable = false;
      return false;
    }
  }

  function mergeData(source) {
    var base = defaultData();
    if (!source || typeof source !== "object") {
      return base;
    }
    base.settings = Object.assign(base.settings, source.settings || {});
    base.progression = Object.assign(base.progression, source.progression || {});
    base.progression.stars = Object.assign({}, source.progression && source.progression.stars || {});
    base.progression.bestTimes = Object.assign({}, source.progression && source.progression.bestTimes || {});
    base.activeBattle = source.activeBattle || null;
    return base;
  }

  function loadGame() {
    var raw = readRaw();
    if (!raw) {
      return defaultData();
    }
    try {
      return mergeData(JSON.parse(raw));
    } catch (error) {
      return defaultData();
    }
  }

  function saveGame(data) {
    var merged = mergeData(data);
    writeData(merged);
    return merged;
  }

  function saveSettings(settings) {
    var data = loadGame();
    data.settings = Object.assign(data.settings, settings || {});
    saveGame(data);
    app.events.emit("save:settings", data.settings);
    return data.settings;
  }

  function saveBattle(snapshot) {
    var data = loadGame();
    data.activeBattle = snapshot ? app.utils.clone(snapshot) : null;
    saveGame(data);
    app.events.emit("save:battle", data.activeBattle);
    return data;
  }

  function completeLevel(levelId, stars, remainingTime) {
    var data = loadGame();
    var currentStars = Number(data.progression.stars[levelId] || 0);
    data.progression.stars[levelId] = Math.max(currentStars, Number(stars || 0));
    if (remainingTime !== undefined) {
      var previousBest = Number(data.progression.bestTimes[levelId] || 0);
      data.progression.bestTimes[levelId] = Math.max(previousBest, Math.round(remainingTime));
    }
    data.progression.unlockedLevel = Math.max(data.progression.unlockedLevel, Number(levelId) + 1);
    data.activeBattle = null;
    saveGame(data);
    app.events.emit("save:complete", data.progression);
    return data;
  }

  function clearSave() {
    var data = loadGame();
    data.progression = defaultData().progression;
    data.activeBattle = null;
    saveGame(data);
    app.events.emit("save:cleared", data.progression);
    return data;
  }

  app.SaveManager = {
    loadGame: loadGame,
    saveGame: saveGame,
    saveSettings: saveSettings,
    saveBattle: saveBattle,
    completeLevel: completeLevel,
    clearSave: clearSave,
    getSettings: function () { return loadGame().settings; },
    getProgression: function () { return loadGame().progression; },
    getActiveBattle: function () { return loadGame().activeBattle; },
    hasSave: function () {
      var data = loadGame();
      return Boolean(data.activeBattle || data.progression.unlockedLevel > 1 || Object.keys(data.progression.stars).length);
    },
    isStorageAvailable: function () { return storageAvailable; }
  };
})(window);
