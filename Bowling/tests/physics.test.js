import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateImpactOrder,
  calculateKnockdownCount,
  createPhysicsState,
  getPinImpactProgress,
  launchPhysics,
  PHYSICS_PHASES,
  stepPhysics,
} from "../js/core/physics.js";

test("physics starts with a ready ball and ten upright pins", () => {
  const state = createPhysicsState();
  assert.equal(state.phase, PHYSICS_PHASES.READY);
  assert.equal(state.pins.length, 10);
  assert.equal(state.pins.every((pin) => !pin.fallen), true);
});

test("knockdown prediction stays inside the physical pin range", () => {
  const centred = calculateImpactOrder({ angle: 0, power: 1 });
  const pocket = calculateImpactOrder({ angle: 0.06, power: 1 });
  assert.equal(centred.length, 9);
  assert.equal(pocket.length, 10);
  assert.notDeepEqual(centred, pocket);
  assert.ok(calculateKnockdownCount({ angle: 0, power: 0.25 }) < centred.length);
  assert.ok(calculateKnockdownCount({ angle: -1, power: 0 }) >= 0);
  assert.ok(calculateKnockdownCount({ angle: 3, power: 4 }) <= 10);
});

test("power changes travel time without making a fixed aim path wander", () => {
  const simulate = (power) => {
    let state = launchPhysics(createPhysicsState(), { angle: 0.35, power });
    const samples = [];
    for (let index = 0; index < 60 && state.phase !== PHYSICS_PHASES.SETTLED; index += 1) {
      state = stepPhysics(state, 0.05);
      samples.push(state.ball.x);
    }
    return { state, samples };
  };

  const lowPower = simulate(0.25);
  const highPower = simulate(0.9);
  assert.ok(lowPower.samples.every((x, index) => index === 0 || x >= lowPower.samples[index - 1]));
  assert.ok(highPower.samples.every((x, index) => index === 0 || x >= highPower.samples[index - 1]));
  assert.ok(highPower.state.elapsed < lowPower.state.elapsed);
  assert.equal(highPower.state.ball.x, lowPower.state.ball.x);
});

test("a launched ball advances and settles with a result", () => {
  let state = launchPhysics(createPhysicsState(), { angle: 0, power: 0.8, knockedPins: 7 });
  assert.equal(state.phase, PHYSICS_PHASES.ROLLING);
  assert.ok(getPinImpactProgress(state.pins[9]) > 0);
  state = stepPhysics(state, 0.05);
  assert.equal(state.pins.some((pin) => pin.fallen), false);
  for (let index = 0; index < 50 && state.phase !== PHYSICS_PHASES.SETTLED; index += 1) state = stepPhysics(state, 0.05);
  assert.equal(state.phase, PHYSICS_PHASES.SETTLED);
  assert.deepEqual(state.result, { knockedPins: 7 });
  assert.equal(state.pins.filter((pin) => pin.fallen).length > 0, true);
});

test("a second launch cannot interrupt a rolling ball", () => {
  const launched = launchPhysics(createPhysicsState(), { angle: 0.2, power: 0.5, knockedPins: 3 });
  assert.equal(launchPhysics(launched, { angle: -0.8, power: 1 }).angle, 0.2);
});
