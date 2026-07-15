(function (Game) {
  "use strict";
  var types = ["star", "spring", "rocket", "shield", "magnet", "slow", "lucky"];
  function create(id, x, y, type) {
    return {
      id: id,
      x: x,
      y: y,
      width: 24,
      height: 24,
      type: type || "star",
      active: true,
      phase: (id * 1.37) % 6.28,
      baseY: y,
    };
  }
  function update(item, dt, time) {
    if (item.active)
      item.y = item.baseY + Math.sin(time * 0.003 + item.phase) * 5;
  }
  function effect(player, item) {
    if (item.type === "spring")
      player.buffs.springUses = Math.max(player.buffs.springUses, 3);
    if (item.type === "rocket")
      player.buffs.rocket = Math.max(player.buffs.rocket, 2.8);
    if (item.type === "shield")
      player.buffs.shield = Math.max(player.buffs.shield, 8);
    if (item.type === "magnet")
      player.buffs.magnet = Math.max(player.buffs.magnet, 6);
    if (item.type === "slow")
      player.buffs.slow = Math.max(player.buffs.slow, 4);
    if (item.type === "lucky")
      player.buffs.lucky = Math.max(player.buffs.lucky, 5);
  }
  Game.Item = Object.freeze({
    types: types,
    create: create,
    update: update,
    effect: effect,
  });
})(window.DJGame);
