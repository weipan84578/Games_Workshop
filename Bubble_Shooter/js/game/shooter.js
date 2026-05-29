(function (BS) {
  function randomFromPool(pool) {
    return BS.Utils.pick(pool && pool.length ? pool : BS.Game.makeColorPool(BS.Core.Config.game.colorCount));
  }

  BS.Game.Shooter = function (config) {
    this.config = config;
    this.angle = -Math.PI / 2;
    this.currentColor = BS.Utils.randomInt(0, config.colorCount - 1);
    this.nextColor = BS.Utils.randomInt(0, config.colorCount - 1);
  };

  BS.Game.Shooter.prototype.setAim = function (x, y, metrics) {
    var angle = Math.atan2(y - metrics.shooterY, x - metrics.shooterX);

    if (angle > 0) {
      angle = -Math.PI / 2;
    }

    var min = this.config.minAimDeg * Math.PI / 180;
    var max = this.config.maxAimDeg * Math.PI / 180;
    this.angle = BS.Utils.clamp(angle, min, max);
  };

  BS.Game.Shooter.prototype.adjustAim = function (delta) {
    var min = this.config.minAimDeg * Math.PI / 180;
    var max = this.config.maxAimDeg * Math.PI / 180;
    this.angle = BS.Utils.clamp(this.angle + delta, min, max);
  };

  BS.Game.Shooter.prototype.shoot = function (metrics, colorPool) {
    var directionX = Math.cos(this.angle);
    var directionY = Math.sin(this.angle);
    var bubble = new BS.Game.Bubble(
      this.currentColor,
      metrics.shooterX + directionX * metrics.radius * 1.7,
      metrics.shooterY + directionY * metrics.radius * 1.7,
      metrics.radius
    );

    bubble.vx = directionX * this.config.shotSpeed;
    bubble.vy = directionY * this.config.shotSpeed;
    this.currentColor = this.nextColor;
    this.nextColor = randomFromPool(colorPool);
    return bubble;
  };

  BS.Game.Shooter.prototype.refreshPalette = function (pool) {
    if (!pool || !pool.length) {
      return;
    }
    if (pool.indexOf(this.currentColor) === -1) {
      this.currentColor = randomFromPool(pool);
    }
    if (pool.indexOf(this.nextColor) === -1) {
      this.nextColor = randomFromPool(pool);
    }
  };

  BS.Game.Shooter.prototype.serialize = function () {
    return {
      angle: this.angle,
      currentColor: this.currentColor,
      nextColor: this.nextColor
    };
  };

  BS.Game.Shooter.prototype.deserialize = function (data) {
    this.angle = data.angle || -Math.PI / 2;
    this.currentColor = data.currentColor || 0;
    this.nextColor = data.nextColor || 0;
  };
})(window.BubbleShooter);
