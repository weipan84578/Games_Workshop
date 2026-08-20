(function (PSG) {
  'use strict';

  function hashString(text) {
    var hash = 2166136261;
    var input = String(text);
    for (var i = 0; i < input.length; i += 1) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function RNG(seed) {
    this.seed = (Number(seed) || 1) >>> 0;
  }

  RNG.prototype.next = function () {
    var t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  RNG.prototype.int = function (min, max) { return Math.floor(this.next() * (max - min + 1)) + min; };
  RNG.prototype.pick = function (items) { return items[Math.floor(this.next() * items.length)]; };
  RNG.prototype.shuffle = function (items) {
    var result = items.slice();
    for (var i = result.length - 1; i > 0; i -= 1) {
      var j = Math.floor(this.next() * (i + 1));
      var temp = result[i]; result[i] = result[j]; result[j] = temp;
    }
    return result;
  };
  RNG.prototype.weighted = function (items, getWeight) {
    var weights = items.map(function (item) { return Math.max(0, getWeight(item)); });
    var total = weights.reduce(function (sum, value) { return sum + value; }, 0);
    if (!total) return null;
    var roll = this.next() * total;
    for (var i = 0; i < items.length; i += 1) {
      roll -= weights[i];
      if (roll < 0) return items[i];
    }
    return items[items.length - 1];
  };

  PSG.utils.RNG = RNG;
  PSG.utils.hashString = hashString;
  PSG.utils.seedFrom = function () {
    return hashString(Array.prototype.join.call(arguments, '|'));
  };
})(window.PSG);
