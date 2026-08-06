"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Physics = require("../js/physics/physics.js");
const { GameLoop } = require("../js/core/game-loop.js");

test("projectile fixed steps produce stable no-wind motion", () => {
  let projectile = { x: 0, y: 0, vx: 300, vy: -200, windFactor: 1 };
  for (let step = 0; step < 120; step += 1)
    projectile = Physics.integrateProjectile(projectile, Physics.FIXED_DT, 0);
  assert.ok(Math.abs(projectile.x - 300) < 1e-8);
  assert.ok(Math.abs(projectile.vy - 700) < 1e-8);
  assert.ok(projectile.y > 250 && projectile.y < 258);
});

test("wind acceleration has the same sign as the HUD direction", () => {
  const initial = { x: 0, y: 0, vx: 0, vy: 0, windFactor: 1 };
  const right = Physics.integrateProjectile(initial, 1, 100, 0);
  const left = Physics.integrateProjectile(initial, 1, -100, 0);
  assert.equal(right.vx, 100);
  assert.equal(left.vx, -100);
  assert.ok(right.x > 0 && left.x < 0);
});

test("fixed-step loop is independent of display frame grouping", () => {
  let updatesA = 0;
  let updatesB = 0;
  const loopA = new GameLoop(
    () => {
      updatesA += 1;
    },
    () => {},
  );
  const loopB = new GameLoop(
    () => {
      updatesB += 1;
    },
    () => {},
  );
  for (let frame = 0; frame < 60; frame += 1) loopA.consume(1 / 60);
  for (let frame = 0; frame < 30; frame += 1) loopB.consume(1 / 30);
  assert.equal(updatesA, 120);
  assert.equal(updatesB, 120);
});

test("explosion and fall damage honor boundaries and caps", () => {
  assert.equal(Physics.explosionDamage(50, 100, 0), 50);
  assert.equal(Physics.explosionDamage(50, 100, 99), 1);
  assert.equal(Physics.explosionDamage(50, 100, 100), 0);
  assert.equal(Physics.explosionDamage(50, 100, 110), 0);
  assert.equal(Physics.fallDamage(420), 0);
  assert.equal(Physics.fallDamage(432), 1);
  assert.equal(Physics.fallDamage(2000), 60);
});

test("one explosion affects self, allies, and enemies exactly once", () => {
  const characters = [
    { id: "owner", team: 0, x: 0, y: 0, alive: true },
    { id: "ally", team: 0, x: 10, y: 0, alive: true },
    { id: "enemy", team: 1, x: 20, y: 0, alive: true },
  ];
  const events = Physics.resolveExplosion(
    { x: 0, y: 0 },
    { maxDamage: 50, blastRadius: 100, impulse: 100 },
    characters,
    "blast-1",
  );
  assert.deepEqual(
    events.map((event) => event.characterId),
    ["owner", "ally", "enemy"],
  );
  assert.equal(
    new Set(events.map((event) => event.characterId)).size,
    events.length,
  );
});
