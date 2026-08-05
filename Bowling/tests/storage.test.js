import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SETTINGS, createInitialGameState } from "../js/utils/constants.js";
import {
  clearProgress,
  hasSavedProgress,
  loadProgress,
  loadSettings,
  saveProgress,
  saveSettings,
} from "../js/utils/storage.js";

function createFakeStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

test("saves and restores a valid game state", () => {
  const storage = createFakeStorage();
  const state = { ...createInitialGameState(), rolls: [10, 4, 3], currentFrame: 2 };
  assert.equal(saveProgress(state, storage), true);
  assert.equal(hasSavedProgress(storage), true);
  assert.deepEqual(loadProgress(storage).rolls, [10, 4, 3]);
  clearProgress(storage);
  assert.equal(loadProgress(storage), null);
  assert.equal(hasSavedProgress(storage), false);
});

test("ignores corrupt or impossible progress data", () => {
  const storage = createFakeStorage();
  storage.setItem("bowling_save_v1", "not-json");
  assert.equal(loadProgress(storage), null);
  storage.setItem("bowling_save_v1", JSON.stringify({ rolls: [7, 7] }));
  assert.equal(hasSavedProgress(storage), false);
});

test("settings are normalized and persisted independently", () => {
  const storage = createFakeStorage();
  saveSettings({ language: "xx", theme: "unknown", bgmVolume: 4, sfxVolume: -1 }, storage);
  const settings = loadSettings(storage);
  assert.equal(settings.language, DEFAULT_SETTINGS.language);
  assert.equal(settings.theme, DEFAULT_SETTINGS.theme);
  assert.equal(settings.bgmVolume, 1);
  assert.equal(settings.sfxVolume, 0);
});
