"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

test("index is a local, non-module, zero-build entry point", () => {
  assert.doesNotMatch(html, /type=["']module["']/i);
  assert.doesNotMatch(html, /https?:\/\//i);
  assert.doesNotMatch(html, /\bfetch\s*\(/i);
  assert.match(html, /js\/core\/namespace\.js/);
  assert.match(html, /js\/core\/app\.js/);
});

test("every local script and stylesheet referenced by index exists", () => {
  const references = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((value) => !value.startsWith("#"));
  assert.ok(references.length > 10);
  for (const reference of references) {
    assert.equal(fs.existsSync(path.join(root, reference)), true, `missing ${reference}`);
  }
});

test("script order follows namespace, data/services, game, UI, router, app", () => {
  const scripts = [...html.matchAll(/<script defer src=["']([^"']+)["']/g)].map((match) => match[1]);
  const indexOf = (suffix) => scripts.findIndex((value) => value.endsWith(suffix));
  assert.ok(indexOf("namespace.js") < indexOf("dictionaries.js"));
  assert.ok(indexOf("game-data.js") < indexOf("storage.js"));
  assert.ok(indexOf("storage.js") < indexOf("rules.js"));
  assert.ok(indexOf("session.js") < indexOf("screens.js"));
  assert.ok(indexOf("screens.js") < indexOf("router.js"));
  assert.ok(indexOf("router.js") < indexOf("app.js"));
});

test("all three language dictionaries contain the same visible keys", () => {
  require(path.join(root, "js/core/namespace.js"));
  require(path.join(root, "js/i18n/dictionaries.js"));
  const dictionaries = globalThis.CCC.i18nData;
  const base = Object.keys(dictionaries["zh-TW"]).sort();
  assert.deepEqual(Object.keys(dictionaries.en).sort(), base);
  assert.deepEqual(Object.keys(dictionaries.ja).sort(), base);
});

test("every statically referenced translation key exists", () => {
  require(path.join(root, "js/core/namespace.js"));
  require(path.join(root, "js/i18n/dictionaries.js"));
  const keys = new Set(Object.keys(globalThis.CCC.i18nData["zh-TW"]));
  const files = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".js")) files.push(full);
    }
  }
  walk(path.join(root, "js"));
  const referenced = new Set();
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(/(?:\bt|\.t)\(\s*["']([^"']+)["']/g)) referenced.add(match[1]);
  }
  for (const key of referenced) assert.equal(keys.has(key), true, `missing translation: ${key}`);
});

test("project includes local music definitions, licensing records, and documentation", () => {
  require(path.join(root, "assets/audio/bgm/tracks.js"));
  require(path.join(root, "assets/audio/sfx/sounds.js"));
  assert.equal(Object.keys(globalThis.CCC.audioData.tracks).length, 3);
  assert.ok(Object.keys(globalThis.CCC.audioData.sfx).length >= 15);
  assert.equal(fs.existsSync(path.join(root, "LICENSES.md")), true);
  assert.equal(fs.existsSync(path.join(root, "assets/licenses/ORIGINAL_ASSETS.txt")), true);
  assert.equal(fs.existsSync(path.join(root, "README.md")), true);
});

test("data-driven recipes, tutorials, upgrades, and help sections are translated", () => {
  require(path.join(root, "js/core/namespace.js"));
  require(path.join(root, "js/i18n/dictionaries.js"));
  require(path.join(root, "js/data/game-data.js"));
  const keys = new Set(Object.keys(globalThis.CCC.i18nData["zh-TW"]));
  const dynamicKeys = [
    ...globalThis.CCC.data.recipes.map((item) => item.nameKey),
    ...globalThis.CCC.data.levels.map((item) => item.tutorial),
    ...Object.values(globalThis.CCC.data.upgrades).flatMap((item) => [item.nameKey, ...item.effectKeys]),
    ...globalThis.CCC.data.helpSections.flatMap((item) => item.slice(1))
  ];
  for (const key of dynamicKeys) assert.equal(keys.has(key), true, `missing data translation: ${key}`);
});
