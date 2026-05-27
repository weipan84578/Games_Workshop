import { clamp } from "../utils/helpers.js";

export class PuzzlePiece {
  constructor({ id, row, col, cols, boardSize }) {
    this.id = id;
    this.row = row;
    this.col = col;
    this.cols = cols;
    this.size = boardSize / cols;
    this.correctX = col * this.size;
    this.correctY = row * this.size;
    this.x = this.correctX;
    this.y = this.correctY;
    this.solved = false;
  }

  resize(newBoardSize, oldBoardSize) {
    const oldSize = oldBoardSize || newBoardSize;
    const scale = newBoardSize / oldSize;
    this.size = newBoardSize / this.cols;
    this.x *= scale;
    this.y *= scale;
    this.correctX = this.col * this.size;
    this.correctY = this.row * this.size;

    if (this.solved) {
      this.x = this.correctX;
      this.y = this.correctY;
    }
  }

  contains(x, y) {
    return x >= this.x && x <= this.x + this.size && y >= this.y && y <= this.y + this.size;
  }

  moveTo(x, y, boardSize) {
    this.x = clamp(x, 0, boardSize - this.size);
    this.y = clamp(y, 0, boardSize - this.size);
  }

  distanceToHome() {
    return Math.hypot(this.x - this.correctX, this.y - this.correctY);
  }

  snapHome() {
    this.x = this.correctX;
    this.y = this.correctY;
    this.solved = true;
  }

  serialize(boardSize) {
    return {
      id: this.id,
      x: this.x / boardSize,
      y: this.y / boardSize,
      solved: this.solved
    };
  }

  hydrate(data, boardSize) {
    this.x = data.x * boardSize;
    this.y = data.y * boardSize;
    this.solved = Boolean(data.solved);
    if (this.solved) this.snapHome();
  }

  draw(ctx, sourceCanvas, options = {}) {
    const sourcePieceSize = sourceCanvas.width / this.cols;
    const sourceX = this.col * sourcePieceSize;
    const sourceY = this.row * sourcePieceSize;
    const radius = Math.max(4, this.size * 0.035);

    ctx.save();
    ctx.globalAlpha = this.solved ? 0.98 : 1;
    ctx.shadowColor = options.selected ? "rgba(0,0,0,0.30)" : "rgba(0,0,0,0.18)";
    ctx.shadowBlur = options.selected ? 16 : 8;
    ctx.shadowOffsetY = options.selected ? 8 : 4;

    roundedRect(ctx, this.x, this.y, this.size, this.size, radius);
    ctx.clip();
    ctx.drawImage(sourceCanvas, sourceX, sourceY, sourcePieceSize, sourcePieceSize, this.x, this.y, this.size, this.size);
    ctx.restore();

    ctx.save();
    roundedRect(ctx, this.x, this.y, this.size, this.size, radius);
    ctx.lineWidth = options.selected ? 4 : 2;
    ctx.strokeStyle = options.selected ? options.accentColor : "rgba(255,255,255,0.88)";
    ctx.stroke();

    if (this.solved) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(45,106,79,0.88)";
      ctx.stroke();
    }
    ctx.restore();
  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}
