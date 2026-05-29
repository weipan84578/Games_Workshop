(function (BS) {
  BS.Core.Config = {
    themes: [
      { name: "classic", label: "Classic", swatch: ["#e84d64", "#29a98d", "#f6c94c", "#4388f0"] },
      { name: "ocean", label: "Ocean", swatch: ["#ff6b77", "#35c6d0", "#ffe27a", "#2e79d9"] },
      { name: "candy", label: "Candy", swatch: ["#ff5fa1", "#55d6a7", "#ffd95a", "#6ba7ff"] },
      { name: "neon", label: "Neon", swatch: ["#ff4976", "#20e3b2", "#ffcf33", "#38a2ff"] },
      { name: "dark", label: "Dark", swatch: ["#e85b65", "#55c9a8", "#eec65f", "#5a9de6"] }
    ],

    languages: [
      { name: "zh", label: "中文", htmlLang: "zh-Hant" },
      { name: "en", label: "English", htmlLang: "en" },
      { name: "ja", label: "日本語", htmlLang: "ja" }
    ],

    difficulties: [
      {
        name: "easy",
        pressureInterval: 68,
        addRowEveryMisses: 7
      },
      {
        name: "normal",
        pressureInterval: 48,
        addRowEveryMisses: 5
      },
      {
        name: "hard",
        pressureInterval: 30,
        addRowEveryMisses: 3
      }
    ],

    game: {
      cols: 12,
      maxRows: 13,
      initialRows: 7,
      colorCount: 6,
      rowGapFactor: 1.72,
      shotSpeed: 780,
      minAimDeg: -165,
      maxAimDeg: -15,
      addRowEveryMisses: 5,
      matchCount: 3,
      pointsPerPop: 10,
      pointsPerDrop: 15,
      comboBonus: 25
    },

    audio: {
      bgm: {
        menu: "assets/audio/bgm/menu.mp3",
        game: "assets/audio/bgm/game.mp3",
        victory: "assets/audio/bgm/victory.mp3"
      },
      sfx: {
        shoot: "assets/audio/sfx/shoot.mp3",
        bounce: "assets/audio/sfx/bounce.mp3",
        attach: "assets/audio/sfx/attach.mp3",
        pop: "assets/audio/sfx/pop.mp3",
        drop: "assets/audio/sfx/drop.mp3",
        combo: "assets/audio/sfx/combo.mp3",
        click: "assets/audio/sfx/click.mp3",
        win: "assets/audio/sfx/win.mp3",
        lose: "assets/audio/sfx/lose.mp3"
      }
    }
  };

  BS.Core.getDifficulty = function (name) {
    var difficulties = BS.Core.Config.difficulties;
    for (var i = 0; i < difficulties.length; i += 1) {
      if (difficulties[i].name === name) {
        return difficulties[i];
      }
    }
    return difficulties[1];
  };
})(window.BubbleShooter);
