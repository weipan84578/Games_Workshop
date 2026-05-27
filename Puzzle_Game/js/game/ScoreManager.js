export class ScoreManager {
  constructor() {
    this.bestTimes = new Map();
  }

  record(difficultyId, seconds) {
    const previous = this.bestTimes.get(difficultyId);
    if (!previous || seconds < previous) {
      this.bestTimes.set(difficultyId, seconds);
      return { best: seconds, isNewBest: true };
    }
    return { best: previous, isNewBest: false };
  }

  getBest(difficultyId) {
    return this.bestTimes.get(difficultyId) || null;
  }
}
