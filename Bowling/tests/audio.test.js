import test from "node:test";
import assert from "node:assert/strict";
import { calculateBgmGain } from "../js/audio/audioManager.js";
import { SOUND_LIBRARY } from "../js/audio/soundLibrary.js";

test("exposes four offline-friendly BGM tracks and the required SFX set", () => {
  assert.equal(SOUND_LIBRARY.bgm.length, 4);
  assert.deepEqual(Object.keys(SOUND_LIBRARY.sfx).sort(), ["button", "pin", "roll", "spare", "strike"]);
});

test("keeps menu gain at the user volume", () => {
  assert.equal(calculateBgmGain(0.5, false), 0.5);
  assert.equal(calculateBgmGain(0, false), 0);
});

test("applies tenfold in-game gain with the safety cap", () => {
  assert.equal(calculateBgmGain(0.2, true), 2);
  assert.equal(calculateBgmGain(0.5, true), 3);
  assert.equal(calculateBgmGain(1, true), 3);
});
