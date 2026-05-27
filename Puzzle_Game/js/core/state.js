import { DEFAULT_SETTINGS, DIFFICULTIES } from "../utils/constants.js";
import { getDifficultyById } from "../utils/helpers.js";

export class AppState {
  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.imageCanvas = null;
    this.imageName = "預設插畫";
    this.imageSourceKind = "demo";
    this.gameConfig = null;
    this.lastResult = null;
  }

  get defaultDifficulty() {
    return getDifficultyById(DIFFICULTIES, this.settings.defaultDifficulty);
  }

  setSettings(nextSettings) {
    this.settings = {
      ...this.settings,
      ...nextSettings
    };
  }

  setImage(canvas, name, sourceKind = "upload") {
    this.imageCanvas = canvas;
    this.imageName = name || "自訂圖片";
    this.imageSourceKind = sourceKind;
  }

  setGameConfig(config) {
    this.gameConfig = config;
  }

  clearGameConfig() {
    this.gameConfig = null;
  }
}
