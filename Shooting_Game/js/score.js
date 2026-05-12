function comboMultiplier(combo) {
  if (combo >= 20) return 3;
  if (combo >= 10) return 2;
  if (combo >= 5) return 1.5;
  return 1;
}

function addEnemyScore(run, base, headshot = false) {
  const raw = headshot ? 300 : base;
  const gained = Math.round(raw * comboMultiplier(run.combo));
  run.score += gained;
  return gained;
}

function applyTimeBonus(run) {
  if (!run.failed && Number.isFinite(run.stage.quota)) {
    run.score += Math.floor(run.remainingMs / 1000) * 50;
    if (!run.damaged) run.score += 500;
    if (run.hostageHits === 0) run.score += 300;
  }
}

function penalize(run, amount) {
  run.score = Math.max(0, run.score - amount);
}
