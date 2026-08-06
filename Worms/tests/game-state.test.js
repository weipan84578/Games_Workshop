"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { GameState } = require("../js/core/game-state.js");
const Weapons = require("../js/weapons/weapons.js");

function playerControl(game) {
  for (let step = 0; step < 100; step += 1) game.update(1 / 120);
  assert.equal(game.turn.state, "PLAYER_CONTROL");
}

test("a projectile action resolves and advances to the AI team", () => {
  const game = new GameState({ seed: 321, theme: "candy", turnSeconds: 30 });
  playerControl(game);
  game.angle = 45;
  game.power = 0.55;
  assert.equal(game.fire(), true);
  assert.equal(game.turn.state, "ACTION_ACTIVE");
  for (let step = 0; step < 1400 && game.turn.activeTeam === 0; step += 1)
    game.update(1 / 120);
  assert.equal(game.turn.activeTeam, 1);
  assert.equal(game.metrics.shotsFired, 1);
  assert.equal(game.ammo[0].bazooka, Infinity);
});

test("teleport consumes ammo only after a legal confirmed target", () => {
  const game = new GameState({ seed: 654, theme: "forest", turnSeconds: 30 });
  playerControl(game);
  game.selectWeapon("teleport");
  const before = game.ammo[0].teleport;
  game.selectTarget({ x: -20, y: 100 });
  assert.equal(game.ammo[0].teleport, before);
  let point = null;
  for (let x = 90; x < 1830 && !point; x += 10) {
    const y = game.terrain.getSurfaceY(x, 0);
    const candidate = { x, y: y - 18 };
    if (
      Weapons.isTeleportValid(
        candidate,
        game.terrain,
        game.characters,
        game.currentCharacter().id,
      )
    )
      point = candidate;
  }
  assert.ok(point);
  game.selectTarget(point);
  game.selectTarget(point);
  assert.equal(game.ammo[0].teleport, before - 1);
  assert.equal(game.turn.state, "WORLD_SETTLING");
});

test("shotgun permits exactly two shots and locks weapon selection between them", () => {
  const game = new GameState({ seed: 777, theme: "icecream", turnSeconds: 30 });
  playerControl(game);
  const actor = game.currentCharacter();
  const enemy = game.characters.find((character) => character.team === 1);
  enemy.x = actor.x + 100;
  enemy.y = actor.y;
  actor.facing = 1;
  game.angle = 0;
  game.selectWeapon("shotgun");
  game.fire();
  assert.equal(game.shotgunShots, 1);
  assert.equal(game.turn.state, "PLAYER_CONTROL");
  assert.equal(game.selectWeapon("bazooka"), false);
  game.fire();
  assert.equal(game.shotgunShots, 2);
  assert.equal(game.turn.state, "WORLD_SETTLING");
});

test("a mine arms, waits for a new entry, then respects its trigger delay", () => {
  const game = new GameState({ seed: 991, theme: "forest", turnSeconds: 30 });
  playerControl(game);
  game.selectWeapon("mine");
  game.fire();
  const mine = game.placed[0];
  game.updateMine(mine, 1);
  assert.equal(mine.armed, true);
  assert.equal(mine.triggered, false);
  game.characters.forEach((character) => {
    character.x += 400;
  });
  game.updateMine(mine, 0.1);
  const enemy = game.characters.find((character) => character.team === 1);
  enemy.x = mine.x;
  enemy.y = mine.y;
  game.updateMine(mine, 0.1);
  assert.equal(mine.triggered, true);
  assert.equal(mine.exploded, false);
  game.updateMine(mine, 0.7);
  assert.equal(mine.exploded, true);
});
