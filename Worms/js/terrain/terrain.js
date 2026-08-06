(function (root, factory) {
  var random = root.WormsGame && root.WormsGame.Random;
  if (!random && typeof require === "function")
    random = require("../utils/random.js");
  var api = factory(random);
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.TerrainMask = api.TerrainMask;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (Random) {
  "use strict";

  var WIDTH = 1920;
  var HEIGHT = 1080;
  var WATER_Y = 1010;
  var FALLBACK_SEED = 0x51f15e;
  var THEMES = Object.freeze({
    candy: Object.freeze({
      sky: "#9ee4f2",
      far: "#f8d0e0",
      top: "#7ed7a0",
      soil: "#f4b969",
      deep: "#d9866f",
      accent: "#ff7da5",
    }),
    forest: Object.freeze({
      sky: "#a9e3de",
      far: "#c7d99b",
      top: "#70bd72",
      soil: "#9e714e",
      deep: "#6e4d45",
      accent: "#df5e6b",
    }),
    icecream: Object.freeze({
      sky: "#b9ddf5",
      far: "#d8caee",
      top: "#f9f3dc",
      soil: "#b8a9dc",
      deep: "#7f78b2",
      accent: "#78c9e6",
    }),
  });

  function chooseTheme(seed, requested) {
    if (THEMES[requested]) return requested;
    return ["candy", "forest", "icecream"][Random.normalizeSeed(seed) % 3];
  }

  function buildHeights(seed) {
    var rng = Random.mulberry32(Random.deriveSeed(seed, "terrain"));
    var heights = new Int16Array(WIDTH);
    var base = 575 + Math.floor(rng() * 90);
    var phaseA = rng() * Math.PI * 2;
    var phaseB = rng() * Math.PI * 2;
    var waves = 2 + Math.floor(rng() * 3);
    for (var x = 0; x < WIDTH; x += 1) {
      var normalized = x / WIDTH;
      var y = base;
      y += Math.sin(normalized * Math.PI * 2 * waves + phaseA) * 92;
      y += Math.sin(normalized * Math.PI * 5 + phaseB) * 38;
      y += Math.sin(normalized * Math.PI * 11 + phaseA * 0.5) * 14;
      heights[x] = Math.round(Math.max(400, Math.min(790, y)));
    }
    return heights;
  }

  function flattenPlatforms(heights, seed) {
    var rng = Random.mulberry32(Random.deriveSeed(seed, "spawns"));
    var points = [];
    var slots = [155, 470, 785, 1100, 1415, 1730];
    slots.forEach(function (baseX, index) {
      var x = baseX + Math.round((rng() - 0.5) * 42);
      var y = heights[x];
      var radius = 64;
      for (var px = x - radius; px <= x + radius; px += 1) {
        if (px < 0 || px >= WIDTH) continue;
        var edge = Math.abs(px - x) / radius;
        var blend = edge > 0.84 ? (edge - 0.84) / 0.16 : 0;
        heights[px] = Math.round(y * (1 - blend) + heights[px] * blend);
      }
      points.push({
        x: x,
        y: y - 19,
        team: index % 2,
        slot: Math.floor(index / 2),
      });
    });
    return points;
  }

  function rasterize(heights) {
    var data = new Uint8Array(WIDTH * HEIGHT);
    for (var x = 0; x < WIDTH; x += 1) {
      var start = Math.max(0, heights[x]);
      for (var y = start; y < HEIGHT; y += 1) data[y * WIDTH + x] = 255;
    }
    return data;
  }

  /** Seeded destructible terrain collision mask. */
  function TerrainMask(seed, theme) {
    this.seed = Random.normalizeSeed(seed);
    this.width = WIDTH;
    this.height = HEIGHT;
    this.waterY = WATER_Y;
    this.theme = chooseTheme(this.seed, theme);
    this.palette = THEMES[this.theme];
    this.heights = buildHeights(this.seed);
    this.spawns = flattenPlatforms(this.heights, this.seed);
    this.data = rasterize(this.heights);
    this.carves = [];
    this.addArches();
    this.usedFallback = false;
    if (!this.validateSpawns()) this.useFallback();
  }

  TerrainMask.prototype.addArches = function () {
    var rng = Random.mulberry32(Random.deriveSeed(this.seed, "arches"));
    var count = 2 + Math.floor(rng() * 3);
    for (var i = 0; i < count; i += 1) {
      var x = 280 + rng() * 1360;
      if (
        this.spawns.some(function (spawn) {
          return Math.abs(spawn.x - x) < 115;
        })
      )
        continue;
      var surface = this.heights[Math.round(x)];
      var radius = 38 + rng() * 28;
      this.carveCircle(x, surface + 78 + rng() * 25, radius, true);
    }
  };

  /** Return whether a rounded world coordinate contains solid terrain. */
  TerrainMask.prototype.isSolid = function (x, y) {
    var px = Math.round(x);
    var py = Math.round(y);
    if (px < 0 || px >= this.width || py < 0) return false;
    if (py >= this.height) return true;
    return this.data[py * this.width + px] >= 128;
  };

  /** Find the first solid pixel at or below the provided y coordinate. */
  TerrainMask.prototype.getSurfaceY = function (x, startY) {
    var px = Math.max(0, Math.min(this.width - 1, Math.round(x)));
    for (
      var y = Math.max(0, Math.round(startY || 0));
      y < this.height;
      y += 1
    ) {
      if (this.data[y * this.width + px] >= 128) return y;
    }
    return null;
  };

  /** Remove all solid pixels inside a circle and return its dirty rectangle. */
  TerrainMask.prototype.carveCircle = function (cx, cy, radius, initial) {
    var left = Math.max(0, Math.floor(cx - radius));
    var right = Math.min(this.width - 1, Math.ceil(cx + radius));
    var top = Math.max(0, Math.floor(cy - radius));
    var bottom = Math.min(this.height - 1, Math.ceil(cy + radius));
    var radiusSquared = radius * radius;
    for (var y = top; y <= bottom; y += 1) {
      for (var x = left; x <= right; x += 1) {
        var dx = x - cx;
        var dy = y - cy;
        if (dx * dx + dy * dy <= radiusSquared)
          this.data[y * this.width + x] = 0;
      }
    }
    this.carves.push({ x: cx, y: cy, radius: radius, initial: !!initial });
    return {
      x: left,
      y: top,
      width: right - left + 1,
      height: bottom - top + 1,
    };
  };

  /** Validate a candidate spawn against platform, clearance, and water rules. */
  TerrainMask.prototype.isSpawnValid = function (spawn) {
    if (
      !spawn ||
      spawn.x < 70 ||
      spawn.x > this.width - 70 ||
      spawn.y >= this.waterY - 30
    )
      return false;
    var surface = spawn.y + 19;
    for (var offset = -50; offset <= 50; offset += 10) {
      var y = this.getSurfaceY(spawn.x + offset, surface - 30);
      if (y == null || Math.abs(y - surface) > 17) return false;
    }
    for (var headY = spawn.y - 52; headY < spawn.y + 5; headY += 5) {
      if (this.isSolid(spawn.x, headY)) return false;
    }
    return true;
  };

  TerrainMask.prototype.validateSpawns = function () {
    if (
      this.spawns.length !== 6 ||
      !this.spawns.every(this.isSpawnValid.bind(this))
    )
      return false;
    for (var i = 1; i < this.spawns.length; i += 1) {
      if (Math.abs(this.spawns[i].x - this.spawns[i - 1].x) < 180) return false;
    }
    return true;
  };

  /** Replace an invalid generated layout with the built-in safe template. */
  TerrainMask.prototype.useFallback = function () {
    this.heights = new Int16Array(this.width);
    for (var x = 0; x < this.width; x += 1) {
      this.heights[x] = Math.round(
        620 + Math.sin(x / 170) * 42 + Math.sin(x / 71) * 12,
      );
    }
    this.spawns = flattenPlatforms(this.heights, FALLBACK_SEED);
    this.data = rasterize(this.heights);
    this.carves = [];
    this.usedFallback = true;
    return this;
  };

  /** Create a deterministic render snapshot without exposing mutable mask data. */
  TerrainMask.prototype.snapshot = function () {
    return {
      seed: this.seed,
      width: this.width,
      height: this.height,
      waterY: this.waterY,
      theme: this.theme,
      palette: this.palette,
      heights: Array.from(this.heights),
      carves: this.carves.map(function (carve) {
        return Object.assign({}, carve);
      }),
    };
  };

  return {
    WIDTH: WIDTH,
    HEIGHT: HEIGHT,
    WATER_Y: WATER_Y,
    FALLBACK_SEED: FALLBACK_SEED,
    THEMES: THEMES,
    chooseTheme: chooseTheme,
    TerrainMask: TerrainMask,
  };
});
