export class AudioEngine {
  constructor(settings) {
    this.settings = settings;
    this.context = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
  }

  ensure() {
    if (this.context) return this.context;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    this.context = new AudioContextClass();
    this.masterGain = this.context.createGain();
    this.musicGain = this.context.createGain();
    this.sfxGain = this.context.createGain();
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.context.destination);
    this.applySettings(this.settings);
    return this.context;
  }

  async unlock() {
    const context = this.ensure();
    if (context?.state === "suspended") await context.resume();
  }

  applySettings(settings) {
    this.settings = settings;
    this.ensure();
    if (!this.context) return;
    this.musicGain.gain.setTargetAtTime(settings.musicVolume / 100, this.context.currentTime, 0.02);
    this.sfxGain.gain.setTargetAtTime(settings.sfxVolume / 100, this.context.currentTime, 0.02);
    this.masterGain.gain.setTargetAtTime(1, this.context.currentTime, 0.02);
  }

  playTone({
    frequency = 440,
    endFrequency = null,
    duration = 0.12,
    type = "sine",
    gain = 0.12,
    destination = "sfx",
    delay = 0,
    attack = 0.012,
    pan = 0
  }) {
    const context = this.ensure();
    if (!context) return;

    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const output = this.createOutputNode(destination, pan);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), start + duration);
    }
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(gain, start + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  playNoise({
    duration = 0.12,
    gain = 0.08,
    delay = 0,
    destination = "sfx",
    filterType = "bandpass",
    frequency = 900,
    pan = 0
  }) {
    const context = this.ensure();
    if (!context) return;
    const sampleRate = context.sampleRate;
    const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }

    const source = context.createBufferSource();
    const envelope = context.createGain();
    const filter = context.createBiquadFilter();
    const output = this.createOutputNode(destination, pan);
    const start = context.currentTime + delay;

    filter.type = filterType;
    filter.frequency.setValueAtTime(frequency, start);
    filter.Q.setValueAtTime(1.8, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.linearRampToValueAtTime(gain, start + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(output);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  createOutputNode(destination, pan) {
    const base = destination === "music" ? this.musicGain : this.sfxGain;
    if (!this.context.createStereoPanner || pan === 0) return base;

    const panner = this.context.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    panner.connect(base);
    return panner;
  }
}
