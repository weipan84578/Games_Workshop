(function () {
  "use strict";

  Game.Physics = {
    integrate: function (entity, dt) {
      entity.x += entity.vx * dt;
      entity.y += entity.vy * dt;
    },

    wrap: function (entity, width, height, margin) {
      Game.Utils.wrap(entity, width, height, margin || entity.radius || 0);
    },

    limitSpeed: function (entity, maxSpeed) {
      var speed = Math.hypot(entity.vx, entity.vy);
      if (speed <= maxSpeed || speed === 0) return;
      var scale = maxSpeed / speed;
      entity.vx *= scale;
      entity.vy *= scale;
    }
  };
}());
