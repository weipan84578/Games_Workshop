(function (ns) {
  "use strict";

  var BASE_BGM_VOLUME = ns.Constants.AUDIO.BASE_BGM_VOLUME;
  var GAMEPLAY_BGM_MULTIPLIER = ns.Constants.AUDIO.GAMEPLAY_BGM_MULTIPLIER;

  function AudioManager() {
    this.context = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.settings = ns.SaveManager.loadSettings();
    this.mode = "menu";
    this.step = 0;
    this.timer = 0;
  }

  AudioManager.prototype.ensure = function () {
    if (this.context) {
      if (this.context.state === "suspended") {
        this.context.resume();
      }
      return true;
    }

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return false;
    }

    this.context = new AudioContext();
    this.bgmGain = this.context.createGain();
    this.sfxGain = this.context.createGain();
    this.bgmGain.connect(this.context.destination);
    this.sfxGain.connect(this.context.destination);
    this.updateSettings(this.settings);
    this.startBgm();
    return true;
  };

  AudioManager.prototype.updateSettings = function (settings) {
    this.settings = Object.assign({}, this.settings, settings || {});
    if (!this.context) {
      return;
    }
    var now = this.context.currentTime;
    var bgmTarget = this.getBgmTargetGain();
    var sfxTarget = this.settings.muted ? 0 : ns.Helpers.clamp(this.settings.sfxVolume / 100, 0, 1);
    this.bgmGain.gain.setTargetAtTime(bgmTarget, now, 0.05);
    this.sfxGain.gain.setTargetAtTime(sfxTarget, now, 0.03);
  };

  AudioManager.prototype.getBgmTargetGain = function () {
    if (this.settings.muted) {
      return 0;
    }

    // Requirement 10.3: gameplay BGM uses a deliberately low 5% base gain,
    // then multiplies that base by 10 and clamps it below the browser-safe 1.0 ceiling.
    var base = this.mode === "gameplay" ? BASE_BGM_VOLUME * GAMEPLAY_BGM_MULTIPLIER : BASE_BGM_VOLUME;
    return Math.min(base * ns.Helpers.clamp(this.settings.bgmVolume / 100, 0, 1), 1);
  };

  AudioManager.prototype.setMode = function (mode) {
    this.mode = mode === "gameplay" ? "gameplay" : "menu";
    this.updateSettings(this.settings);
    this.startBgm();
  };

  AudioManager.prototype.startBgm = function () {
    var self = this;
    window.clearInterval(this.timer);
    if (!this.context) {
      return;
    }

    this.timer = window.setInterval(function () {
      self.tickBgm();
    }, this.mode === "gameplay" ? 230 : 380);
  };

  AudioManager.prototype.tickBgm = function () {
    if (!this.context || this.settings.muted || this.settings.bgmVolume <= 0) {
      return;
    }

    var menuPattern = [523.25, 659.25, 783.99, 987.77, 783.99, 659.25];
    var gamePattern = [659.25, 783.99, 1046.5, 1174.66, 1046.5, 783.99, 987.77, 1318.51];
    var pattern = this.mode === "gameplay" ? gamePattern : menuPattern;
    var frequency = pattern[this.step % pattern.length];
    var now = this.context.currentTime;
    this.playTone(frequency, this.mode === "gameplay" ? 0.16 : 0.24, "triangle", this.bgmGain, 0.42, now);
    if (this.step % 4 === 0) {
      this.playTone(frequency / 2, this.mode === "gameplay" ? 0.26 : 0.36, "sine", this.bgmGain, 0.18, now);
    }
    this.step += 1;
  };

  AudioManager.prototype.playTone = function (frequency, duration, type, destination, gain, startTime) {
    if (!this.context || !destination) {
      return;
    }
    var time = startTime || this.context.currentTime;
    var oscillator = this.context.createOscillator();
    var envelope = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(Math.max(gain, 0.001), time + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(envelope);
    envelope.connect(destination);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
  };

  AudioManager.prototype.playSfx = function (name) {
    if (!this.ensure()) {
      return;
    }
    var sfx = ns.SfxMap[name];
    if (!sfx || this.settings.muted || this.settings.sfxVolume <= 0) {
      return;
    }
    var self = this;
    var now = this.context.currentTime;
    sfx.notes.forEach(function (note, index) {
      self.playTone(note, sfx.duration, sfx.type, self.sfxGain, sfx.gain, now + index * 0.055);
    });
  };

  AudioManager.prototype.stop = function () {
    window.clearInterval(this.timer);
  };

  ns.AudioManager = AudioManager;
})(window.AirHockey = window.AirHockey || {});
