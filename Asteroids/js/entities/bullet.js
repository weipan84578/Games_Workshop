(function () {
  "use strict";

  Game.Bullet = {
    create: function (x, y, vx, vy, enemy) {
      return {
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        radius: enemy ? 4 : 3,
        life: enemy ? 2.2 : Game.Constants.SHIP.BULLET_LIFE,
        enemy: !!enemy,
        alive: true
      };
    },

    update: function (bullet, dt, app) {
      bullet.life -= dt;
      if (bullet.life <= 0) {
        bullet.alive = false;
        return;
      }
      Game.Physics.integrate(bullet, dt);
      Game.Physics.wrap(bullet, app.width, app.height, 8);
    },

    draw: function (ctx, bullet) {
      ctx.save();
      ctx.fillStyle = bullet.enemy ? Game.Utils.cssColor("--c-danger") : Game.Utils.cssColor("--c-bullet");
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = bullet.enemy ? 10 : 14;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };
}());
