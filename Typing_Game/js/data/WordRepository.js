const WORD_JSON_FILES = {
  en: "data/words-en.json",
  zh: "data/words-zh.json",
  num: "data/words-num.json",
  mixed: "data/words-mixed.json",
  hira: "data/words-hira.json",
  kata: "data/words-kata.json",
};

export class WordRepository {
  constructor(embeddedWords = globalThis.TYPING_GAME_EMBEDDED_WORDS || {}) {
    this.embeddedWords = embeddedWords;
    this.cache = new Map();
  }

  async load(language) {
    const key = WORD_JSON_FILES[language] ? language : "en";
    if (this.cache.has(key)) return this.cache.get(key);

    const words = await this.loadFromJson(key).catch(() => this.embeddedWords[key]);
    const normalized = this.normalize(words, key);
    this.cache.set(key, normalized);
    return normalized;
  }

  async loadFromJson(language) {
    const response = await fetch(WORD_JSON_FILES[language], { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Cannot load word file: ${WORD_JSON_FILES[language]}`);
    }
    return response.json();
  }

  normalize(payload, language) {
    const words = Array.isArray(payload) ? payload : payload?.words;
    if (!Array.isArray(words)) {
      throw new Error(`Word file for "${language}" must be a JSON array.`);
    }
    const normalized = [...new Set(words.map((word) => String(word).trim()).filter(Boolean))];
    if (normalized.length === 0) {
      throw new Error(`Word file for "${language}" is empty.`);
    }
    return normalized;
  }
}
