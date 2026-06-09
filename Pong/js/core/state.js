(function () {
  const GameState = {
    screen: "boot",
    settings: null,
    muted: false,

    dimensions: {
      width: CONSTANTS.REFERENCE_WIDTH,
      height: CONSTANTS.REFERENCE_HEIGHT,
      scaleFactor: 1
    },

    canvas: {
      element: null,
      context: null,
      wrapper: null
    },

    input: {
      up: false,
      down: false,
      pointerActive: false,
      pointerY: null,
      virtualUp: false,
      virtualDown: false
    },

    game: {
      active: false,
      running: false,
      paused: false,
      difficulty: "normal",
      targetScore: CONSTANTS.DEFAULT_TARGET_SCORE,
      playerScore: 0,
      aiScore: 0,
      player: null,
      ai: null,
      ball: null,
      winner: null,
      lastScoreBy: null,
      lastTimestamp: 0,
      animationFrame: 0,
      countdownTimer: 0,
      countdownInterval: 0,
      continuedFromSave: false
    },

    audio: {
      context: null,
      masterGain: null,
      musicGain: null,
      sfxGain: null,
      currentMusic: null,
      desiredMusic: null,
      musicNodes: [],
      musicTimer: 0,
      unlocked: false
    },

    effects: {
      particles: [],
      fps: 0,
      frames: 0,
      fpsTime: 0
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.GameState = GameState;
})();
