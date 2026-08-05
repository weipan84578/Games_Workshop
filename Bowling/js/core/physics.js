import { BALL_START, PIN_LAYOUT, PINS_PER_FRAME } from "../utils/constants.js";
import { clamp, lerp } from "../utils/helpers.js";

export const PHYSICS_PHASES = Object.freeze({ READY: "ready", ROLLING: "rolling", SETTLED: "settled" });

function clonePins(pins) {
  return pins.map((pin) => ({ ...pin }));
}

export function createPinStates() {
  return PIN_LAYOUT.map((position, index) => ({
    id: index,
    x: position.x,
    y: position.y,
    fallen: false,
    fallProgress: 0,
    rotation: 0,
    drift: 0,
  }));
}

export function createPhysicsState() {
  return {
    phase: PHYSICS_PHASES.READY,
    elapsed: 0,
    progress: 0,
    angle: 0,
    power: 0,
    predictedKnocked: 0,
    result: null,
    ball: { x: BALL_START.x, y: BALL_START.y, rotation: 0, scale: 1, trail: [] },
    pins: createPinStates(),
  };
}

export function calculateKnockdownCount({ angle = 0, power = 0, seed = 0 } = {}) {
  const safeAngle = clamp(Number(angle) || 0, -1, 1);
  const safePower = clamp(Number(power) || 0, 0, 1);
  if (safePower >= 0.999 && Math.abs(safeAngle) <= 0.04) return PINS_PER_FRAME;
  const centerAccuracy = 1 - Math.abs(safeAngle);
  const impact = safePower * (0.34 + 0.66 * centerAccuracy);
  const smallVariation = ((Math.abs(Math.sin(seed * 12.9898)) * 0.18) - 0.09) * safePower;
  return clamp(Math.round((impact + smallVariation) * PINS_PER_FRAME), 0, PINS_PER_FRAME);
}

export function launchPhysics(state = createPhysicsState(), { angle = 0, power = 0.5, knockedPins } = {}) {
  if (state.phase === PHYSICS_PHASES.ROLLING) return state;
  const safeAngle = clamp(Number(angle) || 0, -1, 1);
  const safePower = clamp(Number(power) || 0, 0, 1);
  const predicted = knockedPins === undefined ? calculateKnockdownCount({ angle: safeAngle, power: safePower }) : clamp(Math.round(knockedPins), 0, 10);
  return {
    ...state,
    phase: PHYSICS_PHASES.ROLLING,
    elapsed: 0,
    progress: 0,
    angle: safeAngle,
    power: safePower,
    predictedKnocked: predicted,
    result: null,
    pins: createPinStates(),
    ball: { ...state.ball, x: BALL_START.x, y: BALL_START.y, rotation: 0, scale: 1, trail: [] },
  };
}

function animatePins(pins, knockedCount, progress) {
  const impactProgress = clamp((progress - 0.52) / 0.32, 0, 1);
  return pins.map((pin, index) => {
    if (index >= knockedCount) return { ...pin, fallProgress: 0 };
    const local = clamp(impactProgress * 1.35 - index * 0.055, 0, 1);
    return {
      ...pin,
      fallen: local > 0.08,
      fallProgress: local,
      rotation: local * (index % 2 === 0 ? 1.25 : -1.25),
      drift: local * (index % 3 === 0 ? -0.07 : 0.06),
    };
  });
}

export function stepPhysics(state = createPhysicsState(), deltaSeconds = 0) {
  if (state.phase !== PHYSICS_PHASES.ROLLING) return state;
  const dt = clamp(Number(deltaSeconds) || 0, 0, 0.05);
  const elapsed = state.elapsed + dt;
  const duration = lerp(1.45, 0.72, state.power);
  const progress = clamp(elapsed / duration, 0, 1);
  const ease = 1 - (1 - progress) ** 2;
  const lateral = state.angle * 0.34 * (0.3 + ease * 0.7);
  const ballY = lerp(BALL_START.y, 0.2, ease);
  const ballX = clamp(BALL_START.x + lateral * ease, 0.09, 0.91);
  const trail = [...state.ball.trail, { x: ballX, y: ballY }].slice(-18);
  const pins = animatePins(state.pins, state.predictedKnocked, progress);

  if (progress >= 1) {
    return {
      ...state,
      phase: PHYSICS_PHASES.SETTLED,
      elapsed,
      progress: 1,
      pins,
      ball: { ...state.ball, x: ballX, y: ballY, rotation: state.ball.rotation + dt * 12, trail },
      result: { knockedPins: state.predictedKnocked },
    };
  }

  return {
    ...state,
    elapsed,
    progress,
    pins,
    ball: { ...state.ball, x: ballX, y: ballY, rotation: ease * 18 * (state.angle < 0 ? -1 : 1), trail },
  };
}
