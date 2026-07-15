(function (Game) {
  "use strict";
  var KEY = "djgame.save.v1";
  var PLATFORM_TYPES = [
    "normal",
    "moving",
    "brittle",
    "spring",
    "vanishing",
    "cloud",
    "spike",
  ];
  var ITEM_TYPES = [
    "star",
    "spring",
    "rocket",
    "shield",
    "magnet",
    "slow",
    "lucky",
  ];
  var ENEMY_TYPES = ["monster", "flyer", "hole"];
  var ENVIRONMENTS = ["morning", "sky", "sunset", "night"];

  function isFiniteObject(value, keys) {
    return (
      Game.Validation.isPlainObject(value) &&
      keys.every(function (key) {
        return Game.Validation.finite(value[key]);
      })
    );
  }

  function validId(value) {
    return Game.Validation.string(value, 100) && value.length > 0;
  }

  function validBuffs(value) {
    return (
      isFiniteObject(value, [
        "springUses",
        "rocket",
        "shield",
        "magnet",
        "slow",
        "lucky",
      ]) &&
      Object.keys(value).every(function (key) {
        return Game.Validation.finite(value[key], 0, 3600);
      })
    );
  }

  function validPlayer(value) {
    return (
      isFiniteObject(value, [
        "x",
        "y",
        "previousX",
        "previousY",
        "width",
        "height",
        "vx",
        "vy",
        "facing",
        "squash",
        "invulnerable",
        "hurtTimer",
      ]) &&
      value.width > 0 &&
      value.height > 0 &&
      typeof value.grounded === "boolean" &&
      validBuffs(value.buffs)
    );
  }

  function validPlatform(value) {
    return (
      validId(value && value.id) &&
      isFiniteObject(value, [
        "x",
        "y",
        "width",
        "height",
        "baseX",
        "baseY",
        "phase",
        "speed",
        "breakTimer",
        "vanishTimer",
      ]) &&
      value.width > 0 &&
      value.height > 0 &&
      Game.Validation.oneOf(value.type, PLATFORM_TYPES) &&
      typeof value.active === "boolean" &&
      typeof value.touched === "boolean" &&
      Game.Validation.string(value.color, 40) &&
      value.color.length > 0
    );
  }

  function validItem(value) {
    return (
      validId(value && value.id) &&
      isFiniteObject(value, [
        "x",
        "y",
        "width",
        "height",
        "phase",
        "baseY",
      ]) &&
      value.width > 0 &&
      value.height > 0 &&
      Game.Validation.oneOf(value.type, ITEM_TYPES) &&
      typeof value.active === "boolean"
    );
  }

  function validEnemy(value) {
    return (
      validId(value && value.id) &&
      isFiniteObject(value, [
        "x",
        "y",
        "width",
        "height",
        "baseX",
        "baseY",
        "phase",
        "direction",
        "warning",
      ]) &&
      value.width > 0 &&
      value.height > 0 &&
      Game.Validation.oneOf(value.type, ENEMY_TYPES) &&
      typeof value.active === "boolean"
    );
  }

  function validScore(value) {
    if (
      !isFiniteObject(value, [
        "total",
        "height",
        "maxHeight",
        "itemScore",
        "enemyScore",
        "comboScore",
        "milestoneScore",
        "currentCombo",
        "bestCombo",
        "collected",
        "startY",
      ])
    )
      return false;
    if (
      value.comboPeakY !== undefined &&
      value.comboPeakY !== null &&
      !Game.Validation.finite(value.comboPeakY)
    )
      return false;
    if (
      value.lastPlatformId !== null &&
      value.lastPlatformId !== undefined &&
      !validId(value.lastPlatformId)
    )
      return false;
    return (
      Array.isArray(value.reachedMilestones) &&
      value.reachedMilestones.length <= 1000 &&
      value.reachedMilestones.every(function (milestone) {
        return Game.Validation.finite(milestone, 0, 100000000);
      })
    );
  }

  function isValidSave(value) {
    var validCamera = isFiniteObject(value && value.camera, ["y", "previousY"]);
    var validArrays =
      value &&
      Array.isArray(value.platforms) &&
      value.platforms.length <= 40 &&
      value.platforms.every(validPlatform) &&
      Array.isArray(value.items) &&
      value.items.length <= 15 &&
      value.items.every(validItem) &&
      Array.isArray(value.enemies) &&
      value.enemies.length <= 12 &&
      value.enemies.every(validEnemy) &&
      (value.particles === undefined ||
        (Array.isArray(value.particles) && value.particles.length <= 200));

    return (
      Game.Validation.isPlainObject(value) &&
      value.schemaVersion === 1 &&
      Game.Validation.finite(value.seed, 0, 0xffffffff) &&
      (value.rngState === undefined ||
        Game.Validation.finite(value.rngState, 0, 0xffffffff)) &&
      Game.Validation.finite(value.nextId, 0, 100000000) &&
      Game.Validation.finite(value.time, 0, 1000000000000) &&
      validPlayer(value.player) &&
      validCamera &&
      validScore(value.score) &&
      validArrays &&
      typeof value.over === "boolean" &&
      Game.Validation.string(value.reason, 50) &&
      Game.Validation.oneOf(value.environment, ENVIRONMENTS) &&
      (value.trackIndex === undefined ||
        Game.Validation.finite(value.trackIndex, 0, 2)) &&
      (value.lastSavedHeight === undefined ||
        Game.Validation.finite(value.lastSavedHeight, 0, 100000000)) &&
      (value.lastSaveAt === undefined ||
        Game.Validation.finite(value.lastSaveAt, 0, 1000000000000000))
    );
  }

  function checkpointFor(state) {
    var height = state && state.score ? state.score.maxHeight : 0;
    return Math.floor(Math.max(0, height) / 100) * 100;
  }

  function shouldAutoSave(state, now) {
    if (!state || !state.score || state.over) return false;
    var checkpoint = checkpointFor(state);
    var savedHeight = Number(state.lastSavedHeight) || 0;
    if (checkpoint < savedHeight + 100) return false;
    var lastSaveAt = Number(state.lastSaveAt) || 0;
    if (!lastSaveAt || now < lastSaveAt) return true;
    return now - lastSaveAt >= Game.Constants.SAVE_INTERVAL_MS;
  }

  function markSaved(state, now) {
    state.lastSavedHeight = Math.max(
      Number(state.lastSavedHeight) || 0,
      checkpointFor(state),
    );
    state.lastSaveAt = Math.max(0, Number(now) || Game.now());
    return state;
  }
  Game.SaveStore = Object.freeze({
    key: KEY,
    isValid: isValidSave,
    shouldAutoSave: shouldAutoSave,
    markSaved: markSaved,
    load: function () {
      var result = Game.Storage.read(KEY, isValidSave, null);
      return result.value;
    },
    save: function (snapshot) {
      if (!isValidSave(snapshot)) return { ok: false, invalid: true };
      return Game.Storage.write(KEY, snapshot);
    },
    clear: function () {
      return Game.Storage.remove(KEY);
    },
    has: function () {
      return Boolean(this.load());
    },
  });
})(window.DJGame);
