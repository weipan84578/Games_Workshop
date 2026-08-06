"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { TerrainMask } = require("../js/terrain/terrain.js");
const { PhysicsEngine } = require("../js/physics/physics.js");

test("same seed reproduces theme, heights, and spawn positions", () => {
  const first = new TerrainMask(8042, "random");
  const second = new TerrainMask(8042, "random");
  assert.equal(first.theme, second.theme);
  assert.deepEqual(Array.from(first.heights), Array.from(second.heights));
  assert.deepEqual(first.spawns, second.spawns);
});

test("different seeds normally generate different terrain", () => {
  const first = new TerrainMask(1, "candy");
  const second = new TerrainMask(2, "candy");
  assert.notDeepEqual(
    Array.from(first.heights.slice(0, 500)),
    Array.from(second.heights.slice(0, 500)),
  );
});

test("all six spawn platforms are clear, separated, and above water", () => {
  for (const seed of [1, 99, 8042, 0xffffffff]) {
    const terrain = new TerrainMask(seed, "forest");
    assert.equal(terrain.validateSpawns(), true, `seed ${seed}`);
    assert.equal(terrain.spawns.length, 6);
  }
});

test("carveCircle removes only pixels inside its circle", () => {
  const terrain = new TerrainMask(22, "icecream");
  const x = terrain.spawns[0].x;
  const y = terrain.spawns[0].y + 35;
  assert.equal(terrain.isSolid(x, y), true);
  const outsideBefore = terrain.isSolid(x + 51, y);
  terrain.carveCircle(x, y, 40);
  assert.equal(terrain.isSolid(x, y), false);
  assert.equal(terrain.isSolid(x + 51, y), outsideBefore);
});

test("removing support makes the physics engine report a fall", () => {
  const terrain = new TerrainMask(44, "candy");
  const spawn = terrain.spawns[0];
  const character = { x: spawn.x, y: spawn.y };
  const physics = new PhysicsEngine(terrain);
  assert.equal(physics.isSupported(character), true);
  terrain.carveCircle(character.x, character.y + 20, 45);
  assert.equal(physics.isSupported(character), false);
});

test("the built-in fallback template remains a legal six-spawn map", () => {
  const terrain = new TerrainMask(55, "candy");
  terrain.useFallback();
  assert.equal(terrain.usedFallback, true);
  assert.equal(terrain.validateSpawns(), true);
});
