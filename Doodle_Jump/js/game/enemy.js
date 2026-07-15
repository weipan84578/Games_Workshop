(function (Game) {
  "use strict";
  function create(id, x, y, type, rng) {
    return {
      id: id,
      x: x,
      y: y,
      width: type === "hole" ? 48 : 30,
      height: type === "hole" ? 48 : 30,
      type: type || "monster",
      baseX: x,
      baseY: y,
      phase: rng ? rng.range(0, 6.28) : 0,
      direction: rng && rng.next() > 0.5 ? 1 : -1,
      active: true,
      warning: 0.8,
    };
  }
  function update(enemy, dt, time) {
    if (!enemy.active) return;
    if (enemy.type === "monster") {
      enemy.x += enemy.direction * 28 * dt;
      if (enemy.x < enemy.baseX - 38 || enemy.x > enemy.baseX + 38)
        enemy.direction *= -1;
    }
    if (enemy.type === "flyer") {
      enemy.x = enemy.baseX + Math.sin(time * 0.002 + enemy.phase) * 55;
      enemy.y = enemy.baseY + Math.cos(time * 0.0025 + enemy.phase) * 16;
      enemy.warning = Math.max(0, enemy.warning - dt);
    }
  }
  Game.Enemy = Object.freeze({ create: create, update: update });
})(window.DJGame);
