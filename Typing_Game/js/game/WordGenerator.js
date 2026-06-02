import { randomItem } from "../utils/helpers.js";
import { DifficultyManager } from "./DifficultyManager.js";

export class WordGenerator {
  constructor(settings, words) {
    this.settings = settings;
    this.words = words;
    this.recent = [];
  }

  next(completedCount = 0) {
    let word = randomItem(this.words);
    let guard = 0;
    while (this.recent.includes(word) && guard < 8) {
      word = randomItem(this.words);
      guard += 1;
    }
    this.recent = [word, ...this.recent].slice(0, 5);
    return DifficultyManager.transformWord(word, this.settings.difficulty, completedCount, this.settings.language);
  }
}
