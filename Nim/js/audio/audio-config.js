(function (NimGame) {
  'use strict';

  NimGame.AudioConfig = {
    inGameMultiplier: 10,
    limiter: {
      threshold: -12,
      knee: 0,
      ratio: 20,
      attack: 0.003,
      release: 0.18
    },
    bgmPatterns: {
      menu: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63],
      game: [293.66, 369.99, 440.00, 587.33, 493.88, 369.99],
      gameAlt: [329.63, 392.00, 493.88, 659.25, 587.33, 493.88],
      victory: [523.25, 659.25, 783.99, 1046.50]
    }
  };
}(window.NimGame = window.NimGame || {}));
