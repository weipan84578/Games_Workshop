import { wordsEn } from "../data/words-en.js";
import { wordsZh } from "../data/words-zh.js";
import { wordsNum } from "../data/words-num.js";
import { wordsMixed } from "../data/words-mixed.js";
import { randomItem } from "../utils/helpers.js";
import { DifficultyManager } from "./DifficultyManager.js";

const WORD_BANKS = {
  en: wordsEn,
  zh: wordsZh,
  num: wordsNum,
  mixed: wordsMixed,
};

export class WordGenerator {
  constructor(settings) {
    this.settings = settings;
    this.recent = [];
  }

  next(completedCount = 0) {
    const bank = WORD_BANKS[this.settings.language] ?? wordsEn;
    let word = randomItem(bank);
    let guard = 0;
    while (this.recent.includes(word) && guard < 8) {
      word = randomItem(bank);
      guard += 1;
    }
    this.recent = [word, ...this.recent].slice(0, 5);
    return DifficultyManager.transformWord(word, this.settings.difficulty, completedCount);
  }
}
