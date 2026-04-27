'use strict';

const COLS = 10, ROWS = 20, BUFFER = 2;

class Board {
  constructor() {
    // grid[row][col], row 0 = top visible, buffer rows are negative indices handled via offset
    this.grid = Array.from({ length: ROWS + BUFFER }, () => new Array(COLS).fill(null));
  }

  reset() {
    this.grid = Array.from({ length: ROWS + BUFFER }, () => new Array(COLS).fill(null));
  }

  // row 0 = top visible row; buffer rows: row -2, -1
  getCell(row, col) {
    const idx = row + BUFFER;
    if (idx < 0 || idx >= this.grid.length) return 'BORDER';
    return this.grid[idx][col]; // null = empty, color string = filled
  }

  setCell(row, col, color) {
    if (row + BUFFER >= 0 && row + BUFFER < this.grid.length && col >= 0 && col < COLS)
      this.grid[row + BUFFER][col] = color;
  }

  isValid(piece) {
    for (const { x, y } of piece.getCells()) {
      if (x < 0 || x >= COLS) return false;
      if (y >= ROWS) return false;
      if (y >= -BUFFER && this.getCell(y, x) !== null) return false;
    }
    return true;
  }

  lock(piece) {
    for (const { x, y } of piece.getCells())
      this.setCell(y, x, piece.color);
  }

  // Returns array of cleared row indices (in display coords)
  clearLines() {
    const cleared = [];
    const newGrid = [];

    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i].every(c => c !== null)) {
        cleared.push(i - BUFFER); // display row index
      } else {
        newGrid.push(this.grid[i]);
      }
    }

    // Prepend empty rows to replace cleared rows (atomically, no index-shift bug)
    while (newGrid.length < this.grid.length) {
      newGrid.unshift(new Array(COLS).fill(null));
    }

    this.grid = newGrid;
    return cleared;
  }

  isGameOver(piece) {
    return !this.isValid(piece);
  }

  // Check T-Spin using 3-corner rule
  checkTSpin(piece) {
    if (piece.type !== 'T' || !piece.lastActionWasRotate) return false;
    const cx = piece.x + 1, cy = piece.y + 1;
    const corners = [
      { x: cx - 1, y: cy - 1 }, { x: cx + 1, y: cy - 1 },
      { x: cx - 1, y: cy + 1 }, { x: cx + 1, y: cy + 1 }
    ];
    let filled = 0;
    for (const c of corners) {
      if (c.x < 0 || c.x >= COLS || c.y < 0 || c.y >= ROWS) {
        filled++;
      } else if (this.getCell(c.y, c.x) !== null) {
        filled++;
      }
    }
    return filled >= 3;
  }

  // Ghost piece: find lowest valid position
  getGhost(piece) {
    const ghost = piece.clone();
    while (true) {
      ghost.y++;
      if (!this.isValid(ghost)) { ghost.y--; break; }
    }
    return ghost;
  }

  tryMove(piece, dx, dy) {
    const next = piece.clone();
    next.x += dx; next.y += dy;
    if (this.isValid(next)) { piece.x = next.x; piece.y = next.y; piece.lastActionWasRotate = false; return true; }
    return false;
  }

  tryRotate(piece, dir) {
    const from = piece.rotation;
    const to = (from + dir + 4) % 4;
    const next = piece.clone();
    next.rotation = to;
    const kicks = getWallKicks(piece.type, from, to);
    for (const [kdx, kdy] of kicks) {
      next.x = piece.x + kdx;
      next.y = piece.y + kdy;
      if (this.isValid(next)) {
        piece.x = next.x; piece.y = next.y; piece.rotation = to;
        piece.lastActionWasRotate = true;
        return true;
      }
    }
    return false;
  }
}
