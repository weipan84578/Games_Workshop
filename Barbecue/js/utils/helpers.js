(function exposeHelpers(root, factory) {
  var api = factory();
  root.BBQ = root.BBQ || {};
  root.BBQ.Helpers = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis, function helpersFactory() {
  "use strict";

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function formatSeconds(ms) {
    var seconds = Math.max(0, Math.ceil(ms / 1000));
    var minutes = Math.floor(seconds / 60);
    var rest = seconds % 60;
    return minutes > 0 ? minutes + ":" + String(rest).padStart(2, "0") : String(rest);
  }

  function randomChoice(items, rng) {
    var random = rng || Math.random;
    return items[Math.floor(random() * items.length)];
  }

  function createSeededRandom(seed) {
    var state = seed >>> 0;
    return function seededRandom() {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  return {
    clamp: clamp,
    lerp: lerp,
    formatSeconds: formatSeconds,
    randomChoice: randomChoice,
    createSeededRandom: createSeededRandom,
    deepClone: deepClone
  };
});
