(function (ns) {
  "use strict";

  function readThemeColor(name, fallback) {
    return ns.Helpers.normalizeHexColor(getComputedStyle(document.body).getPropertyValue(name), fallback);
  }

  function TableRenderer(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.staticCanvas = document.createElement("canvas");
    this.staticCanvas.width = ns.Constants.TABLE.WIDTH;
    this.staticCanvas.height = ns.Constants.TABLE.HEIGHT;
    this.staticContext = this.staticCanvas.getContext("2d");
    this.themeKey = "";
    this.renderStatic();
  }

  TableRenderer.prototype.getColors = function () {
    return {
      table: readThemeColor("--color-table", "#12315c"),
      line: readThemeColor("--color-table-line", "#ffffff"),
      rail: readThemeColor("--color-table-rail", "#00e5ff"),
      goal: readThemeColor("--color-goal", "#ff4fd8"),
      puck: readThemeColor("--color-puck", "#ffffff"),
      player: readThemeColor("--color-mallet-player", "#ff4fd8"),
      ai: readThemeColor("--color-mallet-ai", "#00e5ff"),
      warn: readThemeColor("--color-warn", "#ffd447")
    };
  };

  TableRenderer.prototype.renderStatic = function () {
    var ctx = this.staticContext;
    var table = ns.Constants.TABLE;
    var colors = this.getColors();
    this.themeKey = JSON.stringify(colors);

    ctx.clearRect(0, 0, table.WIDTH, table.HEIGHT);
    var gradient = ctx.createLinearGradient(0, 0, table.WIDTH, table.HEIGHT);
    gradient.addColorStop(0, colors.table);
    gradient.addColorStop(1, "rgba(255,255,255,0.18)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, table.WIDTH, table.HEIGHT);

    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = colors.line;
    for (var y = 34; y < table.HEIGHT; y += 34) {
      for (var x = 34; x < table.WIDTH; x += 34) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 5;
    ctx.setLineDash([18, 16]);
    ctx.beginPath();
    ctx.moveTo(34, table.CENTER_Y);
    ctx.lineTo(table.WIDTH - 34, table.CENTER_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(table.WIDTH / 2, table.CENTER_Y, 86, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    this.drawGoalSlot(ctx, table.WIDTH / 2, 0, colors, false);
    this.drawGoalSlot(ctx, table.WIDTH / 2, table.HEIGHT, colors, true);

    ctx.strokeStyle = colors.rail;
    ctx.lineWidth = 7;
    ctx.shadowColor = colors.rail;
    ctx.shadowBlur = 18;
    ctx.strokeRect(10, 10, table.WIDTH - 20, table.HEIGHT - 20);
    ctx.shadowBlur = 0;
  };

  TableRenderer.prototype.drawGoalSlot = function (ctx, centerX, y, colors, bottom) {
    var table = ns.Constants.TABLE;
    var width = table.GOAL_WIDTH;
    var height = 28;
    var x = centerX - width / 2;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.shadowColor = colors.goal;
    ctx.shadowBlur = 18;
    ctx.fillRect(x, bottom ? y - height : y, width, height);
    ctx.strokeStyle = colors.goal;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x, bottom ? y - height : y + height);
    ctx.lineTo(x + width, bottom ? y - height : y + height);
    ctx.stroke();
    ctx.restore();
  };

  TableRenderer.prototype.draw = function () {
    var colors = this.getColors();
    if (this.themeKey !== JSON.stringify(colors)) {
      this.renderStatic();
    }
    this.context.drawImage(this.staticCanvas, 0, 0);
  };

  function isInsideGoalX(x) {
    var table = ns.Constants.TABLE;
    var half = table.GOAL_WIDTH / 2;
    return x >= table.WIDTH / 2 - half && x <= table.WIDTH / 2 + half;
  }

  function clampMallet(position, isPlayer) {
    var table = ns.Constants.TABLE;
    var radius = table.MALLET_RADIUS;
    var minY = isPlayer ? table.PLAYER_MIN_Y + radius : radius;
    var maxY = isPlayer ? table.HEIGHT - radius : table.AI_MAX_Y - radius;
    return {
      x: ns.Helpers.clamp(position.x, radius + 12, table.WIDTH - radius - 12),
      y: ns.Helpers.clamp(position.y, minY, maxY)
    };
  }

  ns.Table = {
    Renderer: TableRenderer,
    isInsideGoalX: isInsideGoalX,
    clampMallet: clampMallet
  };
})(window.AirHockey = window.AirHockey || {});
