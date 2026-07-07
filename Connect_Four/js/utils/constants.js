(function initConstants(global) {
  const CF = global.CF || (global.CF = {});

  CF.constants = {
    ROWS: 6,
    COLUMNS: 7,
    EMPTY: 0,
    PLAYER_ONE: 1,
    PLAYER_TWO: 2,
    STORAGE_KEYS: {
      settings: "connectfour_settings",
      saveGame: "connectfour_savegame",
      stats: "connectfour_stats"
    },
    THEMES: [
      { id: "classic", key: "theme.classic", swatches: ["#bd7a3c", "#194f7e", "#ffd65b"] },
      { id: "ocean", key: "theme.ocean", swatches: ["#1c93c4", "#f15f4d", "#54d7a3"] },
      { id: "candy", key: "theme.candy", swatches: ["#b96fc4", "#d93f64", "#41a6df"] },
      { id: "night", key: "theme.night", swatches: ["#263b72", "#b477ff", "#45e8e2"] },
      { id: "forest", key: "theme.forest", swatches: ["#477d57", "#b84e35", "#f3d76b"] }
    ],
    LANGUAGES: [
      { id: "zh-TW", key: "language.zhTW" },
      { id: "en", key: "language.en" },
      { id: "ja", key: "language.ja" }
    ],
    DIFFICULTIES: {
      easy: { key: "difficulty.easy", descKey: "difficulty.easyDesc", depth: 1, timeLimitMs: 220 },
      normal: { key: "difficulty.normal", descKey: "difficulty.normalDesc", depth: 3, timeLimitMs: 650 },
      hard: { key: "difficulty.hard", descKey: "difficulty.hardDesc", depth: 5, timeLimitMs: 1200 },
      expert: { key: "difficulty.expert", descKey: "difficulty.expertDesc", depth: 8, timeLimitMs: 1500 }
    },
    DEFAULT_SETTINGS: {
      language: "zh-TW",
      theme: "classic",
      bgmVolume: 0.75,
      sfxVolume: 0.8,
      bgmMuted: false,
      sfxMuted: false,
      bgmBoost: 1.4,
      randomBgm: false,
      aiDifficulty: "normal",
      vibration: true,
      animations: true
    }
  };
})(window);
