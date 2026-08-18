(function (global) {
  global.AUDIO_CONFIG = {
    scenes: {
      menu: { tracks: ["menu_piano_1", "menu_piano_2"], tempo: 112 },
      battle: { tracks: ["battle_piano_1", "battle_piano_2", "battle_piano_3"], tempo: 132 },
      victory: { tracks: ["victory_piano"], tempo: 150 },
      defeat: { tracks: ["defeat_piano"], tempo: 82 }
    },
    sfx: { click: true, summon: true, hit: true, victory: true, defeat: true, star: true, upgrade: true, boss: true }
  };
})(window);
