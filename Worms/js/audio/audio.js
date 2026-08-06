(function (root, factory) {
  var api = factory();
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.AudioManager = api.AudioManager;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  var TRACKS = Object.freeze({
    menu: "assets/audio/bgm/menu.mp3",
    battle: "assets/audio/bgm/battle.mp3",
    result: "assets/audio/bgm/result.mp3",
  });

  /** Resilient BGM and procedural Web Audio sound manager. */
  function AudioManager(settings) {
    settings = settings || {};
    this.bgmVolume = settings.bgmVolume == null ? 0.45 : settings.bgmVolume;
    this.sfxVolume = settings.sfxVolume == null ? 0.7 : settings.sfxVolume;
    this.muted = !!settings.muted;
    this.context = null;
    this.current = null;
    this.unlocked = false;
    this.warned = {};
    this.tracks = {};
    if (typeof Audio !== "undefined") {
      Object.keys(TRACKS).forEach(function (name) {
        var audio = new Audio(TRACKS[name]);
        audio.loop = true;
        audio.preload = "metadata";
        audio.volume = 0;
        this.tracks[name] = audio;
      }, this);
    }
  }

  AudioManager.prototype.unlock = function () {
    if (this.unlocked) return;
    this.unlocked = true;
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.context = new AudioContext();
      if (this.context && this.context.state === "suspended")
        this.context.resume().catch(function () {});
      if (this.current) this.playTrack(this.current);
    } catch (_) {}
  };

  AudioManager.prototype.fade = function (audio, target, duration, done) {
    if (!audio) return;
    var start = audio.volume;
    var started = performance.now();
    function frame(now) {
      var progress = Math.min(1, (now - started) / duration);
      audio.volume = Math.max(
        0,
        Math.min(1, start + (target - start) * progress),
      );
      if (progress < 1) requestAnimationFrame(frame);
      else if (done) done();
    }
    requestAnimationFrame(frame);
  };

  AudioManager.prototype.playTrack = function (name) {
    var self = this;
    var next = this.tracks[name];
    if (!next) return;
    if (this.current && this.current !== name) {
      var old = this.tracks[this.current];
      this.fade(old, 0, 400, function () {
        old.pause();
        old.currentTime = 0;
      });
    }
    this.current = name;
    if (!this.unlocked || this.muted || document.hidden) return;
    var promise = next.play();
    if (promise && promise.catch)
      promise.catch(function () {
        if (!self.warned[name]) {
          self.warned[name] = true;
          console.warn("Optional BGM unavailable:", TRACKS[name]);
        }
      });
    this.fade(next, this.bgmVolume, 400);
  };

  AudioManager.prototype.setSettings = function (settings) {
    this.bgmVolume = settings.bgmVolume;
    this.sfxVolume = settings.sfxVolume;
    this.muted = settings.muted;
    var active = this.current && this.tracks[this.current];
    if (active) active.volume = this.muted ? 0 : this.bgmVolume;
    if (!this.muted && this.unlocked && this.current)
      this.playTrack(this.current);
  };

  AudioManager.prototype.setHidden = function (hidden) {
    var active = this.current && this.tracks[this.current];
    if (!active) return;
    if (hidden) active.pause();
    else if (this.unlocked && !this.muted) this.playTrack(this.current);
  };

  AudioManager.prototype.tone = function (
    frequency,
    duration,
    type,
    volume,
    slide,
  ) {
    if (!this.context || this.muted || this.sfxVolume <= 0) return;
    var now = this.context.currentTime;
    var oscillator = this.context.createOscillator();
    var gain = this.context.createGain();
    oscillator.type = type || "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    if (slide)
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(30, slide),
        now + duration,
      );
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.0001, (volume || 0.15) * this.sfxVolume),
      now + 0.015,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  };

  AudioManager.prototype.noise = function (duration, volume) {
    if (!this.context || this.muted || this.sfxVolume <= 0) return;
    var length = Math.floor(this.context.sampleRate * duration);
    var buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < length; i += 1)
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    var source = this.context.createBufferSource();
    var gain = this.context.createGain();
    source.buffer = buffer;
    gain.gain.value = (volume || 0.12) * this.sfxVolume;
    source.connect(gain).connect(this.context.destination);
    source.start();
  };

  AudioManager.prototype.sfx = function (name) {
    var patterns = {
      click: [520, 0.06, "sine", 0.08, 650],
      back: [360, 0.08, "triangle", 0.08, 240],
      error: [180, 0.16, "square", 0.07, 130],
      confirm: [440, 0.12, "sine", 0.1, 760],
      jump: [360, 0.12, "triangle", 0.12, 700],
      backflip: [260, 0.2, "sine", 0.12, 880],
      land: [140, 0.08, "sine", 0.07, 90],
      hurt: [170, 0.18, "sawtooth", 0.1, 90],
      splash: [130, 0.25, "sine", 0.1, 60],
      sheep: [740, 0.18, "triangle", 0.1, 510],
      rocket: [150, 0.22, "sawtooth", 0.12, 55],
      shotgun: [90, 0.09, "square", 0.16, 45],
      bat: [260, 0.08, "square", 0.1, 110],
      fuse: [880, 0.05, "sine", 0.08, 880],
      mine: [620, 0.12, "square", 0.08, 900],
      turn: [500, 0.16, "triangle", 0.1, 760],
      countdown: [740, 0.09, "square", 0.08, 740],
      sudden: [190, 0.55, "sawtooth", 0.14, 70],
      victory: [520, 0.45, "triangle", 0.12, 1040],
      defeat: [330, 0.5, "triangle", 0.1, 120],
    };
    if (name === "explosion" || name === "bigExplosion") {
      this.noise(
        name === "bigExplosion" ? 0.55 : 0.32,
        name === "bigExplosion" ? 0.24 : 0.17,
      );
      this.tone(90, 0.3, "sine", 0.16, 35);
      return;
    }
    var args = patterns[name] || patterns.click;
    this.tone.apply(this, args);
  };

  AudioManager.TRACKS = TRACKS;
  return { TRACKS: TRACKS, AudioManager: AudioManager };
});
