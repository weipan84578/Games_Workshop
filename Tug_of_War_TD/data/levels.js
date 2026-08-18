(function (global) {
  global.LEVELS_DATA = [
    { id: 1, nameKey: "level_1_name", descriptionKey: "level_1_desc", difficultyKey: "difficulty_1", maxTime: 120, baseHp: 1000, energyMax: 100, energyRate: 1.2, enemyRate: 1.05, enemyPool: ["basic", "ranger"], accent: "#e984a8" },
    { id: 2, nameKey: "level_2_name", descriptionKey: "level_2_desc", difficultyKey: "difficulty_2", maxTime: 125, baseHp: 1120, energyMax: 110, energyRate: 1.3, enemyRate: 1.12, enemyPool: ["basic", "ranger", "tank"], accent: "#5ba4df" },
    { id: 3, nameKey: "level_3_name", descriptionKey: "level_3_desc", difficultyKey: "difficulty_3", maxTime: 130, baseHp: 1240, energyMax: 120, energyRate: 1.4, enemyRate: 1.22, enemyPool: ["basic", "ranger", "tank", "striker"], accent: "#73b866" },
    { id: 4, nameKey: "level_4_name", descriptionKey: "level_4_desc", difficultyKey: "difficulty_4", maxTime: 135, baseHp: 1380, energyMax: 130, energyRate: 1.5, enemyRate: 1.3, enemyPool: ["ranger", "tank", "striker", "healer"], accent: "#ed9852" },
    { id: 5, nameKey: "level_5_name", descriptionKey: "level_5_desc", difficultyKey: "difficulty_5", maxTime: 145, baseHp: 1550, energyMax: 140, energyRate: 1.65, enemyRate: 1.42, enemyPool: ["basic", "ranger", "tank", "striker", "healer"], accent: "#a679dc" }
  ];
})(window);
