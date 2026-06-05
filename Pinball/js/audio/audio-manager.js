(function (window) {
  "use strict";

  var Pinball = window.Pinball;
  var CONFIG = Pinball.CONFIG;

  var ctx = null;
  var bgmGain = null;
  var sfxGain = null;
  var currentTrack = "";
  var desiredTrack = "";
  var stepTimer = 0;
  var stepIndex = 0;
  var settings = Object.assign({}, CONFIG.DEFAULT_SETTINGS);

  var TRACKS = {
    menu: {
      interval: 165,
      melodyWave: "triangle",
      bassWave: "sine",
      gain: 0.045,
      melody: [392, 523, 659, 784, 659, 523, 440, 523, 392, 494, 587, 740, 587, 494, 440, 330],
      bass: [98, 0, 0, 0, 123, 0, 0, 0, 147, 0, 0, 0, 110, 0, 0, 0],
      chords: [[392, 494, 587], null, [440, 523, 659], null, [330, 392, 494], null, [349, 440, 523], null]
    },
    game: {
      interval: 145,
      melodyWave: "square",
      bassWave: "sawtooth",
      gain: 0.038,
      melody: [330, 392, 494, 659, 587, 494, 392, 494, 370, 440, 554, 740, 659, 554, 440, 554],
      bass: [82, 0, 123, 0, 110, 0, 147, 0, 98, 0, 147, 0, 123, 0, 165, 0],
      chords: [[330, 392, 494], null, [370, 440, 554], null, [294, 370, 440], null, [330, 415, 494], null]
    }
  };

  function unlock() {
    if (!ctx) {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      ctx = new AudioContext();
      bgmGain = ctx.createGain();
      sfxGain = ctx.createGain();
      bgmGain.connect(ctx.destination);
      sfxGain.connect(ctx.destination);
      applyVolumes();
    }

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    if (desiredTrack && desiredTrack !== currentTrack) {
      playBGM(desiredTrack);
    }
    return ctx;
  }

  function configure(nextSettings) {
    settings = Object.assign({}, settings, nextSettings || {});
    applyVolumes();
  }

  function applyVolumes() {
    if (!bgmGain || !sfxGain) return;
    var muted = settings.muted;
    bgmGain.gain.setTargetAtTime(muted ? 0 : settings.bgmVolume, ctx.currentTime, 0.04);
    sfxGain.gain.setTargetAtTime(muted ? 0 : settings.sfxVolume, ctx.currentTime, 0.02);
  }

  function playBGM(key) {
    desiredTrack = key;
    if (!ctx || !TRACKS[key]) return;
    if (currentTrack === key && stepTimer) return;
    stopSequencer();
    currentTrack = key;
    stepIndex = 0;
    stepTimer = window.setInterval(tickSequencer, TRACKS[key].interval);
    tickSequencer();
  }

  function stopSequencer() {
    if (stepTimer) {
      window.clearInterval(stepTimer);
      stepTimer = 0;
    }
  }

  function tickSequencer() {
    if (!ctx || settings.muted || !currentTrack) return;
    var track = TRACKS[currentTrack];
    var note = track.melody[stepIndex % track.melody.length];
    var bass = track.bass[stepIndex % track.bass.length];
    var chord = track.chords[Math.floor(stepIndex / 4) % track.chords.length];
    stepIndex += 1;
    if (note) {
      scheduleTone(note, track.melodyWave, track.gain, track.interval / 1000 * 0.78);
    }
    if (bass) {
      scheduleTone(bass, track.bassWave, track.gain * 0.85, 0.18);
    }
    if (chord && stepIndex % 4 === 1) {
      chord.forEach(function (freq, index) {
        scheduleTone(freq, "triangle", track.gain * 0.32, 0.32, index * 0.012);
      });
    }
    if (currentTrack === "game" && stepIndex % 4 === 0) {
      scheduleTone(1760, "square", track.gain * 0.22, 0.035);
    }
  }

  function scheduleTone(freq, type, gain, duration, delay) {
    if (!ctx || !bgmGain) return;
    var now = ctx.currentTime + (delay || 0);
    var osc = ctx.createOscillator();
    var env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(gain, now + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(env).connect(bgmGain);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playSFX(key, options) {
    unlock();
    if (!ctx || settings.muted || !Pinball.SFX) return;
    Pinball.SFX.play(key, ctx, sfxGain, options || {});
  }

  function stopAll() {
    stopSequencer();
    currentTrack = "";
  }

  Pinball.AudioManager = {
    unlock: unlock,
    configure: configure,
    playBGM: playBGM,
    playSFX: playSFX,
    stopAll: stopAll,
    getContext: function () { return ctx; },
    getSfxGain: function () { return sfxGain; }
  };
})(window);
