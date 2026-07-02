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
      touchSensitivity: "medium",
      keyboardEnabled: true,
      targetScore: 7
    },
    VALID: {
      languages: ["zh", "en", "ja"],
      themes: ["neon", "classic", "sunset", "ice"],
      effectsQuality: ["low", "medium", "high"],
      touchSensitivity: ["low", "medium", "high"],
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
      FRICTION_PER_SECOND: 0.985,
      WALL_RESTITUTION: 0.93,
      MALLET_RESTITUTION: 1.08,
      MAX_PUCK_SPEED: 1220,
      SERVE_SPEED: 420
    },
    DIFFICULTY: {
      easy: {
        reactionDelay: 0.4,
        speed: 330,
        predictionTime: 0,
        mistakeRate: 0.25,
        attackBias: 0.18
      },
      normal: {
        reactionDelay: 0.2,
        speed: 470,
        predictionTime: 0.3,
        mistakeRate: 0.1,
        attackBias: 0.35
      },
      hard: {
        reactionDelay: 0.06,
        speed: 650,
        predictionTime: 0.62,
        mistakeRate: 0.02,
        attackBias: 0.55
      }
    },
    EFFECT_LIMITS: {
      low: 34,
      medium: 72,
      high: 120
    },
    TOUCH_MULTIPLIER: {
      low: 0.82,
      medium: 1,
      high: 1.18
    },
    AUDIO: {
      BASE_BGM_VOLUME: 0.05,
      GAMEPLAY_BGM_MULTIPLIER: 10
    }
  };
})(window.AirHockey = window.AirHockey || {});
