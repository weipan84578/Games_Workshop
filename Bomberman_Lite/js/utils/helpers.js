(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function randInt(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  function choose(rng, list) {
    return list[Math.floor(rng() * list.length)];
  }

  function shuffle(rng, list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function mulberry32(seed) {
    let value = seed >>> 0;
    return function () {
      value += 0x6D2B79F5;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function debounce(fn, wait) {
    let timer = 0;
    return function () {
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
      }, wait);
    };
  }

  function tileKey(x, y) {
    return x + "," + y;
  }

  function parseKey(key) {
    const parts = key.split(",");
    return { x: Number(parts[0]), y: Number(parts[1]) };
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y;
  }

  function centerTile(entity) {
    const ts = root.CONFIG.tileSize;
    return {
      x: Math.floor((entity.x + entity.w / 2) / ts),
      y: Math.floor((entity.y + entity.h / 2) / ts)
    };
  }

  function tileToPixel(x, y, size) {
    const ts = root.CONFIG.tileSize;
    const entitySize = size || root.CONFIG.playerSize;
    return {
      x: x * ts + (ts - entitySize) / 2,
      y: y * ts + (ts - entitySize) / 2
    };
  }

  function formatTime(seconds) {
    if (!seconds && seconds !== 0) return "--:--";
    const safe = Math.max(0, Math.ceil(seconds));
    const min = String(Math.floor(safe / 60)).padStart(2, "0");
    const sec = String(safe % 60).padStart(2, "0");
    return min + ":" + sec;
  }

  function formatScore(value) {
    return String(Math.max(0, Math.floor(value))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function cssVar(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function safeJsonParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function normalizeDirection(dir) {
    const x = dir.x || 0;
    const y = dir.y || 0;
    const length = Math.hypot(x, y);
    if (!length) return { x: 0, y: 0 };
    return { x: x / length, y: y / length };
  }

  root.Helpers = {
    clamp,
    lerp,
    randInt,
    choose,
    shuffle,
    mulberry32,
    debounce,
    tileKey,
    parseKey,
    rectsOverlap,
    centerTile,
    tileToPixel,
    formatTime,
    formatScore,
    cssVar,
    safeJsonParse,
    normalizeDirection
  };
}());
