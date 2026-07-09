(function exposeAudioManager(root, factory) {
  var AudioManager = factory(root);
  root.BBQ = root.BBQ || {};
  root.BBQ.AudioManager = AudioManager;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = AudioManager;
  }
})(typeof window !== "undefined" ? window : globalThis, function audioManagerFactory(root) {
  "use strict";

  var clamp = root.BBQ && root.BBQ.Helpers ? root.BBQ.Helpers.clamp : function fallbackClamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  };

  function getAudioContextClass() {
    return root.AudioContext || root.webkitAudioContext || null;
  }

  function AudioManager(options) {
    options = options || {};
    this.settingsProvider = options.settingsProvider || null;
    this.context = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.bgmOscillators = [];
    this.currentScene = "menu";
    this.bgmVolume = 0.08;
    this.sfxVolume = 0.72;
    this.enabled = true;
  }

  AudioManager.prototype.applySettings = function applySettings(settings) {
    settings = settings || {};
    var bgmVolume = Number(settings.bgmVolume);
    var sfxVolume = Number(settings.sfxVolume);
    this.bgmVolume = Number.isFinite(bgmVolume) ? clamp(bgmVolume, 0, 1) : this.bgmVolume;
    this.sfxVolume = Number.isFinite(sfxVolume) ? clamp(sfxVolume, 0, 1) : this.sfxVolume;
    this.updateBgmGain();
  };

  AudioManager.prototype.getEffectiveBgmVolume = function getEffectiveBgmVolume(scene) {
    var multiplier = (scene || this.currentScene) === "game" ? 10 : 1;
    return clamp(this.bgmVolume * multiplier, 0, 1);
  };

  AudioManager.prototype.ensureContext = function ensureContext() {
    if (this.context) {
      return this.context;
    }

    var AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) {
      return null;
    }

    this.context = new AudioContextClass();
    this.masterGain = this.context.createGain();
    this.bgmGain = this.context.createGain();
    this.masterGain.gain.value = 0.88;
    this.bgmGain.gain.value = this.getEffectiveBgmVolume();
    this.bgmGain.connect(this.masterGain);
    this.masterGain.connect(this.context.destination);
    return this.context;
  };

  AudioManager.prototype.unlock = function unlock() {
    var context = this.ensureContext();
    if (context && context.state === "suspended") {
      return context.resume();
    }
    return Promise.resolve(Boolean(context));
  };

  AudioManager.prototype.setScene = function setScene(scene) {
    this.currentScene = scene || "menu";
    this.startBgm();
    this.updateBgmGain();
  };

  AudioManager.prototype.updateBgmGain = function updateBgmGain() {
    if (!this.bgmGain || !this.context) {
      return;
    }
    var now = this.context.currentTime;
    var value = this.getEffectiveBgmVolume();
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.setTargetAtTime(value, now, 0.08);
  };

  AudioManager.prototype.startBgm = function startBgm() {
    var context = this.ensureContext();
    if (!context || this.bgmOscillators.length) {
      return;
    }

    var frequencies = this.currentScene === "game" ? [196, 247, 330] : [174, 220, 294];
    this.bgmOscillators = frequencies.map(function createTone(frequency, index) {
      var osc = context.createOscillator();
      var gain = context.createGain();
      osc.type = index === 0 ? "sine" : "triangle";
      osc.frequency.value = frequency;
      gain.gain.value = 0.08 / (index + 1);
      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start();
      return { osc: osc, gain: gain };
    }, this);
  };

  AudioManager.prototype.stopBgm = function stopBgm() {
    this.bgmOscillators.forEach(function stopTone(node) {
      try {
        node.osc.stop();
      } catch (error) {
        // Oscillators can only be stopped once.
      }
    });
    this.bgmOscillators = [];
  };

  AudioManager.prototype.playSfx = function playSfx(name) {
    var context = this.ensureContext();
    var list = root.BBQ && root.BBQ.SoundList && root.BBQ.SoundList.sfx ? root.BBQ.SoundList.sfx : {};
    var preset = list[name] || list.click;
    if (!context || !preset || this.sfxVolume <= 0) {
      return false;
    }

    var osc = context.createOscillator();
    var gain = context.createGain();
    var now = context.currentTime;
    osc.type = preset.type;
    osc.frequency.value = preset.frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(clamp(this.sfxVolume, 0.001, 1), now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + preset.duration);
    osc.connect(gain);
    gain.connect(this.masterGain || context.destination);
    osc.start(now);
    osc.stop(now + preset.duration + 0.02);
    return true;
  };

  AudioManager.prototype.dispose = function dispose() {
    this.stopBgm();
    if (this.context && typeof this.context.close === "function") {
      this.context.close();
    }
    this.context = null;
    this.masterGain = null;
    this.bgmGain = null;
  };

  return AudioManager;
});
