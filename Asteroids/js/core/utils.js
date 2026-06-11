(function () {
  "use strict";

  var Utils = {
    clamp: function (value, min, max) {
      return Math.max(min, Math.min(max, value));
    },

    lerp: function (a, b, t) {
      return a + (b - a) * t;
    },

    rand: function (min, max) {
      return min + Math.random() * (max - min);
    },

    randInt: function (min, max) {
      return Math.floor(Utils.rand(min, max + 1));
    },

    choice: function (items) {
      return items[Math.floor(Math.random() * items.length)];
    },

    wrap: function (entity, width, height, margin) {
      var pad = margin || 0;
      if (entity.x < -pad) entity.x = width + pad;
      if (entity.x > width + pad) entity.x = -pad;
      if (entity.y < -pad) entity.y = height + pad;
      if (entity.y > height + pad) entity.y = -pad;
    },

    distanceSq: function (a, b) {
      var dx = a.x - b.x;
      var dy = a.y - b.y;
      return dx * dx + dy * dy;
    },

    circlesHit: function (a, b) {
      var radius = a.radius + b.radius;
      return Utils.distanceSq(a, b) <= radius * radius;
    },

    angleVector: function (angle, speed) {
      return {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      };
    },

    formatScore: function (score) {
      return String(Math.max(0, Math.floor(score))).padStart(6, "0");
    },

    cssColor: function (name) {
      return getComputedStyle(document.body).getPropertyValue(name).trim();
    },

    randomEdgePosition: function (width, height) {
      var side = Utils.randInt(0, 3);
      if (side === 0) return { x: Utils.rand(0, width), y: -40 };
      if (side === 1) return { x: width + 40, y: Utils.rand(0, height) };
      if (side === 2) return { x: Utils.rand(0, width), y: height + 40 };
      return { x: -40, y: Utils.rand(0, height) };
    },

    randomAwayFrom: function (width, height, from, minDistance) {
      var pos = Utils.randomEdgePosition(width, height);
      var tries = 0;
      while (from && Utils.distanceSq(pos, from) < minDistance * minDistance && tries < 20) {
        pos = Utils.randomEdgePosition(width, height);
        tries += 1;
      }
      return pos;
    }
  };

  Game.Utils = Utils;
}());
