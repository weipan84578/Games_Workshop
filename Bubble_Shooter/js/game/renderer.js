(function (BS) {
  BS.Game.Renderer = function (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.metrics = null;
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.resize();
  };

  BS.Game.Renderer.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    var width = Math.max(300, Math.floor(rect.width || 360));
    var height = Math.max(400, Math.floor(rect.height || 600));
    var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    if (this.canvas.width !== Math.floor(width * dpr) || this.canvas.height !== Math.floor(height * dpr)) {
      this.canvas.width = Math.floor(width * dpr);
      this.canvas.height = Math.floor(height * dpr);
    }

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.metrics = this.computeMetrics(width, height);
  };

  BS.Game.Renderer.prototype.computeMetrics = function (width, height) {
    var config = BS.Core.Config.game;
    var side = BS.Utils.clamp(width * 0.045, 12, 38);
    var top = BS.Utils.clamp(height * 0.055, 24, 56);
    var bottom = BS.Utils.clamp(height * 0.15, 82, 132);
    var radiusByWidth = (width - side * 2) / (config.cols * 2 + 1);
    var radiusByHeight = (height - top - bottom) / (2.8 + (config.maxRows - 1) * config.rowGapFactor);
    var radius = Math.floor(BS.Utils.clamp(Math.min(radiusByWidth, radiusByHeight), 10, 25));
    var diameter = radius * 2;
    var rowGap = radius * config.rowGapFactor;
    var boardWidth = config.cols * diameter + radius;
    var startX = Math.max(8, (width - boardWidth) / 2);
    var shooterY = height - BS.Utils.clamp(height * 0.085, 48, 76);

    return {
      width: width,
      height: height,
      radius: radius,
      diameter: diameter,
      rowGap: rowGap,
      top: top,
      startX: startX,
      boardWidth: boardWidth,
      wallLeft: startX + radius,
      wallRight: startX + boardWidth - radius,
      shooterX: width / 2,
      shooterY: shooterY,
      dangerY: top + radius + (config.maxRows - 1) * rowGap
    };
  };

  BS.Game.Renderer.prototype.getMetrics = function () {
    var rect = this.canvas.getBoundingClientRect();
    if (Math.abs(rect.width - this.width) > 1 || Math.abs(rect.height - this.height) > 1) {
      this.resize();
    }
    return this.metrics;
  };

  BS.Game.Renderer.prototype.render = function (state, time) {
    var metrics = this.getMetrics();
    var ctx = this.ctx;

    ctx.clearRect(0, 0, metrics.width, metrics.height);
    this.drawBackground(ctx, metrics);

    if (!state) {
      return;
    }

    this.drawGridGuides(ctx, state.grid, metrics);
    this.drawDangerLine(ctx, metrics);
    this.drawBubbles(ctx, state.grid, metrics);
    this.drawAim(ctx, state.shooter, metrics);
    this.drawShooter(ctx, state.shooter, metrics, time);

    if (state.activeBubble) {
      this.drawBubble(ctx, state.activeBubble.x, state.activeBubble.y, metrics.radius, state.activeBubble.color, 1);
    }
  };

  BS.Game.Renderer.prototype.drawBackground = function (ctx, metrics) {
    ctx.save();
    ctx.fillStyle = BS.Utils.cssVar("--color-canvas-bg") || "#e9f6ee";
    ctx.fillRect(0, 0, metrics.width, metrics.height);

    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = BS.Utils.cssVar("--color-canvas-grid") || "rgba(0,0,0,0.12)";
    ctx.lineWidth = 1;
    for (var x = metrics.wallLeft; x <= metrics.wallRight; x += metrics.radius * 2) {
      ctx.beginPath();
      ctx.moveTo(x, metrics.top * 0.7);
      ctx.lineTo(x, metrics.dangerY + metrics.radius);
      ctx.stroke();
    }
    ctx.restore();
  };

  BS.Game.Renderer.prototype.drawGridGuides = function (ctx, grid, metrics) {
    ctx.save();
    ctx.fillStyle = BS.Utils.cssVar("--color-canvas-grid") || "rgba(0,0,0,0.12)";
    for (var row = 0; row < grid.maxRows; row += 1) {
      for (var col = 0; col < grid.cols; col += 1) {
        if (grid.get(row, col) === null) {
          var center = grid.getCellCenter(row, col, metrics);
          ctx.beginPath();
          ctx.arc(center.x, center.y, Math.max(1.2, metrics.radius * 0.08), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  };

  BS.Game.Renderer.prototype.drawDangerLine = function (ctx, metrics) {
    ctx.save();
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = BS.Utils.cssVar("--color-warning") || "#dc3545";
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(metrics.wallLeft - metrics.radius, metrics.dangerY);
    ctx.lineTo(metrics.wallRight + metrics.radius, metrics.dangerY);
    ctx.stroke();
    ctx.restore();
  };

  BS.Game.Renderer.prototype.drawBubbles = function (ctx, grid, metrics) {
    var self = this;
    grid.eachBubble(metrics, function (cell) {
      self.drawBubble(ctx, cell.x, cell.y, metrics.radius, cell.color, 1);
    });
  };

  BS.Game.Renderer.prototype.drawBubble = function (ctx, x, y, radius, color, alpha) {
    var base = BS.Game.getBubbleColor(color);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
    ctx.shadowBlur = radius * 0.18;
    ctx.shadowOffsetY = radius * 0.1;

    var gradient = ctx.createRadialGradient(
      x - radius * 0.35,
      y - radius * 0.4,
      radius * 0.1,
      x,
      y,
      radius
    );
    gradient.addColorStop(0, "rgba(255,255,255,0.92)");
    gradient.addColorStop(0.22, base);
    gradient.addColorStop(1, "rgba(0,0,0,0.28)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.94, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = Math.max(1, radius * 0.08);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.arc(x - radius * 0.32, y - radius * 0.36, radius * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  BS.Game.Renderer.prototype.drawAim = function (ctx, shooter, metrics) {
    var x = metrics.shooterX;
    var y = metrics.shooterY;
    var dx = Math.cos(shooter.angle);
    var dy = Math.sin(shooter.angle);

    ctx.save();
    ctx.setLineDash([7, 9]);
    ctx.strokeStyle = "rgba(255,255,255,0.86)";
    ctx.lineWidth = Math.max(2, metrics.radius * 0.12);
    ctx.beginPath();
    ctx.moveTo(x, y);

    for (var bounce = 0; bounce < 3; bounce += 1) {
      var tTop = dy < 0 ? (metrics.top + metrics.radius - y) / dy : Infinity;
      var tWall = dx > 0 ? (metrics.wallRight - x) / dx : (metrics.wallLeft - x) / dx;
      var t = Math.min(Math.abs(tTop), Math.abs(tWall), 520);

      if (!isFinite(t) || t <= 0) {
        break;
      }

      x += dx * t;
      y += dy * t;
      ctx.lineTo(x, y);

      if (Math.abs(t - Math.abs(tWall)) < 0.1) {
        dx *= -1;
      } else {
        break;
      }
    }

    ctx.stroke();
    ctx.restore();
  };

  BS.Game.Renderer.prototype.drawShooter = function (ctx, shooter, metrics, time) {
    var pulse = Math.sin((time || 0) / 220) * 0.04 + 1;
    var baseRadius = metrics.radius * 1.28;

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(metrics.shooterX, metrics.shooterY + metrics.radius * 0.88, baseRadius * 1.35, baseRadius * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = BS.Utils.cssVar("--color-surface") || "#fff";
    ctx.strokeStyle = BS.Utils.cssVar("--color-line") || "rgba(0,0,0,0.18)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(metrics.shooterX, metrics.shooterY, baseRadius, Math.PI, 0);
    ctx.lineTo(metrics.shooterX + baseRadius, metrics.shooterY + metrics.radius * 0.72);
    ctx.lineTo(metrics.shooterX - baseRadius, metrics.shooterY + metrics.radius * 0.72);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    this.drawBubble(ctx, metrics.shooterX, metrics.shooterY, metrics.radius * 0.92 * pulse, shooter.currentColor, 1);
    ctx.restore();
  };
})(window.BubbleShooter);
