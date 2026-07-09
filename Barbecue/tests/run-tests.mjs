import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

globalThis.BBQ = {};

const Helpers = require("../js/utils/helpers.js");
const Storage = require("../js/utils/storage.js");
const I18n = require("../js/i18n/i18n.js");
require("../js/i18n/lang-zh.js");
require("../js/i18n/lang-en.js");
require("../js/i18n/lang-ja.js");
require("../js/audio/soundList.js");
const AudioManager = require("../js/audio/audioManager.js");
const GrillLogic = require("../js/game/grillLogic.js");
const OrderApi = require("../js/game/orderSystem.js");

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function cookPerfect(typeId = "pork") {
  const food = GrillLogic.createFood(typeId, 0, 0);
  const type = GrillLogic.getFoodType(typeId);
  GrillLogic.updateFood(food, type.cookMs + 120);
  GrillLogic.flipFood(food, type.cookMs + 120);
  GrillLogic.updateFood(food, type.cookMs + 120);
  return food;
}

test("storage normalizes settings and clamps volumes", () => {
  assert.equal(Storage.DEFAULT_SETTINGS.bgmVolume, 0.24);

  const settings = Storage.normalizeSettings({
    language: "xx",
    theme: "unknown",
    bgmVolume: 3,
    sfxVolume: -2,
    largeText: 1,
    highContrast: 0
  });

  assert.equal(settings.language, "zh-Hant");
  assert.equal(settings.theme, "classic");
  assert.equal(settings.bgmVolume, 1);
  assert.equal(settings.sfxVolume, 0);
  assert.equal(settings.largeText, true);
  assert.equal(settings.highContrast, false);
});

test("i18n translates with interpolation and falls back safely", () => {
  assert.equal(globalThis.BBQ.i18n.setLanguage("en"), "en");
  assert.equal(globalThis.BBQ.i18n.t("order_item", { food: "Corn", count: 2 }), "Corn x2");
  assert.equal(globalThis.BBQ.i18n.setLanguage("missing"), "zh-Hant");
  assert.equal(globalThis.BBQ.i18n.t("food_corn"), "玉米");

  const localI18n = new I18n({
    language: "en",
    dictionaries: {
      "zh-Hant": { hello: "哈囉 {name}" },
      en: { hello: "Hello {name}" }
    }
  });
  assert.equal(localI18n.t("hello", { name: "BBQ" }), "Hello BBQ");
});

test("grill logic uses two green sides and still burns when overcooked", () => {
  const food = GrillLogic.createFood("pork", 1, 0);
  const type = GrillLogic.getFoodType("pork");

  GrillLogic.updateFood(food, type.cookMs + 80);
  assert.equal(GrillLogic.getFoodState(food), GrillLogic.DONENESS.READY);
  assert.equal(GrillLogic.canServe(food), false);
  assert.deepEqual(GrillLogic.getCookProgress(food), [1, 0]);

  GrillLogic.updateFood(food, type.burnMs);
  assert.equal(GrillLogic.getFoodState(food), GrillLogic.DONENESS.BURNT);
  assert.equal(GrillLogic.canServe(food), false);
  assert.equal(GrillLogic.scoreFood(food), -45);

  const perfectFood = GrillLogic.createFood("pork", 1, 0);
  GrillLogic.updateFood(perfectFood, type.cookMs + 80);
  GrillLogic.flipFood(perfectFood, type.cookMs + 80);
  GrillLogic.updateFood(perfectFood, type.cookMs + 80);
  assert.equal(GrillLogic.getFoodState(perfectFood), GrillLogic.DONENESS.PERFECT);
  assert.equal(GrillLogic.canServe(perfectFood), true);
  assert.equal(GrillLogic.scoreFood(perfectFood), type.score);

  GrillLogic.updateFood(perfectFood, type.burnMs);
  assert.equal(GrillLogic.getFoodState(perfectFood), GrillLogic.DONENESS.BURNT);
  assert.equal(GrillLogic.canServe(perfectFood), false);
});

test("grill logic makes perfect after flipping once", () => {
  const food = GrillLogic.createFood("pork", 1, 0);
  const type = GrillLogic.getFoodType("pork");

  GrillLogic.updateFood(food, type.cookMs + 80);
  assert.equal(GrillLogic.getFoodState(food), GrillLogic.DONENESS.READY);
  assert.equal(GrillLogic.canServe(food), false);

  GrillLogic.flipFood(food, type.cookMs + 80);
  GrillLogic.updateFood(food, type.cookMs + 80);
  assert.equal(GrillLogic.getFoodState(food), GrillLogic.DONENESS.PERFECT);
  assert.equal(GrillLogic.canServe(food), true);
  assert.equal(GrillLogic.scoreFood(food), type.score);
});

test("order system accepts requested perfect food and completes order", () => {
  const system = new OrderApi.OrderSystem({
    now: 0,
    rng: Helpers.createSeededRandom(4),
    currentOrder: {
      id: "test-order",
      level: 1,
      createdAt: 0,
      expiresAt: 50000,
      completed: false,
      items: [{ typeId: "pork", count: 1, served: 0 }]
    }
  });
  const result = system.serve(cookPerfect("pork"), 12000);

  assert.equal(result.accepted, true);
  assert.equal(result.complete, true);
  assert.equal(system.combo, 1);
  assert.equal(system.completedOrders, 1);
  assert.ok(result.scoreDelta > GrillLogic.getFoodType("pork").score);
  assert.ok(system.score > 0);
});

