import { PuzzlePiece } from "./PuzzlePiece.js";

export class PuzzleEngine {
  constructor({ canvas, sourceCanvas, difficulty, sfx, onChange, onSolvedChange, onVictory }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sourceCanvas = sourceCanvas;
    this.difficulty = difficulty;
    this.sfx = sfx;
    this.onChange = onChange;
    this.onSolvedChange = onSolvedChange;
    this.onVictory = onVictory;
    this.boardSize = 0;
    this.pieces = [];
    this.selectedPiece = null;
    this.dragOffset = { x: 0, y: 0 };
    this.hintId = null;
    this.hintTimer = null;
    this.isPaused = false;
  }

  init(snapshot = null) {
    this.resize();
    this.createPieces();

    if (snapshot?.pieces?.length === this.pieces.length) {
      snapshot.pieces.forEach((data) => {
        const piece = this.pieces.find((item) => item.id === data.id);
        piece?.hydrate(data, this.boardSize);
      });
    } else {
      this.shuffle();
    }

    this.reportSolved();
    this.render();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const newSize = Math.max(280, Math.round(rect.width || 600));
    const oldSize = this.boardSize || newSize;
    const ratio = Math.max(1, window.devicePixelRatio || 1);

    this.boardSize = newSize;
    this.canvas.width = Math.round(newSize * ratio);
    this.canvas.height = Math.round(newSize * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    this.pieces.forEach((piece) => piece.resize(newSize, oldSize));
    this.render();
  }

  createPieces() {
    if (this.pieces.length) return;
    const cols = this.difficulty.cols;
    for (let row = 0; row < cols; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        this.pieces.push(new PuzzlePiece({
          id: row * cols + col,
          row,
          col,
          cols,
          boardSize: this.boardSize
        }));
      }
    }
  }

  shuffle() {
    const positions = this.pieces.map((piece) => ({
      x: piece.correctX,
      y: piece.correctY
    }));

    for (let i = positions.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    this.pieces.forEach((piece, index) => {
      let position = positions[index];
      if (position.x === piece.correctX && position.y === piece.correctY && positions.length > 1) {
        const swapIndex = (index + 1) % positions.length;
        [positions[index], positions[swapIndex]] = [positions[swapIndex], positions[index]];
        position = positions[index];
      }
      piece.x = position.x;
      piece.y = position.y;
      piece.solved = false;
    });

    this.bringUnsolvedForward();
    this.sfx?.play("shuffle");
    this.changed();
  }

  shuffleUnsolved() {
    const unsolved = this.pieces.filter((piece) => !piece.solved);
    const positions = unsolved.map((piece) => ({ x: piece.x, y: piece.y }));

    for (let i = positions.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    unsolved.forEach((piece, index) => {
      piece.x = positions[index].x;
      piece.y = positions[index].y;
    });

    this.sfx?.play("shuffle");
    this.changed();
  }

  getSolvedCount() {
    return this.pieces.filter((piece) => piece.solved).length;
  }

  pick(x, y) {
    if (this.isPaused) return null;
    for (let i = this.pieces.length - 1; i >= 0; i -= 1) {
      const piece = this.pieces[i];
      if (!piece.solved && piece.contains(x, y)) {
        this.selectedPiece = piece;
        this.dragOffset = { x: x - piece.x, y: y - piece.y };
        this.pieces.splice(i, 1);
        this.pieces.push(piece);
        this.sfx?.play("pickup");
        this.render();
        return piece;
      }
    }
    return null;
  }

  dragTo(x, y) {
    if (!this.selectedPiece || this.isPaused) return;
    this.selectedPiece.moveTo(x - this.dragOffset.x, y - this.dragOffset.y, this.boardSize);
    this.render();
  }

  drop(pointerType = "mouse") {
    if (!this.selectedPiece) return false;

    const piece = this.selectedPiece;
    this.selectedPiece = null;
    const thresholdRatio = pointerType === "touch" ? 0.25 : this.difficulty.snapRatio;
    const threshold = piece.size * thresholdRatio;

    if (piece.distanceToHome() <= threshold) {
      piece.snapHome();
      this.sfx?.play("snap");
      this.bringSolvedBackward();
      this.reportSolved();
      this.changed();

      if (this.getSolvedCount() === this.pieces.length) {
        this.sfx?.play("victory");
        this.onVictory?.();
      }
      return true;
    }

    this.sfx?.play("drop");
    this.changed();
    return false;
  }

  setPaused(isPaused) {
    this.isPaused = isPaused;
    this.render();
  }

  showHint() {
    const unsolved = this.pieces.filter((piece) => !piece.solved);
    if (!unsolved.length) return;
    const piece = unsolved[Math.floor(Math.random() * unsolved.length)];
    this.hintId = piece.id;
    this.sfx?.play("hint");
    clearTimeout(this.hintTimer);
    this.hintTimer = window.setTimeout(() => {
      this.hintId = null;
      this.render();
    }, 1400);
    this.render();
  }

  serialize() {
    return {
      difficulty: this.difficulty.id,
      pieces: this.pieces.map((piece) => piece.serialize(this.boardSize))
    };
  }

  destroy() {
    clearTimeout(this.hintTimer);
  }

  changed() {
    this.render();
    this.reportSolved();
    this.onChange?.();
  }

  reportSolved() {
    this.onSolvedChange?.(this.getSolvedCount(), this.pieces.length);
  }

  bringSolvedBackward() {
    this.pieces.sort((a, b) => Number(a.solved) - Number(b.solved));
  }

  bringUnsolvedForward() {
    this.pieces.sort((a, b) => Number(a.solved) - Number(b.solved));
  }

  render() {
    if (!this.ctx || !this.boardSize) return;
    const ctx = this.ctx;
    const size = this.boardSize;
    const tile = size / this.difficulty.cols;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.drawImage(this.sourceCanvas, 0, 0, size, size);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(20,33,61,0.13)";
    ctx.lineWidth = 1;
    for (let i = 1; i < this.difficulty.cols; i += 1) {
      const pos = Math.round(i * tile) + 0.5;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }
    ctx.restore();

    if (this.hintId !== null) {
      const piece = this.pieces.find((item) => item.id === this.hintId);
      if (piece) {
        ctx.save();
        ctx.fillStyle = "rgba(255,183,3,0.24)";
        ctx.strokeStyle = "rgba(255,183,3,0.92)";
        ctx.lineWidth = 4;
        ctx.fillRect(piece.correctX + 2, piece.correctY + 2, piece.size - 4, piece.size - 4);
        ctx.strokeRect(piece.correctX + 2, piece.correctY + 2, piece.size - 4, piece.size - 4);
        ctx.restore();
      }
    }

    this.pieces.forEach((piece) => {
      if (piece !== this.selectedPiece) {
        piece.draw(ctx, this.sourceCanvas, {
          accentColor: getComputedStyle(document.body).getPropertyValue("--color-accent").trim() || "#ffb703"
        });
      }
    });

    if (this.selectedPiece) {
      this.selectedPiece.draw(ctx, this.sourceCanvas, {
        selected: true,
        accentColor: getComputedStyle(document.body).getPropertyValue("--color-accent").trim() || "#ffb703"
      });
    }

    if (this.isPaused) {
      ctx.save();
      ctx.fillStyle = "rgba(8,13,27,0.56)";
      ctx.fillRect(0, 0, size, size);
      ctx.restore();
    }
  }
}
