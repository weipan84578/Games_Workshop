(function (app) {
  "use strict";

  const SAVE_KEY = "mole_mayhem_save_v1";
  const DIFFICULTY = {
    easy: { spawn: 1.12, time: 1.08, penalty: 0.75 },
    normal: { spawn: 1, time: 1, penalty: 1 },
    hard: { spawn: 0.84, time: 0.92, penalty: 1.2 }
  };

  const LEVELS = [
    { id: 1, name: "新手草地", rows: 3, cols: 3, time: 60, target: 500, bpm: 100, tint: "rgba(6, 214, 160, 0.04)", types: ["normal"] },
    { id: 2, name: "快手訓練", rows: 3, cols: 3, time: 60, target: 800, bpm: 110, tint: "rgba(255, 210, 63, 0.06)", types: ["normal", "fast"] },
    { id: 3, name: "像素暴走", rows: 3, cols: 3, time: 55, target: 1200, bpm: 120, tint: "rgba(6, 130, 214, 0.08)", types: ["normal", "fast", "bad"] },
    { id: 4, name: "陷阱花園", rows: 3, cols: 4, time: 60, target: 2000, bpm: 130, tint: "rgba(239, 71, 111, 0.08)", types: ["normal", "fast", "bad", "bonus"], obstacle: true },
    { id: 5, name: "毒霧沼澤", rows: 3, cols: 4, time: 55, target: 2800, bpm: 95, tint: "rgba(141, 211, 75, 0.08)", types: ["normal", "fast", "bad", "poison", "bonus"] },
    { id: 6, name: "冰晶礦坑", rows: 4, cols: 4, time: 55, target: 4200, bpm: 140, tint: "rgba(125, 218, 255, 0.1)", types: ["normal", "fast", "armored", "flash", "bonus"] },
    { id: 7, name: "暗夜迷宮", rows: 4, cols: 4, time: 50, target: 6000, bpm: 150, tint: "rgba(98, 55, 170, 0.15)", types: ["normal", "fast", "bad", "armored", "flash"], obstacle: true },
    { id: 8, name: "熔岩亂流", rows: 4, cols: 4, time: 50, target: 9000, bpm: 160, tint: "rgba(255, 107, 53, 0.12)", types: ["normal", "fast", "bad", "armored", "bonus", "flash"] },
    { id: 9, name: "變形領域", rows: 4, cols: 5, time: 70, target: 14000, bpm: 125, tint: "rgba(6, 214, 160, 0.12)", types: ["normal", "fast", "bad", "armored", "bonus", "flash"], obstacle: true },
    { id: 10, name: "地鼠魔王", rows: 4, cols: 5, time: 90, target: 1, bpm: 170, tint: "rgba(239, 71, 111, 0.16)", types: ["normal", "fast", "bad", "armored", "bonus", "boss"], boss: true }
  ];

  const MOLES = {
    normal: { label: "地鼠", hp: 1, reward: 100, penalty: 0, duration: 1600, weight: 50, icon: "" },
    fast: { label: "快鼠", hp: 1, reward: 150, penalty: 0, duration: 950, weight: 24, icon: "" },
    bad: { label: "炸彈鼠", hp: 1, reward: -150, penalty: 1, duration: 1500, weight: 14, icon: "" },
    poison: { label: "毒鼠", hp: 1, reward: -200, penalty: 0, duration: 1550, weight: 10, icon: "" },
    armored: { label: "裝甲鼠", hp: 2, reward: 240, penalty: 0, duration: 2200, weight: 16, shield: true, icon: "" },
    bonus: { label: "寶石鼠", hp: 1, reward: 500, penalty: 0, duration: 1150, weight: 7, powerChance: 0.8, icon: "" },
    flash: { label: "閃電鼠", hp: 1, reward: 420, penalty: 0, duration: 620, weight: 7, icon: "" },
    boss: { label: "BOSS", hp: 100, reward: 2000, penalty: 0, duration: 2600, weight: 6, icon: "" }
  };

  app.SAVE_KEY = SAVE_KEY;
  app.DIFFICULTY = DIFFICULTY;
  app.LEVELS = LEVELS;
  app.MOLES = MOLES;
})(window.MoleMayhem = window.MoleMayhem || {});
