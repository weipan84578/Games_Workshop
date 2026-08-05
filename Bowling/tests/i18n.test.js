import test from "node:test";
import assert from "node:assert/strict";
import { createI18n } from "../js/i18n/i18n.js";

function createFakeStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  };
}

test("translates interpolation parameters and switches languages", () => {
  const storage = createFakeStorage();
  const events = [];
  const documentRef = {
    dispatchEvent: (event) => events.push(event.type),
    defaultView: { CustomEvent: class CustomEvent { constructor(type) { this.type = type; } } },
  };
  const i18n = createI18n({ storage, documentRef });
  assert.equal(i18n.t("game_frame", { n: 3 }), "第 3 局");
  i18n.setLanguage("en");
  assert.equal(i18n.t("game_frame", { n: 3 }), "Frame 3");
  i18n.setLanguage("ja");
  assert.equal(i18n.t("game_frame", { n: 3 }), "3フレーム目");
  assert.deepEqual(events, ["language-changed", "language-changed"]);
  assert.equal(i18n.t("missing_key"), "missing_key");
});

test("falls back to Traditional Chinese for a missing translation", () => {
  const i18n = createI18n({ storage: createFakeStorage() });
  i18n.setLanguage("en");
  assert.equal(i18n.t("logo_title"), "Cute Bowling");
  assert.equal(i18n.t("score_pending"), "—");
});
