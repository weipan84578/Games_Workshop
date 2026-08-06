"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Camera = require("../js/render/camera.js");

function snapshot(state, overrides = {}) {
  return {
    current: { id: "p1", x: 220, y: 440 },
    projectiles: [],
    placed: [],
    effects: [],
    turn: { state },
    ...overrides,
  };
}

test("camera follows a live projectile and locks out early character return", () => {
  const projectile = { x: 780, y: 260, delay: 0 };
  const focus = Camera.chooseBattleFocus(
    snapshot("ACTION_ACTIVE", { projectiles: [projectile] }),
    { x: 600, y: 300 },
  );
  assert.equal(focus.target, projectile);
  assert.equal(focus.locked, true);
  assert.equal(focus.mode, "projectile");
});

test("camera retains the last impact through settling and damage summary", () => {
  const impact = { x: 1040, y: 610 };
  for (const state of ["WORLD_SETTLING", "DAMAGE_SUMMARY"]) {
    const focus = Camera.chooseBattleFocus(snapshot(state), impact);
    assert.equal(focus.target, impact);
    assert.equal(focus.locked, true);
    assert.equal(focus.mode, "impact");
  }
});

test("camera follows a moving placed weapon before its final impact", () => {
  const sheep = { type: "sheep", x: 920, y: 500 };
  const focus = Camera.chooseBattleFocus(
    snapshot("ACTION_ACTIVE", { placed: [sheep] }),
    { x: 400, y: 300 },
  );
  assert.equal(focus.target, sheep);
  assert.equal(focus.locked, true);
  assert.equal(focus.mode, "placed");
});

test("camera returns to the new current character only after the next turn begins", () => {
  const current = { id: "e1", x: 1400, y: 420 };
  const focus = Camera.chooseBattleFocus(snapshot("TURN_INTRO", { current }), {
    x: 1040,
    y: 610,
  });
  assert.equal(focus.target, current);
  assert.equal(focus.locked, false);
  assert.equal(focus.mode, "character");
});
