'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

class FakeParam {
  constructor() {
    this.value = 0;
  }
  setTargetAtTime(value) {
    this.value = value;
  }
  cancelScheduledValues() {}
  setValueAtTime(value) {
    this.value = value;
  }
  linearRampToValueAtTime(value) {
    this.value = value;
  }
}

class FakeNode {
  constructor() {
    this.gain = new FakeParam();
  }
  connect(node) {
    return node;
  }
  disconnect() {}
}

class FakeAudio {
  static instances = [];
  constructor() {
    this.src = '';
    this.dataset = {};
    this.paused = true;
    this.volume = 1;
    this.playCalls = 0;
    this.listeners = {};
    FakeAudio.instances.push(this);
  }
  addEventListener(name, listener) {
    this.listeners[name] = listener;
  }
  load() {}
  play() {
    this.playCalls += 1;
    this.paused = false;
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
  removeAttribute(name) {
    if (name === 'src') this.src = '';
  }
}

class FakeAudioContext {
  constructor() {
    this.currentTime = 0;
    this.state = 'suspended';
    this.destination = {};
  }
  createGain() {
    return new FakeNode();
  }
  createDynamicsCompressor() {
    return {
      threshold: new FakeParam(),
      knee: new FakeParam(),
      ratio: new FakeParam(),
      attack: new FakeParam(),
      release: new FakeParam(),
      connect(node) {
        return node;
      }
    };
  }
  createMediaElementSource() {
    return new FakeNode();
  }
  resume() {
    this.state = 'running';
    return Promise.resolve();
  }
}

function loadManager(protocol) {
  FakeAudio.instances = [];
  const window = {
    Audio: FakeAudio,
    AudioContext: FakeAudioContext,
    setTimeout,
    setInterval,
    clearInterval,
    location: protocol ? { protocol } : undefined,
    PSG: {
      audio: {
        bgmTracks: { menu: 'assets/audio/bgm/bgm_menu.wav' },
        sfxTracks: { confirm: 'assets/audio/sfx/confirm.wav' }
      },
      core: { settings: { masterVolume: 0.5, bgmVolume: 0.3, sfxVolume: 0.65, muted: false } },
      storage: {
        save: { settingsDefaults: () => ({ masterVolume: 0.5, bgmVolume: 0.3, sfxVolume: 0.65, muted: false }) }
      }
    }
  };
  window.window = window;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'js/audio/audioManager.js'), 'utf8'), window, {
    filename: 'js/audio/audioManager.js'
  });
  return { manager: window.PSG.audio.manager, instances: FakeAudio.instances };
}

test('BGM requested before a gesture starts on unlock without duplicate restart', async () => {
  const { manager, instances } = loadManager();
  manager.play('menu');
  assert.equal(instances.length, 0);
  await manager.unlock();
  assert.equal(instances.length, 2);
  assert.equal(instances.filter((audio) => audio.src.endsWith('bgm_menu.wav')).length, 1);
  assert.equal(instances.find((audio) => audio.src.endsWith('bgm_menu.wav')).playCalls, 1);
});

test('SFX requested before unlock is replayed after the gesture', async () => {
  const { manager, instances } = loadManager();
  manager.sfx('confirm');
  await manager.unlock();
  const effect = instances.find((audio) => audio.src.endsWith('confirm.wav'));
  assert.ok(effect);
  assert.equal(effect.playCalls, 1);
});

test('file launches use direct HTML audio for BGM and SFX', async () => {
  const { manager, instances } = loadManager('file:');
  manager.play('menu');
  manager.sfx('confirm');
  await manager.unlock();
  await new Promise((resolve) => setTimeout(resolve, 60));
  const bgm = instances.find((audio) => audio.src.endsWith('bgm_menu.wav'));
  const effect = instances.find((audio) => audio.src.endsWith('confirm.wav'));
  assert.ok(bgm);
  assert.equal(bgm.playCalls, 1);
  assert.ok(bgm.volume > 0);
  assert.ok(effect);
  assert.equal(effect.playCalls, 1);
  assert.ok(effect.volume > 0);
});
