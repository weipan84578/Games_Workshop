(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};
  var world = app.Config.world;

  app.PathManager = {
    getY: function (x, time) {
      var wave = Math.sin((x / world.width) * Math.PI * 2 + (time || 0) * .35) * 7;
      return world.laneY + wave;
    },
    getSpawnX: function (side) {
      return side === "player" ? 130 : 870;
    },
    getDirection: function (side) {
      return side === "player" ? 1 : -1;
    },
    clampX: function (x) {
      return app.utils.clamp(x, 85, 915);
    }
  };
})(window);
