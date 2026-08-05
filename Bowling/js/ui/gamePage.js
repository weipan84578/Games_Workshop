import { createGameEngine } from "../core/gameEngine.js";
import {
  calculateKnockdownCount,
  createPhysicsState,
  launchPhysics,
  PHYSICS_PHASES,
} from "../core/physics.js";
import {
  getNextRollContext,
  getTotalScore,
  isGameComplete,
  getFrameRecords,
  recordRoll,
} from "../core/scoring.js";
import { createCanvasRenderer } from "../render/canvasRenderer.js";
import { createParticleSystem } from "../render/particleEffects.js";
import { createCameraController } from "../render/cameraController.js";
import { renderHudStats, renderScoreboard } from "./hud.js";
import { attachAimGestures } from "./touchControls.js";
import { createInitialGameState, SCREENS } from "../utils/constants.js";
import { clearProgress, saveProgress } from "../utils/storage.js";
import { announce, clamp, formatPercent } from "../utils/helpers.js";

export function createGamePage({ section, i18n, storage, audio, getSettings, onNavigate } = {}) {
  let built = false;
  let gameState = createInitialGameState();
  let physics = createPhysicsState();
  let renderer;
  let particles;
  let camera;
  let engine;
  let angle = 0;
  let power = 0.68;
  let statusKey = "game_ready";
  let statusParams = {};
  let shouldResumeOnMount = false;
  let removeAimGestures = () => {};
  let removeResizeListener = () => {};
  let pointerStartedAt = 0;
  let suppressClickUntil = 0;

  function t(key, params) {
    return i18n.t(key, params);
  }

  function setStatus(key, params = {}) {
    statusKey = key;
    statusParams = params;
    const element = section.querySelector("#game-status");
    if (element) element.textContent = t(key, params);
  }

  function build() {
    section.innerHTML = `
      <h1 id="game-screen-title" class="game-screen-title" data-i18n="game_title"></h1>
      <div class="game-topbar">
        <div class="hud" id="game-hud">
          <div class="hud__stats">
            <div class="hud-stat"><span class="hud-stat__label" data-role="frame-label"></span><strong class="hud-stat__value" data-role="frame-value">1</strong></div>
            <div class="hud-stat"><span class="hud-stat__label" data-role="ball-label"></span><strong class="hud-stat__value" data-role="ball-value">1</strong></div>
            <div class="hud-stat"><span class="hud-stat__label" data-i18n="game_score"></span><strong class="hud-stat__value" data-role="score-value">0</strong></div>
            <div class="hud-stat"><span class="hud-stat__label" data-i18n="game_total"></span><strong class="hud-stat__value" data-role="total-value">0</strong></div>
          </div>
          <div class="game-topbar__actions">
            <button class="icon-button" id="game-pause" type="button" data-i18n-title="game_pause" data-i18n-aria-label="game_pause">
              <img src="assets/images/icons/icon-pause.svg" alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div class="game-scoreboard-wrap"><div class="scoreboard" id="scoreboard" data-i18n-aria-label="scoreboard"></div></div>
      <div class="game-stage-wrap">
        <canvas id="game-canvas" class="game-canvas" tabindex="0" data-i18n-aria-label="game_title"></canvas>
        <p id="game-status" class="game-status" aria-live="polite"></p>
        <div id="celebration" class="celebration" aria-live="polite"></div>
        <div id="game-over-panel" class="game-over-panel">
          <strong data-i18n="game_over"></strong>
          <span id="final-score"></span>
          <button class="cute-button" id="game-new-game" type="button"><img class="button-icon" src="assets/images/icons/icon-restart.svg" alt="" aria-hidden="true" /><span data-i18n="game_new_game"></span></button>
        </div>
      </div>
      <div class="control-dock" id="control-dock">
        <div class="control-group">
          <label for="angle-control"><span data-i18n="game_angle"></span><output class="range-value" id="angle-value">0°</output></label>
          <input id="angle-control" type="range" min="-100" max="100" step="1" value="0" data-i18n-aria-label="direction" />
          <span class="touch-hint" data-i18n="game_aim_hint"></span>
        </div>
        <div class="control-group">
          <label for="power-control"><span data-i18n="game_power"></span><output class="range-value" id="power-value">68%</output></label>
          <input id="power-control" type="range" min="0" max="100" step="1" value="68" data-i18n-aria-label="power" />
        </div>
        <button class="cute-button cute-button--large launch-button" id="launch-button" type="button">
          <img class="button-icon" src="assets/images/icons/icon-launch.svg" alt="" aria-hidden="true" />
          <span data-i18n="game_launch"></span>
        </button>
      </div>
      <div class="modal-backdrop" id="pause-modal" hidden>
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="pause-title">
          <div class="modal-card__header">
            <h2 id="pause-title" data-i18n="game_paused"></h2>
            <button class="icon-button" id="pause-close" type="button" data-i18n-aria-label="game_resume"><img src="assets/images/icons/icon-close.svg" alt="" aria-hidden="true" /></button>
          </div>
          <div class="modal-card__body">
            <button class="cute-button" id="pause-resume" type="button"><img class="button-icon" src="assets/images/icons/icon-continue.svg" alt="" aria-hidden="true" /><span data-i18n="game_resume"></span></button>
            <button class="cute-button cute-button--secondary" id="pause-home" type="button"><img class="button-icon" src="assets/images/icons/icon-home.svg" alt="" aria-hidden="true" /><span data-i18n="home"></span></button>
            <button class="cute-button cute-button--soft" id="pause-restart" type="button"><img class="button-icon" src="assets/images/icons/icon-restart.svg" alt="" aria-hidden="true" /><span data-i18n="game_restart"></span></button>
            <button class="cute-button cute-button--soft" id="pause-settings" type="button"><img class="button-icon" src="assets/images/icons/icon-settings.svg" alt="" aria-hidden="true" /><span data-i18n="game_settings"></span></button>
          </div>
        </div>
      </div>`;

    const canvas = section.querySelector("#game-canvas");
    renderer = createCanvasRenderer(canvas);
    particles = createParticleSystem();
    camera = createCameraController();
    engine = createGameEngine({
      onUpdate(nextPhysics, delta) {
        physics = nextPhysics;
        particles.update(delta);
        camera.update(delta, nextPhysics.phase === PHYSICS_PHASES.SETTLED ? 0.03 : 0);
      },
      onRender(nextPhysics) {
        renderer.render(nextPhysics, { particles, camera, aim: { angle, power } });
      },
      onSettled: handleSettled,
    });
    removeAimGestures = attachAimGestures(canvas, { onAim: (delta) => setAngle(angle + delta * 1.8) });
    const onResize = () => {
      renderer.resize();
      camera.resize();
      engine.renderNow();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    removeResizeListener = () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };

    section.querySelector("#angle-control").addEventListener("input", (event) => setAngle(Number(event.target.value) / 100));
    section.querySelector("#power-control").addEventListener("input", (event) => setPower(Number(event.target.value) / 100));
    const launchButton = section.querySelector("#launch-button");
    launchButton.addEventListener("pointerdown", () => {
      pointerStartedAt = performance.now();
    });
    launchButton.addEventListener("pointerup", () => {
      if (!pointerStartedAt) return;
      const heldSeconds = (performance.now() - pointerStartedAt) / 1000;
      if (heldSeconds > 0.12) setPower(Math.max(power, clamp(heldSeconds / 1.2, 0, 1)));
      pointerStartedAt = 0;
      suppressClickUntil = Date.now() + 400;
      launch();
    });
    launchButton.addEventListener("pointercancel", () => { pointerStartedAt = 0; });
    launchButton.addEventListener("click", () => {
      if (Date.now() < suppressClickUntil) return;
      launch();
    });
    section.querySelector("#game-pause").addEventListener("click", openPause);
    section.querySelector("#pause-close").addEventListener("click", resume);
    section.querySelector("#pause-resume").addEventListener("click", resume);
    section.querySelector("#pause-home").addEventListener("click", goHome);
    section.querySelector("#pause-restart").addEventListener("click", restart);
    section.querySelector("#pause-settings").addEventListener("click", goSettings);
    section.querySelector("#game-new-game").addEventListener("click", restart);
    section.addEventListener("keydown", onKeyDown);
    built = true;
  }

  function setAngle(nextAngle) {
    angle = clamp(Number(nextAngle) || 0, -1, 1);
    const input = section.querySelector("#angle-control");
    const output = section.querySelector("#angle-value");
    if (input) input.value = String(Math.round(angle * 100));
    if (output) output.textContent = `${Math.round(angle * 30)}°`;
    engine?.renderNow();
  }

  function setPower(nextPower) {
    power = clamp(Number(nextPower) || 0, 0, 1);
    const input = section.querySelector("#power-control");
    const output = section.querySelector("#power-value");
    if (input) input.value = String(Math.round(power * 100));
    if (output) output.textContent = formatPercent(power);
    engine?.renderNow();
  }

  function syncControls() {
    const disabled = physics.phase === PHYSICS_PHASES.ROLLING || isGameComplete(gameState.rolls);
    section.querySelector("#angle-control").disabled = disabled;
    section.querySelector("#power-control").disabled = disabled;
    section.querySelector("#launch-button").disabled = disabled;
  }

  function renderHud() {
    const context = getNextRollContext(gameState.rolls);
    const records = getFrameRecords(gameState.rolls);
    const currentRecord = records[Math.max(0, context.frame - 1)];
    renderHudStats(section.querySelector("#game-hud"), {
      t,
      frame: gameState.currentFrame || context.frame,
      ball: context.done ? 0 : context.ball,
      score: currentRecord?.score ?? getTotalScore(gameState.rolls),
      total: getTotalScore(gameState.rolls),
    });
    renderScoreboard(section.querySelector("#scoreboard"), gameState.rolls, { t, currentFrame: context.frame });
  }

  function refreshTranslations() {
    if (!built) return;
    i18n.applyTranslations(section);
    section.querySelector("#game-status").textContent = t(statusKey, statusParams);
    renderHud();
    const canvas = section.querySelector("#game-canvas");
    canvas.setAttribute("aria-label", t("game_title"));
  }

  function showCelebration(key) {
    const celebration = section.querySelector("#celebration");
    celebration.textContent = t(key);
    celebration.classList.remove("is-visible");
    void celebration.offsetWidth;
    celebration.classList.add("is-visible");
  }

  function vibrate(pattern) {
    const settings = getSettings?.();
    if (settings?.vibration && typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(pattern);
  }

  function launch() {
    if (!built || physics.phase === PHYSICS_PHASES.ROLLING || isGameComplete(gameState.rolls)) return;
    const context = getNextRollContext(gameState.rolls);
    const predicted = Math.min(calculateKnockdownCount({ angle, power }), context.pinsRemaining);
    physics = launchPhysics(createPhysicsState(), { angle, power, knockedPins: predicted });
    setStatus("game_rolling");
    syncControls();
    audio?.playSfx("roll");
    engine.start(physics);
  }

  function handleSettled(result) {
    const context = getNextRollContext(gameState.rolls);
    if (context.done) return;
    let nextRolls;
    try {
      nextRolls = recordRoll(gameState.rolls, result?.knockedPins ?? 0);
    } catch {
      nextRolls = recordRoll(gameState.rolls, 0);
    }
    gameState = {
      ...gameState,
      rolls: nextRolls,
      currentFrame: Math.min(10, getNextRollContext(nextRolls).frame),
      updatedAt: Date.now(),
      language: i18n.getLanguage(),
    };
    saveProgress(gameState, storage);
    particles.emit({ x: 0.5, y: 0.4, count: 24, kind: "spark" });
    audio?.playSfx("pin");
    const frameRecord = getFrameRecords(nextRolls)[context.frame - 1];
    if (frameRecord?.type === "strike") {
      showCelebration("result_strike");
      audio?.playSfx("strike");
      vibrate([40, 30, 80]);
      announce(t("result_strike"));
    } else if (frameRecord?.type === "spare") {
      showCelebration("result_spare");
      audio?.playSfx("spare");
      vibrate(60);
      announce(t("result_spare"));
    } else {
      announce(t("result_open"));
    }
    renderHud();
    if (isGameComplete(nextRolls)) {
      setStatus("game_over");
      section.querySelector("#final-score").textContent = `${t("game_total")}: ${getTotalScore(nextRolls)}`;
      section.querySelector("#game-over-panel").classList.add("is-visible");
    } else {
      setStatus("game_ready");
    }
    physics = createPhysicsState();
    engine.setSimulation(physics);
    syncControls();
  }

  function onKeyDown(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setAngle(angle - 0.05);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setAngle(angle + 0.05);
    } else if (event.code === "Space" && !event.repeat && event.target.tagName !== "INPUT") {
      event.preventDefault();
      launch();
    }
  }

  function openPause() {
    if (!built) return;
    engine.stop();
    section.querySelector("#pause-modal").hidden = false;
    setStatus("game_paused");
    section.querySelector("#pause-close").focus();
  }

  function resume() {
    section.querySelector("#pause-modal").hidden = true;
    if (physics.phase === PHYSICS_PHASES.ROLLING) {
      setStatus("game_rolling");
      engine.start(physics);
    } else if (!isGameComplete(gameState.rolls)) {
      setStatus("game_ready");
    }
  }

  function goHome() {
    engine.stop();
    section.querySelector("#pause-modal").hidden = true;
    if (gameState.rolls.length > 0) saveProgress(gameState, storage);
    else clearProgress(storage);
    onNavigate?.(SCREENS.MENU);
  }

  function goSettings() {
    shouldResumeOnMount = physics.phase === PHYSICS_PHASES.ROLLING;
    engine.stop();
    section.querySelector("#pause-modal").hidden = true;
    onNavigate?.(SCREENS.SETTINGS, { returnTo: SCREENS.GAME });
  }

  function restart() {
    audio?.playSfx("button");
    clearProgress(storage);
    gameState = createInitialGameState({ theme: document.body.dataset.theme || "cute", language: i18n.getLanguage() });
    physics = createPhysicsState();
    engine.stop();
    section.querySelector("#pause-modal").hidden = true;
    section.querySelector("#game-over-panel").classList.remove("is-visible");
    renderHud();
    setStatus("game_ready");
    engine.setSimulation(physics);
    syncControls();
  }

  function mount(nextState) {
    if (!built) build();
    if (nextState) gameState = { ...nextState, rolls: [...(nextState.rolls || [])] };
    const resumePhysics = shouldResumeOnMount && physics.phase === PHYSICS_PHASES.ROLLING;
    if (!resumePhysics) physics = createPhysicsState();
    renderer.resize();
    camera.resize();
    engine.setSimulation(physics);
    renderHud();
    refreshTranslations();
    setStatus(isGameComplete(gameState.rolls) ? "game_over" : "game_ready");
    section.querySelector("#game-over-panel").classList.toggle("is-visible", isGameComplete(gameState.rolls));
    if (isGameComplete(gameState.rolls)) section.querySelector("#final-score").textContent = `${t("game_total")}: ${getTotalScore(gameState.rolls)}`;
    syncControls();
    if (resumePhysics) {
      setStatus("game_rolling");
      syncControls();
      engine.start(physics);
    }
    shouldResumeOnMount = false;
  }

  return {
    mount,
    refresh: refreshTranslations,
    getState: () => ({ ...gameState, rolls: [...gameState.rolls] }),
    destroy() {
      engine?.stop();
      removeAimGestures();
      removeResizeListener();
    },
  };
}
