const AudioEngine = (() => {
  let ctx = null;
  let masterGain = null;
  let sfxGain = null;
  let bgmGain = null;
  let bgmNode = null;
  let bgmInterval = null;
  let muted = false;

  function init() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      sfxGain = ctx.createGain();
      bgmGain = ctx.createGain();
      sfxGain.connect(masterGain);
      bgmGain.connect(masterGain);
      masterGain.connect(ctx.destination);
      applyVolumes();
    } catch {}
  }

  function applyVolumes() {
    if (!ctx) return;
    const master = SettingsStore.get('volMaster') / 100;
    const sfx = SettingsStore.get('volSfx') / 100;
    const bgm = SettingsStore.get('volBgm') / 100;
    const m = muted ? 0 : 1;
    masterGain.gain.setTargetAtTime(master * m, ctx.currentTime, 0.05);
    sfxGain.gain.setTargetAtTime(sfx, ctx.currentTime, 0.05);
    bgmGain.gain.setTargetAtTime(bgm, ctx.currentTime, 0.05);
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  function playTone(freq, type, duration, gainVal, delay = 0) {
    if (!ctx) return;
    resume();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    g.gain.setValueAtTime(gainVal, ctx.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
    osc.connect(g);
    g.connect(sfxGain);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.01);
  }

  function slide() { playTone(220, 'sine', 0.08, 0.3); }

  function merge(value) {
    const note = Math.min(Math.log2(value) * 80 + 150, 1200);
    playTone(note, 'triangle', 0.12, 0.4);
    playTone(note * 1.5, 'sine', 0.08, 0.2, 0.05);
  }

  function newTile() { playTone(440, 'sine', 0.06, 0.15); }

  function buttonClick() { playTone(330, 'square', 0.05, 0.1); }

  function undoSound() {
    playTone(300, 'triangle', 0.1, 0.3);
    playTone(240, 'triangle', 0.1, 0.2, 0.1);
  }

  function newRecord() {
    [523, 659, 784, 1047].forEach((f, i) => playTone(f, 'triangle', 0.15, 0.4, i * 0.1));
  }

  function win() {
    const freqs = [523, 659, 784, 1047, 1319, 1568];
    freqs.forEach((f, i) => playTone(f, 'triangle', 0.2, 0.5, i * 0.08));
  }

  function gameOver() {
    [400, 320, 240, 180].forEach((f, i) => playTone(f, 'sawtooth', 0.2, 0.4, i * 0.12));
  }

  /* ---- BGM (procedural) ---- */
  function startBgm() {
    if (!ctx || SettingsStore.get('bgmTrack') === 'none') return;
    resume();
    stopBgm();
    let beat = 0;
    const scale = [261, 293, 329, 349, 392, 440, 493, 523];

    bgmInterval = setInterval(() => {
      if (muted) return;
      const freq = scale[beat % scale.length] * (beat % 16 < 8 ? 1 : 0.5);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.38);
      osc.connect(g);
      g.connect(bgmGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
      beat++;
    }, 420);
  }

  function stopBgm() {
    if (bgmInterval) { clearInterval(bgmInterval); bgmInterval = null; }
  }

  function setMuted(val) {
    muted = val;
    applyVolumes();
    if (muted) stopBgm(); else startBgm();
  }

  function isMuted() { return muted; }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopBgm();
    else if (!muted) startBgm();
  });

  return { init, applyVolumes, slide, merge, newTile, buttonClick, undoSound, newRecord, win, gameOver, startBgm, stopBgm, setMuted, isMuted };
})();
