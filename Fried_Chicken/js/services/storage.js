(function (global) {
  "use strict";
  var CCC = global.CCC;
  var u = CCC.utils;

  function defaultRecords() {
    var records = {};
    for (var day = 1; day <= 10; day += 1) {
      records[day] = { stars: 0, revenue: 0, combo: 0 };
    }
    return records;
  }

  function defaultProgress() {
    return {
      version: CCC.SAVE_VERSION,
      highestCompletedDay: 0,
      currentDay: 1,
      coins: 0,
      upgrades: { fryer: 1, prep: 1, counter: 1 },
      unlockedRecipes: ["pepper"],
      records: defaultRecords(),
      tutorialsSeen: {},
      completed: false
    };
  }

  function defaultPreferences() {
    var reduce = false;
    try { reduce = !!global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (_) {}
    return {
      language: null,
      theme: "cream",
      bgmVolume: 70,
      sfxVolume: 80,
      muted: false,
      reduceMotion: reduce,
      fullscreenPreferred: false
    };
  }

  function boundedInt(value, fallback, min, max) {
    return Number.isInteger(value) ? u.clamp(value, min, max) : fallback;
  }

  function sanitizeProgress(raw) {
    var base = defaultProgress();
    if (!raw || typeof raw !== "object") { return base; }
    base.highestCompletedDay = boundedInt(raw.highestCompletedDay, 0, 0, 10);
    base.currentDay = Math.min(10, base.highestCompletedDay + 1);
    base.coins = boundedInt(raw.coins, 0, 0, 99999999);
    ["fryer", "prep", "counter"].forEach(function (id) {
      base.upgrades[id] = boundedInt(raw.upgrades && raw.upgrades[id], 1, 1, 3);
    });
    base.records = defaultRecords();
    Object.keys(base.records).forEach(function (day) {
      var record = raw.records && raw.records[day];
      if (!record || typeof record !== "object") { return; }
      base.records[day] = {
        stars: boundedInt(record.stars, 0, 0, 3),
        revenue: boundedInt(record.revenue, 0, 0, 99999999),
        combo: boundedInt(record.combo, 0, 0, 99999)
      };
    });
    base.tutorialsSeen = raw.tutorialsSeen && typeof raw.tutorialsSeen === "object" ? raw.tutorialsSeen : {};
    base.completed = base.highestCompletedDay >= 10 || raw.completed === true;
    base.unlockedRecipes = CCC.data.recipes.filter(function (recipe) {
      return recipe.unlockDay <= Math.min(10, base.highestCompletedDay + 1);
    }).map(function (recipe) { return recipe.id; });
    return base;
  }

  function sanitizePreferences(raw) {
    var base = defaultPreferences();
    if (!raw || typeof raw !== "object") { return base; }
    if (["zh-TW", "en", "ja"].indexOf(raw.language) >= 0) { base.language = raw.language; }
    if (["cream", "berry", "mint", "sky"].indexOf(raw.theme) >= 0) { base.theme = raw.theme; }
    base.bgmVolume = boundedInt(raw.bgmVolume, 70, 0, 100);
    base.sfxVolume = boundedInt(raw.sfxVolume, 80, 0, 100);
    base.muted = raw.muted === true;
    base.reduceMotion = raw.reduceMotion === true;
    base.fullscreenPreferred = raw.fullscreenPreferred === true;
    return base;
  }

  function storageWorks() {
    try {
      var key = "__ccc_test__";
      global.localStorage.setItem(key, "1");
      global.localStorage.removeItem(key);
      return true;
    } catch (_) { return false; }
  }

  function read(key) {
    if (!CCC.state.storageAvailable) { return null; }
    try {
      var value = global.localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (_) { return null; }
  }

  function write(key, value) {
    if (!CCC.state.storageAvailable) { return false; }
    try {
      global.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      CCC.state.storageAvailable = false;
      CCC.events.emit("storageerror");
      return false;
    }
  }

  CCC.storage = {
    defaults: { progress: defaultProgress, preferences: defaultPreferences },
    sanitizeProgress: sanitizeProgress,
    sanitizePreferences: sanitizePreferences,
    init: function () {
      CCC.state.storageAvailable = storageWorks();
      CCC.state.progress = sanitizeProgress(read(CCC.config.progressKey));
      CCC.state.preferences = sanitizePreferences(read(CCC.config.preferencesKey));
      return CCC.state.storageAvailable;
    },
    hasProgress: function () { return CCC.state.storageAvailable && CCC.state.progress && CCC.state.progress.highestCompletedDay > 0; },
    saveProgress: function () { return write(CCC.config.progressKey, CCC.state.progress); },
    savePreferences: function () { return write(CCC.config.preferencesKey, CCC.state.preferences); },
    clearProgress: function () {
      CCC.state.progress = defaultProgress();
      if (CCC.state.storageAvailable) {
        try { global.localStorage.removeItem(CCC.config.progressKey); } catch (_) {}
      }
      CCC.events.emit("progresschange", CCC.state.progress);
    },
    resetProgress: function () {
      CCC.state.progress = defaultProgress();
      this.saveProgress();
      CCC.events.emit("progresschange", CCC.state.progress);
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { defaultProgress: defaultProgress, defaultPreferences: defaultPreferences, sanitizeProgress: sanitizeProgress, sanitizePreferences: sanitizePreferences };
  }
}(typeof window !== "undefined" ? window : globalThis));
