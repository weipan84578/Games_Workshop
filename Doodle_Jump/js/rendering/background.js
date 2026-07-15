(function (Game) {
  "use strict";
  var palettes = {
    morning: {
      top: "#93d9f3",
      bottom: "#f7e9c9",
      sun: "#ffd979",
      far: "#86b8b8",
      near: "#6cae9a",
      cloud: "#ffffff",
    },
    sky: {
      top: "#73b9ee",
      bottom: "#e3f5fa",
      sun: "#fff0a4",
      far: "#6b9ac1",
      near: "#77b2ae",
      cloud: "#f7fbff",
    },
    sunset: {
      top: "#ef8eb6",
      bottom: "#ffd49b",
      sun: "#ffe18a",
      far: "#826da6",
      near: "#b16f83",
      cloud: "#fff0dc",
    },
    night: {
      top: "#151a44",
      bottom: "#34346e",
      sun: "#ecedff",
      far: "#343768",
      near: "#242753",
      cloud: "#6266a2",
    },
  };
  function drawCloud(ctx, x, y, scale, alpha, color) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, 48 * scale, 13 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(
      x - 30 * scale,
      y + 2 * scale,
      24 * scale,
      14 * scale,
      0,
      0,
      Math.PI * 2,
    );
    ctx.ellipse(
      x + 26 * scale,
      y + 1 * scale,
      31 * scale,
      17 * scale,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();
  }
  function drawMountains(ctx, y, color, offset, height) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.34;
    ctx.beginPath();
    ctx.moveTo(0, y + height);
    for (var x = -90; x < Game.Constants.LOGICAL_WIDTH + 120; x += 90) {
      var peak = y - (32 + ((x / 90) % 3) * 19) * (height / 85);
      ctx.lineTo(x + 45, peak);
      ctx.lineTo(x + 90, y + height);
    }
    ctx.lineTo(Game.Constants.LOGICAL_WIDTH, Game.Constants.LOGICAL_HEIGHT);
    ctx.lineTo(0, Game.Constants.LOGICAL_HEIGHT);
    ctx.closePath();
    ctx.translate(offset, 0);
    ctx.fill();
    ctx.restore();
  }
  function draw(ctx, state) {
    var p = palettes[state.environment] || palettes.morning;
    var gradient = ctx.createLinearGradient(
      0,
      0,
      0,
      Game.Constants.LOGICAL_HEIGHT,
    );
    gradient.addColorStop(0, p.top);
    gradient.addColorStop(1, p.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(
      0,
      0,
      Game.Constants.LOGICAL_WIDTH,
      Game.Constants.LOGICAL_HEIGHT,
    );
    var height = state.score.maxHeight;
    var sunX = 330 + Math.sin(height / 700) * 30;
    var sunY = 105 + Math.sin(height / 500) * 18;
    ctx.save();
    ctx.globalAlpha = state.environment === "night" ? 0.75 : 0.9;
    ctx.fillStyle = p.sun;
    ctx.shadowColor = p.sun;
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(
      sunX,
      sunY,
      state.environment === "night" ? 27 : 38,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();
    if (state.environment === "night") {
      ctx.save();
      ctx.fillStyle = "#fff9c4";
      for (var s = 0; s < 34; s += 1) {
        var sx = (s * 83 + 27) % 420;
        var sy = (s * 47 + 11) % 320;
        ctx.globalAlpha = 0.35 + ((s * 13) % 5) * 0.1;
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.restore();
    }
    var drift = (state.camera.y * 0.06) % 520;
    drawMountains(ctx, 400, p.far, (state.camera.y * 0.018) % 90, 100);
    drawMountains(ctx, 505, p.near, -(state.camera.y * 0.035) % 90, 90);
    drawCloud(
      ctx,
      70 - ((state.camera.y * 0.045) % 520),
      130,
      1.25,
      0.26,
      p.cloud,
    );
    drawCloud(
      ctx,
      310 + ((state.camera.y * 0.025) % 500),
      255,
      0.85,
      0.28,
      p.cloud,
    );
    drawCloud(
      ctx,
      120 - ((state.camera.y * 0.02) % 480),
      455,
      1.05,
      0.2,
      p.cloud,
    );
    drawCloud(ctx, 360 + drift, 590, 0.7, 0.23, p.cloud);
    ctx.save();
    ctx.globalAlpha = state.environment === "night" ? 0.18 : 0.14;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    for (var line = 0; line < 9; line += 1) {
      var lx = ((line * 62 + state.camera.y * 0.08) % 460) - 20;
      ctx.beginPath();
      ctx.moveTo(lx, 0);
      ctx.lineTo(lx - 35, 720);
      ctx.stroke();
    }
    ctx.restore();
  }
  Game.Background = Object.freeze({ draw: draw, palettes: palettes });
})(window.DJGame);
