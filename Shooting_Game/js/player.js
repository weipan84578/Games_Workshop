
function canShoot(run) {
  return run && !run.reloading && !run.failed && !run.cleared;
}

function consumeAmmo(run, settings) {
  const difficulty = DIFFICULTY[settings.difficulty];
  if (difficulty.ammo === Infinity) return true;
  if (run.ammo <= 0) return false;
  run.ammo -= 1;
  return true;
}

function reload(run, settings, onStart, onDone) {
  const difficulty = DIFFICULTY[settings.difficulty];
  if (!run || run.reloading || difficulty.ammo === Infinity || run.ammo === run.magazine) return;
  run.reloading = true;
  run.reloadDoneAt = performance.now() + difficulty.reloadMs;
  onStart?.(difficulty.reloadMs);
  window.setTimeout(() => {
    if (!run.reloading) return;
    run.ammo = run.magazine;
    run.reloading = false;
    onDone?.();
  }, difficulty.reloadMs);
}
