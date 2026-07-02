(function (ns) {
  "use strict";

  ns.Constants = {
    VERSION: "1.0.0",
    STORAGE_KEYS: {
      SETTINGS: "airHockey.settings",
      PROGRESS: "airHockey.gameProgress",
      LANGUAGE_CHOSEN: "airHockey.languageChosen"
    },
    DEFAULT_SETTINGS: {
      language: "auto",
      theme: "neon",
      bgmVolume: 70,
      sfxVolume: 80,
      muted: false,
      effectsQuality: "medium",
      targetScore: 7
    },
    VALID: {
      languages: ["zh", "en", "ja"],
      themes: ["neon", "classic", "sunset", "ice"],
      effectsQuality: ["low", "medium", "high"],
      targetScore: [5, 7, 10]
    },
    TABLE: {
      WIDTH: 600,
      HEIGHT: 900,
      RAIL: 28,
      CENTER_Y: 450,
      GOAL_WIDTH: 170,
      PUCK_RADIUS: 19,
      MALLET_RADIUS: 38,
      PLAYER_START_Y: 675,
      AI_START_Y: 225,
      PLAYER_MIN_Y: 450,
      AI_MAX_Y: 450,
      RALLY_ACCELERATION_PER_SECOND: 1.12,
      MIN_PUCK_SPEED: 360,
      WALL_RESTITUTION: 1.02,
      MALLET_RESTITUTION: 1.12,
      MAX_PUCK_SPEED: 1650,
      SERVE_SPEED: 430
    },
    DIFFICULTY: {
      easy: {
        reactionDelay: 0.28,
        speed: 430,
        predictionTime: 0.12,
        mistakeRate: 0.16,
        attackBias: 0.24,
        rallyAcceleration: 1.035,
        minPuckSpeed: 340,
        maxPuckSpeed: 860
      },
      normal: {
        reactionDelay: 0.14,
        speed: 590,
        predictionTime: 0.42,
        mistakeRate: 0.06,
        attackBias: 0.44,
        rallyAcceleration: 1.065,
        minPuckSpeed: 380,
        maxPuckSpeed: 1220
      },
      hard: {
        reactionDelay: 0.035,
        speed: 800,
        predictionTime: 0.82,
        mistakeRate: 0.01,
        attackBias: 0.68,
        rallyAcceleration: 1.12,
        minPuckSpeed: 420,
        maxPuckSpeed: 1700
      }
    },
    EFFECT_LIMITS: {
      low: 34,
      medium: 72,
      high: 120
    },
    AUDIO: {
      BASE_BGM_VOLUME: 0.05,
      GAMEPLAY_BGM_MULTIPLIER: 10
    }
  };
})(window.AirHockey = window.AirHockey || {});
