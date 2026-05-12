
class GameController {
  constructor({ audio, fx }) {
    this.audio = audio;
    this.fx = fx;
    this.field = document.querySelector("#game-field");
    this.targetLayer = document.querySelector("#target-layer");
    this.scene = document.querySelector("#scene-backdrop");
    this.reloadMeter = document.querySelector("#reload-meter");
    this.bindInput();
  }

  start(stageIndex) {
    window.cancelAnimationFrame(GameState.rafId);
    GameState.activeStageIndex = stageIndex;
    const stage = STAGES[stageIndex];
    const difficulty = DIFFICULTY[GameState.settings.difficulty];
    GameState.run = createRun(stage, difficulty);
    GameState.paused = false;
    this.targetLayer.innerHTML = "";
    document.querySelector("#fx-layer").innerHTML = "";
    this.scene.style.setProperty("--scene-bg", stage.scene);
    this.audio.playMusic(stage.id);
    showScreen("gameplay");
    GameState.screen = "gameplay";
    this.updateHud();
    GameState.rafId = window.requestAnimationFrame((time) => this.loop(time));
  }

  loop(time) {
    const run = GameState.run;
    if (!run || GameState.paused) return;
    const delta = Math.min(100, time - run.lastTickAt);
    run.lastTickAt = time;
    this.update(delta, time);
    this.updateHud();
    if (!run.failed && !run.cleared) {
      GameState.rafId = window.requestAnimationFrame((next) => this.loop(next));
    }
  }

  update(delta, now) {
    const run = GameState.run;
    run.remainingMs = Math.max(0, run.remainingMs - delta);
    if (run.combo > 0 && now - run.lastHitAt > 3000) run.combo = 0;

    for (const target of [...run.targets]) {
      target.age += delta;
      if (target.age > target.stayMs) {
        this.targetEscaped(target);
      }
    }

    run.spawnClock += delta;
    const spawnEvery = Math.max(330, run.stage.spawnEvery - (run.endlessLevel - 1) * 32);
    if (run.spawnClock >= spawnEvery && run.targets.length < run.stage.maxActive + Math.floor((run.endlessLevel - 1) / 4)) {
      run.spawnClock = 0;
      this.spawnTarget();
    }

    if (run.stage.boss && !run.bossSpawned && run.killed >= run.stage.quota) {
      run.bossSpawned = true;
      this.addTarget(createBoss(run));
      this.audio.sfx("combo");
    }

    if (run.stage.endless && run.killed > 0 && run.killed % 18 === 0) {
      run.endlessLevel = 1 + Math.floor(run.killed / 18);
    }

    if (run.remainingMs <= 0) this.finish(false);
    if (run.lives <= 0) this.finish(false);
    if (!run.stage.endless && !run.stage.boss && run.killed >= run.stage.quota) this.finish(true);
    if (run.stage.boss && run.bossDefeated) this.finish(true);
  }

  spawnTarget() {
    const run = GameState.run;
    if (!run || run.failed || run.cleared) return;
    if (run.stage.boss && run.bossSpawned) {
      if (Math.random() < 0.7) return;
    }
    this.addTarget(createTarget(run));
  }

  addTarget(target) {
    const run = GameState.run;
    run.targets.push(target);
    renderTarget(target, this.targetLayer);
    this.audio.sfx(target.isHostage ? "help" : "reload");
  }

  targetEscaped(target) {
    const run = GameState.run;
    this.removeTarget(target);
    if (!target.isHostage) {
      run.lives -= 1;
      run.damaged = true;
      run.combo = 0;
      this.audio.sfx("attack");
      this.shake();
    }
  }

  removeTarget(target) {
    const run = GameState.run;
    run.targets = run.targets.filter((item) => item.id !== target.id);
    target.node?.remove();
  }

