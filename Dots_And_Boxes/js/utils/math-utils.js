(function (ns) {
  "use strict";

  ns.MathUtils = {
    clamp: function (value, min, max) {
      return Math.max(min, Math.min(max, value));
    },
    randomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    pickRandom: function (items) {
      if (!items || !items.length) {
        return null;
      }
      return items[Math.floor(Math.random() * items.length)];
    },
    shuffle: function (items) {
      var result = items.slice();
      for (var index = result.length - 1; index > 0; index -= 1) {
        var swapIndex = Math.floor(Math.random() * (index + 1));
        var temp = result[index];
        result[index] = result[swapIndex];
        result[swapIndex] = temp;
      }
      return result;
    }
  };
})(window.DAB = window.DAB || {});
