(function () {
  const CONSTANTS = {
    REFERENCE_WIDTH: 800,
    REFERENCE_HEIGHT: 450,
    GAME_RATIO: 16 / 9,

    BALL_RADIUS: 8,
    BALL_INIT_SPEED: 5,
    BALL_MAX_SPEED: 15,
    BALL_SPEED_INCREMENT: 0.3,

    PADDLE_WIDTH: 14,
    PADDLE_HEIGHT_RATIO: 0.16,
    PADDLE_OFFSET: 20,
    PLAYER_SPEED: 7,

    AI: {
      easy: { speed: 3.5, errorRange: 60, reactionDelay: 200, trackRate: 0.5 },
      normal: { speed: 5.5, errorRange: 25, reactionDelay: 100, trackRate: 0.75 },
      hard: { speed: 8.0, errorRange: 5, reactionDelay: 16, trackRate: 0.98 }
    },

    TARGET_SCORES: [5, 7, 11, 15],
    DEFAULT_TARGET_SCORE: 7,
    DEFAULT_MUSIC_VOLUME: 0.6,
    DEFAULT_SFX_VOLUME: 0.8,
    SCREEN_FADE_DURATION: 400,
    COUNTDOWN_DURATION: 3000,
    SCORE_FLASH_DURATION: 600,

    SPEED_MULTIPLIERS: {
      slow: 0.82,
      normal: 1,
      fast: 1.18
    },

    DIFFICULTY_LABELS: {
      easy: "簡單",
      normal: "普通",
      hard: "困難"
    },

    BALL_SPEED_LABELS: {
      slow: "慢",
      normal: "正常",
      fast: "快"
    },

    LANGUAGES: [
      { id: "zh-TW", label: "繁體中文", htmlLang: "zh-TW" },
      { id: "en", label: "English", htmlLang: "en" },
      { id: "ja", label: "日本語", htmlLang: "ja" }
    ],

    THEMES: [
      { id: "neon", name: "霓虹", primary: "#00FFAA", secondary: "#FF00FF", bg: "#0A0A1A" },
      { id: "classic", name: "經典", primary: "#FFFFFF", secondary: "#FFFFFF", bg: "#000000" },
      { id: "ocean", name: "海洋", primary: "#00BFFF", secondary: "#7FFFD4", bg: "#001428" },
      { id: "fire", name: "火焰", primary: "#FF6B00", secondary: "#FFD700", bg: "#1A0500" },
      { id: "forest", name: "森林", primary: "#00E676", secondary: "#69F0AE", bg: "#0A1F0A" },
      { id: "candy", name: "糖果", primary: "#FF4081", secondary: "#E040FB", bg: "#FFF0F5" },
      { id: "ice", name: "冰川", primary: "#B0E0FF", secondary: "#FFFFFF", bg: "#0D1B2A" },
      { id: "galaxy", name: "星河", primary: "#C77DFF", secondary: "#E0AAFF", bg: "#03001C" }
    ],

    SAVE_VERSION: "1.0",
    SETTINGS_KEY: "pong_settings",
    SAVE_KEY: "pong_save"
  };

  window.Pong = window.Pong || {};
  window.CONSTANTS = CONSTANTS;
  window.Pong.Constants = CONSTANTS;
})();
