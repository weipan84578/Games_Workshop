"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Weapons = require("../js/weapons/weapons.js");
const { TerrainMask } = require("../js/terrain/terrain.js");

test("registry exposes ten unique valid immutable definitions", () => {
  const list = Weapons.WeaponRegistry.list();
  assert.equal(list.length, 10);
  assert.equal(new Set(list.map((item) => item.id)).size, 10);
  assert.equal(Weapons.WeaponRegistry.validate(), true);
  assert.ok(list.every(Object.isFrozen));
  list.forEach((weapon) => {
    assert.equal(path.extname(weapon.icon), ".svg");
    assert.equal(
      fs.existsSync(path.resolve(__dirname, "..", weapon.icon)),
      true,
      weapon.icon,
    );
  });
});

test("team ammo handles infinite, finite, and illegal actions", () => {
  const ammo = Weapons.WeaponRegistry.createAmmo();
  assert.equal(Weapons.WeaponRegistry.consume(ammo, "bazooka", true), true);
  assert.equal(ammo.bazooka, Infinity);
  assert.equal(Weapons.WeaponRegistry.consume(ammo, "mine", false), false);
  assert.equal(ammo.mine, 2);
  assert.equal(Weapons.WeaponRegistry.consume(ammo, "mine", true), true);
  assert.equal(ammo.mine, 1);
  Weapons.WeaponRegistry.consume(ammo, "mine", true);
  assert.equal(Weapons.WeaponRegistry.consume(ammo, "mine", true), false);
});

test("fused weapons keep their specified three-second fuse", () => {
  assert.equal(Weapons.WeaponRegistry.get("grenade").fuse, 3);
  assert.equal(Weapons.WeaponRegistry.get("banana").fuse, 3);
  assert.equal(Weapons.WeaponRegistry.get("holy").fuse, 3);
});

test("airstrike creates five correctly spaced missiles from the opposite wind side", () => {
  const missiles = Weapons.createAirstrike({ x: 900, y: 600 }, 70, 1);
  assert.equal(missiles.length, 5);
  assert.deepEqual(
    missiles
      .map((missile) => missile.x)
      .map((x, index) => (index ? x - missiles[index - 1].x : 48)),
    [48, 48, 48, 48, 48],
  );
  assert.ok(missiles.every((missile) => missile.vx < 0));
});

test("teleport rejects world bounds, water, terrain overlap, and characters", () => {
  const terrain = new TerrainMask(18, "forest");
  const spawn = terrain.spawns[0];
  const characters = [{ id: "other", alive: true, x: spawn.x, y: spawn.y }];
  assert.equal(
    Weapons.isTeleportValid({ x: -2, y: 100 }, terrain, characters, "current"),
    false,
  );
  assert.equal(
    Weapons.isTeleportValid(
      { x: 400, y: terrain.waterY },
      terrain,
      characters,
      "current",
    ),
    false,
  );
  assert.equal(
    Weapons.isTeleportValid(spawn, terrain, characters, "current"),
    false,
  );
  const free = terrain.spawns[2];
  assert.equal(
    Weapons.isTeleportValid(free, terrain, characters, "current"),
    true,
  );
});
