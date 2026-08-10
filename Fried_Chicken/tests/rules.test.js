"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
require(path.join(root, "js/core/namespace.js"));
require(path.join(root, "js/data/game-data.js"));
const rules = require(path.join(root, "js/game/rules.js"));

test("daily level table matches the ten-day specification", () => {
  const levels = globalThis.CCC.data.levels;
  assert.equal(levels.length, 10);
  assert.deepEqual(levels.map((level) => level.duration), [120, 135, 150, 165, 180, 195, 210, 225, 240, 270]);
  assert.deepEqual(levels.map((level) => level.goal), [360, 560, 800, 1080, 1380, 1760, 2160, 2620, 3150, 3900]);
  assert.deepEqual(levels.map((level) => level.maxOrders), [1, 1, 2, 2, 2, 3, 3, 3, 4, 4]);
});

test("marinade ranges and prep upgrade are applied", () => {
  assert.equal(rules.marinadeScore(70, 1), 100);
  assert.equal(rules.marinadeScore(90, 1), 100);
  assert.equal(rules.marinadeScore(65, 1), 72);
  assert.equal(rules.marinadeScore(65, 2), 100);
  assert.equal(rules.marinadeScore(95, 2), 100);
  assert.equal(rules.marinadeScore(101, 3), 10);
});

test("coating quality uses the level-three perfect threshold", () => {
  assert.equal(rules.coatingScore(90, 1), 100);
  assert.equal(rules.coatingScore(85, 1), 75);
  assert.equal(rules.coatingScore(85, 3), 100);
  assert.ok(rules.coatingScore(60, 1) < 75);
});

test("frying requires deliverable doneness and rewards ideal heat and flip", () => {
  assert.equal(rules.fryingScore({ doneness: 79, idealRatio: 1, flipAt: 50 }), 0);
  assert.equal(rules.fryingScore({ doneness: 116, idealRatio: 1, flipAt: 50 }), 0);
  assert.equal(rules.fryingScore({ doneness: 95, idealRatio: .8, flipAt: 50 }), 100);
  assert.ok(rules.fryingScore({ doneness: 85, idealRatio: .4, flipAt: 75 }) < 75);
});

test("quality grade, patience, combo and income calculations are stable", () => {
  assert.deepEqual(rules.grade(90), { id: "perfect", multiplier: 1.15 });
  assert.deepEqual(rules.grade(75), { id: "delicious", multiplier: 1 });
  assert.deepEqual(rules.grade(60), { id: "normal", multiplier: .8 });
  assert.deepEqual(rules.grade(59), { id: "pass", multiplier: .6 });
  assert.equal(rules.patienceMultiplier(0), .7);
  assert.equal(rules.patienceMultiplier(1), 1);
  assert.equal(rules.comboMultiplier(3), 1.05);
  assert.equal(rules.comboMultiplier(6), 1.1);
  assert.equal(rules.comboMultiplier(10), 1.15);
  assert.equal(rules.income(100, 90, 1, 10), 132);
});

test("corrected seasoning lowers the final quality by one grade", () => {
  const quality = rules.totalQuality({
    marinade: 80, coating: 100, prepLevel: 1, seasoningAttempts: 2, flavorScore: 100,
    fry: { doneness: 95, idealRatio: 1, flipAt: 50 }
  });
  assert.equal(quality.total, 89);
  assert.equal(rules.grade(quality.total).id, "delicious");
});

test("star conditions follow goal, satisfaction and waste rules", () => {
  assert.equal(rules.stars(359, 360, 100, 0), 0);
  assert.equal(rules.stars(360, 360, 60, 5), 1);
  assert.equal(rules.stars(432, 360, 75, 5), 2);
  assert.equal(rules.stars(504, 360, 90, 1), 3);
  assert.equal(rules.stars(504, 360, 90, 2), 2);
});
