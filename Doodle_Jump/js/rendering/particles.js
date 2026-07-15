(function (Game) {
  "use strict";
  function add(list, x, y, color, count) {
    for (var i = 0; i < count; i += 1) {
      if (list.length >= Game.Constants.MAX_PARTICLES) break;
      var angle = Math.random() * Math.PI * 2;
      var speed = 20 + Math.random() * 80;
      list.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        life: 0.35 + Math.random() * 0.5,
        maxLife: 0.85,
        size: 2 + Math.random() * 4,
        color: color,
      });
    }
  }
  function update(list, dt) {
    for (var i = list.length - 1; i >= 0; i -= 1) {
      var item = list[i];
      item.life -= dt;
      item.x += item.vx * dt;
      item.y += item.vy * dt;
      item.vy += 100 * dt;
      if (item.life <= 0) list.splice(i, 1);
    }
  }
  function draw(ctx, list, cameraY) {
    list.forEach(function (item) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, item.life / item.maxLife);
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(item.x, item.y - cameraY, item.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
  Game.Particles = Object.freeze({ add: add, update: update, draw: draw });
})(window.DJGame);
