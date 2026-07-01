(function (ns) {
  "use strict";

  var AudioContextClass = window.AudioContext || window.webkitAudioContext;

  function AudioManager() {
    this.context = null;
    this.master = null;
    this.compressor = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.settings = Object.assign({}, ns.Constants.DEFAULT_SETTINGS);
    this.currentTrack = null;
    this.bgmTimer = null;
    this.step = 0;
  }

  AudioManager.prototype.init = function (settings) {
    this.settings = Object.assign({}, this.settings, settings || {});
  };

  AudioManager.prototype.ensureContext = function () {
    if (!AudioContextClass) {
      return null;
    }
    if (!this.context) {
      this.context = new AudioContextClass();
      this.compressor = this.context.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 24;
      this.compressor.ratio.value = 8;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.18;

      this.master = this.context.createGain();
      this.master.gain.value = 0.22;
      this.bgmGain = this.context.createGain();
      this.sfxGain = this.context.createGain();
      this.bgmGain.connect(this.compressor);
      this.sfxGain.connect(this.compressor);
      this.compressor.connect(this.master);
      this.master.connect(this.context.destination);
    }
    if (this.context.state === "suspended") {
      this.context.resume();
    }
    return this.context;
  };

  AudioManager.prototype.updateGains = function () {
    if (!this.context) {
      return;
    }
    var now = this.context.currentTime;
    var muted = this.settings.muted;
    var multiplier = this.currentTrack === "gameplay" ? 5 : 1;
    var bgmValue = muted ? 0 : this.settings.bgmVolume * multiplier;
    var sfxValue = muted ? 0 : this.settings.sfxVolume;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.linearRampToValueAtTime(bgmValue, now + 0.5);
    this.sfxGain.gain.setTargetAtTime(sfxValue, now, 0.02);
  };

  AudioManager.prototype.playBgm = function (track) {
    if (!this.ensureContext()) {
      return;
    }
    if (this.currentTrack === track && this.bgmTimer) {
      this.updateGains();
      return;
    }
    this.stopBgm(false);
    this.currentTrack = track;
    this.step = 0;
    this.updateGains();
    this.scheduleBgmNote();
    this.bgmTimer = window.setInterval(this.scheduleBgmNote.bind(this), track === "gameplay" ? 220 : 340);
  };

  AudioManager.prototype.scheduleBgmNote = function () {
    if (!this.context || !this.bgmGain || this.settings.muted) {
      return;
    }
    var menuNotes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];
    var gameNotes = [659.25, 783.99, 987.77, 880, 783.99, 987.77, 1174.66, 987.77];
    var notes = this.currentTrack === "gameplay" ? gameNotes : menuNotes;
    var frequency = notes[this.step % notes.length];
    this.step += 1;
    this.playTone(frequency, 0.16, this.bgmGain, "triangle", 0.18);
    if (this.step % 4 === 0) {
      this.playTone(frequency / 2, 0.28, this.bgmGain, "sine", 0.08);
    }
  };

  AudioManager.prototype.stopBgm = function () {
    if (this.bgmTimer) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.currentTrack = null;
    if (this.context && this.bgmGain) {
      this.bgmGain.gain.setTargetAtTime(0, this.context.currentTime, 0.12);
    }
  };

  AudioManager.prototype.playTone = function (frequency, duration, output, type, gainValue) {
    if (!this.context || !output) {
      return;
    }
    var oscillator = this.context.createOscillator();
    var gain = this.context.createGain();
    var now = this.context.currentTime;
    oscillator.type = type || "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue || 0.22, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  };

  AudioManager.prototype.playSfx = function (name) {
    if (!this.ensureContext() || this.settings.muted) {
      return;
    }
    var notes = ns.SoundMap.sfx[name] || ns.SoundMap.sfx.buttonTap;
    notes.forEach(function (frequency, index) {
      window.setTimeout(function () {
        this.playTone(frequency, 0.12, this.sfxGain, "sine", 0.28);
      }.bind(this), index * 90);
    }, this);
  };

  AudioManager.prototype.setBgmVolume = function (value) {
    this.settings.bgmVolume = ns.MathUtils.clamp(Number(value), 0, 1);
    this.updateGains();
  };

  AudioManager.prototype.setSfxVolume = function (value) {
    this.settings.sfxVolume = ns.MathUtils.clamp(Number(value), 0, 1);
    this.updateGains();
  };

  AudioManager.prototype.muteAll = function () {
    this.settings.muted = true;
    this.updateGains();
  };

  AudioManager.prototype.unmuteAll = function () {
    this.settings.muted = false;
    this.updateGains();
  };

  AudioManager.prototype.toggleMuted = function () {
    if (this.settings.muted) {
      this.unmuteAll();
    } else {
      this.muteAll();
    }
    return this.settings.muted;
  };

  ns.AudioManager = new AudioManager();
})(window.DAB = window.DAB || {});
