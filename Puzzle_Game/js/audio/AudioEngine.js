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
    const muted = settings.muted ? 0 : 1;
    this.musicGain.gain.setTargetAtTime((settings.musicVolume / 100) * muted, this.context.currentTime, 0.02);
    this.sfxGain.gain.setTargetAtTime((settings.sfxVolume / 100) * muted, this.context.currentTime, 0.02);
    this.masterGain.gain.setTargetAtTime(muted, this.context.currentTime, 0.02);
  }

  playTone({ frequency = 440, duration = 0.12, type = "sine", gain = 0.12, destination = "sfx", delay = 0 }) {
    const context = this.ensure();
    if (!context) return;

    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(gain, start + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(destination === "music" ? this.musicGain : this.sfxGain);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  playNoise({ duration = 0.12, gain = 0.08 }) {
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
    envelope.gain.value = gain;
    source.buffer = buffer;
    source.connect(envelope);
    envelope.connect(this.sfxGain);
    source.start();
  }
}
