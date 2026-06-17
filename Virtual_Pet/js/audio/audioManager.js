window.VP = window.VP || {};

VP.AudioManager = (function () {
  var AudioCtor = window.AudioContext || window.webkitAudioContext;
  var ctx = AudioCtor ? new AudioCtor() : null;
  var bgmGain = ctx ? ctx.createGain() : null;
  var sfxGain = ctx ? ctx.createGain() : null;
  var compressor = ctx ? ctx.createDynamicsCompressor() : null;
  var currentTrackId = "";
  var currentStep = 0;
  var loopId = 0;
  var unlocked = false;
  var BGM_BASE_MULTIPLIER = 5;

  if (ctx) {
    bgmGain.gain.value = 0;
    sfxGain.gain.value = 0.8;
    bgmGain.connect(compressor);
    sfxGain.connect(compressor);
    compressor.connect(ctx.destination);
  }

  function safeNow() {
    return ctx ? ctx.currentTime : 0;
  }

  function setBgmVolume(userPercent) {
    if (!ctx) {
      return;
    }
    var target = Math.min(Math.max(Number(userPercent) || 0, 0) * BGM_BASE_MULTIPLIER, 4);
    bgmGain.gain.setTargetAtTime(target, safeNow(), 0.1);
  }

  function setSfxVolume(userPercent) {
    if (!ctx) {
      return;
    }
    sfxGain.gain.setTargetAtTime(Math.max(Number(userPercent) || 0, 0), safeNow(), 0.05);
  }

  function unlock() {
    if (!ctx || unlocked) {
      return Promise.resolve();
    }
    unlocked = true;
    return ctx.resume().then(function () {
      if (currentTrackId) {
        var trackId = currentTrackId;
        stopBgm();
        playBgm(trackId);
      }
    }).catch(function () {});
  }

  function playTone(destination, frequency, start, duration, wave, gainValue) {
    if (!ctx || !frequency) {
      return;
    }
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = wave || "sine";
    osc.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(gainValue, 0.0002), start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(duration, 0.04));
    osc.connect(gain);
    gain.connect(destination);
    osc.start(start);
    osc.stop(start + Math.max(duration, 0.05) + 0.03);
  }

  function playSfx(id) {
    if (!ctx) {
      return;
    }
    var sfx = VP.SFX_LIBRARY[id] || VP.SFX_LIBRARY.click;
    var start = safeNow();
    sfx.notes.forEach(function (note, index) {
      playTone(sfxGain, note, start + index * (sfx.duration * 0.58), sfx.duration, sfx.type, sfx.gain);
    });
  }

  function tickBgm() {
    var track = VP.BGM_PLAYLIST[currentTrackId];
    if (!ctx || !track) {
      return;
    }
    var note = track.notes[currentStep % track.notes.length];
    playTone(bgmGain, note, safeNow(), Math.min(track.tempo / 1000 * 0.62, 0.7), track.wave, track.gain);
    currentStep += 1;
  }

  function stopBgm() {
    if (loopId) {
      window.clearInterval(loopId);
      loopId = 0;
    }
    currentTrackId = "";
  }

  function playBgm(id) {
    if (!ctx || currentTrackId === id) {
      return;
    }
    stopBgm();
    currentTrackId = id;
    currentStep = 0;
    tickBgm();
    loopId = window.setInterval(tickBgm, (VP.BGM_PLAYLIST[id] || VP.BGM_PLAYLIST["main-menu"]).tempo);
  }

  function syncSettings(settings) {
    settings = settings || {};
    setBgmVolume(settings.bgmVolume === undefined ? 0.6 : settings.bgmVolume);
    setSfxVolume(settings.sfxVolume === undefined ? 0.8 : settings.sfxVolume);
  }

  return {
    ctx: ctx,
    bgmGain: bgmGain,
    sfxGain: sfxGain,
    setBgmVolume: setBgmVolume,
    setSfxVolume: setSfxVolume,
    unlock: unlock,
    playSfx: playSfx,
    playBgm: playBgm,
    stopBgm: stopBgm,
    syncSettings: syncSettings
  };
})();
