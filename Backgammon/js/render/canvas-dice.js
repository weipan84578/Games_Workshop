(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  const DOTS = {
    1: [[0.5, 0.5]],
    2: [[0.28, 0.28], [0.72, 0.72]],
    3: [[0.28, 0.28], [0.5, 0.5], [0.72, 0.72]],
    4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
    5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
    6: [[0.28, 0.22], [0.72, 0.22], [0.28, 0.5], [0.72, 0.5], [0.28, 0.78], [0.72, 0.78]],
  };

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  function setup(canvas) {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.width;
    const height = rect.height || canvas.height;
    const dpr = global.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width, height };
  }

  BG.CanvasDice = {
    drawDice(ctx, x, y, size, value, isRolling, rotation) {
      ctx.save();
      ctx.translate(x + size / 2, y + size / 2);
      if (isRolling) ctx.rotate(rotation || 0);
      ctx.translate(-size / 2, -size / 2);

      roundRect(ctx, 0, 0, size, size, size * 0.16);
      const bg = ctx.createLinearGradient(0, 0, size, size);
      bg.addColorStop(0, "#fffdf6");
      bg.addColorStop(0.55, "#f0eee8");
      bg.addColorStop(1, "#d8d4c8");
      ctx.fillStyle = bg;
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.82)";
      ctx.lineWidth = 2;
      roundRect(ctx, 2, 2, size - 4, size - 4, size * 0.14);
      ctx.stroke();

      ctx.strokeStyle = "#5c4a2a";
      ctx.lineWidth = 2.4;
      roundRect(ctx, 0, 0, size, size, size * 0.16);
      ctx.stroke();

      if (!isRolling && value) this.drawDots(ctx, value, size);
      ctx.restore();
    },

    drawDots(ctx, value, size) {
      const radius = size * 0.078;
      (DOTS[value] || []).forEach(([px, py]) => {
        const cx = px * size;
        const cy = py * size;
        ctx.beginPath();
        ctx.arc(cx + 1, cy + 1, radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fill();

        const dot = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
        dot.addColorStop(0, "#cc2200");
        dot.addColorStop(1, "#8b0000");
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = dot;
        ctx.fill();
      });
    },

    render(canvas, dice) {
      const { ctx, width, height } = setup(canvas);
      ctx.clearRect(0, 0, width, height);
      const values = dice && dice.length ? dice.slice(0, 4) : [];
      if (!values.length) {
        ctx.fillStyle = "rgba(255,255,255,0.72)";
        ctx.font = `700 18px ${getComputedStyle(document.body).fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("ROLL", width / 2, height / 2);
        return;
      }
      const count = Math.min(values.length, 4);
      const gap = Math.min(14, Math.max(8, width * 0.035));
      const size = Math.min(58, (width - gap * (count - 1)) / count, height * 0.62);
      const totalWidth = count * size + (count - 1) * gap;
      let x = (width - totalWidth) / 2;
      const y = (height - size) / 2;
      values.slice(0, 4).forEach((value) => {
        this.drawDice(ctx, x, y, size, value, false, 0);
        x += size + gap;
      });
    },
  };
})(window);