test("order system rejects wrong food and expires orders", () => {
  const system = new OrderApi.OrderSystem({
    now: 0,
    rng: Helpers.createSeededRandom(9),
    score: 100,
    combo: 2,
    currentOrder: {
      id: "wrong-food-order",
      level: 1,
      createdAt: 0,
      expiresAt: 1000,
      completed: false,
      items: [{ typeId: "pork", count: 1, served: 0 }]
    }
  });

  const wrongFood = system.serve(cookPerfect("corn"), 500);
  assert.equal(wrongFood.accepted, false);
  assert.equal(wrongFood.reason, "wrong_food");
  assert.equal(system.combo, 0);
  assert.equal(system.score, 75);

  const expired = system.update(1500);
  assert.equal(expired.expired, true);
  assert.equal(expired.scoreDelta, -35);
  assert.equal(system.score, 40);
});

test("audio manager applies game BGM x10 with clamp", () => {
  const audio = new AudioManager();
  assert.equal(audio.bgmVolume, 0.24);

  audio.applySettings({ bgmVolume: 0.04, sfxVolume: 0.5 });
  assert.equal(audio.getEffectiveBgmVolume("menu"), 0.04);
  assert.equal(audio.getEffectiveBgmVolume("game"), 0.4);

  audio.applySettings({ bgmVolume: 0.2, sfxVolume: 0.5 });
  assert.equal(audio.getEffectiveBgmVolume("game"), 1);
});

test("audio manager starts pleasant scheduled BGM only after unlock and swaps patterns", async () => {
  const originalAudioContext = globalThis.AudioContext;

  class FakeParam {
    constructor(value = 0) {
      this.value = value;
    }

    cancelScheduledValues() {}
    setTargetAtTime(value) {
      this.value = value;
    }
    setValueAtTime(value) {
      this.value = value;
    }
    exponentialRampToValueAtTime(value) {
      this.value = value;
    }
  }

  class FakeGain {
    constructor() {
      this.gain = new FakeParam(1);
      this.connections = [];
    }

    connect(node) {
      this.connections.push(node);
    }
  }

  class FakeOscillator {
    constructor() {
      this.type = "sine";
      this.frequency = new FakeParam(0);
      this.started = false;
      this.stopped = false;
      this.connections = [];
    }

    connect(node) {
      this.connections.push(node);
    }

    start(time) {
      this.started = true;
      this.startTime = time;
    }

    stop(time) {
      this.stopped = true;
      this.stopTime = time;
    }
  }

  class FakeAudioContext {
    constructor() {
      this.state = "suspended";
      this.currentTime = 0;
      this.destination = {};
    }

    createGain() {
      return new FakeGain();
    }

    createOscillator() {
      return new FakeOscillator();
    }

    resume() {
      this.state = "running";
      return Promise.resolve();
    }
  }

  globalThis.AudioContext = FakeAudioContext;

  const audio = new AudioManager();
  audio.setScene("menu");
  assert.equal(audio.context, null);
  assert.equal(audio.pendingBgmStart, true);
  assert.equal(audio.bgmOscillators.length, 0);

  await audio.unlock();
  assert.equal(audio.unlocked, true);
  assert.equal(audio.bgmPattern.name, "menu");
  assert.ok(audio.bgmTimer);
  assert.ok(audio.bgmOscillators.length >= 4);
  assert.ok(audio.bgmOscillators.some((node) => Math.round(node.frequency) === 262));
  assert.ok(audio.bgmOscillators.every((node) => node.osc.started));

  const menuOscillators = audio.bgmOscillators.map((node) => node.osc);
  audio.setScene("game");
  assert.ok(menuOscillators.every((osc) => osc.stopped));
  assert.equal(audio.bgmPattern.name, "game");
  assert.ok(audio.bgmOscillators.length >= 4);
  assert.ok(audio.bgmOscillators.some((node) => Math.round(node.frequency) === 659));
  assert.ok(audio.bgmOscillators.some((node) => Math.round(node.frequency) === 131));

  audio.dispose();
  assert.equal(audio.bgmTimer, null);
  assert.equal(audio.bgmOscillators.length, 0);

  const directAudio = new AudioManager();
  await directAudio.requestStart("game");
  assert.equal(directAudio.unlocked, true);
  assert.equal(directAudio.bgmPattern.name, "game");
  assert.ok(directAudio.bgmTimer);
  directAudio.dispose();

  if (originalAudioContext) {
    globalThis.AudioContext = originalAudioContext;
  } else {
    delete globalThis.AudioContext;
  }
});

let passed = 0;

for (const { name, fn } of tests) {
  try {
    await fn();
    passed += 1;
    console.log(`ok ${passed} - ${name}`);
  } catch (error) {
    console.error(`not ok ${passed + 1} - ${name}`);
    console.error(error);
    process.exitCode = 1;
    break;
  }
}

if (process.exitCode !== 1) {
  console.log(`\n${passed}/${tests.length} tests passed`);
}
