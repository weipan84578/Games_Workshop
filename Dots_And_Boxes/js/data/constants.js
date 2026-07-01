(function (ns) {
  "use strict";

  ns.Constants = {
    STORAGE_KEYS: {
      SETTINGS: "dab.settings",
      SAVED_GAME: "savedGame",
      LANGUAGE: "language"
    },
    DEFAULT_SETTINGS: {
      language: "zh-TW",
      theme: "classic",
      bgmVolume: 0.65,
      sfxVolume: 0.8,
      muted: false,
      vibration: true
    },
    BOARD_SIZE_OPTIONS: [3, 4, 5, 6],
    DIFFICULTIES: {
      easy: { key: "easy", delayMin: 400, delayMax: 800 },
      normal: { key: "normal", delayMin: 500, delayMax: 1000 },
      hard: { key: "hard", delayMin: 600, delayMax: 1200 }
    },
    PLAYERS: {
      PLAYER: "player",
      AI: "ai"
    },
    LANGUAGES: [
      { code: "zh-TW", short: "中", label: "中文" },
      { code: "en-US", short: "EN", label: "English" },
      { code: "ja-JP", short: "日", label: "日本語" }
    ]
  };
})(window.DAB = window.DAB || {});
