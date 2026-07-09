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

  var BGM_PATTERNS = {
    menu: {
      name: "menu",
      bpm: 92,
      steps: 32,
      stepsPerChord: 8,
      swing: 0.08,
      arpGain: 0.18,
      bassGain: 0.16,
      melodyGain: 0.14,
      chords: [
        [261.63, 329.63, 392.00],
        [246.94, 293.66, 392.00],
        [220.00, 261.63, 329.63],
        [174.61, 220.00, 261.63]
      ],
      bass: [130.81, 98.00, 110.00, 87.31],
      arpOrder: [0, 1, 2, 1, 0, 2, 1, 2],
      melody: {
        2: [523.25],
        6: [493.88],
        10: [440.00],
        14: [392.00],
        18: [440.00],
        22: [523.25],
        26: [493.88],
        30: [392.00]
      }
    },
    game: {
      name: "game",
      bpm: 116,
      steps: 32,
      stepsPerChord: 8,
      swing: 0.05,
      arpGain: 0.12,
      bassGain: 0.14,
      melodyGain: 0.12,
      chords: [
        [261.63, 329.63, 392.00],
        [349.23, 440.00, 523.25],
        [392.00, 493.88, 587.33],
        [220.00, 261.63, 329.63]
      ],
      bass: [130.81, 174.61, 196.00, 110.00],
      arpOrder: [0, 2, 1, 2, 0, 1, 2, 1],
      melody: {
        1: [659.25],
        4: [587.33],
        7: [523.25],
        9: [659.25],
        12: [698.46],
        15: [587.33],
        17: [783.99],
        20: [659.25],
        24: [587.33],
        28: [523.25]
      }
    }
  };

  function AudioManager(options) {
    options = options || {};
    this.settingsProvider = options.settingsProvider || null;
    this.context = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.bgmOscillators = [];
    this.bgmTimer = null;
    this.bgmPattern = null;
    this.bgmLoopStartedAt = 0;
    this.bgmNextStep = 0;
    this.currentScene = "menu";
    this.bgmVolume = 0.24;
    this.sfxVolume = 0.72;
    this.enabled = true;
    this.unlocked = false;
    this.pendingBgmStart = false;
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
    if (!context) {
      return Promise.resolve(false);
    }

    var finishUnlock = function finishUnlock() {
      this.unlocked = true;
      if (this.pendingBgmStart || !this.bgmTimer) {
        this.startBgm();
      }
      this.updateBgmGain();
      return true;
    }.bind(this);

    if (context.state === "suspended" && typeof context.resume === "function") {
      return context.resume().then(finishUnlock, function resumeFailed() {
        return false;
      });
    }

    return Promise.resolve(finishUnlock());
  };

  AudioManager.prototype.setScene = function setScene(scene) {
    this.currentScene = scene || "menu";
    this.pendingBgmStart = true;
    if (!this.unlocked) {
      return;
    }
    if (this.bgmTimer || this.bgmOscillators.length) {
      this.stopBgm();
    }
    this.startBgm();
    this.updateBgmGain();
  };

  AudioManager.prototype.requestStart = function requestStart(scene) {
    if (scene) {
      this.currentScene = scene;
    }
    this.pendingBgmStart = true;
    return this.unlock().then(function finishRequest(success) {
      if (success) {
        this.setScene(this.currentScene);
      }
      return success;
    }.bind(this));
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
    if (!context || !this.unlocked || this.bgmTimer) {
      this.pendingBgmStart = true;
      return;
    }

    this.bgmPattern = BGM_PATTERNS[this.currentScene === "game" ? "game" : "menu"];
    this.bgmLoopStartedAt = context.currentTime + 0.05;
    this.bgmNextStep = 0;
    this.bgmOscillators = [];
    this.scheduleBgmWindow();
    this.bgmTimer = root.setInterval(this.scheduleBgmWindow.bind(this), 120);
    this.pendingBgmStart = false;
  };

  AudioManager.prototype.stopBgm = function stopBgm() {
    if (this.bgmTimer) {
      root.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.bgmOscillators.forEach(function stopTone(node) {
      try {
        node.osc.stop();
      } catch (error) {
        // Oscillators can only be stopped once.
      }
    });
    this.bgmOscillators = [];
    this.bgmPattern = null;
    this.bgmNextStep = 0;
  };

  AudioManager.prototype.scheduleBgmWindow = function scheduleBgmWindow() {
    if (!this.context || !this.bgmPattern || !this.unlocked) {
      return;
    }

    var now = this.context.currentTime;
    var horizon = now + 0.85;
    var stepDuration = 60 / this.bgmPattern.bpm / 2;
    this.bgmOscillators = this.bgmOscillators.filter(function keepLiveNode(node) {
      return node.stopAt > now;
    });

    while (this.bgmLoopStartedAt + this.bgmNextStep * stepDuration < horizon) {
      var stepInLoop = this.bgmNextStep % this.bgmPattern.steps;
      var stepTime = this.bgmLoopStartedAt + this.bgmNextStep * stepDuration;
      if (stepInLoop % 2 === 1) {
        stepTime += stepDuration * this.bgmPattern.swing;
      }
      this.scheduleBgmStep(stepInLoop, stepTime, stepDuration);
      this.bgmNextStep += 1;
    }
  };

  AudioManager.prototype.scheduleBgmStep = function scheduleBgmStep(step, time, stepDuration) {
    var pattern = this.bgmPattern;
    var chordIndex = Math.floor(step / pattern.stepsPerChord) % pattern.chords.length;
    var chord = pattern.chords[chordIndex];
    var arpIndex = pattern.arpOrder[step % pattern.arpOrder.length] % chord.length;
    this.scheduleTone(chord[arpIndex], time, stepDuration * 0.78, "triangle", pattern.arpGain);

    if (step % 4 === 0) {
      this.scheduleTone(pattern.bass[chordIndex], time, stepDuration * 1.35, "sine", pattern.bassGain);
    }

    var melodyNotes = pattern.melody[step];
    if (melodyNotes) {
      melodyNotes.forEach(function scheduleMelody(frequency) {
        this.scheduleTone(frequency, time + stepDuration * 0.04, stepDuration * 1.05, "sine", pattern.melodyGain);
      }, this);
    }
  };

  AudioManager.prototype.scheduleTone = function scheduleTone(frequency, startAt, duration, type, peakGain) {
    var context = this.context;
    if (!context || !this.bgmGain) {
      return null;
    }

    var osc = context.createOscillator();
    var gain = context.createGain();
    var stopAt = startAt + duration + 0.04;
    osc.type = type;
    if (osc.frequency && typeof osc.frequency.setValueAtTime === "function") {
      osc.frequency.setValueAtTime(frequency, startAt);
    } else if (osc.frequency) {
      osc.frequency.value = frequency;
    }

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peakGain), startAt + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(startAt);
    osc.stop(stopAt);
    this.bgmOscillators.push({ osc: osc, gain: gain, stopAt: stopAt, frequency: frequency });
    return osc;
  };

  AudioManager.prototype.playSfx = function playSfx(name) {
    this.unlock();
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
