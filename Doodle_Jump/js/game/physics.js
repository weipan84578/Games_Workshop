(function (Game) {
  "use strict";
  function update(player, input, dt, options) {
    options = options || {};
    var slow = options.slowFactor || 1;
    player.previousX = player.x;
    player.previousY = player.y;
    player.grounded = false;
    Game.Player.tickBuffs(player, dt);
    if (player.buffs.rocket > 0) {
      player.vy = -520;
    } else {
      player.vy += Game.Constants.GRAVITY * dt * slow;
    }
    var axis = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    player.vx += axis * Game.Constants.HORIZONTAL_ACCELERATION * dt;
    player.vx += (options.wind || 0) * dt;
    if (!axis) player.vx *= Math.pow(Game.Constants.AIR_RESISTANCE, dt * 120);
    player.vx = Game.Math.clamp(
      player.vx,
      -Game.Constants.MAX_HORIZONTAL_SPEED,
      Game.Constants.MAX_HORIZONTAL_SPEED,
    );
    if (axis) player.facing = axis;
    player.x += player.vx * dt;
    player.y += player.vy * dt;
    if (player.x + player.width < 0) player.x = Game.Constants.LOGICAL_WIDTH;
    if (player.x > Game.Constants.LOGICAL_WIDTH) player.x = -player.width;
  }
  Game.Physics = Object.freeze({ update: update });
})(window.DJGame);
