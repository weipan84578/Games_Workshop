import test from "node:test";
import assert from "node:assert/strict";
import { calculateBgmGain, createAudioManager } from "../js/audio/audioManager.js";
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

test("starts synthesized BGM and SFX after an audio context is unlocked", async () => {
  class FakeParam {
    setTargetAtTime() {}
    setValueAtTime() {}
    exponentialRampToValueAtTime() {}
    linearRampToValueAtTime() {}
  }

  class FakeNode {
    connect() { return this; }
    disconnect() {}
  }

  class FakeAudioContext {
    constructor() {
      this.currentTime = 0;
      this.sampleRate = 8000;
      this.state = "running";
      this.destination = new FakeNode();
      this.sources = 0;
      this.oscillators = 0;
    }

    createGain() {
      return Object.assign(new FakeNode(), { gain: new FakeParam() });
    }

    createDynamicsCompressor() {
      return new FakeNode();
    }

    createBuffer(channels, length) {
      assert.equal(channels, 1);
      return { getChannelData: () => new Float32Array(length) };
    }

    createBufferSource() {
      this.sources += 1;
      return Object.assign(new FakeNode(), { start() {}, stop() {}, loop: false });
    }

    createOscillator() {
      this.oscillators += 1;
      return Object.assign(new FakeNode(), {
        frequency: new FakeParam(),
        start() {},
        stop() {},
      });
    }

    async resume() {
      this.state = "running";
    }
  }

  const audio = createAudioManager({ audioContextFactory: FakeAudioContext });
  audio.setScreen("game");
  assert.equal(await audio.playBgm(), true);
  assert.equal(await audio.playSfx("roll"), true);
  assert.equal(audio.getState().hasContext, true);
});
