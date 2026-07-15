(function (Game) {
  "use strict";
  var KEY = "djgame.save.v1";
  function isFiniteObject(value, keys) {
    return (
      Game.Validation.isPlainObject(value) &&
      keys.every(function (key) {
        return Game.Validation.finite(value[key]);
      })
    );
  }

  function isValidSave(value) {
    var validPlayer = isFiniteObject(value && value.player, [
      "x",
      "y",
      "previousX",
      "previousY",
      "width",
      "height",
      "vx",
      "vy",
    ]);
    var validCamera = isFiniteObject(value && value.camera, ["y", "previousY"]);
    var validScore = isFiniteObject(value && value.score, [
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
    ]);
    var validArrays =
      value &&
      Array.isArray(value.platforms) &&
      value.platforms.length <= 40 &&
      Array.isArray(value.items) &&
      value.items.length <= 15 &&
      Array.isArray(value.enemies) &&
      value.enemies.length <= 12;

    return (
      Game.Validation.isPlainObject(value) &&
      value.schemaVersion === 1 &&
      Game.Validation.finite(value.seed, 0) &&
      validPlayer &&
      validCamera &&
      validScore &&
      validArrays
    );
  }
  Game.SaveStore = Object.freeze({
    key: KEY,
    isValid: isValidSave,
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
