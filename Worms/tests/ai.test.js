"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Random = require("../js/utils/random.js");
const { TerrainMask } = require("../js/terrain/terrain.js");
const { PhysicsEngine } = require("../js/physics/physics.js");
const { AIController, LEVELS } = require("../js/ai/ai.js");
const { WeaponRegistry } = require("../js/weapons/weapons.js");

function scenario() {
  const terrain = new TerrainMask(32, "candy");
  const current = {
    id: "e1",
    team: 1,
    x: terrain.spawns[1].x,
    y: terrain.spawns[1].y,
    facing: -1,
    alive: true,
    hp: 100,
  };
  const enemy = {
    id: "p1",
    team: 0,
    x: terrain.spawns[2].x,
    y: terrain.spawns[2].y,
    facing: 1,
    alive: true,
    hp: 100,
  };
  return {
    terrain,
    current,
    characters: [current, enemy],
    ammo: WeaponRegistry.createAmmo(),
    wind: 25,
  };
}

test("AI plans are deterministic and legal with a fixed seed", () => {
  const scene = scenario();
  const ai = new AIController(new PhysicsEngine(scene.terrain));
  const first = ai.planTurn(scene, "normal", Random.mulberry32(99));
  const second = ai.planTurn(scene, "normal", Random.mulberry32(99));
  assert.deepEqual(first, second);
  assert.ok(["fire", "target", "move", "skip"].includes(first.type));
  if (first.weaponId) assert.notEqual(scene.ammo[first.weaponId], 0);
  if (first.type === "fire") {
    assert.ok(first.angle >= -80 && first.angle <= 80);
    assert.ok(first.power >= 0.1 && first.power <= 1);
  }
});

test("difficulty definitions progressively reduce seeded error", () => {
  assert.ok(LEVELS.hard.angleError < LEVELS.normal.angleError);
  assert.ok(LEVELS.normal.angleError < LEVELS.easy.angleError);
  assert.ok(LEVELS.hard.powerError < LEVELS.normal.powerError);
  assert.ok(LEVELS.normal.powerError < LEVELS.easy.powerError);
});

test("AI safely falls back when no enemy target exists", () => {
  const scene = scenario();
  scene.characters = [scene.current];
  const ai = new AIController(new PhysicsEngine(scene.terrain));
  assert.deepEqual(ai.planTurn(scene, "hard", Random.mulberry32(4)), {
    type: "skip",
    reason: "no-target",
  });
});

test("AI can select and execute plans for all ten registered weapons", () => {
  for (const weaponId of WeaponRegistry.list().map((weapon) => weapon.id)) {
    const terrain = new TerrainMask(32, "candy");
    const rareProjectile = weaponId === "banana" || weaponId === "holy";
    const actorX = 500;
    const targetX = rareProjectile ? 200 : weaponId === "bat" ? 550 : 700;
    const actorY = rareProjectile ? terrain.getSurfaceY(actorX, 0) - 18 : 300;
    const targetY = rareProjectile ? terrain.getSurfaceY(targetX, 0) - 18 : 300;
    const actor = {
      id: "e",
      team: 1,
      x: actorX,
      y: actorY,
      facing: 1,
      alive: true,
      hp: 100,
    };
    const target = {
      id: "p",
      team: 0,
      x: targetX,
      y: targetY,
      facing: -1,
      alive: true,
      hp: 100,
    };
    const ammo = WeaponRegistry.createAmmo();
    Object.keys(ammo).forEach((id) => {
      ammo[id] = 0;
    });
    ammo[weaponId] = 1;
    const ai = new AIController(new PhysicsEngine(terrain));
    const plan = ai.planTurn(
      { current: actor, characters: [actor, target], ammo, wind: 0 },
      "easy",
      Random.mulberry32(1),
    );
    assert.equal(plan.weaponId, weaponId, weaponId);
  }
});
