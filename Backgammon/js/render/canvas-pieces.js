(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  function themeColor(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  BG.CanvasPieces = {
    drawPiece(ctx, x, y, radius, color, options) {
      const opts = options || {};
      const isWhite = color === BG.COLOR.PLAYER;
      const mainColor = isWhite ? themeColor("--color-piece-white", "#f5f0e8") : themeColor("--color-piece-black", "#2c2416");
      const highlightColor = isWhite ? "#ffffff" : "#5b4b63";
      const shadowColor = isWhite ? "#b8ad98" : "#08070b";
      const rimColor = isWhite ? "#8b7355" : "#140f0a";

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.38)";
      ctx.shadowBlur = 9;
      ctx.shadowOffsetY = 4;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      const rimGradient = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.35, 1, x, y, radius);
      rimGradient.addColorStop(0, highlightColor);
      rimGradient.addColorStop(1, rimColor);
      ctx.fillStyle = rimGradient;
      ctx.fill();

      ctx.shadowBlur = 0;
      const innerRadius = radius * 0.86;
      ctx.beginPath();
      ctx.arc(x, y, innerRadius, 0, Math.PI * 2);
      const bodyGradient = ctx.createRadialGradient(
        x - innerRadius * 0.35,
        y - innerRadius * 0.35,
        innerRadius * 0.12,
        x,
        y,
        innerRadius
      );
      bodyGradient.addColorStop(0, highlightColor);
      bodyGradient.addColorStop(0.42, mainColor);
      bodyGradient.addColorStop(1, shadowColor);
      ctx.fillStyle = bodyGradient;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(x - innerRadius * 0.22, y - innerRadius * 0.32, innerRadius * 0.34, innerRadius * 0.18, -0.35, 0, Math.PI * 2);
      ctx.fillStyle = isWhite ? "rgba(255,255,255,0.58)" : "rgba(255,255,255,0.14)";
      ctx.fill();

      if (opts.selected) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = themeColor("--color-highlight", "#ffd700");
        ctx.lineWidth = 4;
        ctx.shadowColor = themeColor("--color-highlight", "#ffd700");
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (opts.label) {
        ctx.fillStyle = isWhite ? "#3d2b1f" : "#f5f0e8";
        ctx.font = `700 ${Math.max(14, radius * 0.82)}px ${getComputedStyle(document.body).fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(opts.label), x, y + 1);
      }
      ctx.restore();
    },
  };
})(window);
