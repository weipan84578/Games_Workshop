import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateKnockdownCount,
  createPhysicsState,
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
  assert.equal(calculateKnockdownCount({ angle: 0, power: 1, seed: 0 }), 10);
  assert.ok(calculateKnockdownCount({ angle: -1, power: 0 }) >= 0);
  assert.ok(calculateKnockdownCount({ angle: 3, power: 4 }) <= 10);
});

test("a launched ball advances and settles with a result", () => {
  let state = launchPhysics(createPhysicsState(), { angle: 0, power: 0.8, knockedPins: 7 });
  assert.equal(state.phase, PHYSICS_PHASES.ROLLING);
  for (let index = 0; index < 50 && state.phase !== PHYSICS_PHASES.SETTLED; index += 1) state = stepPhysics(state, 0.05);
  assert.equal(state.phase, PHYSICS_PHASES.SETTLED);
  assert.deepEqual(state.result, { knockedPins: 7 });
  assert.equal(state.pins.filter((pin) => pin.fallen).length > 0, true);
});

test("a second launch cannot interrupt a rolling ball", () => {
  const launched = launchPhysics(createPhysicsState(), { angle: 0.2, power: 0.5, knockedPins: 3 });
  assert.equal(launchPhysics(launched, { angle: -0.8, power: 1 }).angle, 0.2);
});
