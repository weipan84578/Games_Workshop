(function (Game) {
  "use strict";
  function create(seed) {
    var state = {
      schemaVersion: 1,
      seed: seed >>> 0 || Game.seedFromTime(),
      rng: null,
      nextId: 0,
      time: 0,
      player: Game.Player.create(193, 576),
      camera: { y: 0, previousY: 0 },
      platforms: [],
      items: [],
      enemies: [],
      particles: [],
      score: null,
      over: false,
      reason: "",
      environment: "morning",
      trackIndex: 0,
      lastSavedHeight: 0,
      lastSaveAt: 0,
    };
    state.rng = new Game.PRNG(state.seed);
    state.score = Game.ScoreService.create(576);
    Game.WorldGenerator.populate(state);
    return state;
  }
  function environmentFor(height) {
    if (height < 300) return "morning";
    if (height < 1000) return "sky";
    if (height < 2500) return "sunset";
    return "night";
  }
  function snapshot(state) {
    var copy = Game.clone(state);
    copy.rngState = state.rng.seed;
    delete copy.rng;
    copy.particles = [];
    return copy;
  }
  function fromSnapshot(data) {
    if (!Game.SaveStore.isValid(data)) return null;
    var state = Game.clone(data);
    if (!Number.isFinite(state.score.comboPeakY)) state.score.comboPeakY = null;
    state.lastSavedHeight = Number(state.lastSavedHeight) || 0;
    state.lastSaveAt = Number(state.lastSaveAt) || 0;
    state.trackIndex = Number(state.trackIndex) || 0;
    state.platforms.forEach(function (platform) {
      if (platform.itemType === undefined) platform.itemType = null;
      if (platform.hazardType === undefined) platform.hazardType = null;
    });
    state.rng = new Game.PRNG(state.seed);
    state.rng.seed = data.rngState >>> 0 || state.seed;
    state.particles = [];
    state.over = false;
    state.reason = "";
    return state;
  }
  Game.GameState = Object.freeze({
    create: create,
    snapshot: snapshot,
    fromSnapshot: fromSnapshot,
    environmentFor: environmentFor,
  });
})(window.DJGame);
