(function (Game) {
  "use strict";
  var KEY = "djgame.settings.v1";
  var defaults = {
    schemaVersion: 1,
    language: "zh-TW",
    theme: "pastel-sky",
    audio: { master: 70, bgm: 55, sfx: 75, muted: false, track: "auto" },
    controls: {
      swapTouchButtons: false,
      tiltEnabled: false,
      tiltSensitivity: 3,
      leftKey: "ArrowLeft",
      rightKey: "ArrowRight",
      pauseKey: "Escape",
    },
    accessibility: {
      highContrast: false,
      reducedMotion: "system",
      particles: "medium",
      screenShake: true,
    },
  };
  function copyDefaults() {
    return Game.clone(defaults);
  }
  function sanitize(value) {
    if (!Game.Validation.isPlainObject(value)) return copyDefaults();
    var result = copyDefaults();
    result.language = Game.Validation.oneOf(value.language, Game.Locales)
      ? value.language
      : result.language;
    result.theme = Game.Validation.oneOf(value.theme, Game.Themes)
      ? value.theme
      : result.theme;
    ["master", "bgm", "sfx"].forEach(function (key) {
      if (Game.Validation.finite(value.audio && value.audio[key])) {
        result.audio[key] = Math.round(
          Game.Math.clamp(value.audio[key], 0, 100),
        );
      }
    });
    result.audio.muted = Boolean(value.audio && value.audio.muted);
    if (
      value.audio &&
      Game.Validation.oneOf(value.audio.track, ["auto", "0", "1", "2", 0, 1, 2])
    )
      result.audio.track = String(value.audio.track);
    result.controls.swapTouchButtons = Boolean(
      value.controls && value.controls.swapTouchButtons,
    );
    result.controls.tiltEnabled = Boolean(
      value.controls && value.controls.tiltEnabled,
    );
    if (
      Game.Validation.finite(
        value.controls && value.controls.tiltSensitivity,
        1,
        5,
      )
    )
      result.controls.tiltSensitivity = Math.round(
        value.controls.tiltSensitivity,
      );
    ["leftKey", "rightKey", "pauseKey"].forEach(function (key) {
      if (
        value.controls &&
        Game.Validation.string(value.controls[key], 30) &&
        value.controls[key].trim()
      )
        result.controls[key] = value.controls[key].trim();
    });
    result.accessibility.highContrast = Boolean(
      value.accessibility && value.accessibility.highContrast,
    );
    if (
      value.accessibility &&
      Game.Validation.oneOf(value.accessibility.reducedMotion, [
        "system",
        "on",
        "off",
      ])
    )
      result.accessibility.reducedMotion = value.accessibility.reducedMotion;
    if (
      value.accessibility &&
      Game.Validation.oneOf(value.accessibility.particles, [
        "low",
        "medium",
        "high",
      ])
    )
      result.accessibility.particles = value.accessibility.particles;
    result.accessibility.screenShake =
      value.accessibility && value.accessibility.screenShake !== undefined
        ? Boolean(value.accessibility.screenShake)
        : true;
    return result;
  }
  function load() {
    return sanitize(
      Game.Storage.read(
        KEY,
        function (value) {
          return (
            Game.Validation.isPlainObject(value) && value.schemaVersion === 1
          );
        },
        copyDefaults(),
      ).value,
    );
  }
  function save(value) {
    return Game.Storage.write(KEY, sanitize(value));
  }
  Game.SettingsStore = Object.freeze({
    key: KEY,
    defaults: copyDefaults,
    sanitize: sanitize,
    load: load,
    save: save,
    reset: function () {
      var value = copyDefaults();
      save(value);
      return value;
    },
  });
})(window.DJGame);
