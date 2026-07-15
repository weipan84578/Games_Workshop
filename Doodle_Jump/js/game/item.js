(function (Game) {
  "use strict";
  var types = ["star", "spring", "rocket", "shield", "magnet", "slow", "lucky"];
  function phaseFromId(id) {
    var text = String(id);
    var hash = 0;
    for (var index = 0; index < text.length; index += 1) {
      hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
    }
    return (hash % 628) / 100;
  }
  function create(id, x, y, type) {
    return {
      id: id,
      x: x,
      y: y,
      width: 24,
      height: 24,
      type: type || "star",
      active: true,
      phase: phaseFromId(id),
      baseY: y,
    };
  }
  function update(item, dt, time) {
    if (item.active)
      item.y = item.baseY + Math.sin(time * 0.003 + item.phase) * 5;
  }
  function attract(item, player, dt) {
    if (
      !item.active ||
      (item.type !== "star" && item.type !== "lucky") ||
      !player
    )
      return false;
    var itemCenterX = item.x + item.width / 2;
    var itemCenterY = item.y + item.height / 2;
    var playerCenterX = player.x + player.width / 2;
    var playerCenterY = player.y + player.height / 2;
    var dx = playerCenterX - itemCenterX;
    var dy = playerCenterY - itemCenterY;
    var distance = Math.hypot(dx, dy);
    var range = 170;
    if (!distance || distance > range) return false;
    var speed = 220 + (1 - distance / range) * 180;
    var step = Math.min(distance, speed * dt);
    var moveX = (dx / distance) * step;
    var moveY = (dy / distance) * step;
    item.x += moveX;
    item.y += moveY;
    item.baseY += moveY;
    return true;
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
    attract: attract,
    effect: effect,
  });
})(window.DJGame);
