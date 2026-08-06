"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { I18n, TRANSLATIONS } = require("../js/data/i18n.js");

test("all three languages expose exactly the same keys", () => {
  assert.equal(I18n.keysMatch(), true);
  assert.deepEqual(Object.keys(TRANSLATIONS), ["zh-Hant", "en", "ja"]);
});

test("missing translations fall back without exposing a key or undefined", () => {
  const i18n = new I18n("en");
  const original = TRANSLATIONS.en["game.title"];
  const originalWarn = console.warn;
  console.warn = () => {};
  delete TRANSLATIONS.en["game.title"];
  assert.equal(i18n.t("game.title"), TRANSLATIONS["zh-Hant"]["game.title"]);
  assert.equal(i18n.t("totally.missing"), "");
  TRANSLATIONS.en["game.title"] = original;
  console.warn = originalWarn;
});

test("translation interpolation replaces named values", () => {
  const i18n = new I18n("en");
  const message = i18n.t("aria.turn", {
    team: "Pink",
    worm: "Pip",
    time: 20,
    weapon: "Bazooka",
    wind: 3,
  });
  assert.match(message, /Pink/);
  assert.match(message, /20/);
});

test("every static HTML translation key exists in all languages", () => {
  const html = fs.readFileSync(
    path.resolve(__dirname, "..", "index.html"),
    "utf8",
  );
  const keys = Array.from(
    html.matchAll(/data-i18n(?:-aria)?=["']([^"']+)["']/g),
    (match) => match[1],
  );
  for (const language of Object.keys(TRANSLATIONS)) {
    keys.forEach((key) =>
      assert.equal(
        typeof TRANSLATIONS[language][key],
        "string",
        `${language}:${key}`,
      ),
    );
  }
});
