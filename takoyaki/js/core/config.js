(function registerConfig(app) {
  "use strict";

  app.Config = {
    version: "1.0.0",
    storageKeys: {
      settings: "takoyaki-master.settings.v1",
      progress: "takoyaki-master.progress.v1",
      flags: "takoyaki-master.flags.v1"
    },
    defaultSettings: {
      bgmVolume: 0.34,
      sfxVolume: 0.72,
      theme: "theme-cute-pink",
      language: "auto"
    },
    languages: [
      { id: "ja", flag: "🇯🇵", nameKey: "language_ja" },
      { id: "en", flag: "🇺🇸", nameKey: "language_en" },
      { id: "zh-TW", flag: "🇹🇼", nameKey: "language_zh" }
    ],
    themes: [
      { id: "theme-cute-pink", key: "theme_cute_pink", color: "#FF6FA5" },
      { id: "theme-ocean-blue", key: "theme_ocean_blue", color: "#2196C9" },
      { id: "theme-sunny-yellow", key: "theme_sunny_yellow", color: "#FFB300" },
      { id: "theme-matcha-green", key: "theme_matcha_green", color: "#4CAF6D" },
      { id: "theme-night-purple", key: "theme_night_purple", color: "#B79CFF" }
    ],
    tools: [
      { id: "batter", icon: "🥄", key: "tool_batter", sfx: "pour" },
      { id: "octopus", icon: "🐙", key: "tool_octopus", sfx: "button" },
      { id: "topping", icon: "🧅", key: "tool_topping", sfx: "button" },
      { id: "flip", icon: "⏱️", key: "tool_flip", sfx: "flip" },
      { id: "plate", icon: "🍽️", key: "tool_plate", sfx: "plate" },
      { id: "sauce", icon: "🍯", key: "tool_sauce", sfx: "sauce" },
      { id: "discard", icon: "🗑️", key: "tool_discard", sfx: "button" }
    ],
    slotTiming: {
      rawToHalf: 2400,
      halfToBurnt: 10032,
      flippedToCooked: 2600,
      cookedToBurnt: 8712,
      doneToClear: 1500
    },
    levels: [
      { id: 1, slots: 6, target: 6, seconds: 110, topping: "greenOnion", sauce: "classic" },
      { id: 2, slots: 8, target: 8, seconds: 120, topping: "beni", sauce: "mayo" },
      { id: 3, slots: 10, target: 10, seconds: 135, topping: "tenkasu", sauce: "classic" },
      { id: 4, slots: 12, target: 12, seconds: 150, topping: "mixed", sauce: "special" }
    ],
    howtoSteps: [
      { icon: "🥄", title: "howto_step_1_title", body: "howto_step_1_body" },
      { icon: "🐙", title: "howto_step_2_title", body: "howto_step_2_body" },
      { icon: "🧅", title: "howto_step_3_title", body: "howto_step_3_body" },
      { icon: "⏱️", title: "howto_step_4_title", body: "howto_step_4_body" },
      { icon: "🍽️", title: "howto_step_5_title", body: "howto_step_5_body" },
      { icon: "🍯", title: "howto_step_6_title", body: "howto_step_6_body" },
      { icon: "⭐⭐⭐", title: "howto_step_7_title", body: "howto_step_7_body" },
      { icon: "📱", title: "howto_step_8_title", body: "howto_step_8_body" }
    ]
  };
})(window.Takoyaki = window.Takoyaki || {});
