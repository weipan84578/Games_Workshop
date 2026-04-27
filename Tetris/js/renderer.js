'use strict';

const CELL = 32;
const GRID_COLOR = '#1a1a2e';
const BG_COLOR = '#0d0d1a';

class Renderer {
  constructor(canvas, holdCanvas, nextCanvases) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.holdCtx = holdCanvas.getContext('2d');
    this.nextCtxs = nextCanvases.map(c => c.getContext('2d'));
    this.nextSizes = [120, 80, 80];
    this.clearAnimRows = null; // rows currently animating
    this.clearAnimProgress = 0;
    this.lockFlashPiece = null;
    this.lockFlashTimer = 0;
    this.gameOverRows = 0; // for game over animation
  }

  drawCell(ctx, x, y, color, size = CELL, alpha = 1) {
    if (!color) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
    // Highlight (top-left)
    ctx.fillStyle = this.lighten(color, 0.35);
    ctx.fillRect(x + 1, y + 1, size - 2, 3);
    ctx.fillRect(x + 1, y + 1, 3, size - 2);
    // Shadow (bottom-right)
    ctx.fillStyle = this.darken(color, 0.35);
    ctx.fillRect(x + 1, y + size - 4, size - 2, 3);
    ctx.fillRect(x + size - 4, y + 1, 3, size - 2);
    ctx.restore();
  }

  drawGhostCell(ctx, x, y, color, size = CELL) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);
    ctx.restore();
  }

  lighten(hex, amt) { return this.shiftColor(hex, amt); }
  darken(hex, amt)  { return this.shiftColor(hex, -amt); }

  shiftColor(hex, amt) {
    const n = parseInt(hex.replace('#',''), 16);
    let r = (n >> 16) & 0xff, g = (n >> 8) & 0xff, b = n & 0xff;
    r = Math.max(0, Math.min(255, Math.round(r + (amt > 0 ? amt * (255 - r) : amt * r))));
    g = Math.max(0, Math.min(255, Math.round(g + (amt > 0 ? amt * (255 - g) : amt * g))));
    b = Math.max(0, Math.min(255, Math.round(b + (amt > 0 ? amt * (255 - b) : amt * b))));
    return `rgb(${r},${g},${b})`;
  }

  render(board, current, ghost, showGhost, settings) {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, H); ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(W, r * CELL); ctx.stroke();
    }

    // Board cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const color = board.getCell(r, c);
        if (color) this.drawCell(ctx, c * CELL, r * CELL, color);
      }
    }

    // Clear animation (row flash)
    if (this.clearAnimRows) {
      const alpha = Math.abs(Math.sin(this.clearAnimProgress * Math.PI * 2)) * 0.8 + 0.2;
      for (const r of this.clearAnimRows) {
        if (r < 0 || r >= ROWS) continue;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, r * CELL, COLS * CELL, CELL);
        ctx.restore();
      }
    }

    // Game over animation (grey fill from bottom)
    if (this.gameOverRows > 0) {
      for (let r = ROWS - 1; r >= ROWS - this.gameOverRows; r--) {
        ctx.save(); ctx.globalAlpha = 0.85;
        ctx.fillStyle = '#555566';
        ctx.fillRect(0, r * CELL, COLS * CELL, CELL);
        ctx.restore();
      }
    }

    // Lock flash
    if (this.lockFlashPiece && this.lockFlashTimer > 0) {
      ctx.save(); ctx.globalAlpha = 0.6 * (this.lockFlashTimer / 0.05);
      ctx.fillStyle = '#ffffff';
      for (const { x, y } of this.lockFlashPiece.getCells()) {
        if (y >= 0) ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
      ctx.restore();
    }

    // Ghost piece
    if (showGhost && ghost && current) {
      for (const { x, y } of ghost.getCells()) {
        if (y >= 0) this.drawGhostCell(ctx, x * CELL, y * CELL, current.color);
      }
    }

    // Current piece
    if (current) {
      for (const { x, y } of current.getCells()) {
        if (y >= 0) this.drawCell(ctx, x * CELL, y * CELL, current.color);
      }
    }
  }

  renderPreview(ctx, piece, size, canvasSize) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    if (!piece) return;
    const cellSize = canvasSize / 5;
    const shape = piece.shape;
    let minR = 4, maxR = 0, minC = 4, maxC = 0;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++)
      if (shape[r][c]) { minR = Math.min(minR, r); maxR = Math.max(maxR, r); minC = Math.min(minC, c); maxC = Math.max(maxC, c); }
    const pw = (maxC - minC + 1) * cellSize, ph = (maxR - minR + 1) * cellSize;
    const ox = (canvasSize - pw) / 2, oy = (canvasSize - ph) / 2;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++)
      if (shape[r][c]) this.drawCell(ctx, ox + (c - minC) * cellSize, oy + (r - minR) * cellSize, piece.color, cellSize);
  }

  renderHold(piece, canUsed) {
    const ctx = this.holdCtx;
    this.renderPreview(ctx, piece, 120, 120);
    if (piece && !canUsed) {
      ctx.save(); ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 120, 120);
      ctx.restore();
    }
  }

  renderNextQueue(queue) {
    this.renderPreview(this.nextCtxs[0], queue[0], 120, 120);
    this.renderPreview(this.nextCtxs[1], queue[1], 80, 80);
    this.renderPreview(this.nextCtxs[2], queue[2], 80, 80);
  }

  startClearAnim(rows, onDone) {
    this.clearAnimRows = rows;
    this.clearAnimProgress = 0;
    const duration = 250; // ms
    const start = performance.now();
    const tick = (now) => {
      this.clearAnimProgress = (now - start) / duration;
      if (this.clearAnimProgress < 1) requestAnimationFrame(tick);
      else { this.clearAnimRows = null; onDone(); }
    };
    requestAnimationFrame(tick);
  }

  triggerLockFlash(piece) {
    this.lockFlashPiece = piece.clone();
    this.lockFlashTimer = 0.05;
    const tick = () => {
      this.lockFlashTimer -= 0.016;
      if (this.lockFlashTimer > 0) requestAnimationFrame(tick);
      else this.lockFlashPiece = null;
    };
    requestAnimationFrame(tick);
  }

  animateGameOver(onDone) {
    this.gameOverRows = 0;
    let row = 0;
    const interval = setInterval(() => {
      this.gameOverRows = ++row;
      if (row >= ROWS) { clearInterval(interval); setTimeout(onDone, 200); }
    }, 50);
  }
}
