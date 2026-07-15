(function (Game) {
  "use strict";
  function create(x, y) {
    return {
      x: x,
      y: y,
      previousX: x,
      previousY: y,
      width: Game.Constants.PLAYER_WIDTH,
      height: Game.Constants.PLAYER_HEIGHT,
      vx: 0,
      vy: 0,
      facing: 1,
      grounded: false,
      squash: 0,
      invulnerable: 0,
      hurtTimer: 0,
      buffs: {
        springUses: 0,
        rocket: 0,
        shield: 0,
        magnet: 0,
        slow: 0,
        lucky: 0,
      },
    };
  }
  function rect(player) {
    return {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height,
    };
  }
  function tickBuffs(player, dt) {
    Object.keys(player.buffs).forEach(function (key) {
      if (key !== "springUses")
        player.buffs[key] = Math.max(0, player.buffs[key] - dt);
    });
    player.invulnerable = Math.max(0, player.invulnerable - dt);
    player.hurtTimer = Math.max(0, player.hurtTimer - dt);
    player.squash = Math.max(0, player.squash - dt * 5);
  }
  function land(player, multiplier) {
    player.y -= 0;
    player.vy = Game.Constants.JUMP_VELOCITY * (multiplier || 1);
    player.grounded = true;
    player.squash = 0.18;
    if (player.buffs.springUses > 0) {
      player.vy *= 1.25;
      player.buffs.springUses -= 1;
    }
  }
  function hurt(player) {
    if (player.invulnerable > 0 || player.buffs.rocket > 0) return false;
    if (player.buffs.shield > 0) {
      player.buffs.shield = 0;
      player.invulnerable = 1.2;
      player.hurtTimer = 0.4;
      return true;
    }
    return null;
  }
  Game.Player = Object.freeze({
    create: create,
    rect: rect,
    tickBuffs: tickBuffs,
    land: land,
    hurt: hurt,
  });
})(window.DJGame);
