const DEFAULT_SETTINGS = {
  bgmEnabled: true,
  sfxEnabled: true,
  bgmVolume: 0.6,
  sfxVolume: 0.8,
  aiDifficulty: "normal",
  boardTheme: "classic",
  pieceStyle: "traditional",
  showTimer: true,
  showLegalMoves: true,
  language: "zh-TW"
};

const STORAGE_KEY = "chinese_chess_settings";

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Some browsers restrict localStorage for file:// pages.
  }
}

function resetSettings() {
  saveSettings(DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS };
}
