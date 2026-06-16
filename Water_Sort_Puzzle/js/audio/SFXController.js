let getContext = null;
let getSettings = null;

function volume(settings, scale) {
  return Math.max(0, Math.min(1, settings.sfxVolume)) * scale;
}

function playOsc(ctx, freq, delay, duration, type, gainValue) {
  const start = ctx.currentTime + delay;
  const gain = ctx.createGain();
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainValue), start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function playNoise(ctx, delay, duration, gainValue, filterFreq = 1200) {
  const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / sampleCount);
  }
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  const start = ctx.currentTime + delay;
  source.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq;
  filter.Q.value = 0.8;
  gain.gain.setValueAtTime(gainValue, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(start);
}

export const SFXController = {
  init(contextFactory, settingsFactory) {
    getContext = contextFactory;
    getSettings = settingsFactory;
  },
  play(id) {
    const settings = getSettings?.();
    if (!settings?.sfxEnabled) return;
    const ctx = getContext?.();
    if (!ctx) return;

    const base = volume(settings, 0.36);
    if (id === 'select') {
      playOsc(ctx, 520, 0, 0.055, 'sine', base * 0.55);
      playOsc(ctx, 660, 0.045, 0.07, 'sine', base * 0.45);
    } else if (id === 'deselect') {
      playOsc(ctx, 420, 0, 0.05, 'triangle', base * 0.35);
      playOsc(ctx, 320, 0.045, 0.06, 'triangle', base * 0.32);
    } else if (id === 'invalid') {
      playOsc(ctx, 180, 0, 0.08, 'square', base * 0.45);
      playOsc(ctx, 120, 0.07, 0.11, 'square', base * 0.35);
    } else if (id === 'pour_start' || id === 'pour_end') {
      playNoise(ctx, 0, 0.32, base * 0.45, 900);
      playOsc(ctx, 430, 0, 0.16, 'triangle', base * 0.25);
      playOsc(ctx, 620, 0.18, 0.09, 'sine', base * 0.35);
    } else if (id === 'complete_tube') {
      playOsc(ctx, 660, 0, 0.08, 'sine', base * 0.38);
      playOsc(ctx, 880, 0.08, 0.12, 'sine', base * 0.4);
    } else if (id === 'level_clear') {
      playOsc(ctx, 523, 0, 0.14, 'triangle', base * 0.55);
      playOsc(ctx, 659, 0.12, 0.14, 'triangle', base * 0.55);
      playOsc(ctx, 784, 0.24, 0.16, 'triangle', base * 0.55);
      playOsc(ctx, 1047, 0.38, 0.28, 'sine', base * 0.65);
      playOsc(ctx, 1319, 0.55, 0.36, 'sine', base * 0.45);
      playNoise(ctx, 0.08, 0.72, base * 0.25, 2600);
    } else if (id === 'confetti') {
      playNoise(ctx, 0, 0.38, base * 0.22, 2600);
      playOsc(ctx, 1175, 0.04, 0.08, 'sine', base * 0.22);
      playOsc(ctx, 1568, 0.13, 0.1, 'sine', base * 0.2);
    } else if (id === 'level_fail') {
      playOsc(ctx, 220, 0, 0.16, 'sawtooth', base * 0.35);
      playOsc(ctx, 160, 0.15, 0.24, 'sawtooth', base * 0.35);
    } else if (id === 'undo') {
      playOsc(ctx, 420, 0, 0.06, 'triangle', base * 0.4);
      playOsc(ctx, 300, 0.055, 0.08, 'triangle', base * 0.45);
    } else if (id === 'hint') {
      playOsc(ctx, 760, 0, 0.08, 'sine', base * 0.42);
      playOsc(ctx, 960, 0.08, 0.12, 'sine', base * 0.36);
    } else if (id === 'btn_hover') {
      playOsc(ctx, 620, 0, 0.035, 'sine', base * 0.22);
    } else {
      playOsc(ctx, 460, 0, 0.045, 'sine', base * 0.38);
    }
  },
};
