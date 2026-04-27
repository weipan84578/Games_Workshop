'use strict';

const SPEED_TABLE = [
  1.000, 0.793, 0.618, 0.473, 0.355,
  0.262, 0.190, 0.135, 0.094, 0.064,
  0.043, 0.028, 0.018, 0.011, 0.007,
  0.005, 0.005, 0.005, 0.005, 0.005
];

const LINE_SCORES   = [0, 100, 300, 500, 800];
const TSPIN_SCORES  = [400, 800, 1200, 1600];

class Scoring {
  constructor() { this.reset(); }

  reset() {
    this.score = 0; this.lines = 0; this.level = 1;
    this.combo = -1; this.btb = false;
    this.lastClear = 'none'; // 'tetris', 'tspin', or 'normal'
  }

  getLevelFromLines(lines) {
    return Math.min(20, Math.floor(lines / 10) + 1);
  }

  getSpeed(level) {
    return SPEED_TABLE[Math.min(level - 1, SPEED_TABLE.length - 1)];
  }

  calcLineClear(lines, isTSpin) {
    let base = 0;
    const isSpecial = isTSpin || lines === 4;

    if (isTSpin) {
      base = TSPIN_SCORES[lines] ?? 0;
    } else {
      base = LINE_SCORES[lines] ?? 0;
    }

    let btbBonus = 1;
    if (isSpecial && lines > 0) {
      if (this.btb) btbBonus = 1.5;
      this.btb = true;
    } else if (lines > 0 && !isSpecial) {
      this.btb = false;
    }

    return Math.floor(base * this.level * btbBonus);
  }

  addLines(cleared, isTSpin) {
    if (cleared === 0 && !isTSpin) { this.combo = -1; return 0; }

    let pts = this.calcLineClear(cleared, isTSpin);

    if (cleared > 0) {
      this.combo++;
      pts += Math.floor(50 * Math.max(this.combo, 0) * this.level);
    } else {
      this.combo = -1;
    }

    this.lines += cleared;
    this.score += pts;
    this.level = this.getLevelFromLines(this.lines);
    return pts;
  }

  addDropBonus(cells, hard) {
    const bonus = cells * (hard ? 2 : 1);
    this.score += bonus;
    return bonus;
  }

  clearTypeLabel(lines, isTSpin) {
    if (isTSpin) {
      const names = ['T-SPIN', 'T-SPIN SINGLE', 'T-SPIN DOUBLE', 'T-SPIN TRIPLE'];
      return names[lines] ?? 'T-SPIN';
    }
    return ['', 'SINGLE', 'DOUBLE', 'TRIPLE', 'TETRIS!'][lines] ?? '';
  }
}
