import { DifficultyManager } from "./DifficultyManager.js";

export class ScoreCalculator {
  static wpm(correctChars, elapsedSeconds) {
    if (elapsedSeconds <= 0) return 0;
    return Math.max(0, (correctChars / 5 / elapsedSeconds) * 60);
  }

  static accuracy(correctChars, wrongChars) {
    const total = correctChars + wrongChars;
    if (total === 0) return 100;
    return (correctChars / total) * 100;
  }

  static scoreForChar(combo, difficulty) {
    const comboMultiplier = combo / 100 + 1;
    return Math.round(10 * comboMultiplier * DifficultyManager.multiplier(difficulty));
  }

  static scoreForWord(wordLength, combo, difficulty) {
    const base = wordLength * 10;
    const bonus = base * (combo / 100 + 1);
    return Math.round((base + bonus) * DifficultyManager.multiplier(difficulty));
  }

  static timeBonus(timeRemaining, duration, difficulty) {
    if (!duration || duration <= 0) return 0;
    return Math.round(Math.max(0, timeRemaining) * 5 * DifficultyManager.multiplier(difficulty));
  }

  static finalize(stats, settings) {
    const wpm = this.wpm(stats.correctChars, stats.elapsedSeconds);
    const accuracy = this.accuracy(stats.correctChars, stats.wrongChars);
    const score = Math.max(0, Math.round(stats.score + this.timeBonus(stats.timeRemaining, settings.gameDuration, settings.difficulty)));
    return {
      ...stats,
      settings: { ...settings },
      wpm: Math.round(wpm),
      rawWpm: wpm,
      accuracy: Number(accuracy.toFixed(1)),
      score,
      rank: this.rank(wpm, accuracy),
      finishedAt: new Date().toISOString(),
    };
  }

  static rank(wpm, accuracy) {
    if (wpm >= 100 && accuracy >= 97) return "S";
    if (wpm >= 80 && accuracy >= 94) return "A";
    if (wpm >= 60 && accuracy >= 90) return "B";
    if (wpm >= 40 && accuracy >= 84) return "C";
    return "D";
  }
}
