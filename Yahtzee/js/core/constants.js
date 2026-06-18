window.YZ = window.YZ || {};

YZ.Constants = (function () {
  var SCORE_CATEGORIES = [
    { key: "ones", section: "upper", face: 1, icon: "1" },
    { key: "twos", section: "upper", face: 2, icon: "2" },
    { key: "threes", section: "upper", face: 3, icon: "3" },
    { key: "fours", section: "upper", face: 4, icon: "4" },
    { key: "fives", section: "upper", face: 5, icon: "5" },
    { key: "sixes", section: "upper", face: 6, icon: "6" },
    { key: "threeKind", section: "lower", icon: "3K" },
    { key: "fourKind", section: "lower", icon: "4K" },
    { key: "fullHouse", section: "lower", icon: "FH" },
    { key: "smallStraight", section: "lower", icon: "SS" },
    { key: "largeStraight", section: "lower", icon: "LS" },
    { key: "yahtzee", section: "lower", icon: "YZ" },
    { key: "chance", section: "lower", icon: "CH" }
  ];

  var UPPER_KEYS = SCORE_CATEGORIES.filter(function (item) {
    return item.section === "upper";
  }).map(function (item) {
    return item.key;
  });

  var LOWER_KEYS = SCORE_CATEGORIES.filter(function (item) {
    return item.section === "lower";
  }).map(function (item) {
    return item.key;
  });

  return {
    VERSION: 1,
    DICE_COUNT: 5,
    MAX_ROLLS: 3,
    TOTAL_ROUNDS: 13,
    UPPER_BONUS_TARGET: 63,
    UPPER_BONUS_POINTS: 35,
    YAHTZEE_POINTS: 50,
    YAHTZEE_BONUS_POINTS: 100,
    SCORE_CATEGORIES: SCORE_CATEGORIES,
    SCORE_KEYS: SCORE_CATEGORIES.map(function (item) { return item.key; }),
    UPPER_KEYS: UPPER_KEYS,
    LOWER_KEYS: LOWER_KEYS,
    PLAYERS: ["player", "ai"],
    DIE_FACES: ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"],
    THEMES: ["ocean", "sunset", "forest", "grape", "dark"],
    LANGS: ["zh", "en", "ja"],
    DIFFICULTIES: ["easy", "normal", "hard"],
    STORAGE_KEYS: {
      game: "yz.save.game",
      prefPrefix: "yz.pref."
    },
    DEFAULT_PREFS: {
      lang: "zh",
      theme: "ocean",
      bgm: 0.7,
      sfx: 0.8,
      mute: false,
      difficulty: "normal",
      fontScale: "large",
      aiSpeed: 0.55,
      showHints: true
    }
  };
})();
