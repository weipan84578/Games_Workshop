(function (Game) {
  "use strict";
  var Validation = {
    isPlainObject: function (value) {
      return (
        value !== null && typeof value === "object" && !Array.isArray(value)
      );
    },
    finite: function (value, min, max) {
      return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        (min === undefined || value >= min) &&
        (max === undefined || value <= max)
      );
    },
    string: function (value, max) {
      return typeof value === "string" && value.length <= (max || 1000);
    },
    oneOf: function (value, values) {
      return values.indexOf(value) !== -1;
    },
    cleanName: function (value, fallback) {
      var name =
        typeof value === "string"
          ? value.trim().replace(/[\u0000-\u001f\u007f]/g, "")
          : "";
      var chars = Array.from(name).slice(0, 12).join("");
      return chars || fallback || "Player";
    },
    finiteObject: function (object, keys) {
      return (
        this.isPlainObject(object) &&
        keys.every(function (key) {
          return Number.isFinite(object[key]);
        })
      );
    },
  };
  Game.Validation = Object.freeze(Validation);
})(window.DJGame);
