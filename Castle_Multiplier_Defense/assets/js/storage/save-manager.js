(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});
  var C = cg.Constants;
  var Save = (cg.SaveManager = {});

  function store() {
    try {
      return window.localStorage;
    } catch (error) {
      return null;
    }
  }
  function blank() {
    return {
      version: C.SAVE_VERSION,
      updatedAt: 0,
      level: 1,
      unlockedLevels: 1,
      unlockedThemes: ["default", "ocean", "kawaii"],
      difficulty: "normal",
      playerStats: {
        hp: C.PLAYER_BASE_HP,
        attack: C.PLAYER_BASE_ATTACK,
        defense: C.PLAYER_BASE_DEFENSE,
        criticalRate: C.PLAYER_CRITICAL_RATE,
      },
      lastResult: null,
    };
  }
  function migrate(value) {
    if (!value || typeof value !== "object") return null;
    var result = Object.assign(blank(), value);
    result.version = C.SAVE_VERSION;
    result.level = Math.max(1, Math.floor(Number(result.level) || 1));
    result.unlockedLevels = Math.max(
      result.level,
      Math.floor(Number(result.unlockedLevels) || result.level),
    );
    result.unlockedThemes = Array.isArray(result.unlockedThemes)
      ? result.unlockedThemes.slice()
      : blank().unlockedThemes;
    result.difficulty =
      ["easy", "normal", "hard"].indexOf(result.difficulty) >= 0
        ? result.difficulty
        : "normal";
    result.playerStats = Object.assign(
      blank().playerStats,
      result.playerStats || {},
    );
    return result;
  }
  Save.load = function () {
    var local = store();
    if (!local) return null;
    var raw = local.getItem(C.SAVE_KEY);
    if (!raw) return null;
    var parsed = cg.Utils.safeJsonParse(raw);
    var result = migrate(parsed);
    if (!result) {
      root.GameState.saveCorrupted = true;
      try {
        local.removeItem(C.SAVE_KEY);
      } catch (error) {
        /* ignore storage cleanup failure */
      }
    }
    return result;
  };
  Save.createNew = function (difficulty) {
    var result = blank();
    result.difficulty = difficulty || "normal";
    result.updatedAt = Date.now();
    return result;
  };
  Save.write = function (value) {
    var result = migrate(value) || blank();
    result.updatedAt = Date.now();
    try {
      var local = store();
      if (local) local.setItem(C.SAVE_KEY, JSON.stringify(result));
    } catch (error) {
      /* best effort for private browsing */
    }
    root.GameState.save = result;
    return result;
  };
  Save.recordBattle = function (outcome, level, stats) {
    var current =
      migrate(root.GameState.save) ||
      Save.createNew(root.GameState.settings.difficulty);
    current.difficulty = root.GameState.settings.difficulty;
    current.lastResult = {
      outcome: outcome,
      level: level,
      stats: Object.assign({}, stats),
      at: Date.now(),
    };
    if (outcome === "win") {
      current.level = Math.max(current.level, level + 1);
      current.unlockedLevels = Math.max(current.unlockedLevels, level + 1);
      if (level >= 3 && current.unlockedThemes.indexOf("sunset") < 0)
        current.unlockedThemes.push("sunset");
      if (level >= 5 && current.unlockedThemes.indexOf("forest") < 0)
        current.unlockedThemes.push("forest");
      if (level >= 7 && current.unlockedThemes.indexOf("night") < 0)
        current.unlockedThemes.push("night");
    } else {
      current.level = Math.max(1, level);
    }
    current.playerStats = Object.assign({}, current.playerStats, {
      hp: C.PLAYER_BASE_HP,
    });
    return Save.write(current);
  };
  Save.reset = function () {
    try {
      var local = store();
      if (local) local.removeItem(C.SAVE_KEY);
    } catch (error) {
      /* ignore */
    }
    root.GameState.save = null;
    return null;
  };
  Save.hasValidSave = function () {
    return !!migrate(root.GameState.save);
  };
  Save.blank = blank;
})(window);
