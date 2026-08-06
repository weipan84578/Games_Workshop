(function (root, factory) {
  var api = factory();
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.Random = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  /** Convert arbitrary text into a stable unsigned 32-bit seed. */
  function hashString(value) {
    var hash = 2166136261;
    var text = String(value);
    for (var i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  /** Return the specified seed as a nonzero uint32. */
  function normalizeSeed(seed) {
    var result =
      typeof seed === "number" && Number.isFinite(seed)
        ? seed >>> 0
        : hashString(seed);
    return result || 0x6d2b79f5;
  }

  /** Create a deterministic Mulberry32 generator returning numbers in [0, 1). */
  function mulberry32(seed) {
    var state = normalizeSeed(seed);
    return function () {
      state |= 0;
      state = (state + 0x6d2b79f5) | 0;
      var t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Derive an isolated deterministic stream seed from a match seed and label. */
  function deriveSeed(seed, label) {
    return hashString(normalizeSeed(seed).toString(16) + ":" + String(label));
  }

  /** Return an inclusive deterministic integer from a random generator. */
  function int(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  /** Deterministically choose one item. */
  function pick(rng, items) {
    return items[Math.min(items.length - 1, Math.floor(rng() * items.length))];
  }

  return {
    hashString: hashString,
    normalizeSeed: normalizeSeed,
    mulberry32: mulberry32,
    deriveSeed: deriveSeed,
    int: int,
    pick: pick,
  };
});
