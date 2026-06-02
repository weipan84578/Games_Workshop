import { Storage } from "../utils/Storage.js";
import { clamp } from "../utils/helpers.js";

export const DEFAULT_SETTINGS = {
  theme: "default",
  fontSize: "medium",
  masterVolume: 100,
  bgmVolume: 70,
  sfxVolume: 75,
  sfxSkin: "standard",
  showVirtualKeyboard: true,
  persistBGM: true,
  showLiveWPM: true,
  enableShakeOnError: true,
  enableComboEffect: true,
  animation: true,
  language: "en",
  difficulty: "normal",
  gameDuration: 60,
};

const DEFAULT_RECORDS = {
  easy: { wpm: 0, accuracy: 0, score: 0, date: null },
  normal: { wpm: 0, accuracy: 0, score: 0, date: null },
  hard: { wpm: 0, accuracy: 0, score: 0, date: null },
  hell: { wpm: 0, accuracy: 0, score: 0, date: null },
};

export class StateManager {
  constructor(storage = new Storage("typingGame_")) {
    this.storage = storage;
    this.settings = this.normalizeSettings(this.storage.get("settings", DEFAULT_SETTINGS));
    this.currentResult = null;
    this.lastGameOptions = null;
  }

  normalizeSettings(settings) {
    return {
      ...DEFAULT_SETTINGS,
      ...settings,
      masterVolume: clamp(Number(settings?.masterVolume ?? DEFAULT_SETTINGS.masterVolume), 0, 100),
      bgmVolume: clamp(Number(settings?.bgmVolume ?? DEFAULT_SETTINGS.bgmVolume), 0, 100),
      sfxVolume: clamp(Number(settings?.sfxVolume ?? DEFAULT_SETTINGS.sfxVolume), 0, 100),
      gameDuration: Number(settings?.gameDuration ?? DEFAULT_SETTINGS.gameDuration),
      showVirtualKeyboard: Boolean(settings?.showVirtualKeyboard ?? DEFAULT_SETTINGS.showVirtualKeyboard),
      persistBGM: Boolean(settings?.persistBGM ?? DEFAULT_SETTINGS.persistBGM),
      showLiveWPM: Boolean(settings?.showLiveWPM ?? DEFAULT_SETTINGS.showLiveWPM),
      enableShakeOnError: Boolean(settings?.enableShakeOnError ?? DEFAULT_SETTINGS.enableShakeOnError),
      enableComboEffect: Boolean(settings?.enableComboEffect ?? DEFAULT_SETTINGS.enableComboEffect),
      animation: Boolean(settings?.animation ?? DEFAULT_SETTINGS.animation),
    };
  }

  getSettings() {
    return { ...this.settings };
  }

  updateSettings(patch) {
    this.settings = this.normalizeSettings({ ...this.settings, ...patch });
    this.storage.set("settings", this.settings);
    return this.getSettings();
  }

  getSavedGame() {
    return this.storage.get("savedGame", null);
  }

  saveGame(snapshot) {
    if (!snapshot) return;
    this.storage.set("savedGame", {
      ...snapshot,
      savedAt: new Date().toISOString(),
    });
  }

  clearSavedGame() {
    this.storage.remove("savedGame");
  }

  getHistory() {
    return this.storage.get("history", []);
  }

  getRecords() {
    return { ...DEFAULT_RECORDS, ...this.storage.get("records", DEFAULT_RECORDS) };
  }

  setCurrentResult(result) {
    this.currentResult = result;
  }

  pushHistory(result) {
    const entry = {
      date: new Date().toISOString(),
      wpm: result.wpm,
      accuracy: result.accuracy,
      score: result.score,
      wordsCompleted: result.wordsCompleted,
      maxCombo: result.maxCombo,
      difficulty: result.settings.difficulty,
      language: result.settings.language,
      duration: result.settings.gameDuration,
    };
    const history = [entry, ...this.getHistory()].slice(0, 50);
    this.storage.set("history", history);

    const records = this.getRecords();
    const current = records[entry.difficulty] ?? DEFAULT_RECORDS[entry.difficulty];
    const isNewRecord = entry.wpm > current.wpm || (entry.wpm === current.wpm && entry.score > current.score);
    if (isNewRecord) {
      records[entry.difficulty] = {
        wpm: entry.wpm,
        accuracy: entry.accuracy,
        score: entry.score,
        date: entry.date,
      };
      this.storage.set("records", records);
    }
    return { entry, isNewRecord };
  }

  resetRecords() {
    this.storage.set("records", DEFAULT_RECORDS);
    this.storage.set("history", []);
  }

  resetAll() {
    this.storage.clear();
    this.settings = { ...DEFAULT_SETTINGS };
    this.currentResult = null;
  }

  exportData() {
    return {
      settings: this.getSettings(),
      savedGame: this.getSavedGame(),
      history: this.getHistory(),
      records: this.getRecords(),
      exportedAt: new Date().toISOString(),
    };
  }

  importData(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("匯入資料格式不正確");
    }
    if (payload.settings) {
      this.updateSettings(payload.settings);
    }
    if (Array.isArray(payload.history)) {
      this.storage.set("history", payload.history.slice(0, 50));
    }
    if (payload.records) {
      this.storage.set("records", { ...DEFAULT_RECORDS, ...payload.records });
    }
    if (payload.savedGame) {
      this.saveGame(payload.savedGame);
    }
  }
}
