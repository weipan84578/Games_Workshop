(function (root) {
  "use strict";

  var cg = (root.CastleGame = root.CastleGame || {});
  var Particle = (cg.Particles = {});
  var pool = [];
  var active = [];
  var qualityLimits = {
    low: 110,
    medium: 220,
    high: cg.Constants.MAX_PARTICLES,
    auto: 220,
  };
  var textEffects = [];

  function acquire() {
    var item = pool.pop() || {};
    active.push(item);
    return item;
  }
  function release(item) {
    var index = active.indexOf(item);
    if (index >= 0) active.splice(index, 1);
    pool.push(item);
  }
  function spawn(x, y, options) {
    var limit = qualityLimits[cg.Utils.getQuality()] || qualityLimits.medium;
    if (active.length >= limit) return null;
    var p = acquire();
    p.x = x;
    p.y = y;
    p.vx = options.vx || 0;
    p.vy = options.vy || 0;
    p.life = options.life || 0.5;
    p.maxLife = p.life;
    p.size = options.size || 0.008;
    p.color = options.color || "#fff";
    p.gravity = options.gravity || 0;
    p.kind = options.kind || "dot";
    p.rotation = options.rotation || 0;
    p.spin = options.spin || 0;
    p.text = options.text || "";
    return p;
  }
  Particle.reset = function () {
    while (active.length) pool.push(active.pop());
    textEffects.length = 0;
  };
  Particle.burst = function (x, y, color, amount, spread) {
    var count = Math.min(
      amount || 10,
      cg.Utils.getQuality() === "low" ? 7 : 22,
    );
    for (var i = 0; i < count; i += 1) {
      var angle = Math.random() * Math.PI * 2;
      var speed = cg.Utils.rand(0.03, spread || 0.22);
      spawn(x, y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: cg.Utils.rand(0.25, 0.72),
        size: cg.Utils.rand(0.003, 0.011),
        color: color,
        gravity: 0.18,
        kind: i % 4 === 0 ? "star" : "dot",
        rotation: angle,
        spin: cg.Utils.rand(-4, 4),
      });
    }
  };
  Particle.trail = function (x, y, color) {
    spawn(x, y, {
      vx: cg.Utils.rand(-0.012, 0.012),
      vy: cg.Utils.rand(-0.012, 0.012),
      life: 0.25,
      size: cg.Utils.rand(0.004, 0.012),
      color: color,
      kind: "smoke",
    });
  };
  Particle.shockwave = function (x, y, color) {
    spawn(x, y, { life: 0.5, size: 0.015, color: color, kind: "ring" });
  };
  Particle.text = function (x, y, text, color) {
    textEffects.push({
      x: x,
      y: y,
      text: text,
      color: color || "#fff",
      life: 1.05,
      maxLife: 1.05,
    });
  };
  Particle.update = function (dt) {
    for (var i = active.length - 1; i >= 0; i -= 1) {
      var p = active[i];
      p.life -= dt;
      if (p.life <= 0) {
        release(p);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.rotation += p.spin * dt;
    }
    for (var j = textEffects.length - 1; j >= 0; j -= 1) {
      textEffects[j].life -= dt;
      textEffects[j].y -= dt * 0.045;
      if (textEffects[j].life <= 0) textEffects.splice(j, 1);
    }
  };
  Particle.draw = function (ctx, width, height) {
    ctx.save();
    active.forEach(function (p) {
      var opacity = cg.Utils.clamp(p.life / p.maxLife, 0, 1);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;
      var x = p.x * width;
      var y = p.y * height;
      var size =
        p.size *
        Math.min(width, height) *
        (p.kind === "ring" ? 1 + (1 - opacity) * 4 : 1);
      if (p.kind === "ring") {
        ctx.globalAlpha *= 0.8;
        ctx.lineWidth = Math.max(1, size * 0.18);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.kind === "star") {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -size * 2);
        ctx.lineTo(size * 0.6, -size * 0.55);
        ctx.lineTo(size * 2, 0);
        ctx.lineTo(size * 0.6, size * 0.55);
        ctx.lineTo(0, size * 2);
        ctx.lineTo(-size * 0.6, size * 0.55);
        ctx.lineTo(-size * 2, 0);
        ctx.lineTo(-size * 0.6, -size * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, size), 0, Math.PI * 2);
        ctx.fill();
      }
    });
    textEffects.forEach(function (effect) {
      ctx.globalAlpha = cg.Utils.clamp(effect.life / effect.maxLife, 0, 1);
      ctx.fillStyle = effect.color;
      ctx.font =
        "900 " +
        Math.max(16, Math.min(width, height) * 0.035) +
        "px Trebuchet MS, sans-serif";
      ctx.textAlign = "center";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(8, 18, 46, .72)";
      ctx.strokeText(effect.text, effect.x * width, effect.y * height);
      ctx.fillText(effect.text, effect.x * width, effect.y * height);
    });
    ctx.restore();
    ctx.globalAlpha = 1;
  };
  Particle.count = function () {
    return active.length;
  };
})(window);