  bindInput() {
    this.field.addEventListener("mousedown", (event) => {
      if (event.button !== 0) return;
      this.handleShot(event.clientX, event.clientY);
    });
    this.field.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this.reload();
    });
    this.field.addEventListener("touchstart", (event) => {
      event.preventDefault();
      if (event.touches.length > 1) {
        this.reload();
        return;
      }
      const touch = event.changedTouches[0];
      this.handleShot(touch.clientX, touch.clientY);
    }, { passive: false });
    document.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "r") this.reload();
      if (event.key === "Escape") this.togglePause();
    });
  }

  handleShot(clientX, clientY) {
    const run = GameState.run;
    if (!canShoot(run)) return;
    this.audio.unlock();
    if (!consumeAmmo(run, GameState.settings)) {
      penalize(run, 50);
      this.audio.sfx("empty");
      this.reload();
      this.updateHud();
      return;
    }
    run.shots += 1;
    this.audio.sfx("gun");

    const target = this.findTargetAt(clientX, clientY);
    const rect = this.field.getBoundingClientRect();
    if (!target) {
      run.combo = 0;
      this.audio.sfx("miss");
      this.fx.spawn("hole", clientX - rect.left, clientY - rect.top);
      this.updateHud();
      if (run.ammo === 0) this.reload();
      return;
    }
    this.hitTarget(target, clientX - rect.left, clientY - rect.top, clientY);
    if (run.ammo === 0) this.reload();
  }

  findTargetAt(clientX, clientY) {
    const run = GameState.run;
    return [...run.targets].reverse().find((target) => {
      if (!target.node) return false;
      const rect = target.node.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    });
  }

  hitTarget(target, localX, localY, clientY) {
    const run = GameState.run;
    run.hits += 1;
    const targetRect = target.node.getBoundingClientRect();
    const headshot = clientY < targetRect.top + targetRect.height * 0.34 && !target.isHostage;

    if (target.isHostage) {
      run.hostageHits += 1;
      run.combo = 0;
      penalize(run, target.typeId === "vip" ? 1000 : 500);
      if (Math.random() < 0.18) run.lives -= 1;
      this.fx.spawn("flash", localX, localY);
      this.audio.sfx("hostage");
      this.shake();
      this.removeTarget(target);
      return;
    }

    const damage = headshot ? 2 : 1;
    target.hp -= damage;
    run.combo += 1;
    run.lastHitAt = performance.now();
    if (run.combo === 5 || run.combo === 10 || run.combo === 20) this.audio.sfx("combo");

    if (target.typeId === "boss") {
      updateBossBar(target);
      this.audio.sfx("hit");
      target.node.animate([{ filter: "brightness(2)" }, { filter: "brightness(1)" }], { duration: 130 });
    }

    if (target.hp <= 0) {
      const gained = target.typeId === "boss" ? target.score : addEnemyScore(run, target.score, headshot);
      if (target.typeId === "boss") {
        run.score += target.score;
        run.bossDefeated = true;
      }
      run.killed += target.typeId === "boss" ? 0 : 1;
      target.node.classList.add("is-dead");
      this.fx.spawn(GameState.settings.fxEnabled ? "blood" : "flash", localX, localY);
      this.fx.score(`+${gained}`, localX, localY);
      this.audio.sfx(headshot ? "head" : "hit");
      window.setTimeout(() => this.removeTarget(target), 280);
    } else {
      this.fx.spawn("flash", localX, localY);
      this.fx.score("-HP", localX, localY);
    }
    this.updateHud(true);
  }

  reload() {
    const run = GameState.run;
    reload(run, GameState.settings, (ms) => {
      this.audio.sfx("reload");
      const bar = this.reloadMeter.querySelector("span");
      this.reloadMeter.classList.add("is-active");
      bar.getAnimations().forEach((animation) => animation.cancel());
      bar.style.transition = "none";
      bar.style.transform = "scaleX(0)";
      void bar.offsetWidth;
      bar.animate([
        { transform: "scaleX(0)" },
        { transform: "scaleX(1)" }
      ], {
        duration: ms,
        easing: "linear",
        fill: "forwards"
      });
    }, () => {
      this.audio.sfx("reload");
      const bar = this.reloadMeter.querySelector("span");
      bar.getAnimations().forEach((animation) => animation.cancel());
      bar.style.transform = "scaleX(1)";
      this.reloadMeter.classList.remove("is-active");
      this.updateHud();
    });
  }

  togglePause(force) {
    if (GameState.screen !== "gameplay" && !document.querySelector("#screen-gameplay").classList.contains("is-active")) return;
    GameState.paused = typeof force === "boolean" ? force : !GameState.paused;
    setPauseVisible(GameState.paused);
    if (!GameState.paused) {
      GameState.run.lastTickAt = performance.now();
      GameState.rafId = requestAnimationFrame((time) => this.loop(time));
    }
  }

  finish(cleared) {
    const run = GameState.run;
    if (run.cleared || run.failed) return;
    run.cleared = cleared;
    run.failed = !cleared;
    if (cleared) applyTimeBonus(run);
    this.audio.sfx(cleared ? "clear" : "over");
    this.audio.playMusic("result");
    GameState.screen = "result";
    this.showResult();
  }

  showResult() {
    const run = GameState.run;
    const status = document.querySelector("#result-status");
    const stats = document.querySelector("#result-stats");
    status.textContent = run.cleared ? "任務完成" : "任務失敗";
    stats.innerHTML = `
      <dt>關卡</dt><dd>${run.stage.label} ${run.stage.title}</dd>
      <dt>分數</dt><dd>${run.score.toLocaleString()}</dd>
      <dt>擊倒</dt><dd>${run.killed}</dd>
      <dt>命中率</dt><dd>${run.shots ? Math.round((run.hits / run.shots) * 100) : 0}%</dd>
      <dt>誤傷</dt><dd>${run.hostageHits}</dd>
      <dt>剩餘時間</dt><dd>${Math.ceil(run.remainingMs / 1000)} 秒</dd>
    `;
    document.querySelector("#next-stage-button").disabled = !run.cleared || GameState.activeStageIndex >= STAGES.length - 2;
    addLeaderboardEntry({
      name: document.querySelector("#player-name").value || "PLAYER",
      score: run.score,
      stage: run.stage.label
    });
    showScreen("result");
  }

  updateHud(popScore = false) {
    const run = GameState.run;
    if (!run) return;
    const time = Math.ceil(run.remainingMs / 1000);
    document.querySelector("#hud-lives").textContent = "❤️".repeat(Math.max(0, run.lives));
    document.querySelector("#hud-stage").textContent = `${run.stage.label} ${run.stage.title}`;
    const timer = document.querySelector("#hud-time");
    timer.textContent = `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`;
    timer.classList.toggle("is-warning", time <= 10);
    document.querySelector("#hud-combo").textContent = `💥 x${run.combo}`;
    const score = document.querySelector("#hud-score");
    score.textContent = `🎯 ${run.score.toLocaleString().padStart(7, "0")}`;
    if (popScore) {
      score.classList.remove("is-pop");
      void score.offsetWidth;
      score.classList.add("is-pop");
    }
    const ammo = document.querySelector("#hud-ammo");
    const infinite = run.magazine === Infinity;
    const fill = infinite ? 100 : Math.round((run.ammo / run.magazine) * 100);
    ammo.style.setProperty("--ammo-fill", `${fill}%`);
    ammo.querySelector("em").textContent = infinite ? "∞" : `${run.ammo}/${run.magazine}`;
    ammo.classList.toggle("is-low", !infinite && run.ammo <= 3);
  }

  shake() {
    this.field.classList.remove("shake");
    void this.field.offsetWidth;
    this.field.classList.add("shake");
  }
}
