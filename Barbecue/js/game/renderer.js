(function exposeRenderer(root, factory) {
  var GameRenderer = factory(root);
  root.BBQ = root.BBQ || {};
  root.BBQ.GameRenderer = GameRenderer;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = GameRenderer;
  }
})(typeof window !== "undefined" ? window : globalThis, function rendererFactory(root) {
  "use strict";

  var GrillLogic = root.BBQ && root.BBQ.GrillLogic;

  function GameRenderer(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = 1280;
    this.height = 800;
    this.layout = { slots: [] };
    this.resize();
  }

  GameRenderer.prototype.resize = function resize() {
    var rect = this.canvas.getBoundingClientRect ? this.canvas.getBoundingClientRect() : { width: 1280, height: 800 };
    var displayWidth = Math.max(320, rect.width || 1280);
    var displayHeight = Math.max(220, rect.height || Math.round(displayWidth * 0.625));
    var dpr = Math.max(1, Math.min(2, root.devicePixelRatio || 1));
    this.canvas.width = Math.round(displayWidth * dpr);
    this.canvas.height = Math.round(displayHeight * dpr);
    this.canvas.style.width = displayWidth + "px";
    this.canvas.style.height = displayHeight + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = displayWidth;
    this.height = displayHeight;
    this.updateLayout();
  };

  GameRenderer.prototype.updateLayout = function updateLayout() {
    var marginX = this.width * 0.07;
    var grillY = this.height * 0.26;
    var grillW = this.width - marginX * 2;
    var grillH = this.height * 0.5;
    var gap = grillW * 0.018;
    var cols = 3;
    var rows = 2;
    var slotW = (grillW - gap * (cols + 1)) / cols;
    var slotH = (grillH - gap * (rows + 1)) / rows;
    var slots = [];

    for (var row = 0; row < rows; row += 1) {
      for (var col = 0; col < cols; col += 1) {
        slots.push({
          id: row * cols + col,
          x: marginX + gap + col * (slotW + gap),
          y: grillY + gap + row * (slotH + gap),
          w: slotW,
          h: slotH
        });
      }
    }

    this.layout = {
      grill: { x: marginX, y: grillY, w: grillW, h: grillH },
      slots: slots
    };
  };

  GameRenderer.prototype.render = function render(state) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    this.drawBackground(ctx);
    this.drawGrill(ctx);
    this.drawSlots(ctx, state);
    this.drawMascot(ctx, state);

    if (state.paused) {
      this.drawOverlayText(ctx, state.pauseText || "Paused");
    }
  };

  GameRenderer.prototype.drawBackground = function drawBackground(ctx) {
    var gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, "#fff8e8");
    gradient.addColorStop(0.52, "#ffe9cc");
    gradient.addColorStop(1, "#bdebd7");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.58)";
    for (var i = 0; i < 12; i += 1) {
      var x = (i * 113) % this.width;
      var y = 20 + (i * 47) % (this.height * 0.34);
      ctx.beginPath();
      ctx.roundRect(x, y, 48, 14, 8);
      ctx.fill();
    }

    ctx.fillStyle = "#f4a261";
    ctx.fillRect(0, this.height * 0.78, this.width, this.height * 0.22);
    ctx.fillStyle = "rgba(75, 47, 32, 0.12)";
    for (var line = 0; line < 8; line += 1) {
      ctx.fillRect(0, this.height * 0.8 + line * 22, this.width, 2);
    }
  };

  GameRenderer.prototype.drawGrill = function drawGrill(ctx) {
    var grill = this.layout.grill;
    ctx.save();
    ctx.fillStyle = "#3a2c2a";
    ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.beginPath();
    ctx.roundRect(grill.x, grill.y, grill.w, grill.h, 18);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#8c2f1d";
    for (var coal = 0; coal < 20; coal += 1) {
      var cx = grill.x + 32 + (coal * 67) % Math.max(1, grill.w - 64);
      var cy = grill.y + grill.h - 38 - (coal % 3) * 12;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 18, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "#f7d8a8";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    for (var x = grill.x + 28; x < grill.x + grill.w - 24; x += 38) {
      ctx.beginPath();
      ctx.moveTo(x, grill.y + 20);
      ctx.lineTo(x, grill.y + grill.h - 22);
      ctx.stroke();
    }
    for (var y = grill.y + 28; y < grill.y + grill.h - 24; y += 42) {
      ctx.beginPath();
      ctx.moveTo(grill.x + 22, y);
      ctx.lineTo(grill.x + grill.w - 22, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  GameRenderer.prototype.drawSlots = function drawSlots(ctx, state) {
    this.layout.slots.forEach(function drawSlot(slot) {
      var selected = state.selectedSlot === slot.id;
      ctx.save();
      ctx.strokeStyle = selected ? "#ffffff" : "rgba(255, 255, 255, 0.28)";
      ctx.lineWidth = selected ? 5 : 2;
      ctx.setLineDash(selected ? [] : [8, 10]);
      ctx.beginPath();
      ctx.roundRect(slot.x + 6, slot.y + 6, slot.w - 12, slot.h - 12, 14);
      ctx.stroke();
      ctx.restore();

      var food = state.foods[slot.id];
      if (food) {
        this.drawFood(ctx, food, slot, selected);
      }
    }, this);
  };

  GameRenderer.prototype.drawFood = function drawFood(ctx, food, slot, selected) {
    var type = GrillLogic.getFoodType(food.typeId);
    var state = GrillLogic.getFoodState(food);
    var progress = GrillLogic.getCookProgress(food);
    var ratio = Math.max(progress[0], progress[1]);
    var scorch = state === GrillLogic.DONENESS.BURNT ? 1 : Math.max(0, ratio - 0.55) * 0.52;
    var x = slot.x + slot.w / 2;
    var y = slot.y + slot.h / 2;
    var w = slot.w * 0.56;
    var h = slot.h * 0.34;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(food.activeSide === 1 ? -0.08 : 0.08);
    ctx.fillStyle = mixColor(type.color, "#3a241e", Math.min(0.58, scorch));
    ctx.strokeStyle = selected ? "#ffffff" : "rgba(48, 36, 31, 0.34)";
    ctx.lineWidth = selected ? 5 : 3;

    if (food.typeId === "corn") {
      drawCob(ctx, w, h, type, scorch);
    } else if (food.typeId === "mushroom") {
      drawMushroom(ctx, w, h, type, scorch);
    } else if (food.typeId === "shrimp") {
      drawShrimp(ctx, w, h, type, scorch);
    } else {
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, h / 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = type.accent;
      for (var stripe = -w / 2 + 18; stripe < w / 2; stripe += 28) {
        ctx.fillRect(stripe, -h / 2 + 4, 8, h - 8);
      }
    }

    drawFace(ctx, state, w, h);
    ctx.restore();

    this.drawProgress(ctx, slot, progress, state, food.activeSide);
  };

  GameRenderer.prototype.drawProgress = function drawProgress(ctx, slot, progress, state, activeSide) {
    var barW = slot.w * 0.64;
    var x = slot.x + (slot.w - barW) / 2;
    var y = slot.y + slot.h - 24;
    var barGap = 5;
    var halfW = (barW - barGap) / 2;
    ctx.save();
    for (var side = 0; side < 2; side += 1) {
      var sideX = x + side * (halfW + barGap);
      var cooked = progress[side] >= 1;
      ctx.fillStyle = activeSide === side ? "rgba(255, 255, 255, 0.94)" : "rgba(255, 255, 255, 0.68)";
      ctx.beginPath();
      ctx.roundRect(sideX, y, halfW, 11, 6);
      ctx.fill();
      ctx.fillStyle = state === GrillLogic.DONENESS.BURNT ? "#2b1a16" : cooked ? "#57b86b" : state === GrillLogic.DONENESS.PERFECT ? "#57b86b" : "#f6c445";
      ctx.beginPath();
      ctx.roundRect(sideX, y, halfW * Math.min(1, progress[side]), 11, 6);
      ctx.fill();
      if (activeSide === side) {
        ctx.strokeStyle = "rgba(48, 36, 31, 0.32)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(sideX - 2, y - 2, halfW + 4, 15, 8);
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  GameRenderer.prototype.drawMascot = function drawMascot(ctx, state) {
    var x = this.width * 0.83;
    var y = this.height * 0.15;
    ctx.save();
    ctx.fillStyle = "#fff4df";
    ctx.strokeStyle = "#6e4b3a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x - 54, y - 42, 108, 84, 28);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#6e4b3a";
    ctx.beginPath();
    ctx.arc(x - 20, y - 4, 4, 0, Math.PI * 2);
    ctx.arc(x + 20, y - 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#6e4b3a";
    ctx.beginPath();
    ctx.arc(x, y + 10, 16, 0.1, Math.PI - 0.1);
    ctx.stroke();
    ctx.fillStyle = "#ff7a45";
    ctx.fillRect(x - 42, y - 56, 84, 18);
    ctx.restore();

    if (state.message) {
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.strokeStyle = "rgba(80, 55, 42, 0.22)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(this.width * 0.06, this.height * 0.06, this.width * 0.56, 50, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#30241f";
      ctx.font = "800 20px Segoe UI, sans-serif";
      ctx.fillText(state.message, this.width * 0.08, this.height * 0.06 + 32);
      ctx.restore();
    }
  };

  GameRenderer.prototype.drawOverlayText = function drawOverlayText(ctx, text) {
    ctx.save();
    ctx.fillStyle = "rgba(28, 23, 20, 0.52)";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 42px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, this.width / 2, this.height / 2);
    ctx.restore();
  };

  GameRenderer.prototype.hitTest = function hitTest(clientX, clientY) {
    var rect = this.canvas.getBoundingClientRect();
    var x = clientX - rect.left;
    var y = clientY - rect.top;
    var slot = this.layout.slots.find(function contains(candidate) {
      return x >= candidate.x && x <= candidate.x + candidate.w && y >= candidate.y && y <= candidate.y + candidate.h;
    });
    return slot ? slot.id : null;
  };

  function mixColor(hexA, hexB, amount) {
    var a = hexToRgb(hexA);
    var b = hexToRgb(hexB);
    var t = Math.max(0, Math.min(1, amount));
    return "rgb(" + Math.round(a.r + (b.r - a.r) * t) + "," + Math.round(a.g + (b.g - a.g) * t) + "," + Math.round(a.b + (b.b - a.b) * t) + ")";
  }

  function hexToRgb(hex) {
    var clean = hex.replace("#", "");
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16)
    };
  }

  function drawCob(ctx, w, h, type) {
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, h / 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = type.accent;
    for (var dot = -w / 2 + 8; dot < w / 2 - 4; dot += 15) {
      ctx.beginPath();
      ctx.arc(dot, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawMushroom(ctx, w, h, type) {
    ctx.fillStyle = type.accent;
    ctx.beginPath();
    ctx.roundRect(-w * 0.16, -h * 0.05, w * 0.32, h * 0.82, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = type.color;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h * 0.86, 24);
    ctx.fill();
    ctx.stroke();
  }

  function drawShrimp(ctx, w, h, type) {
    ctx.strokeStyle = type.color;
    ctx.lineWidth = h * 0.42;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.3, 0.2, Math.PI * 1.75);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.3, 0.5, Math.PI * 1.4);
    ctx.stroke();
  }

  function drawFace(ctx, state, w, h) {
    ctx.fillStyle = state === GrillLogic.DONENESS.BURNT ? "#fff1d2" : "#4f352b";
    ctx.beginPath();
    ctx.arc(-w * 0.16, -h * 0.02, 3.5, 0, Math.PI * 2);
    ctx.arc(w * 0.16, -h * 0.02, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = state === GrillLogic.DONENESS.BURNT ? "#fff1d2" : "#4f352b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (state === GrillLogic.DONENESS.BURNT) {
      ctx.moveTo(-8, h * 0.16);
      ctx.lineTo(8, h * 0.16);
    } else {
      ctx.arc(0, h * 0.04, 8, 0.1, Math.PI - 0.1);
    }
    ctx.stroke();
  }

  return GameRenderer;
});
