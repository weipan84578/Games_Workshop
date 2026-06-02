export class ComboSystem {
  constructor() {
    this.combo = 0;
    this.maxCombo = 0;
    this.thresholds = [10, 25, 50, 100];
  }

  add() {
    this.combo += 1;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    return {
      combo: this.combo,
      maxCombo: this.maxCombo,
      milestone: this.thresholds.includes(this.combo) ? this.combo : null,
    };
  }

  reset() {
    const previous = this.combo;
    this.combo = 0;
    return previous;
  }

  hydrate(combo, maxCombo) {
    this.combo = combo || 0;
    this.maxCombo = maxCombo || 0;
  }
}
