(function (Game) {
  "use strict";
  function update(camera, player, dt) {
    camera.previousY = camera.y;
    var target = player.y - Game.Constants.CAMERA_TRIGGER_Y;
    if (target < camera.y)
      camera.y = Game.Math.lerp(
        camera.y,
        target,
        Game.Math.clamp(dt * 8, 0, 1),
      );
    if (Math.abs(camera.y - target) < 0.001) camera.y = target;
  }
  Game.Camera = Object.freeze({ update: update });
})(window.DJGame);
