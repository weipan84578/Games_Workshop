const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");
const coreFiles = [
  "js/utils/helpers.js",
  "js/utils/storage.js",
  "js/i18n/lang-zh-TW.js",
  "js/i18n/lang-en.js",
  "js/i18n/lang-ja.js",
  "js/i18n/i18n.js",
  "js/data/units.js",
  "js/data/synergies.js",
  "js/data/stages.js",
  "js/data/items.js",
  "js/core/gameState.js",
  "js/core/economySystem.js",
  "js/core/synergySystem.js",
  "js/core/boardSystem.js",
  "js/core/shopSystem.js",
  "js/core/battleSystem.js"
];

function loadRuntime(files = coreFiles) {
  const values = new Map();
  const document = {
    documentElement: { dataset: {}, lang: "" },
    querySelectorAll: () => [],
    querySelector: () => null,
    getElementById: () => null,
    addEventListener: () => {},
    dispatchEvent: () => {}
  };
  const window = {
    localStorage: {
      getItem: (key) => values.has(key) ? values.get(key) : null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key)
    },
    setTimeout,
    clearTimeout
  };
  const context = {
    window,
    document,
    navigator: { language: "zh-TW", maxTouchPoints: 0 },
    console,
    Date,
    Intl,
    JSON,
    Math,
    Number,
    Object,
    Array,
    String,
    Boolean,
    RegExp,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    setTimeout,
    clearTimeout,
    CustomEvent: function CustomEvent(type, init) {
      this.type = type;
      this.detail = init && init.detail;
    }
  };
  window.window = window;
  vm.createContext(context);
  files.forEach((relativeFile) => {
    const filename = path.join(projectRoot, relativeFile);
    vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
  });
  return { app: context.window.AutoBattler, context };
}

test("unit data, star scaling, and translated capacity text are available", () => {
  const { app } = loadRuntime();
  assert.equal(app.UnitData.all.length, 10);
  assert.equal(app.UnitData.coefficient(1), 1);
  assert.equal(app.UnitData.coefficient(2), 1.8);
  assert.equal(app.UnitData.coefficient(3), 3.2);
  assert.equal(app.UnitData.coefficient(4), 4.8);
  assert.equal(app.UnitData.coefficient(5), 6.8);
  assert.equal(app.UnitData.maxStar, 5);
  assert.equal(app.UnitData.experienceToNext(1), 2);
  assert.equal(app.UnitData.experienceToNext(4), 5);

  const zh = app.I18n.t("game.boardCapacity");
  app.I18n.setLanguage("en");
  assert.equal(app.I18n.t("game.boardCapacity"), "On board {current} / {max}");
  app.I18n.setLanguage("ja");
  assert.equal(app.I18n.t("game.boardCapacity"), "出撃 {current} / {max}");
  app.I18n.setLanguage("zh-TW");
  assert.equal(zh, "上場 {current} / {max}");
});

test("board capacity, cross-area feeding, removal, and star-up work together", () => {
  const { app } = loadRuntime();
  const state = app.GameState.createNew();
  assert.equal(app.BoardSystem.maxUnits(state), 3);
  assert.equal(app.BoardSystem.boardCount(state), 1);

  state.board[4] = app.UnitData.create("stoneback", 1);
  state.bench.push(app.UnitData.create("stoneback", 1));
  const fed = app.BoardSystem.autoMerge(state);
  assert.equal(fed.length, 1);
  assert.equal(fed.events[0].experience, 1);
  assert.equal(state.board[4].typeId, "stoneback");
  assert.equal(state.board[4].star, 1);
  assert.equal(state.board[4].experience, 1);
  assert.equal(state.bench.filter((unit) => unit.typeId === "stoneback").length, 0);

  state.bench.push(app.UnitData.create("stoneback", 2));
  const mixedStarFeed = app.BoardSystem.autoMerge(state);
  assert.equal(mixedStarFeed.length, 1);
  assert.equal(mixedStarFeed[0].star, 2);
  assert.equal(mixedStarFeed[0].experience, 1);

  const fiveStar = app.UnitData.create("emberfox", 4, 4);
  state.board[0] = fiveStar;
  state.bench.push(app.UnitData.create("emberfox", 1));
  app.BoardSystem.autoMerge(state);
  assert.equal(fiveStar.star, 5);
  assert.equal(fiveStar.experience, 0);

  const removed = app.BoardSystem.returnToBench(state, 0);
  assert.equal(removed.ok, true);
  assert.equal(state.board[0], null);
});

