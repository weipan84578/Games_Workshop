import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fromRoot(...parts) {
  return path.join(root, ...parts);
}

function readText(...parts) {
  return readFileSync(fromRoot(...parts), "utf8");
}

function listFiles(dir) {
  const base = fromRoot(dir);
  const found = [];
  function walk(current) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        found.push(path.relative(root, fullPath).replaceAll("\\", "/"));
      }
    }
  }
  walk(base);
  return found;
}

function createBrowserSandbox() {
  const store = new Map();
  const window = {
    Takoyaki: {},
    navigator: { language: "zh-TW" },
    localStorage: {
      getItem(key) {
        return store.has(key) ? store.get(key) : null;
      },
      setItem(key, value) {
        store.set(key, String(value));
      },
      removeItem(key) {
        store.delete(key);
      }
    },
    setTimeout,
    clearTimeout
  };
  const document = {
    body: { dataset: {}, classList: { add() {}, remove() {} } },
    documentElement: { lang: "" }
  };
  return vm.createContext({ window, document, performance: { now: () => 0 }, console });
}

class FakeClassList {
  constructor() {
    this.values = new Set();
  }

  add(...names) {
    names.forEach((name) => this.values.add(name));
  }

  remove(...names) {
    names.forEach((name) => this.values.delete(name));
  }

  toggle(name, force) {
    const shouldAdd = force === undefined ? !this.values.has(name) : Boolean(force);
    if (shouldAdd) {
      this.values.add(name);
    } else {
      this.values.delete(name);
    }
  }

  contains(name) {
    return this.values.has(name);
  }
}

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.dataset = {};
    this.attributes = new Map();
    this.children = [];
    this.classList = new FakeClassList();
    this.eventListeners = new Map();
    this._innerHTML = "";
    this.textContent = "";
    this.onload = null;
    this.onerror = null;
    this.src = "";
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
    this.children = [];
    for (const match of this._innerHTML.matchAll(/data-([a-z-]+)="([^"]+)"/g)) {
      const child = new FakeElement("button");
      child.dataset[toCamelCase(match[1])] = match[2];
      this.children.push(child);
    }
  }

  get innerHTML() {
    return this._innerHTML;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name.startsWith("data-")) {
      this.dataset[toCamelCase(name.slice(5))] = String(value);
    }
  }

  getAttribute(name) {
    return this.attributes.get(name) || null;
  }

  addEventListener(type, handler) {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    this.eventListeners.get(type).push(handler);
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const dataMatch = /^\[data-([a-z-]+)(?:='([^']+)')?\]$/.exec(selector);
    if (!dataMatch) {
      return [];
    }
    const key = toCamelCase(dataMatch[1]);
    const expected = dataMatch[2];
    return this.children.filter((child) => {
      if (!(key in child.dataset)) {
        return false;
      }
      return expected === undefined || child.dataset[key] === expected;
    });
  }

  append(child) {
    this.children.push(child);
  }
}

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function loadScripts(paths) {
  const sandbox = createBrowserSandbox();
  for (const scriptPath of paths) {
    vm.runInContext(readText(scriptPath), sandbox, { filename: scriptPath });
  }
  return sandbox.window.Takoyaki;
}

async function runAppBoot() {
  const screens = {
    "screen-main-menu": new FakeElement("section"),
    "screen-game": new FakeElement("section"),
    "screen-howto": new FakeElement("section"),
    "screen-settings": new FakeElement("section"),
    "modal-root": new FakeElement("div")
  };
  const screenPanels = [
    ["screen-main-menu", "main-menu"],
    ["screen-game", "game"],
    ["screen-howto", "howto"],
    ["screen-settings", "settings"]
  ].map(([id, screenPanel]) => {
    const element = screens[id];
    element.dataset.screenPanel = screenPanel;
    return element;
  });

  let context;
  const document = {
    baseURI: `file:///${root.replaceAll("\\", "/")}/index.html`,
    currentScript: { src: `file:///${root.replaceAll("\\", "/")}/js/app.js` },
    body: { dataset: {}, classList: new FakeClassList() },
    documentElement: { lang: "" },
    head: {
      append(script) {
        try {
          const scriptFile = path.relative(root, fileURLToPath(script.src));
          vm.runInContext(readText(scriptFile), context, { filename: scriptFile });
          script.onload?.();
        } catch (error) {
          script.onerror?.(error);
        }
      }
    },
    createElement(tagName) {
      return new FakeElement(tagName);
    },
    getElementById(id) {
      return screens[id] || null;
    },
    querySelectorAll(selector) {
      return selector === "[data-screen-panel]" ? screenPanels : [];
    }
  };
  const window = {
    Takoyaki: {},
    navigator: { language: "zh-TW" },
    localStorage: {
      getItem() {
        return null;
      },
      setItem() {},
      removeItem() {}
    },
    setTimeout,
    clearTimeout,
    addEventListener() {}
  };
  context = vm.createContext({ window, document, performance: { now: () => 0 }, console, URL });
  vm.runInContext(readText("js/app.js"), context, { filename: "js/app.js" });
  await new Promise((resolve) => setTimeout(resolve, 0));
  await new Promise((resolve) => setTimeout(resolve, 0));
  return { app: window.Takoyaki, screens, document };
}

