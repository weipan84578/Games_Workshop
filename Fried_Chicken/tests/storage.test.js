"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
require(path.join(root, "js/core/namespace.js"));
require(path.join(root, "js/data/game-data.js"));
const storage = require(path.join(root, "js/services/storage.js"));

test("corrupt progress falls back to safe bounded values", () => {
  const repaired = storage.sanitizeProgress({
    highestCompletedDay: 99,
    currentDay: -8,
    coins: -20,
    upgrades: { fryer: 9, prep: "bad", counter: 0 },
    records: { 1: { stars: 9, revenue: -1, combo: "bad" } }
  });
  assert.equal(repaired.highestCompletedDay, 10);
  assert.equal(repaired.currentDay, 10);
  assert.equal(repaired.coins, 0);
  assert.deepEqual(repaired.upgrades, { fryer: 3, prep: 1, counter: 1 });
  assert.deepEqual(repaired.records[1], { stars: 3, revenue: 0, combo: 0 });
  assert.equal(repaired.unlockedRecipes.length, 6);
});

test("preferences preserve valid values and repair invalid ones", () => {
  const repaired = storage.sanitizePreferences({ language: "ja", theme: "mint", bgmVolume: 105, sfxVolume: 35, muted: true, reduceMotion: true });
  assert.equal(repaired.language, "ja");
  assert.equal(repaired.theme, "mint");
  assert.equal(repaired.bgmVolume, 100);
  assert.equal(repaired.sfxVolume, 35);
  assert.equal(repaired.muted, true);
  assert.equal(repaired.reduceMotion, true);
});
