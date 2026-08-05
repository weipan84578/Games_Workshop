import { BALL_START, PIN_LAYOUT, PINS_PER_FRAME } from "../utils/constants.js";
import { clamp, lerp } from "../utils/helpers.js";

export const PHYSICS_PHASES = Object.freeze({ READY: "ready", ROLLING: "rolling", SETTLED: "settled" });

const PIN_DECK_EXIT_Y = 0.12;
const PIN_COLLISION_WINDOW = 0.18;

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
    impactOrder: [],
    result: null,
    ball: { x: BALL_START.x, y: BALL_START.y, rotation: 0, scale: 1, trail: [] },
    pins: createPinStates(),
  };
}

/**
 * Convert the ball's eased travel into the progress at which it reaches a pin.
 * Keeping this calculation shared by physics and renderers prevents pins from
 * animating before the ball can physically reach their depth.
 */
export function getPinImpactProgress(pin, sequence = 0) {
  const travel = clamp((BALL_START.y - pin.y) / (BALL_START.y - PIN_DECK_EXIT_Y), 0, 1);
  const progressAtDepth = 1 - Math.sqrt(1 - travel);
  return clamp(progressAtDepth + sequence * 0.018, 0, 0.96);
}

function getBallPathX(angle, pinY) {
  const safeAngle = clamp(Number(angle) || 0, -1, 1);
  const travel = clamp((BALL_START.y - pinY) / (BALL_START.y - PIN_DECK_EXIT_Y), 0, 1);
  return BALL_START.x + safeAngle * 0.34 * travel;
}

/**
 * Selects the pins that the current ball path can reach, then returns them in
 * physical arrival order. A centred full-power shot is strong, but it is not
 * an unconditional strike: a small pocket angle can create a better chain.
 */
export function calculateImpactOrder({ angle = 0, power = 0 } = {}) {
  const safeAngle = clamp(Number(angle) || 0, -1, 1);
  const safePower = clamp(Number(power) || 0, 0, 1);
  if (safePower <= 0) return [];

  const alignment = 1 - Math.abs(safeAngle);
  const pocketQuality = 1 - clamp(Math.abs(Math.abs(safeAngle) - 0.06) / 0.09, 0, 1);
  const pocketBonus = safePower > 0.86 && pocketQuality > 0.55 ? 1 : 0;
  const targetCount = clamp(Math.round(safePower * (2.4 + alignment * 6.6) + pocketBonus), 0, PINS_PER_FRAME);
  const collisionReach = 0.04 + safePower * 0.125;

  const candidates = PIN_LAYOUT.map((pin, id) => {
    const gap = Math.abs(pin.x - getBallPathX(safeAngle, pin.y));
    return {
      id,
      gap,
      proximity: clamp(1 - gap / collisionReach, 0, 1),
    };
  })
    .filter((candidate) => candidate.proximity > 0.05)
    .sort((first, second) => second.proximity - first.proximity || first.id - second.id)
    .slice(0, targetCount);

  return candidates
    .sort((first, second) => {
      const firstProgress = getPinImpactProgress(PIN_LAYOUT[first.id]);
      const secondProgress = getPinImpactProgress(PIN_LAYOUT[second.id]);
      return firstProgress - secondProgress || first.gap - second.gap;
    })
    .map((candidate) => candidate.id);
}

export function calculateKnockdownCount({ angle = 0, power = 0 } = {}) {
  return calculateImpactOrder({ angle, power }).length;
}

function fillExplicitImpactOrder(preferredOrder, count) {
  const order = [...preferredOrder];
  for (let id = 0; id < PINS_PER_FRAME && order.length < count; id += 1) {
    if (!order.includes(id)) order.push(id);
  }
  return order.slice(0, count);
}

export function launchPhysics(state = createPhysicsState(), { angle = 0, power = 0.5, knockedPins } = {}) {
  if (state.phase === PHYSICS_PHASES.ROLLING) return state;
  const safeAngle = clamp(Number(angle) || 0, -1, 1);
  const safePower = clamp(Number(power) || 0, 0, 1);
  const preferredOrder = calculateImpactOrder({ angle: safeAngle, power: safePower });
  const predicted = knockedPins === undefined
    ? preferredOrder.length
    : clamp(Math.round(knockedPins), 0, PINS_PER_FRAME);
  const impactOrder = knockedPins === undefined
    ? preferredOrder
    : fillExplicitImpactOrder(preferredOrder, predicted);

  return {
    ...state,
    phase: PHYSICS_PHASES.ROLLING,
    elapsed: 0,
    progress: 0,
    angle: safeAngle,
    power: safePower,
    predictedKnocked: impactOrder.length,
    impactOrder,
    result: null,
    pins: createPinStates(),
    ball: { ...state.ball, x: BALL_START.x, y: BALL_START.y, rotation: 0, scale: 1, trail: [] },
  };
}

function animatePins(pins, state, progress) {
  const impactSequence = new Map(state.impactOrder.map((pinId, sequence) => [pinId, sequence]));
  return pins.map((pin) => {
    const sequence = impactSequence.get(pin.id);
    if (sequence === undefined) return { ...pin, fallen: false, fallProgress: 0, rotation: 0, drift: 0 };

    const impactProgress = getPinImpactProgress(pin, sequence);
    const local = clamp((progress - impactProgress) / PIN_COLLISION_WINDOW, 0, 1);
    return {
      ...pin,
      fallen: local > 0,
      fallProgress: local,
      rotation: local * (pin.id % 2 === 0 ? 1.25 : -1.25),
      drift: local * (pin.id % 3 === 0 ? -0.07 : 0.06),
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
  const ballY = lerp(BALL_START.y, PIN_DECK_EXIT_Y, ease);
  const ballX = clamp(BALL_START.x + lateral * ease, 0.09, 0.91);
  const trail = [...state.ball.trail, { x: ballX, y: ballY }].slice(-18);
  const pins = animatePins(state.pins, state, progress);
  const ball = { ...state.ball, x: ballX, y: ballY, rotation: ease * 18 * (state.angle < 0 ? -1 : 1), trail };

  if (progress >= 1) {
    return {
      ...state,
      phase: PHYSICS_PHASES.SETTLED,
      elapsed,
      progress: 1,
      pins,
      ball,
      result: { knockedPins: state.impactOrder.length },
    };
  }

  return { ...state, elapsed, progress, pins, ball };
}