test("project contains required static structure and no README", () => {
  const expected = [
    "index.html",
    "css/main.css",
    "css/base/reset.css",
    "css/base/variables.css",
    "css/base/typography.css",
    "css/layout/layout.css",
    "css/layout/responsive.css",
    "css/components/buttons.css",
    "css/components/modal.css",
    "css/components/icons.css",
    "css/components/hud.css",
    "css/components/mobile-controls.css",
    "css/pages/main-menu.css",
    "css/pages/game.css",
    "css/pages/howto.css",
    "css/pages/settings.css",
    "js/app.js",
    "js/core/config.js",
    "js/core/state.js",
    "js/core/storage.js",
    "js/core/event-bus.js",
    "js/i18n/i18n-engine.js",
    "js/i18n/lang-zh.js",
    "js/i18n/lang-en.js",
    "js/i18n/lang-jp.js",
    "js/audio/audio-manager.js",
    "js/audio/playlist.js",
    "js/ui/screen-manager.js",
    "js/ui/main-menu.js",
    "js/ui/howto-page.js",
    "js/ui/settings-page.js",
    "js/ui/mobile-controls.js",
    "js/game/game-loop.js",
    "js/game/takoyaki-slot.js",
    "js/game/ingredients.js",
    "js/game/scoring.js",
    "js/game/order-system.js",
    "js/game/animations.js",
    "data/levels.json",
    "data/achievements.json"
  ];
  for (const file of expected) {
    assert.equal(existsSync(fromRoot(file)), true, `${file} should exist`);
  }
  assert.equal(existsSync(fromRoot("README.md")), false, "README.md must not be created in this phase");
});

