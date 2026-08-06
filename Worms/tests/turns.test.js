"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { TurnManager } = require("../js/core/turn-manager.js");

function characters() {
  return [0, 1].flatMap((team) =>
    [0, 1, 2].map((slot) => ({
      id: `${team}-${slot}`,
      team,
      slot,
      hp: 100,
      alive: true,
    })),
  );
}

test("teams alternate and living team cursors remain cyclic", () => {
  const roster = characters();
  const turns = new TurnManager(roster, 30, 1);
  turns.startTurn();
  assert.equal(turns.currentCharacter().id, "0-0");
  turns.advance();
  assert.equal(turns.currentCharacter().id, "1-0");
  turns.advance();
  assert.equal(turns.currentCharacter().id, "0-1");
  roster.find((item) => item.id === "1-1").alive = false;
  turns.advance();
  assert.equal(turns.currentCharacter().id, "1-2");
});

test("turn timeout skips without mutating ammo", () => {
  const turns = new TurnManager(characters(), 20, 2);
  const ammo = { mine: 2 };
  turns.startTurn();
  turns.tick(0.8);
  assert.equal(turns.state, "PLAYER_CONTROL");
  assert.equal(turns.tick(20), "timeout");
  assert.equal(ammo.mine, 2);
});

test("single-team elimination and simultaneous elimination resolve correctly", () => {
  const roster = characters();
  const turns = new TurnManager(roster, 30, 3);
  roster
    .filter((item) => item.team === 1)
    .forEach((item) => {
      item.alive = false;
    });
  assert.equal(turns.checkVictory(), "team0");
  roster
    .filter((item) => item.team === 0)
    .forEach((item) => {
      item.alive = false;
    });
  assert.equal(turns.checkVictory(), "draw");
});

test("sudden death starts only after ten minutes and raises water each completed turn", () => {
  const roster = characters();
  const turns = new TurnManager(roster, 30, 4);
  turns.matchElapsed = 599.99;
  turns.startTurn();
  assert.equal(turns.suddenDeath, false);
  turns.matchElapsed = 600;
  turns.startTurn();
  assert.equal(turns.suddenDeath, true);
  assert.ok(roster.every((item) => item.hp === 1));
  const water = turns.waterY;
  turns.advance();
  assert.equal(turns.waterY, water - 18);
});

test("pause freezes both turn and match timers", () => {
  const turns = new TurnManager(characters(), 30, 5);
  turns.startTurn();
  turns.tick(0.8);
  turns.setPaused(true);
  turns.tick(12);
  assert.equal(turns.timeLeft, 30);
  assert.equal(turns.matchElapsed, 0.8);
});
