(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  function css(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function setupCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 900;
    const height = rect.height || 620;
    const dpr = global.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width, height };
  }

  function createLayout(width, height) {
    const margin = Math.max(14, Math.min(width, height) * 0.032);
    const label = Math.max(18, height * 0.052);
    const board = { x: margin, y: margin, w: width - margin * 2, h: height - margin * 2 };
    const pointW = board.w / 13;
    const bar = { x: board.x + pointW * 6, y: board.y, w: pointW, h: board.h };
    const playTop = board.y + label;
    const playBottom = board.y + board.h - label;
    const pointH = (playBottom - playTop) * 0.42;
    const areas = {};

    const colForIndex = (index) => (index < 6 ? index : index + 1);
    BG.POINT_ROWS.top.forEach((point, index) => {
      const col = colForIndex(index);
      areas[point] = {
        point,
        x: board.x + col * pointW,
        y: playTop,
        w: pointW,
        h: pointH,
        centerX: board.x + col * pointW + pointW / 2,
        top: true,
      };
    });
    BG.POINT_ROWS.bottom.forEach((point, index) => {
      const col = colForIndex(index);
      areas[point] = {
        point,
        x: board.x + col * pointW,
        y: playBottom - pointH,
        w: pointW,
        h: pointH,
        centerX: board.x + col * pointW + pointW / 2,
        top: false,
      };
    });

    return {
      margin,
      label,
      board,
      pointW,
      pointH,
      bar,
      playTop,
      playBottom,
      areas,
      radius: BG.clamp(pointW * 0.37, 12, 30),
    };
  }

  function drawTriangle(ctx, area, index) {
    const dark = css("--color-board-dark", "#8b4513");
    const light = css("--color-board-light", "#deb887");
    ctx.beginPath();
    if (area.top) {
      ctx.moveTo(area.x, area.y);
      ctx.lineTo(area.x + area.w, area.y);
      ctx.lineTo(area.centerX, area.y + area.h);
    } else {
      ctx.moveTo(area.x, area.y + area.h);
      ctx.lineTo(area.x + area.w, area.y + area.h);
      ctx.lineTo(area.centerX, area.y);
    }
    ctx.closePath();
    ctx.fillStyle = index % 2 === 0 ? dark : light;
    ctx.fill();
  }

  function drawHighlight(ctx, area, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.38;
    ctx.beginPath();
    if (area.top) {
      ctx.moveTo(area.x, area.y);
      ctx.lineTo(area.x + area.w, area.y);
      ctx.lineTo(area.centerX, area.y + area.h);
    } else {
      ctx.moveTo(area.x, area.y + area.h);
      ctx.lineTo(area.x + area.w, area.y + area.h);
      ctx.lineTo(area.centerX, area.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawLabels(ctx, layout) {
    ctx.fillStyle = "rgba(0,0,0,0.62)";
    ctx.font = `700 ${Math.max(12, layout.label * 0.58)}px ${getComputedStyle(document.body).fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    Object.values(layout.areas).forEach((area) => {
      const y = area.top ? layout.board.y + layout.label * 0.42 : layout.board.y + layout.board.h - layout.label * 0.42;
      ctx.fillText(String(area.point), area.centerX, y);
    });
  }

  function stackPositions(area, layout, count) {
    const positions = [];
    const radius = layout.radius;
    const step = Math.min(radius * 1.72, (layout.pointH - radius * 2) / Math.max(1, Math.min(count, 5) - 1 || 1));
    for (let index = 0; index < Math.min(count, 5); index += 1) {
      const y = area.top ? area.y + radius + index * step : area.y + area.h - radius - index * step;
      positions.push({ x: area.centerX, y });
    }
    return positions;
  }

  function drawPieces(ctx, layout, game) {
    const selected = game.selectedPoint;
    for (let point = 1; point <= 24; point += 1) {
      const checker = game.board.points[point];
      if (!checker.count) continue;
      const area = layout.areas[point];
      const positions = stackPositions(area, layout, checker.count);
      positions.forEach((pos, index) => {
        const label = checker.count > 5 && index === positions.length - 1 ? checker.count : "";
        BG.CanvasPieces.drawPiece(ctx, pos.x, pos.y, layout.radius, checker.color, {
          selected: selected === point && index === positions.length - 1,
          label,
        });
      });
    }

    drawBarPieces(ctx, layout, game);
  }

  function drawBarPieces(ctx, layout, game) {
    const radius = layout.radius * 0.92;
    const x = layout.bar.x + layout.bar.w / 2;
    const aiCount = game.board.bar.ai;
    const playerCount = game.board.bar.player;
    for (let i = 0; i < Math.min(aiCount, 4); i += 1) {
      BG.CanvasPieces.drawPiece(ctx, x, layout.playTop + radius + i * radius * 1.35, radius, BG.COLOR.AI, {
        label: aiCount > 4 && i === 3 ? aiCount : "",
      });
    }
    for (let i = 0; i < Math.min(playerCount, 4); i += 1) {
      BG.CanvasPieces.drawPiece(ctx, x, layout.playBottom - radius - i * radius * 1.35, radius, BG.COLOR.PLAYER, {
        selected: game.selectedPoint === BG.BAR_POINT[BG.COLOR.PLAYER] && i === 0,
        label: playerCount > 4 && i === 3 ? playerCount : "",
      });
    }
  }

  function drawBearOffHints(ctx, layout, game) {
    const highlight = css("--color-highlight", "#ffd700");
    ctx.save();
    ctx.globalAlpha = game.legalTargets.includes(0) || game.legalTargets.includes(25) ? 0.9 : 0.5;
    ctx.strokeStyle = highlight;
    ctx.lineWidth = 3;
    if (game.legalTargets.includes(0)) {
      ctx.strokeRect(layout.board.x + 3, layout.playBottom - layout.pointH, layout.pointW * 0.72, layout.pointH);
    }
    if (game.legalTargets.includes(25)) {
      ctx.strokeRect(layout.board.x + layout.board.w - layout.pointW * 0.72 - 3, layout.playTop, layout.pointW * 0.72, layout.pointH);
    }
    ctx.restore();
  }

  BG.CanvasBoard = {
    render(canvas, game) {
      const { ctx, width, height } = setupCanvas(canvas);
      const layout = createLayout(width, height);
      canvas._bgLayout = layout;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = css("--color-board-surface", "#c8a96e");
      ctx.fillRect(layout.board.x, layout.board.y, layout.board.w, layout.board.h);

      ctx.fillStyle = css("--color-bar", "#2d1b0e");
      ctx.fillRect(layout.bar.x, layout.bar.y, layout.bar.w, layout.bar.h);

      ctx.strokeStyle = css("--color-border", "#4a2c1a");
      ctx.lineWidth = Math.max(3, width * 0.006);
      ctx.strokeRect(layout.board.x, layout.board.y, layout.board.w, layout.board.h);

      BG.POINT_ROWS.top.concat(BG.POINT_ROWS.bottom).forEach((point, index) => {
        drawTriangle(ctx, layout.areas[point], index);
      });

      const highlight = css("--color-highlight", "#ffd700");
      game.legalTargets.forEach((point) => {
        if (layout.areas[point]) drawHighlight(ctx, layout.areas[point], highlight);
      });

      drawBearOffHints(ctx, layout, game);
      drawLabels(ctx, layout);
      drawPieces(ctx, layout, game);

      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.font = `700 ${Math.max(12, layout.label * 0.55)}px ${getComputedStyle(document.body).fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("BAR", layout.bar.x + layout.bar.w / 2, layout.board.y + layout.board.h / 2);
    },

    hitTest(canvas, clientX, clientY) {
      const layout = canvas._bgLayout;
      if (!layout) return null;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (x >= layout.bar.x && x <= layout.bar.x + layout.bar.w && y >= layout.bar.y && y <= layout.bar.y + layout.bar.h) {
        return y > layout.board.y + layout.board.h / 2 ? BG.BAR_POINT[BG.COLOR.PLAYER] : BG.BAR_POINT[BG.COLOR.AI];
      }

      for (let point = 1; point <= 24; point += 1) {
        const area = layout.areas[point];
        if (x >= area.x && x <= area.x + area.w) {
          if (area.top && y >= layout.playTop && y <= layout.playTop + layout.pointH + layout.radius * 2) return point;
          if (!area.top && y <= layout.playBottom && y >= layout.playBottom - layout.pointH - layout.radius * 2) return point;
        }
      }

      if (x < layout.board.x + layout.pointW && y > layout.playBottom - layout.pointH) return 0;
      if (x > layout.board.x + layout.board.w - layout.pointW && y < layout.playTop + layout.pointH) return 25;
      return null;
    },
  };
})(window);
