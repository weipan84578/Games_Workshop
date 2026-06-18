window.YZ = window.YZ || {};

YZ.Audio = (function () {
  var ctx = null;
  var bgmGain = null;
  var sfxGain = null;
  var compressor = null;
  var masterBgmVolume = 0.7;
  var masterSfxVolume = 0.8;
  var muted = false;
  var currentTrack = null;
  var currentBoost = 1;
  var loopTimer = null;
  var noteIndex = 0;

  var tracks = {
    menu: { bpm: 94, wave: "triangle", notes: [261.63, 329.63, 392.00, 493.88, 392.00, 329.63, 293.66, 349.23] },
    game: { bpm: 132, wave: "square", notes: [220.00, 330.00, 440.00, 554.37, 493.88, 392.00, 330.00, 277.18] },
    win: { bpm: 128, wave: "triangle", notes: [392.00, 493.88, 587.33, 783.99, 987.77] },
    lose: { bpm: 76, wave: "sine", notes: [392.00, 349.23, 293.66, 246.94] }
  };

  function init() {
    if (ctx) return;
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    ctx = new AudioContext();
    bgmGain = ctx.createGain();
    sfxGain = ctx.createGain();
    compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 24;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.006;
    compressor.release.value = 0.18;
    bgmGain.connect(compressor);
    sfxGain.connect(compressor);
    compressor.connect(ctx.destination);
    applyBgmGain(0);
    applySfxGain();
  }

  function unlock() {
    init();
    if (ctx && ctx.state === "suspended") ctx.resume();
  }

  function applyBgmGain(fadeMs) {
    if (!bgmGain || !ctx) return;
    var target = muted ? 0 : masterBgmVolume * currentBoost;
    var now = ctx.currentTime;
    bgmGain.gain.cancelScheduledValues(now);
    bgmGain.gain.setValueAtTime(bgmGain.gain.value, now);
    bgmGain.gain.linearRampToValueAtTime(target, now + (fadeMs || 0) / 1000);
  }

  function applySfxGain() {
    if (!sfxGain) return;
    sfxGain.gain.value = muted ? 0 : masterSfxVolume;
  }

  function playNote(freq, duration, gainNode, type, volume) {
    if (!ctx || !gainNode || muted && gainNode === sfxGain) return;
    var osc = ctx.createOscillator();
    var env = ctx.createGain();
    var now = ctx.currentTime;
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, now);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume || 0.08), now + 0.025);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(env);
    env.connect(gainNode);
    osc.start(now);
    osc.stop(now + duration + 0.04);
  }

  function tickTrack(trackName) {
    var track = tracks[trackName] || tracks.menu;
    var interval = 60000 / track.bpm;
    var freq = track.notes[noteIndex % track.notes.length];
    noteIndex += 1;
    playNote(freq, Math.min(0.42, interval / 1000 * 0.72), bgmGain, track.wave, 0.055);
    if (noteIndex % 4 === 0) playNote(freq / 2, 0.35, bgmGain, "sine", 0.035);
  }

  function stopLoop() {
    if (loopTimer) {
      clearInterval(loopTimer);
      loopTimer = null;
    }
  }

  function startLoop(trackName) {
    stopLoop();
    noteIndex = 0;
    currentTrack = trackName;
    var track = tracks[trackName] || tracks.menu;
    var interval = 60000 / track.bpm;
    tickTrack(trackName);
    loopTimer = setInterval(function () {
      tickTrack(trackName);
    }, interval);
    if (trackName === "win" || trackName === "lose") {
      setTimeout(function () {
        if (currentTrack === trackName) playBgm("menu", { boost: 1, fade: 700 });
      }, 3600);
    }
  }

  function playBgm(trackName, options) {
    init();
    options = options || {};
    currentBoost = options.boost === undefined ? 1 : options.boost;
    applyBgmGain(options.fade === undefined ? 500 : options.fade);
    if (currentTrack === trackName && loopTimer) return;
    startLoop(trackName || "menu");
  }

  function playSfx(key) {
    init();
    if (!ctx || muted) return;
    var patterns = {
      diceRoll: [220, 330, 260],
      diceHold: [420, 560],
      score: [523.25, 659.25, 783.99],
      yahtzee: [392, 523.25, 659.25, 987.77],
      bonus: [349.23, 440, 698.46],
      click: [360],
      transition: [260, 390],
      win: [523.25, 659.25, 783.99, 1046.5],
      lose: [392, 311.13, 246.94]
    };
    var tones = patterns[key] || patterns.click;
    tones.forEach(function (freq, index) {
      setTimeout(function () {
        playNote(freq, 0.16 + index * 0.02, sfxGain, key === "diceRoll" ? "sawtooth" : "triangle", key === "diceRoll" ? 0.045 : 0.08);
      }, index * 55);
    });
  }

  function setBgmVolume(value) {
    masterBgmVolume = Math.max(0, Math.min(1, Number(value)));
    applyBgmGain(160);
  }

  function setSfxVolume(value) {
    masterSfxVolume = Math.max(0, Math.min(1, Number(value)));
    applySfxGain();
  }

  function setMuted(value) {
    muted = !!value;
    applyBgmGain(120);
    applySfxGain();
  }

  function getState() {
    return {
      bgm: masterBgmVolume,
      sfx: masterSfxVolume,
      mute: muted,
      track: currentTrack,
      boost: currentBoost
    };
  }

  return {
    init: init,
    unlock: unlock,
    playBgm: playBgm,
    playSfx: playSfx,
    setBgmVolume: setBgmVolume,
    setSfxVolume: setSfxVolume,
    setMuted: setMuted,
    getState: getState
  };
})();
