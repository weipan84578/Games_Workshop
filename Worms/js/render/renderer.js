(function (root, factory) {
  var api = factory();
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.Renderer = api.Renderer;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function roundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
  }

  /** Canvas-only battlefield renderer. It never mutates gameplay state. */
  function Renderer(canvas, camera) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.camera = camera;
    this.terrainCanvas = document.createElement("canvas");
    this.terrainCanvas.width = 1920;
    this.terrainCanvas.height = 1080;
    this.cachedTerrainKey = "";
    this.pixelRatio = 1;
  }

  Renderer.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    var ratio = Math.min(2, window.devicePixelRatio || 1);
    var width = Math.max(1, Math.round(rect.width * ratio));
    var height = Math.max(1, Math.round(rect.height * ratio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.pixelRatio = ratio;
    this.camera.resize(rect.width, rect.height);
  };

  Renderer.prototype.rebuildTerrain = function (terrain) {
    var context = this.terrainCanvas.getContext("2d");
    var palette = terrain.palette;
    context.clearRect(0, 0, 1920, 1080);
    var gradient = context.createLinearGradient(0, 360, 0, 1080);
    gradient.addColorStop(0, palette.top);
    gradient.addColorStop(0.08, palette.soil);
    gradient.addColorStop(1, palette.deep);
    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(0, 1080);
    context.lineTo(0, terrain.heights[0]);
    for (var x = 0; x < terrain.heights.length; x += 3)
      context.lineTo(x, terrain.heights[x]);
    context.lineTo(1920, 1080);
    context.closePath();
    context.fill();

    context.strokeStyle = palette.top;
    context.lineWidth = 20;
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(0, terrain.heights[0]);
    for (var px = 0; px < terrain.heights.length; px += 3)
      context.lineTo(px, terrain.heights[px]);
    context.stroke();

    context.save();
    context.globalCompositeOperation = "destination-out";
    terrain.carves.forEach(function (carve) {
      context.beginPath();
      context.arc(carve.x, carve.y, carve.radius, 0, Math.PI * 2);
      context.fill();
    });
    context.restore();
    this.cachedTerrainKey = terrain.seed + ":" + terrain.carves.length;
  };

  Renderer.prototype.drawBackground = function (context, snapshot) {
    var width = this.camera.viewWidth;
    var height = this.camera.viewHeight;
    var palette = snapshot.terrain.palette;
    var gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, palette.sky);
    gradient.addColorStop(1, "#f7eff0");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.fillStyle = "rgba(255,255,255,.72)";
    for (var cloud = 0; cloud < 7; cloud += 1) {
      var x = ((cloud * 279 - this.camera.x * 0.08) % (width + 250)) - 80;
      var y = 80 + (cloud % 3) * 72;
      context.beginPath();
      context.ellipse(x, y, 60, 24, 0, 0, Math.PI * 2);
      context.ellipse(x + 48, y + 4, 42, 20, 0, 0, Math.PI * 2);
      context.fill();
    }
  };

  Renderer.prototype.drawDecorations = function (context, snapshot) {
    var theme = snapshot.terrain.theme;
    context.lineCap = "round";
    for (var i = 0; i < 9; i += 1) {
      var x = 110 + i * 215;
      var y = snapshot.terrain.heights[Math.min(1919, x)] - 7;
      context.save();
      context.translate(x, y);
      if (theme === "candy") {
        context.strokeStyle = "#fff4df";
        context.lineWidth = 12;
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, -72);
        context.stroke();
        context.fillStyle = i % 2 ? "#ff6e9e" : "#79d9ba";
        context.beginPath();
        context.arc(0, -91, 28, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#fff";
        context.lineWidth = 5;
        context.beginPath();
        context.arc(0, -91, 14, 0, Math.PI * 1.6);
        context.stroke();
      } else if (theme === "forest") {
        context.fillStyle = "#76513f";
        context.fillRect(-7, -64, 14, 64);
        context.fillStyle = i % 2 ? "#62b86e" : "#79c989";
        context.beginPath();
        context.arc(0, -76, 34, 0, Math.PI * 2);
        context.arc(-24, -58, 23, 0, Math.PI * 2);
        context.arc(25, -57, 24, 0, Math.PI * 2);
        context.fill();
      } else {
        context.fillStyle = i % 2 ? "#a78bd5" : "#8bd3e7";
        context.beginPath();
        context.moveTo(-35, 0);
        context.lineTo(0, -93);
        context.lineTo(38, 0);
        context.fill();
        context.fillStyle = "#fff9e8";
        context.beginPath();
        context.arc(0, -86, 19, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    }
  };

  Renderer.prototype.drawWorm = function (context, character, active, time) {
    var bob =
      character.grounded && character.alive
        ? Math.sin(time * 2.4 + character.slot) * 2
        : 0;
    context.save();
    context.translate(character.x, character.y + bob);
    if (!character.alive) {
      context.globalAlpha = 0.34;
      context.rotate(Math.PI / 2);
    }
    context.scale(character.facing || 1, 1);
    context.fillStyle = character.color;
    context.strokeStyle = "#34294f";
    context.lineWidth = active ? 6 : 4;
    context.beginPath();
    context.moveTo(-18, 18);
    context.bezierCurveTo(-29, -1, -19, -32, 2, -30);
    context.bezierCurveTo(24, -29, 27, -6, 18, 17);
    context.bezierCurveTo(10, 30, -7, 30, -18, 18);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = "#fff";
    context.beginPath();
    context.ellipse(-7, -12, 6, 9, 0, 0, Math.PI * 2);
    context.ellipse(8, -12, 6, 9, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#34294f";
    context.beginPath();
    context.arc(-5, -10, 2.5, 0, Math.PI * 2);
    context.arc(10, -10, 2.5, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = character.team === 0 ? "#7053b4" : "#d15b54";
    context.lineWidth = 8;
    context.beginPath();
    context.moveTo(-20, -3);
    context.lineTo(20, -3);
    context.stroke();
    context.fillStyle = "rgba(245,79,125,.58)";
    context.beginPath();
    context.arc(-13, 1, 4, 0, Math.PI * 2);
    context.arc(14, 1, 4, 0, Math.PI * 2);
    context.fill();
    if (active) {
      context.fillStyle = "#ffd76e";
      context.strokeStyle = "#34294f";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(0, -62);
      context.lineTo(-10, -44);
      context.lineTo(10, -44);
      context.closePath();
      context.fill();
      context.stroke();
    }
    context.restore();

    if (character.alive) {
      context.fillStyle = "rgba(52,41,79,.24)";
      roundedRect(context, character.x - 25, character.y - 48, 50, 7, 4);
      context.fill();
      context.fillStyle =
        character.hp > 45
          ? "#5fca7c"
          : character.hp > 20
            ? "#f1bc55"
            : "#eb5e74";
      roundedRect(
        context,
        character.x - 25,
        character.y - 48,
        (50 * character.hp) / 100,
        7,
        4,
      );
      context.fill();
    }
  };

  Renderer.prototype.drawAim = function (context, snapshot) {
    if (
      !snapshot.current ||
      snapshot.turn.state !== "PLAYER_CONTROL" ||
      snapshot.targetMode
    )
      return;
    var character = snapshot.current;
    var radians = (snapshot.angle * Math.PI) / 180;
    var facing = character.facing || 1;
    var length = 46 + snapshot.power * 55;
    var endX = character.x + Math.cos(radians) * facing * length;
    var endY = character.y - Math.sin(radians) * length;
    context.strokeStyle = "rgba(255,255,255,.9)";
    context.lineWidth = 4;
    context.setLineDash([9, 10]);
    context.beginPath();
    context.moveTo(character.x, character.y - 4);
    context.lineTo(endX, endY);
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = snapshot.validTarget === false ? "#e84b65" : "#ffd76e";
    context.strokeStyle = "#34294f";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(endX, endY, 8, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  };

  Renderer.prototype.drawEntities = function (context, snapshot) {
    var currentId = snapshot.current && snapshot.current.id;
    snapshot.characters.forEach(function (character) {
      this.drawWorm(
        context,
        character,
        character.id === currentId,
        snapshot.elapsed,
      );
    }, this);
    snapshot.projectiles.forEach(function (projectile) {
      if (projectile.delay > 0) return;
      context.save();
      context.translate(projectile.x, projectile.y);
      context.fillStyle =
        projectile.weaponId === "banana"
          ? "#ffd85e"
          : projectile.weaponId === "holy"
            ? "#fff9ce"
            : "#655274";
      context.strokeStyle = "#34294f";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(0, 0, projectile.radius || 6, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.restore();
    });
    snapshot.placed.forEach(function (entity) {
      context.font = "28px sans-serif";
      context.textAlign = "center";
      context.fillText(
        entity.type === "mine" ? "⚙️" : "🐑",
        entity.x,
        entity.y + 7,
      );
      if (entity.triggered) {
        context.fillStyle = "#e84b65";
        context.beginPath();
        context.arc(entity.x + 13, entity.y - 15, 5, 0, Math.PI * 2);
        context.fill();
      }
    });
    snapshot.effects.forEach(function (effect) {
      var progress = effect.age / effect.life;
      context.globalAlpha = 1 - progress;
      context.strokeStyle = effect.color || "#fff";
      context.lineWidth = 10 * (1 - progress);
      context.beginPath();
      context.arc(
        effect.x,
        effect.y,
        effect.radius * (0.25 + progress),
        0,
        Math.PI * 2,
      );
      context.stroke();
      context.globalAlpha = 1;
    });
    this.drawAim(context, snapshot);
    if (snapshot.targetMode && snapshot.targetPreview) {
      context.fillStyle = snapshot.validTarget
        ? "rgba(76,205,153,.38)"
        : "rgba(232,75,101,.4)";
      context.strokeStyle = snapshot.validTarget ? "#35a77d" : "#d83451";
      context.lineWidth = 5;
      context.beginPath();
      context.arc(
        snapshot.targetPreview.x,
        snapshot.targetPreview.y,
        snapshot.targetMode === "airstrike" ? 120 : 24,
        0,
        Math.PI * 2,
      );
      context.fill();
      context.stroke();
    }
  };

  Renderer.prototype.drawWater = function (context, snapshot) {
    var y = snapshot.turn.waterY;
    var gradient = context.createLinearGradient(0, y, 0, 1080);
    gradient.addColorStop(0, "rgba(80,194,229,.8)");
    gradient.addColorStop(1, "rgba(37,107,183,.96)");
    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(0, y);
    for (var x = 0; x <= 1920; x += 25)
      context.lineTo(x, y + Math.sin(x * 0.025 + snapshot.elapsed * 3) * 7);
    context.lineTo(1920, 1080);
    context.lineTo(0, 1080);
    context.closePath();
    context.fill();
  };

  Renderer.prototype.render = function (snapshot) {
    this.resize();
    var context = this.context;
    var ratio = this.pixelRatio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, this.camera.viewWidth, this.camera.viewHeight);
    this.drawBackground(context, snapshot);
    context.save();
    this.camera.apply(context);
    this.drawDecorations(context, snapshot);
    var terrainKey =
      snapshot.terrain.seed + ":" + snapshot.terrain.carves.length;
    if (terrainKey !== this.cachedTerrainKey)
      this.rebuildTerrain(snapshot.terrain);
    context.drawImage(this.terrainCanvas, 0, 0);
    this.drawEntities(context, snapshot);
    this.drawWater(context, snapshot);
    context.restore();
  };

  return { Renderer: Renderer };
});
