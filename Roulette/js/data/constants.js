(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};

  const STORAGE_KEY = "roulette_save_v1";
  const SETTINGS_KEY = "roulette_settings_v1";
  const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const WHEEL_ORDER_EUROPEAN = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27,
    13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1,
    20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ];
  const WHEEL_ORDER_AMERICAN = [
    0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1,
    "00", 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2,
  ];
  const CHIP_VALUES = [5, 10, 25, 50, 100, 500, 1000];
  const CHIP_COLORS = ["#d9b23f", "#d96f3f", "#3bb77a", "#4f91d9", "#9f78df", "#dedede", "#f0c15a"];

  const DEFAULT_SETTINGS = {
    language: "zh-TW",
    bgmVolume: 0.6,
    sfxVolume: 0.8,
    bgmEnabled: true,
    sfxEnabled: true,
    theme: "classic",
    animationSpeed: "normal",
    showHistory: true,
    difficulty: "normal",
    wheelType: "european",
    startingBalance: 3000,
  };

  const DIFFICULTY = {
    easy: {
      player: 5000,
      ai: 2000,
      target: 10000,
      aiRatio: 0.05,
      aiDiversity: 1,
      thinkMin: 500,
      thinkMax: 1000,
      labelColor: "easy",
    },
    normal: {
      player: 3000,
      ai: 3000,
      target: 8000,
      aiRatio: 0.08,
      aiDiversity: 3,
      thinkMin: 900,
      thinkMax: 1500,
      labelColor: "normal",
    },
    hard: {
      player: 2000,
      ai: 5000,
      target: 6000,
      aiRatio: 0.12,
      aiDiversity: 5,
      thinkMin: 1500,
      thinkMax: 3000,
      labelColor: "hard",
    },
  };

  const THEME_META = [
    { key: "classic", nameKey: "theme.classic", felt: "#1a5c2e", border: "#8b6914" },
    { key: "royal", nameKey: "theme.royal", felt: "#0d2b5e", border: "#c9a84c" },
    { key: "neon", nameKey: "theme.neon", felt: "#0a0a12", border: "#ff00ff" },
    { key: "rose", nameKey: "theme.rose", felt: "#3d1a24", border: "#e8a598" },
    { key: "midnight", nameKey: "theme.midnight", felt: "#1a0a2e", border: "#9c27b0" },
  ];

  const HELP_TABS = ["goal", "wheel", "bets", "payout", "ai", "controls"];

  Object.assign(R, { STORAGE_KEY, SETTINGS_KEY, RED_NUMBERS, WHEEL_ORDER_EUROPEAN, WHEEL_ORDER_AMERICAN, CHIP_VALUES, CHIP_COLORS, DEFAULT_SETTINGS, DIFFICULTY, THEME_META, HELP_TABS });
})();
