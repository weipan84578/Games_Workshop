(function (window) {
  "use strict";

  var Pinball = window.Pinball;
  var CONFIG = Pinball.CONFIG;
  var Utils = Pinball.Utils;

  function Renderer(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.w = CONFIG.BOARD.width;
    this.h = CONFIG.BOARD.height;
    this.colors = {};
    this.refreshTheme();
  }

  Renderer.prototype.refreshTheme = function () {
    this.colors = {
      bg: Utils.getCssColor("--c-bg", "#0d0221"),
      surface: Utils.getCssColor("--c-surface", "#1a0b2e"),
      panel: Utils.getCssColor("--c-panel", "#21133a"),
      primary: Utils.getCssColor("--c-primary", "#ff2d95"),
      secondary: Utils.getCssColor("--c-secondary", "#00e5ff"),
      accent: Utils.getCssColor("--c-accent", "#faff00"),
      text: Utils.getCssColor("--c-text", "#ffffff"),
      danger: Utils.getCssColor("--c-danger", "#ff4d5e"),
      success: Utils.getCssColor("--c-success", "#00ff9f")
    };
  };

  Renderer.prototype.render = function (game) {
    var ctx = this.ctx;
    this.refreshTheme();
    ctx.clearRect(0, 0, this.w, this.h);
    this.drawPlayfield(game);
    this.drawWalls(game.walls);
    this.drawRamps(game);
    this.drawTargets(game.targets);
    this.drawBumpers(game.bumpers);
    this.drawFlippers(game.flippers);
    this.drawPlunger(game.plunger, game.balls);
    this.drawBalls(game.balls);
    this.drawLamps(game);
    this.drawBoardText(game);
  };

  Renderer.prototype.drawPlayfield = function (game) {
    var ctx = this.ctx;
    var c = this.colors;
    var bg = ctx.createLinearGradient(0, 0, this.w, this.h);
    bg.addColorStop(0, c.surface);
    bg.addColorStop(0.5, c.bg);
    bg.addColorStop(1, "#05020b");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.save();
    ctx.globalAlpha = 0.17;
    ctx.strokeStyle = c.secondary;
    ctx.lineWidth = 1;
    for (var y = 80; y < this.h; y += 44) {
      ctx.beginPath();
      ctx.moveTo(52, y);
      ctx.lineTo(455, y - 28);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.beginPath();
    ctx.moveTo(452, 164);
    ctx.lineTo(516, 142);
    ctx.lineTo(516, 902);
    ctx.lineTo(452, 902);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 4;
    ctx.shadowColor = c.accent;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(454, 220);
    ctx.lineTo(454, 850);
    ctx.stroke();

    ctx.globalAlpha = 0.35 + game.shooterGatePulse * 0.55;
    ctx.strokeStyle = game.shooterGatePulse > 0 ? c.success : c.secondary;
    ctx.lineWidth = 7;
    ctx.shadowColor = game.shooterGatePulse > 0 ? c.success : c.secondary;
    ctx.shadowBlur = 8 + game.shooterGatePulse * 20;
    ctx.beginPath();
    ctx.moveTo(506, 168);
    ctx.quadraticCurveTo(480, 186, 454, 214);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = c.primary;
    ctx.lineWidth = 8;
    ctx.shadowColor = c.primary;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(98, 735);
    ctx.lineTo(205, 843);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(442, 735);
    ctx.lineTo(335, 843);
    ctx.stroke();
    ctx.restore();

    var saveLeft = Math.max(0, game.ballSaveUntil - performance.now());
    if (saveLeft > 0) {
      ctx.save();
      ctx.globalAlpha = 0.36 + Math.sin(performance.now() / 90) * 0.14;
      ctx.fillStyle = c.success;
      ctx.fillRect(220, 914, 100, 8);
      ctx.restore();
    }
  };

  Renderer.prototype.drawWalls = function (walls) {
    var ctx = this.ctx;
    var c = this.colors;
    ctx.save();
    walls.forEach(function (wall) {
      var isRubber = wall.kind === "rubber" || wall.kind === "gate";
      ctx.strokeStyle = wall.kind === "gate" ? c.success : isRubber ? c.secondary : c.text;
      ctx.globalAlpha = wall.kind === "gate" ? 0.5 : isRubber ? 0.8 : 0.32;
      ctx.lineWidth = isRubber ? 8 : 5;
      ctx.lineCap = "round";
      ctx.shadowColor = isRubber ? ctx.strokeStyle : "transparent";
      ctx.shadowBlur = isRubber ? 12 : 0;
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
    });
    ctx.restore();
  };

  Renderer.prototype.drawRamps = function (game) {
    var ctx = this.ctx;
    var c = this.colors;
    ctx.save();
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = c.secondary;
    ctx.beginPath();
    ctx.arc(274, 492, 156, Math.PI * 0.15, Math.PI * 1.18, true);
    ctx.stroke();

    ctx.globalAlpha = 0.72 + game.rampPulse * 0.2;
    ctx.lineWidth = 5;
    ctx.shadowColor = c.secondary;
    ctx.shadowBlur = 16 + game.rampPulse * 22;
    ctx.beginPath();
    ctx.arc(274, 492, 156, Math.PI * 0.15, Math.PI * 1.18, true);
    ctx.stroke();
    ctx.restore();
  };

  Renderer.prototype.drawBumpers = function (bumpers) {
    var ctx = this.ctx;
    var c = this.colors;
    bumpers.forEach(function (bumper) {
      var pulse = bumper.pulse;
      var r = bumper.r + pulse * 8;
      ctx.save();
      ctx.shadowColor = c.primary;
      ctx.shadowBlur = 18 + pulse * 24;
      ctx.fillStyle = c.primary;
      ctx.globalAlpha = 0.2 + pulse * 0.18;
      ctx.beginPath();
      ctx.arc(bumper.x, bumper.y, r + 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#0b0615";
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(bumper.x, bumper.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = c.text;
      ctx.font = "900 22px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(bumper.label, bumper.x, bumper.y + 1);
      ctx.restore();
    });
  };

  Renderer.prototype.drawTargets = function (targets) {
    var ctx = this.ctx;
    var c = this.colors;
    targets.forEach(function (target) {
      ctx.save();
      ctx.translate(target.x + target.w / 2, target.y + target.h / 2);
      ctx.rotate(target.angle);
      ctx.globalAlpha = target.down ? 0.32 : 1;
      ctx.shadowColor = target.lit ? c.accent : c.secondary;
      ctx.shadowBlur = target.lit ? 18 + target.pulse * 20 : 8;
      ctx.fillStyle = target.lit ? c.accent : c.secondary;
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 2;
      ctx.beginPath();
      roundRect(ctx, -target.w / 2, -target.h / 2, target.w, target.h, 6);
      ctx.fill();
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.restore();
    });
  };

  Renderer.prototype.drawFlippers = function (flippers) {
    var ctx = this.ctx;
    var c = this.colors;
    flippers.forEach(function (flipper) {
      var tip = flipper.tip();
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineWidth = flipper.width;
      ctx.strokeStyle = flipper.active ? c.accent : c.primary;
      ctx.shadowColor = flipper.active ? c.accent : c.primary;
      ctx.shadowBlur = flipper.active ? 20 : 10;
      ctx.beginPath();
      ctx.moveTo(flipper.pivotX, flipper.pivotY);
      ctx.lineTo(tip.x, tip.y);
      ctx.stroke();
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#ffffff";
      ctx.globalAlpha = 0.28;
      ctx.stroke();
      ctx.restore();
    });
  };

  Renderer.prototype.drawPlunger = function (plunger, balls) {
    var ctx = this.ctx;
    var c = this.colors;
    var y = 882 + plunger.charge * 38;
    ctx.save();
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.shadowColor = c.accent;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(491, 912);
    ctx.lineTo(491, y);
    ctx.stroke();
    ctx.fillStyle = c.accent;
    ctx.fillRect(470, y, 42, 9);
    ctx.restore();

    if (balls.some(function (ball) { return ball.inShooter; })) {
      ctx.save();
      ctx.fillStyle = c.text;
      ctx.globalAlpha = 0.75;
      ctx.font = "700 13px Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("LAUNCH", 491, 824);
      ctx.restore();
    }
  };

  Renderer.prototype.drawBalls = function (balls) {
    var ctx = this.ctx;
    var c = this.colors;
    balls.forEach(function (ball) {
      for (var i = 0; i < ball.trail.length; i += 1) {
        var p = ball.trail[i];
        ctx.save();
        ctx.globalAlpha = i / ball.trail.length * 0.22;
        ctx.fillStyle = c.secondary;
        ctx.beginPath();
        ctx.arc(p.x, p.y, ball.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      var grad = ctx.createRadialGradient(ball.x - 4, ball.y - 5, 2, ball.x, ball.y, ball.r + 5);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.38, c.accent);
      grad.addColorStop(1, c.secondary);
      ctx.save();
      ctx.shadowColor = c.secondary;
      ctx.shadowBlur = 14;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  Renderer.prototype.drawLamps = function (game) {
    var ctx = this.ctx;
    var c = this.colors;
    var labels = ["J", "A", "C", "K", "P", "O", "T"];
    var lit = game.jackpotProgress;
    ctx.save();
    labels.forEach(function (label, i) {
      var x = 128 + i * 47;
      var y = 112;
      ctx.globalAlpha = i < lit ? 1 : 0.36;
      ctx.fillStyle = i < lit ? c.accent : c.panel;
      ctx.shadowColor = i < lit ? c.accent : "transparent";
      ctx.shadowBlur = i < lit ? 16 : 0;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = i < lit ? "#050112" : c.text;
      ctx.font = "900 13px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x, y + 1);
    });
    ctx.restore();
  };

  Renderer.prototype.drawBoardText = function (game) {
    var ctx = this.ctx;
    var c = this.colors;
    ctx.save();
    ctx.fillStyle = c.text;
    ctx.globalAlpha = 0.72;
    ctx.font = "900 22px Arial Black, Impact, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("NEON PINBALL", 270, 72);

    if (game.state === "gameover") {
      ctx.globalAlpha = 0.94;
      ctx.fillStyle = c.danger;
      ctx.font = "900 44px Arial Black, Impact, sans-serif";
      ctx.fillText("GAME OVER", 270, 468);
    }
    ctx.restore();
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  function drawAttract(canvas) {
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    var colors = {
      bg: Utils.getCssColor("--c-bg", "#0d0221"),
      surface: Utils.getCssColor("--c-surface", "#1a0b2e"),
      primary: Utils.getCssColor("--c-primary", "#ff2d95"),
      secondary: Utils.getCssColor("--c-secondary", "#00e5ff"),
      accent: Utils.getCssColor("--c-accent", "#faff00"),
      text: Utils.getCssColor("--c-text", "#ffffff")
    };

    ctx.clearRect(0, 0, w, h);
    var bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, colors.surface);
    bg.addColorStop(1, colors.bg);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.strokeStyle = colors.secondary;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 2;
    for (var i = 0; i < 7; i += 1) {
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.34 + i * 22, 42 + i * 18, Math.PI * 0.1, Math.PI * 1.3, true);
      ctx.stroke();
    }
    ctx.restore();

    var bumpers = [
      { x: w * 0.42, y: h * 0.28, r: 22 },
      { x: w * 0.62, y: h * 0.38, r: 26 },
      { x: w * 0.38, y: h * 0.48, r: 20 }
    ];
    bumpers.forEach(function (b, index) {
      ctx.save();
      ctx.shadowColor = index === 1 ? colors.accent : colors.primary;
      ctx.shadowBlur = 18;
      ctx.fillStyle = index === 1 ? colors.accent : colors.primary;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    ctx.save();
    ctx.strokeStyle = colors.primary;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 12;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(w * 0.23, h * 0.78);
    ctx.lineTo(w * 0.48, h * 0.86);
    ctx.moveTo(w * 0.77, h * 0.78);
    ctx.lineTo(w * 0.52, h * 0.86);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = colors.text;
    ctx.font = "900 22px Arial Black, Impact, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("READY", w / 2, h * 0.16);
    ctx.restore();
  }

  Pinball.Renderer = Renderer;
  Pinball.drawAttract = drawAttract;
})(window);
