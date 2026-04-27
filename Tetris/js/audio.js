'use strict';

const Audio = (() => {
  let ctx = null;
  let bgmGain = null, sfxGain = null;
  let bgmSource = null;
  let settings = { bgmVolume: 0.6, sfxVolume: 0.8, bgmEnabled: true, sfxEnabled: true };
  let initialized = false;
  let lastMoveSfx = 0;

  function init() {
    if (initialized) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      bgmGain = ctx.createGain();
      sfxGain = ctx.createGain();
      bgmGain.connect(ctx.destination);
      sfxGain.connect(ctx.destination);
      initialized = true;
      applySettings(settings);
    } catch(e) { console.warn('Web Audio API not available'); }
  }

  function applySettings(s) {
    settings = { ...s };
    if (!initialized) return;
    bgmGain.gain.value = s.bgmEnabled ? s.bgmVolume : 0;
    sfxGain.gain.value = s.sfxEnabled ? s.sfxVolume : 0;
  }

  // Synthesize simple tones for all sound effects
  function playTone(freq, type, duration, gainVal, detune = 0) {
    if (!initialized || !ctx) return;
    try {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(sfxGain);
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const t = ctx.currentTime;
      g.gain.setValueAtTime(gainVal, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.start(t); osc.stop(t + duration);
    } catch(e) {}
  }

  function playNoise(duration, gainVal) {
    if (!initialized || !ctx) return;
    try {
      const bufSize = ctx.sampleRate * duration;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      const g = ctx.createGain();
      src.buffer = buf; src.connect(g); g.connect(sfxGain);
      const t = ctx.currentTime;
      g.gain.setValueAtTime(gainVal, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + duration);
      src.start(t);
    } catch(e) {}
  }

  // BGM: synthesized looping pattern
  let bgmInterval = null;
  let bgmBeat = 0;
  const bgmNotes = [262,294,330,349,392,440,494,523,494,440,392,349,330,294];

  function startBGM(fast = false) {
    if (!initialized || !ctx) return;
    stopBGM();
    bgmBeat = 0;
    const tempo = fast ? 320 : 400;
    bgmInterval = setInterval(() => {
      if (!settings.bgmEnabled) return;
      try {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g); g.connect(bgmGain);
        osc.type = 'square';
        osc.frequency.value = bgmNotes[bgmBeat % bgmNotes.length];
        const t = ctx.currentTime;
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t); osc.stop(t + 0.4);
        bgmBeat++;
      } catch(e) {}
    }, tempo);
  }

  function stopBGM() {
    if (bgmInterval) { clearInterval(bgmInterval); bgmInterval = null; }
  }

  function fadeBGM(targetVol, durationMs) {
    if (!initialized || !bgmGain) return;
    const start = bgmGain.gain.value;
    const steps = 20;
    const dt = durationMs / steps;
    const delta = (targetVol - start) / steps;
    let step = 0;
    const iv = setInterval(() => {
      step++;
      bgmGain.gain.value = Math.max(0, Math.min(1, start + delta * step));
      if (step >= steps) clearInterval(iv);
    }, dt);
  }

  const SFX = {
    move()     { const now = Date.now(); if (now - lastMoveSfx < 30) return; lastMoveSfx = now; playTone(440, 'square', 0.05, 0.3); },
    rotate()   { playTone(520, 'square', 0.08, 0.35); },
    softDrop() { playTone(200, 'square', 0.04, 0.2); },
    hardDrop() { playNoise(0.15, 0.6); },
    lock()     { playTone(180, 'sawtooth', 0.1, 0.4); },
    hold()     { playTone(380, 'triangle', 0.1, 0.3); },
    clear1()   { playTone(600, 'sine', 0.2, 0.5); },
    clear2()   { playTone(700, 'sine', 0.25, 0.5); playTone(800, 'sine', 0.25, 0.5); },
    clear3()   { playTone(800, 'sine', 0.3, 0.6); playTone(1000,'sine', 0.3, 0.5); },
    tetris()   {
      [600, 700, 800, 1000].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.12, 0.7), i * 60));
    },
    tspin()    { [500,700,900].forEach((f,i) => setTimeout(() => playTone(f,'triangle',0.1,0.6), i*50)); },
    levelUp()  { [523,659,784,1047].forEach((f,i) => setTimeout(() => playTone(f,'square',0.15,0.6), i*80)); },
    gameOver() {
      [440,349,294,220,165].forEach((f,i) => setTimeout(() => playTone(f,'sawtooth',0.25,0.5), i*180));
    },
    newRecord() { [784,1047,1319,1568].forEach((f,i) => setTimeout(() => playTone(f,'sine',0.2,0.7), i*100)); },
    combo()    { playTone(660, 'square', 0.2, 0.4); },
    btb()      { playTone(880, 'square', 0.2, 0.5); },
    uiClick()  { playTone(500, 'square', 0.05, 0.25); },
  };

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  return { init, applySettings, startBGM, stopBGM, fadeBGM, resume, SFX };
})();
