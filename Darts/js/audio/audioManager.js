(function () {
  "use strict";

  window.Darts = window.Darts || {};

  var context = null;
  var masterGain = null;
  var bgmGain = null;
  var sfxGain = null;
  var compressor = null;
  var bgmTimer = null;
  var bgmStep = 0;
  var settings = null;

  var bgmPatterns = {
    menu: [261.63, 329.63, 392, 523.25, 392, 329.63],
    game: [220, 277.18, 329.63, 440, 329.63, 277.18],
    result: [329.63, 392, 493.88, 659.25, 493.88]
  };

  function ensureContext() {
    if (context) {
      if (context.state === "suspended") {
        context.resume();
      }
      return context;
    }
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return null;
    }
    context = new AudioContext();
    masterGain = context.createGain();
    bgmGain = context.createGain();
    sfxGain = context.createGain();
    compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 18;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.18;
    bgmGain.connect(compressor);
    sfxGain.connect(compressor);
    compressor.connect(masterGain);
    masterGain.connect(context.destination);
    applySettings(settings || window.Darts.Storage.getSettings());
    return context;
  }

  function gainFromVolume(volume, enabled) {
    if (!enabled) {
      return 0;
    }
    return Math.max(0, Math.min(10, Number(volume) || 0)) / 10 * 1.6;
  }

  function applySettings(nextSettings) {
    settings = nextSettings || settings || window.Darts.Storage.getSettings();
    if (!bgmGain || !sfxGain) {
      return;
    }
    bgmGain.gain.value = gainFromVolume(settings.bgmVolume, settings.bgmEnabled);
    sfxGain.gain.value = gainFromVolume(settings.sfxVolume, settings.sfxEnabled);
  }

  function playTone(frequency, duration, destination, type) {
    var ctx = ensureContext();
    if (!ctx || !destination) {
      return;
    }
    var now = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function stopBgm() {
    if (bgmTimer) {
      window.clearTimeout(bgmTimer);
      bgmTimer = null;
    }
  }

  function scheduleBgm(scene) {
    if (!settings || !settings.bgmEnabled) {
      return;
    }
    var pattern = bgmPatterns[scene] || bgmPatterns.menu;
    var note = pattern[bgmStep % pattern.length];
    bgmStep += 1;
    playTone(note, 0.34, bgmGain, "triangle");
    bgmTimer = window.setTimeout(function () {
      scheduleBgm(scene);
    }, scene === "game" ? 420 : 560);
  }

  window.Darts.Audio = {
    init: function (nextSettings) {
      settings = nextSettings;
      ensureContext();
    },
    applySettings: applySettings,
    startBgm: function (scene) {
      ensureContext();
      stopBgm();
      bgmStep = 0;
      scheduleBgm(scene || "menu");
    },
    stopBgm: stopBgm,
    play: function (name) {
      var ctx = ensureContext();
      if (!ctx || !settings || !settings.sfxEnabled) {
        return;
      }
      var map = {
        click: [440, 0.08, "square"],
        hover: [660, 0.05, "sine"],
        throw: [180, 0.16, "sawtooth"],
        hit: [260, 0.12, "triangle"],
        bull: [520, 0.18, "triangle"],
        bust: [110, 0.32, "sawtooth"],
        win: [659.25, 0.42, "triangle"],
        tally: [392, 0.1, "sine"]
      };
      var tone = map[name] || map.click;
      playTone(tone[0], tone[1], sfxGain, tone[2]);
      if (name === "win") {
        window.setTimeout(function () { playTone(783.99, 0.38, sfxGain, "triangle"); }, 140);
      }
      if (name === "bull") {
        window.setTimeout(function () { playTone(783.99, 0.16, sfxGain, "triangle"); }, 80);
      }
    }
  };
})();
