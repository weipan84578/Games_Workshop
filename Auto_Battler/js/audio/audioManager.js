(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};
  var context = null;
  var bgmGain = null;
  var sfxGain = null;
  var compressor = null;
  var bgmTimer = null;
  var currentTrack = null;
  var currentSettings = { bgm: 1, sfx: 1, muted: false };

  function getContext() {
    if (context) return context;
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    try {
      context = new AudioContext();
    } catch (error) {
      context = null;
      return null;
    }
    bgmGain = context.createGain();
    sfxGain = context.createGain();
    compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.knee.value = 18;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.006;
    compressor.release.value = 0.18;
    bgmGain.connect(compressor);
    sfxGain.connect(compressor);
    compressor.connect(context.destination);
    applyGains();
    return context;
  }

  function applyGains() {
    if (!context || !bgmGain || !sfxGain) return;
    var muted = currentSettings.muted;
    bgmGain.gain.setTargetAtTime(muted ? 0 : Number(currentSettings.bgm || 0), context.currentTime, 0.03);
    sfxGain.gain.setTargetAtTime(muted ? 0 : Number(currentSettings.sfx || 0), context.currentTime, 0.03);
  }

  function noteFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  function playTone(frequency, duration, destination, volume, type, startAt) {
    var audioContext = getContext();
    if (!audioContext || !destination) return;
    var start = startAt || audioContext.currentTime;
    var oscillator = audioContext.createOscillator();
    var gain = audioContext.createGain();
    oscillator.type = type || "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  function scheduleTrack(trackName) {
    var audioContext = getContext();
    if (!audioContext || currentTrack !== trackName) return;
    var melodies = {
      menu: [64, 67, 71, 72, 71, 67, 69, 67],
      prepare: [60, 64, 67, 69, 67, 64, 62, 64],
      battle: [52, 55, 59, 62, 59, 57, 55, 59],
      result: [72, 76, 79, 84]
    };
    var notes = melodies[trackName] || melodies.menu;
    var start = audioContext.currentTime + 0.04;
    notes.forEach(function (note, index) {
      playTone(noteFrequency(note), trackName === "result" ? 0.34 : 0.52, bgmGain, 0.035, "triangle", start + index * 0.46);
      if (index % 2 === 0 && trackName !== "battle") playTone(noteFrequency(note - 12), 0.72, bgmGain, 0.014, "sine", start + index * 0.46);
    });
    var duration = trackName === "result" ? 1900 : 3900;
    bgmTimer = window.setTimeout(function () { scheduleTrack(trackName); }, duration);
  }

  app.AudioManager = {
    init: function (settings) {
      currentSettings = Object.assign(currentSettings, settings || {});
      this.applySettings(currentSettings);
    },
    ensure: function () {
      var audioContext = getContext();
      if (audioContext && audioContext.state === "suspended") audioContext.resume();
      return !!audioContext;
    },
    applySettings: function (settings) {
      currentSettings = Object.assign(currentSettings, settings || {});
      applyGains();
    },
    getSettings: function () { return Object.assign({}, currentSettings); },
    startBgm: function (trackName) {
      if (!this.ensure()) return false;
      if (currentTrack === trackName && bgmTimer) return true;
      this.stopBgm();
      currentTrack = trackName || "menu";
      scheduleTrack(currentTrack);
      return true;
    },
    stopBgm: function () {
      if (bgmTimer) window.clearTimeout(bgmTimer);
      bgmTimer = null;
      currentTrack = null;
    },
    playSfx: function (name) {
      if (!this.ensure()) return;
      var audioContext = getContext();
      var now = audioContext.currentTime;
      var patterns = {
        click: [[74, 0.08, 0.06]],
        buy: [[78, 0.08, 0.07], [86, 0.12, 0.055]],
        place: [[68, 0.11, 0.06]],
        merge: [[67, 0.12, 0.06], [74, 0.12, 0.06], [81, 0.22, 0.07]],
        victory: [[72, 0.12, 0.07], [76, 0.12, 0.07], [79, 0.26, 0.08]],
        defeat: [[67, 0.14, 0.055], [62, 0.23, 0.06]]
      };
      (patterns[name] || patterns.click).forEach(function (item, index) {
        playTone(noteFrequency(item[0]), item[1], sfxGain, item[2], "sine", now + index * 0.1);
      });
    }
  };
}(window));
