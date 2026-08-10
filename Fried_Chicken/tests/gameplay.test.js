"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
require(path.join(root, "js/core/namespace.js"));
require(path.join(root, "js/data/game-data.js"));
require(path.join(root, "js/game/rules.js"));
globalThis.CCC.audio = { play() {} };
require(path.join(root, "js/game/orders.js"));
require(path.join(root, "js/game/cooking.js"));

function fakeSession() {
  const order = { id: "order-1", recipeId: "pepper", price: 100, patience: 30, maxPatience: 30 };
  return {
    level: globalThis.CCC.data.levels[0],
    upgrades: { fryer: 1, prep: 1, counter: 1 },
    elapsed: 0,
    selectedOrderId: order.id,
    orders: { items: [order], get(id) { return id === order.id ? order : null; } },
    deliver() {},
    onWaste() {}
  };
}

test("a cutlet can move through all five cooking stages", () => {
  const cooking = new globalThis.CCC.game.CookingManager(fakeSession());
  assert.equal(cooking.takeChicken(), true);
  assert.equal(cooking.current.stage, "raw");
  assert.equal(cooking.moveCurrent("marinade"), true);
  cooking.current.marinade = 80;
  cooking.stopMarinate();
  assert.equal(cooking.current.stage, "marinated");
  assert.equal(cooking.moveCurrent("coating"), true);
  cooking.coat(); cooking.coat(); cooking.coat(); cooking.coat();
  assert.equal(cooking.current.coating, 100);
  assert.equal(cooking.moveCurrent("fryer"), true);
  assert.equal(cooking.current, null);
  cooking.fryers[0].fry = { doneness: 95, totalTime: 9, idealTime: 8, idealRatio: 8 / 9, flipAt: 50 };
  assert.equal(cooking.collect(0), true);
  assert.equal(cooking.moveCurrent("seasoning"), true);
  cooking.season("pepper");
  assert.equal(cooking.current.stage, "seasoned");
  assert.equal(cooking.bag(), true);
  assert.equal(cooking.current.stage, "bagged");
});

test("a second wrong seasoning makes food discard-only", () => {
  const session = fakeSession();
  const cooking = new globalThis.CCC.game.CookingManager(session);
  cooking.current = {
    stage: "fried", location: "seasoning", failed: false, seasoningAttempts: 0,
    selectedFlavor: null, flavorScore: 0, marinade: 80, coating: 100,
    prepLevel: 1, fry: { doneness: 95, idealRatio: 1, flipAt: 50 }
  };
  cooking.season("chili");
  assert.equal(cooking.current.failed, false);
  cooking.season("nori");
  assert.equal(cooking.current.failed, true);
  assert.equal(cooking.discard(), true);
  assert.equal(cooking.current, null);
});

test("recipe generator blocks a third consecutive flavor", () => {
  const session = fakeSession();
  session.level = globalThis.CCC.data.levels[1];
  const manager = new globalThis.CCC.game.OrderManager(session);
  manager.lastFlavors = ["pepper", "pepper"];
  const originalRandom = Math.random;
  Math.random = () => 0;
  try { assert.equal(manager.chooseRecipe().id, "chili"); }
  finally { Math.random = originalRandom; }
});
