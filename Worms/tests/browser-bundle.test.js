"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const coreScripts = [
  "js/utils/random.js",
  "js/physics/physics.js",
  "js/terrain/terrain.js",
  "js/weapons/weapons.js",
  "js/core/game-loop.js",
  "js/core/turn-manager.js",
  "js/ai/ai.js",
  "js/render/camera.js",
  "js/core/game-state.js",
];

test("classic browser scripts expose a working game without CommonJS or modules", () => {
  const context = vm.createContext({
    console,
    Set,
    Map,
    Uint8Array,
    Int16Array,
  });
  context.window = context;
  for (const relativePath of coreScripts) {
    const source = fs.readFileSync(path.join(root, relativePath), "utf8");
    vm.runInContext(source, context, { filename: relativePath });
  }
  const game = vm.runInContext(
    "new WormsGame.GameState({ seed: 2468, theme: 'candy' })",
    context,
  );
  assert.equal(game.characters.length, 6);
  assert.equal(game.terrain.validateSpawns(), true);
  assert.equal(context.WormsGame.WeaponRegistry.list().length, 10);
});