test("index.html keeps the static entry contract", () => {
  const html = readText("index.html");
  const scripts = html.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || [];
  assert.equal(scripts.length, 1);
  assert.match(scripts[0], /src="\.\/js\/app\.js"/);
  assert.match(scripts[0], />\s*<\/script>/);
  assert.doesNotMatch(scripts[0], /type="module"/);
  assert.match(html, /href="\.\/css\/main\.css"/);
  assert.doesNotMatch(html, /<style\b/i);
  assert.doesNotMatch(html, /\sstyle="/i);
});

test("app.js references existing local modules", () => {
  const appJs = readText("js/app.js");
  const references = [...appJs.matchAll(/"\.\/([^"]+\.js)"/g)].map((match) => match[1]);
  assert.equal(references.length > 15, true);
  assert.doesNotMatch(appJs, /import\.meta/, "classic script entry must work when index.html is opened via file://");
  for (const reference of references) {
    assert.equal(existsSync(fromRoot("js", reference)), true, `${reference} should exist`);
  }
});

test("entry module order registers the expected browser APIs", () => {
  const appJs = readText("js/app.js");
  const references = [...appJs.matchAll(/"\.\/([^"]+\.js)"/g)].map((match) => `js/${match[1]}`);
  const app = loadScripts(references);
  for (const apiPath of [
    "Config",
    "EventBus",
    "Storage",
    "State",
    "I18n",
    "AudioManager",
    "ScreenManager",
    "MobileControls",
    "MainMenu",
    "HowToPage",
    "SettingsPage",
    "TakoyakiSlot",
    "GameLoop"
  ]) {
    assert.ok(app[apiPath], `${apiPath} should be registered`);
  }
  assert.equal(typeof app.MainMenu.render, "function");
  assert.equal(typeof app.GameLoop.startNew, "function");
});

test("CSS imports all layers and exposes required theme classes", () => {
  const mainCss = readText("css/main.css");
  for (const importPath of [
    "base/reset.css",
    "layout/layout.css",
    "components/buttons.css",
    "themes/theme-cute-pink.css",
    "pages/game.css",
    "layout/responsive.css"
  ]) {
    assert.match(mainCss, new RegExp(importPath.replace("/", "\\/")));
  }

  for (const theme of [
    "theme-cute-pink",
    "theme-ocean-blue",
    "theme-sunny-yellow",
    "theme-matcha-green",
    "theme-night-purple"
  ]) {
    const file = `css/themes/${theme}.css`;
    const css = readText(file);
    assert.match(css, new RegExp(`body\\.${theme}`));
    assert.match(css, /--color-primary:/);
    assert.match(css, /--color-text:/);
  }

  assert.match(readText("css/pages/game.css"), /aspect-ratio/);
  assert.match(readText("css/components/mobile-controls.css"), /env\(safe-area-inset-bottom\)/);
});

test("i18n dictionaries have identical keys and cover configured UI keys", () => {
  const app = loadScripts([
    "js/core/config.js",
    "js/core/event-bus.js",
    "js/core/storage.js",
    "js/core/state.js",
    "js/i18n/lang-zh.js",
    "js/i18n/lang-en.js",
    "js/i18n/lang-jp.js",
    "js/i18n/i18n-engine.js"
  ]);
  const zhKeys = Object.keys(app.LangZh).sort();
  assert.deepEqual(Object.keys(app.LangEn).sort(), zhKeys);
  assert.deepEqual(Object.keys(app.LangJp).sort(), zhKeys);
  for (const tool of app.Config.tools) {
    assert.ok(app.LangZh[tool.key], `${tool.key} missing`);
  }
  for (const theme of app.Config.themes) {
    assert.ok(app.LangZh[theme.key], `${theme.key} missing`);
  }
  for (const step of app.Config.howtoSteps) {
    assert.ok(app.LangZh[step.title], `${step.title} missing`);
    assert.ok(app.LangZh[step.body], `${step.body} missing`);
  }
  assert.equal(app.I18n.detectLanguage("ja-JP"), "ja");
  assert.equal(app.I18n.detectLanguage("en-US"), "en");
  assert.equal(app.I18n.detectLanguage("zh-TW"), "zh-TW");
});

test("takoyaki slot state machine follows the required cooking flow", () => {
  const app = loadScripts([
    "js/core/config.js",
    "js/core/event-bus.js",
    "js/core/storage.js",
    "js/core/state.js",
    "js/game/scoring.js",
    "js/game/takoyaki-slot.js"
  ]);
  const slot = new app.TakoyakiSlot(0, {
    rawToHalf: 10,
    halfToBurnt: 100,
    flippedToCooked: 10,
    cookedToBurnt: 100,
    doneToClear: 10
  });
  assert.equal(slot.state, "empty");
  const batterResult = slot.applyAction("batter", 0);
  assert.equal(batterResult.ok, true);
  assert.equal(batterResult.cue, "msg_added_batter");
  assert.equal(batterResult.sfx, "pour");
  assert.equal(slot.state, "raw");
  assert.equal(slot.applyAction("flip", 5).ok, false);
  assert.equal(slot.update(11).cue, "msg_flip_ready");
  assert.equal(slot.state, "half");
  assert.equal(slot.applyAction("octopus", 12).ok, true);
  assert.equal(slot.applyAction("topping", 13).ok, true);
  assert.equal(slot.applyAction("flip", 20).ok, true);
  assert.equal(slot.state, "flipped");
  assert.equal(slot.update(31).cue, "msg_plate_ready");
  assert.equal(slot.state, "cooked");
  assert.equal(slot.applyAction("plate", 32).ok, true);
  const result = slot.applyAction("sauce", 33);
  assert.equal(result.completed, true);
  assert.equal(result.score > 0, true);
  assert.equal(slot.state, "done");
  slot.update(44);
  assert.equal(slot.state, "empty");
});

test("discard tool clears only burnt takoyaki", () => {
  const app = loadScripts([
    "js/core/config.js",
    "js/core/event-bus.js",
    "js/core/storage.js",
    "js/core/state.js",
    "js/game/scoring.js",
    "js/game/takoyaki-slot.js"
  ]);
  assert.equal(app.Config.tools.some((tool) => tool.id === "discard" && tool.key === "tool_discard"), true);
  const slot = new app.TakoyakiSlot(0, {
    rawToHalf: 10,
    halfToBurnt: 20,
    flippedToCooked: 10,
    cookedToBurnt: 20,
    doneToClear: 10
  });
  assert.equal(slot.applyAction("discard", 0).ok, false);
  slot.applyAction("batter", 0);
  slot.update(10);
  const burnt = slot.update(31);
  assert.equal(burnt.penalty, true);
  assert.equal(slot.state, "burnt");
  const plateResult = slot.applyAction("plate", 32);
  assert.equal(plateResult.ok, false);
  assert.equal(plateResult.cue, "msg_use_discard");
  assert.equal(slot.state, "burnt");
  const discardResult = slot.applyAction("discard", 33);
  assert.equal(discardResult.ok, true);
  assert.equal(discardResult.cue, "msg_discarded");
  assert.equal(slot.state, "empty");
});

test("audio manager implements BGM 10x gain with Web Audio GainNode", () => {
  const source = readText("js/audio/audio-manager.js");
  assert.match(source, /BGM_GAIN_MULTIPLIER\s*=\s*10/);
  assert.match(source, /createGain\(\)/);
  assert.match(source, /settings\.bgmVolume\)\s*\*\s*BGM_GAIN_MULTIPLIER/);
  assert.match(source, /settings\.sfxVolume\)/);
});

test("game loop uses requestAnimationFrame and data files are valid", () => {
  assert.match(readText("js/game/game-loop.js"), /requestAnimationFrame/);
  assert.doesNotMatch(readText("js/game/game-loop.js"), /setInterval/);
  const levels = JSON.parse(readText("data/levels.json"));
  assert.equal(levels.length >= 4, true);
  assert.equal(levels.every((level) => level.slots >= 6 && level.slots <= 12), true);
  JSON.parse(readText("data/achievements.json"));
});

test("all local source files avoid network-only dependencies", () => {
  const files = [
    ...listFiles("css"),
    ...listFiles("js"),
    "index.html"
  ];
  for (const file of files) {
    assert.doesNotMatch(readText(file), /https?:\/\//i, `${file} should not require network access`);
  }
});
