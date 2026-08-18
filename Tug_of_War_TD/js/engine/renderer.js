(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};
  var world = app.Config.world;

  function roundedRect(ctx, x, y, width, height, radius) {
    var r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function Renderer(canvas, stage) {
    this.canvas = canvas;
    this.stage = stage;
    this.ctx = canvas.getContext("2d");
    this.width = 600;
    this.height = 400;
    this.scaleX = 1;
    this.scaleY = 1;
    this.pixelRatio = 1;
    this.time = 0;
    this.resize();
  }

  Renderer.prototype.resize = function () {
    var width = Math.max(320, this.stage.clientWidth || 600);
    var height = Math.max(260, this.stage.clientHeight || 400);
    this.pixelRatio = Math.min(2, global.devicePixelRatio || 1);
    this.width = width;
    this.height = height;
    this.canvas.width = Math.round(width * this.pixelRatio);
    this.canvas.height = Math.round(height * this.pixelRatio);
    this.scaleX = width / world.width;
    this.scaleY = height / world.height;
    this.ctx.setTransform(this.scaleX * this.pixelRatio, 0, 0, this.scaleY * this.pixelRatio, 0, 0);
  };

  Renderer.prototype.color = function (name, fallback) {
    var value = global.getComputedStyle(document.body).getPropertyValue(name).trim();
    return value || fallback;
  };

  Renderer.prototype.render = function (session, delta) {
    if (!this.ctx) {
      return;
    }
    this.time += delta;
    var ctx = this.ctx;
    ctx.setTransform(this.scaleX * this.pixelRatio, 0, 0, this.scaleY * this.pixelRatio, 0, 0);
    ctx.clearRect(0, 0, world.width, world.height);
    this.drawBackground(ctx);
    this.drawLane(ctx);
    this.drawBase(ctx, session.playerBase);
    this.drawBase(ctx, session.enemyBase);
    var units = session.playerUnits.units.concat(session.enemyUnits.units).sort(function (a, b) { return a.y - b.y; });
    units.forEach(this.drawUnit.bind(this, ctx));
    this.drawEffects(ctx, session.effects || []);
  };

  Renderer.prototype.drawBackground = function (ctx) {
    var top = this.color("--sky-top", "#ffd9e8");
    var bottom = this.color("--sky-bottom", "#fff7dc");
    var ground = this.color("--ground", "#a8d994");
    var groundDark = this.color("--ground-dark", "#70b776");
    var gradient = ctx.createLinearGradient(0, 0, 0, world.height);
    gradient.addColorStop(0, top);
    gradient.addColorStop(.72, bottom);
    gradient.addColorStop(1, ground);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, world.width, world.height);
    ctx.globalAlpha = .55;
    ctx.fillStyle = "#ffffff";
    [110, 420, 760].forEach(function (x, index) {
      var drift = Math.sin(this.time * .15 + index) * 18;
      ctx.beginPath();
      ctx.arc(x + drift, 95 + index * 30, 24, 0, Math.PI * 2);
      ctx.arc(x + 30 + drift, 90 + index * 30, 31, 0, Math.PI * 2);
      ctx.arc(x + 63 + drift, 98 + index * 30, 21, 0, Math.PI * 2);
      ctx.fill();
    }, this);
    ctx.globalAlpha = .55;
    ctx.fillStyle = groundDark;
    for (var treeX = 35; treeX < world.width; treeX += 86) {
      var treeY = 265 + Math.sin(treeX * .4) * 7;
      ctx.beginPath();
      ctx.arc(treeX, treeY, 23, 0, Math.PI * 2);
      ctx.arc(treeX + 17, treeY + 3, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8e643f";
      ctx.fillRect(treeX - 3, treeY + 18, 6, 22);
      ctx.fillStyle = groundDark;
    }
    ctx.globalAlpha = 1;
  };

  Renderer.prototype.drawLane = function (ctx) {
    var y = world.laneY;
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(102, 66, 50, .18)";
    ctx.lineWidth = 68;
    ctx.beginPath();
    ctx.moveTo(90, y + 9);
    ctx.lineTo(910, y + 9);
    ctx.stroke();
    ctx.strokeStyle = "#c88a50";
    ctx.lineWidth = 52;
    ctx.beginPath();
    ctx.moveTo(90, y);
    ctx.lineTo(910, y);
    ctx.stroke();
    ctx.strokeStyle = "#f2c77c";
    ctx.lineWidth = 41;
    ctx.beginPath();
    ctx.moveTo(90, y - 2);
    ctx.lineTo(910, y - 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.45)";
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 17]);
    ctx.beginPath();
    ctx.moveTo(93, y - 12);
    ctx.lineTo(907, y - 12);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,255,255,.72)";
    ctx.beginPath();
    ctx.arc(500, y - 1, 34 + Math.sin(this.time * 2) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#b66a37";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(500, y - 32);
    ctx.lineTo(500, y + 33);
    ctx.stroke();
    ctx.restore();
  };

  Renderer.prototype.drawBase = function (ctx, base) {
    var x = base.x;
    var y = base.y - 70;
    var shake = base.shake > 0 ? Math.sin(base.shake * 90) * 3 : 0;
    var isPlayer = base.side === "player";
    ctx.save();
    ctx.translate(shake, 0);
    ctx.shadowColor = "rgba(48, 27, 42, .22)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = isPlayer ? "#f3a9bd" : "#bb7cc4";
    roundedRect(ctx, x - 48, y, 96, 83, 17);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.fillStyle = isPlayer ? "#fff0f4" : "#f7e7ff";
    roundedRect(ctx, x - 39, y + 20, 78, 63, 12);
    ctx.fill();
    ctx.fillStyle = isPlayer ? "#df628f" : "#874ba2";
    ctx.beginPath();
    ctx.moveTo(x - 55, y + 8);
    ctx.lineTo(x - 36, y - 23);
    ctx.lineTo(x - 18, y + 8);
    ctx.lineTo(x, y - 29);
    ctx.lineTo(x + 18, y + 8);
    ctx.lineTo(x + 36, y - 23);
    ctx.lineTo(x + 55, y + 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#8a5c3f";
    roundedRect(ctx, x - 13, y + 45, 26, 38, 7);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "23px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isPlayer ? "🐱" : "👹", x, y + 15);
    ctx.restore();
    ctx.fillStyle = "rgba(48, 27, 42, .2)";
    roundedRect(ctx, x - 51, y - 43, 102, 9, 5);
    ctx.fill();
    ctx.fillStyle = isPlayer ? "#42bda9" : "#e84f68";
    roundedRect(ctx, x - 49, y - 41, 98 * app.utils.percent(base.hp, base.maxHp) / 100, 5, 3);
    ctx.fill();
  };

  Renderer.prototype.drawUnit = function (ctx, unit) {
    var y = app.PathManager.getY(unit.x, this.time) - 31;
    var size = unit.def.size;
    ctx.save();
    ctx.translate(unit.x, y);
    ctx.globalAlpha = unit.spawnPulse > 0 ? 1 : 1;
    if (unit.spawnPulse > 0) {
      ctx.scale(1 + unit.spawnPulse * .3, 1 + unit.spawnPulse * .3);
    }
    ctx.shadowColor = "rgba(40, 30, 48, .22)";
    ctx.shadowBlur = 9;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = unit.hitFlash > 0 ? "#fff" : unit.def.color;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = unit.side === "player" ? "#fff" : "#5f315d";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.font = Math.max(18, size * 1.26) + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(unit.def.icon, 0, 1);
    ctx.restore();
    ctx.fillStyle = "rgba(47, 28, 45, .22)";
    roundedRect(ctx, unit.x - size, y - size - 12, size * 2, 6, 3);
    ctx.fill();
    ctx.fillStyle = unit.side === "player" ? "#35af87" : "#e65366";
    roundedRect(ctx, unit.x - size, y - size - 12, size * 2 * app.utils.percent(unit.hp, unit.maxHp) / 100, 6, 3);
    ctx.fill();
    if (unit.def.attackType === "ranged") {
      ctx.fillStyle = "rgba(255,255,255,.85)";
      ctx.beginPath();
      ctx.arc(unit.x + (unit.side === "player" ? size + 7 : -size - 7), y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  Renderer.prototype.drawEffects = function (ctx, effects) {
    effects.forEach(function (effect) {
      var alpha = app.utils.clamp(effect.life / .25, 0, 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = effect.color || "#fff";
      ctx.fillStyle = effect.color || "#fff";
      ctx.lineWidth = effect.type === "heal" ? 4 : 5;
      if (effect.type === "heal") {
        ctx.beginPath();
        ctx.arc(effect.x, effect.y - 28, 12 + (1 - alpha) * 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("+", effect.x, effect.y - 25);
      } else {
        ctx.beginPath();
        ctx.moveTo(effect.x1, effect.y1 - 28);
        ctx.lineTo(effect.x2, effect.y2 - 28);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(effect.x2, effect.y2 - 28, 5 + (1 - alpha) * 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  };

  app.Renderer = Renderer;
})(window);
