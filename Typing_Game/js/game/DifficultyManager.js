const LABELS = {
  easy: "Easy",
  normal: "Normal",
  hard: "Hard",
  hell: "Hell",
};

const MULTIPLIERS = {
  easy: 0.8,
  normal: 1,
  hard: 1.5,
  hell: 2.5,
};

export class DifficultyManager {
  static label(difficulty) {
    return LABELS[difficulty] ?? LABELS.normal;
  }

  static multiplier(difficulty) {
    return MULTIPLIERS[difficulty] ?? MULTIPLIERS.normal;
  }

  static timePenalty(difficulty) {
    if (difficulty === "hell") return 2;
    if (difficulty === "hard") return 1;
    return 0;
  }

  static transformWord(word, difficulty, completedCount, language = "en") {
    if (["hira", "kata"].includes(language)) {
      return word;
    }
    if (difficulty === "easy") {
      return word.toLowerCase();
    }
    if (difficulty === "hard") {
      if (completedCount > 0 && completedCount % 8 === 0) return `${word}${(completedCount + 3) % 10}`;
      if (completedCount > 0 && completedCount % 5 === 0) return word.toUpperCase();
    }
    if (difficulty === "hell") {
      if (completedCount > 0 && completedCount % 7 === 0) return [...word].reverse().join("");
      if (completedCount > 0 && completedCount % 4 === 0) return `${word}!`;
      if (completedCount > 0 && completedCount % 3 === 0) return word.toUpperCase();
    }
    return word;
  }
}
