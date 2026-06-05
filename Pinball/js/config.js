(function (window) {
  "use strict";

  window.Pinball = window.Pinball || {};

  window.Pinball.CONFIG = {
    VERSION: "1.0.0",
    STORAGE: {
      HIGH_SCORE: "pinball.highscore",
      SETTINGS: "pinball.settings",
      SAVED_GAME: "pinball.savedGame"
    },
    DEFAULT_SETTINGS: {
      theme: "neon",
      bgmVolume: 0.45,
      sfxVolume: 0.8,
      muted: false,
      difficulty: "normal"
    },
    DIFFICULTY: {
      easy: {
        gravity: 1080,
        friction: 0.997,
        restitution: 0.82,
        flipperForce: 920,
        ballSaveMs: 10000
      },
      normal: {
        gravity: 1220,
        friction: 0.996,
        restitution: 0.78,
        flipperForce: 1080,
        ballSaveMs: 7500
      },
      hard: {
        gravity: 1360,
        friction: 0.995,
        restitution: 0.74,
        flipperForce: 1160,
        ballSaveMs: 5200
      }
    },
    BOARD: {
      width: 540,
      height: 960,
      ballRadius: 12,
      maxSpeed: 1450,
      drainY: 988,
      shooterX: 491,
      shooterRestY: 852,
      playfieldBottom: 878
    },
    SCORE: {
      bumper: 100,
      target: 250,
      ramp: 500,
      rollover: 350,
      jackpot: 5000,
      extraBallAt: 35000
    },
    GAME: {
      startingBalls: 3,
      comboWindowMs: 2400,
      messageMs: 1700
    }
  };
})(window);
