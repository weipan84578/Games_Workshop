(function (Game) {
  "use strict";
  var colors = {
    normal: "#67c779",
    moving: "#57b8e7",
    brittle: "#b67649",
    spring: "#ffd05b",
    vanishing: "#9b78dc",
    cloud: "#ffffff",
    spike: "#d94c5b",
  };
  function create(id, x, y, width, type, extra) {
    var platform = {
      id: id,
      x: x,
      y: y,
      width: width,
      height: Game.Constants.PLATFORM_HEIGHT,
      type: type || "normal",
      baseX: x,
      baseY: y,
      phase: (extra && extra.phase) || 0,
      speed: (extra && extra.speed) || 45,
      active: true,
      touched: false,
      breakTimer: 0,
      vanishTimer: 0,
      color: colors[type || "normal"] || colors.normal,
    };
    if (platform.type === "cloud") platform.height = 20;
    if (platform.type === "spike") platform.height = 22;
    return platform;
  }
  function update(platform, dt, time) {
    if (!platform.active) return;
    if (platform.type === "moving") {
      platform.x =
        platform.baseX +
        Math.sin((time * 0.001 * platform.speed) / 10 + platform.phase) * 52;
      platform.x = Game.Math.clamp(
        platform.x,
        8,
        Game.Constants.LOGICAL_WIDTH - platform.width - 8,
      );
    }
    if (platform.type === "brittle" && platform.breakTimer > 0) {
      platform.breakTimer -= dt;
      if (platform.breakTimer <= 0) platform.active = false;
    }
    if (platform.type === "vanishing" && platform.vanishTimer > 0) {
      platform.vanishTimer -= dt;
      if (platform.vanishTimer <= -2) platform.vanishTimer = 2;
    }
    if (platform.type === "cloud" && platform.touched) {
      platform.vanishTimer -= dt;
      if (platform.vanishTimer <= 0) platform.active = false;
    }
  }
  function touch(platform) {
    if (platform.touched) return;
    platform.touched = true;
    if (platform.type === "brittle") platform.breakTimer = 0.18;
    if (platform.type === "vanishing") platform.vanishTimer = 2;
    if (platform.type === "cloud") platform.vanishTimer = 0.22;
  }
  Game.Platform = Object.freeze({
    create: create,
    update: update,
    touch: touch,
    colors: colors,
  });
})(window.DJGame);
