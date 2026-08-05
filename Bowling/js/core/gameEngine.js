import { PHYSICS_PHASES, createPhysicsState, stepPhysics } from "./physics.js";
import { clamp } from "../utils/helpers.js";

export function createGameEngine({ onUpdate = () => {}, onRender = () => {}, onSettled = () => {}, autoStopOnSettle = true } = {}) {
  let simulation = createPhysicsState();
  let running = false;
  let animationId = null;
  let lastTime = null;
  let settledNotified = false;

  const requestFrame = globalThis.requestAnimationFrame || ((callback) => setTimeout(() => callback(Date.now()), 16));
  const cancelFrame = globalThis.cancelAnimationFrame || ((id) => clearTimeout(id));

  function renderNow() {
    onRender(simulation);
  }

  function tick(timestamp) {
    if (!running) return;
    const now = Number(timestamp) || Date.now();
    const delta = lastTime === null ? 0 : clamp((now - lastTime) / 1000, 0, 0.05);
    lastTime = now;
    simulation = stepPhysics(simulation, delta);
    onUpdate(simulation, delta);
    onRender(simulation);

    if (simulation.phase === PHYSICS_PHASES.SETTLED && !settledNotified) {
      settledNotified = true;
      if (autoStopOnSettle) {
        running = false;
        animationId = null;
      }
      onSettled(simulation.result, simulation);
      if (!running) return;
    }
    animationId = requestFrame(tick);
  }

  return {
    start(nextSimulation = simulation) {
      if (running) return false;
      simulation = nextSimulation;
      running = true;
      settledNotified = false;
      lastTime = null;
      animationId = requestFrame(tick);
      return true;
    },
    stop() {
      running = false;
      if (animationId !== null) cancelFrame(animationId);
      animationId = null;
      lastTime = null;
    },
    setSimulation(nextSimulation) {
      simulation = nextSimulation;
      settledNotified = false;
      renderNow();
    },
    getSimulation: () => simulation,
    isRunning: () => running,
    renderNow,
  };
}
