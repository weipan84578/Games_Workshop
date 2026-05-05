import { BOARD_COLS, BOARD_ROWS, PIECE_LABELS, PieceType, SIDES } from "./pieces.js";

export class BoardView {
  constructor(canvas, onPoint) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.onPoint = onPoint;
    this.state = null;
    this.selected = null;
    this.legalMoves = [];
    this.settings = {};
    this.metrics = { pad: 56, cell: 76 };
    window.addEventListener("resize", () => this.draw());
    canvas.addEventListener("pointerdown", (event) => this.handlePointer(event));
  }

  setData(state, selected, legalMoves, settings) {
    this.state = state;
    this.selected = selected;
    this.legalMoves = legalMoves;
    this.settings = settings;
    this.draw();
  }

  handlePointer(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    const { pad, cell } = this.metrics;
    const col = Math.round((x - pad) / cell);
    const row = Math.round((y - pad) / cell);
    const px = pad + col * cell;
    const py = pad + row * cell;
    if (row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS && Math.hypot(x - px, y - py) <= cell * 0.48) {
      this.onPoint(row, col);
    }
  }

  draw() {
    if (!this.state) return;
    const cssWidth = this.canvas.getBoundingClientRect().width || 640;
    const width = Math.round(cssWidth * window.devicePixelRatio);
    const height = Math.round(width * 10 / 9);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }

    const ctx = this.ctx;
    const pad = width * 0.08;
    const cell = (width - pad * 2) / 8;
    this.metrics = { pad, cell };
    ctx.clearRect(0, 0, width, height);
    this.drawBoard(ctx, width, height, pad, cell);
    this.drawHighlights(ctx, pad, cell);
    this.drawPieces(ctx, pad, cell);
  }

  drawBoard(ctx, width, height, pad, cell) {
    const dark = this.settings.boardTheme === "dark";
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, dark ? "#8d7353" : "#f1cf98");
    gradient.addColorStop(1, dark ? "#594231" : "#d79d58");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = dark ? "#2b2119" : "#7d431b";
    ctx.lineWidth = Math.max(1.5, width * 0.0028);
    ctx.lineCap = "round";

    for (let row = 0; row < BOARD_ROWS; row += 1) {
      const y = pad + row * cell;
      line(ctx, pad, y, pad + 8 * cell, y);
    }

    for (let col = 0; col < BOARD_COLS; col += 1) {
      const x = pad + col * cell;
      if (col === 0 || col === 8) {
        line(ctx, x, pad, x, pad + 9 * cell);
      } else {
        line(ctx, x, pad, x, pad + 4 * cell);
        line(ctx, x, pad + 5 * cell, x, pad + 9 * cell);
      }
    }

    line(ctx, pad + 3 * cell, pad, pad + 5 * cell, pad + 2 * cell);
    line(ctx, pad + 5 * cell, pad, pad + 3 * cell, pad + 2 * cell);
    line(ctx, pad + 3 * cell, pad + 7 * cell, pad + 5 * cell, pad + 9 * cell);
    line(ctx, pad + 5 * cell, pad + 7 * cell, pad + 3 * cell, pad + 9 * cell);

    ctx.font = `700 ${cell * 0.34}px "Noto Serif TC", serif`;
    ctx.fillStyle = dark ? "rgba(250,224,166,0.5)" : "rgba(103,55,22,0.52)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("楚河", pad + 2.4 * cell, pad + 4.5 * cell);
    ctx.fillText("漢界", pad + 5.6 * cell, pad + 4.5 * cell);
  }

  drawHighlights(ctx, pad, cell) {
    const last = this.state.lastMove;
    if (last) {
      [last.from, last.to].forEach(({ row, col }) => {
        ctx.fillStyle = "rgba(65, 137, 221, 0.28)";
        ctx.beginPath();
        ctx.arc(pad + col * cell, pad + row * cell, cell * 0.38, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    if (this.selected) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.34)";
      ctx.beginPath();
      ctx.arc(pad + this.selected.col * cell, pad + this.selected.row * cell, cell * 0.43, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.settings.showLegalMoves) {
      this.legalMoves.forEach((move) => {
        ctx.fillStyle = move.captured ? "rgba(192, 57, 43, 0.34)" : "rgba(29, 142, 92, 0.38)";
        ctx.beginPath();
        ctx.arc(pad + move.col * cell, pad + move.row * cell, move.captured ? cell * 0.32 : cell * 0.12, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  drawPieces(ctx, pad, cell) {
    const radius = Math.max(18, cell * 0.39);
    for (let row = 0; row < BOARD_ROWS; row += 1) {
      for (let col = 0; col < BOARD_COLS; col += 1) {
        const piece = this.state.board[row][col];
        if (!piece) continue;
        this.drawPiece(ctx, piece, pad + col * cell, pad + row * cell, radius);
      }
    }
  }

  drawPiece(ctx, piece, x, y, radius) {
    const flat = this.settings.pieceStyle === "flat";
    const grad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.35, radius * 0.2, x, y, radius);
    grad.addColorStop(0, flat ? "#fff1ce" : "#fff4d8");
    grad.addColorStop(1, flat ? "#e2be7d" : "#c7924f");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = Math.max(2, radius * 0.08);
    ctx.strokeStyle = piece.side === SIDES.RED ? "#8b0000" : "#2c2118";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.78, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(1, radius * 0.035);
    ctx.stroke();

    if (this.state.isCheck && piece.type === PieceType.GENERAL && piece.side === this.state.currentTurn) {
      ctx.save();
      ctx.strokeStyle = "rgba(220, 30, 30, 0.75)";
      ctx.lineWidth = Math.max(3, radius * 0.08);
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = piece.side === SIDES.RED ? "#b60000" : "#151515";
    ctx.font = `900 ${radius * 1.02}px "Noto Serif TC", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(PIECE_LABELS[piece.side][piece.type], x, y + radius * 0.04);
  }
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
