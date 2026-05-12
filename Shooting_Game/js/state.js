
const GameState = {
  screen: "menu",
  settings: loadSettings(),
  activeStageIndex: 0,
  run: null,
  paused: false,
  rafId: 0,
  audioUnlocked: false
};

function createRun(stage, difficulty) {
  const magazine = difficulty.ammo;
  return {
    stage,
    startedAt: performance.now(),
    lastTickAt: performance.now(),
    remainingMs: stage.seconds * 1000,
    spawnClock: 0,
    score: 0,
    combo: 0,
    lastHitAt: 0,
    lives: 3,
    ammo: magazine,
    magazine,
    reloading: false,
    reloadDoneAt: 0,
    cleared: false,
    failed: false,
    killed: 0,
    shots: 0,
    hits: 0,
    hostageHits: 0,
    damaged: false,
    targets: [],
    nextTargetId: 1,
    bossSpawned: false,
    bossDefeated: false,
    endlessLevel: 1
  };
}