test("shop purchase and economy settlement update the intended state", () => {
  const { app } = loadRuntime();
  const state = app.GameState.createNew();
  state.gold = 10;
  state.shop = [{ typeId: "emberfox", offerId: "offer-test" }];
  const purchase = app.ShopSystem.buy(state, "offer-test");
  assert.equal(purchase.ok, true);
  assert.equal(state.gold, 9);
  assert.equal(state.bench.length, 1);

  const income = app.EconomySystem.getIncome(state);
  assert.equal(income.base, 5);
  assert.equal(income.interest, 0);
  const result = app.EconomySystem.settle(state, { winner: "player", damage: 0 });
  assert.equal(result.gameOver, false);
  assert.equal(state.round, 2);
  assert.equal(state.xp, 2);
});

test("buying card experience improves every owned card", () => {
  const { app } = loadRuntime();
  const state = app.GameState.createNew();
  state.board = [app.UnitData.create("emberfox", 1), null, null, null, null, null, null, null];
  state.bench = [app.UnitData.create("tidepup", 1)];
  state.gold = 10;
  const result = app.EconomySystem.buyExperience(state);
  assert.equal(result.ok, true);
  assert.equal(result.amount, 4);
  assert.equal(result.unitExperience.length, 2);
  assert.equal(state.board[0].star, 2);
  assert.equal(state.board[0].experience, 2);
  assert.equal(state.bench[0].star, 2);
  assert.equal(state.bench[0].experience, 2);
  assert.equal(state.gold, 6);

  state.level = 8;
  state.gold = 4;
  const maxLevelPurchase = app.EconomySystem.buyExperience(state);
  assert.equal(maxLevelPurchase.ok, true);
});

test("forest synergy activates from deployed units only", () => {
  const { app } = loadRuntime();
  const state = app.GameState.createNew();
  state.board = [
    app.UnitData.create("mossling", 1),
    app.UnitData.create("stoneback", 1),
    null, null, null, null, null, null
  ];
  const forest = app.SynergySystem.getActive(state).find((entry) => entry.key === "forest");
  assert.equal(forest.count, 2);
  assert.ok(forest.active);
  assert.ok(app.SynergySystem.getModifiers(state).defensePct > 0);
});

test("defeated combatants become dead immediately and emit a defeat event", () => {
  const { app } = loadRuntime();
  const state = app.GameState.createNew();
  state.board[4] = null;
  const carry = app.UnitData.create("crystaldragon", 3);
  state.board[0] = carry;
  const result = app.BattleSystem.simulate(state, [carry]);
  assert.equal(result.winner, "player");
  assert.ok(result.events.some((event) => event.type === "defeat"));
  assert.ok(result.enemyTeam.some((unit) => unit.dead && !unit.alive && unit.health === 0));
});

test("deployed units can be returned through the game engine and save pause state", () => {
  const runtime = loadRuntime();
  const { app, context } = runtime;
  let timerCalls = 0;
  context.window.setTimeout = () => {
    timerCalls += 1;
    return { unref: () => {} };
  };
  context.window.clearTimeout = () => {};
  app.GameUI = { render: () => {} };
  app.MainMenuUI = { updateContinue: () => {} };
  app.AudioManager = { playSfx: () => {}, startBgm: () => {} };
  const engineFile = path.join(projectRoot, "js/core/gameEngine.js");
  vm.runInContext(fs.readFileSync(engineFile, "utf8"), context, { filename: engineFile });

  const state = app.GameState.createNew();
  const unitId = state.board[4].instanceId;
  const returned = app.GameEngine.returnUnit(unitId);
  assert.equal(returned.ok, true);
  assert.equal(state.board[4], null);
  assert.equal(state.bench.length, 1);

  state.board[0] = app.UnitData.create("stoneback", 1);
  state.bench.push(app.UnitData.create("stoneback", 1));
  state.awaitingContinue = true;
  state.phaseTime = 30;
  app.GameState.save();
  app.GameEngine.continueGame();
  assert.equal(timerCalls, 0);
  assert.equal(app.GameState.get().awaitingContinue, true);
  assert.equal(app.GameState.get().board[0].experience, 1);
  assert.equal(app.GameState.get().bench.filter((unit) => unit.typeId === "stoneback").length, 0);
  app.GameEngine.resumePreparation();
  assert.equal(timerCalls, 1);
  assert.equal(app.GameState.get().awaitingContinue, false);
});

test("awaiting-continue state survives local save and load", () => {
  const { app } = loadRuntime();
  const state = app.GameState.createNew();
  state.awaitingContinue = true;
  state.phaseTime = 23;
  app.GameState.save();
  const loaded = app.GameState.load();
  assert.equal(loaded.awaitingContinue, true);
  assert.equal(loaded.phaseTime, 23);
});
