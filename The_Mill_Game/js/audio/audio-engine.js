(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var context = null;
  var master = null;
  var settings = {
    sfxEnabled: true,
    musicEnabled: true,
    volume: 0.55
  };
  var OUTPUT_MULTIPLIER = 5;
  var bgmTimer = null;
  var bgmStep = 0;
  var bgmTrack = 0;

  function effectiveVolume() {
    return Math.max(0, Number(settings.volume || 0) * OUTPUT_MULTIPLIER);
  }

  function getContext() {
    if (!context) {
      var AudioContext = global.AudioContext || global.webkitAudioContext;
      if (!AudioContext) {
        return null;
      }
      context = new AudioContext();
      master = context.createGain();
      master.gain.value = effectiveVolume();
      master.connect(context.destination);
    }
    return context;
  }

  function unlock() {
    var ctx = getContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }
  }

  function applySettings(nextSettings) {
    settings = Object.assign({}, settings, nextSettings || {});
    if (master) {
      master.gain.value = effectiveVolume();
    }
    if (!settings.musicEnabled) {
      stopBgm();
    } else if (context) {
      startBgm(bgmTrack);
    }
  }

  function playSfx(name) {
    var ctx;
    if (!settings.sfxEnabled) {
      return;
    }
    ctx = getContext();
    if (!ctx || !NMM.SfxSynth) {
      return;
    }
    unlock();
    NMM.SfxSynth.play(ctx, master, name);
  }

  function scheduleBgmStep() {
    var ctx = getContext();
    if (!ctx || !settings.musicEnabled || !NMM.BgmSynth) {
      return;
    }
    NMM.BgmSynth.playStep(ctx, master, bgmTrack, bgmStep);
    bgmStep = (bgmStep + 1) % 32;
    bgmTimer = global.setTimeout(scheduleBgmStep, 430);
  }

  function startBgm(track) {
    if (!settings.musicEnabled) {
      return;
    }
    bgmTrack = typeof track === "number" ? track % 5 : bgmTrack;
    if (bgmTimer) {
      return;
    }
    unlock();
    scheduleBgmStep();
  }

  function stopBgm() {
    if (bgmTimer) {
      global.clearTimeout(bgmTimer);
      bgmTimer = null;
    }
  }

  function nextTrack() {
    stopBgm();
    bgmStep = 0;
    bgmTrack = (bgmTrack + 1) % 5;
    startBgm(bgmTrack);
    return bgmTrack;
  }

  NMM.Audio = {
    applySettings: applySettings,
    unlock: unlock,
    playSfx: playSfx,
    startBgm: startBgm,
    stopBgm: stopBgm,
    nextTrack: nextTrack
  };
})(window);
