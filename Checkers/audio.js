(function () {
  class AudioEngine {
    constructor(settings) {
      this.ctx = null;
      this.musicGain = null;
      this.sfxGain = null;
      this.musicTimer = null;
      this.settings = settings;
      document.addEventListener('touchstart', () => this.unlock(), { once: true });
      document.addEventListener('click', () => this.unlock(), { once: true });
    }

    unlock() {
      if (!this.ctx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        this.ctx = new Ctx();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.musicGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
        this.applySettings(this.settings);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.startMusic();
    }

    applySettings(settings) {
      this.settings = settings;
      if (!this.ctx) return;
      this.musicGain.gain.value = settings.musicEnabled ? settings.musicVolume : 0;
      this.sfxGain.gain.value = settings.sfxEnabled ? settings.sfxVolume : 0;
      if (!settings.musicEnabled) this.stopMusic();
      else this.startMusic();
    }

    tone(freq, duration, type = 'sine', gain = 0.18, startOffset = 0) {
      if (!this.ctx || !this.settings.sfxEnabled) return;
      const now = this.ctx.currentTime + startOffset;
      const osc = this.ctx.createOscillator();
      const amp = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      amp.gain.setValueAtTime(gain, now);
      amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(amp);
      amp.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + duration);
    }

    play(name) {
      this.unlock();
      if (!this.ctx) return;
      if (name === 'move') this.noise(0.04, 700);
      if (name === 'capture') {
        this.slide(480, 180, 0.1);
        this.noise(0.06, 1200);
      }
      if (name === 'king') [440, 660, 880].forEach((f, i) => this.tone(f, 0.16, 'sine', 0.14, i * 0.11));
      if (name === 'select') this.tone(880, 0.05, 'sine', 0.08);
      if (name === 'invalid') this.tone(120, 0.08, 'square', 0.07);
      if (name === 'button') this.tone(660, 0.04, 'triangle', 0.08);
      if (name === 'win') [440, 550, 660, 880].forEach((f, i) => this.tone(f, 0.18, 'sine', 0.14, i * 0.12));
      if (name === 'lose') this.slide(330, 160, 0.45);
      if (name === 'draw') [440, 392, 440].forEach((f, i) => this.tone(f, 0.13, 'sine', 0.1, i * 0.12));
    }

    slide(from, to, duration) {
      if (!this.ctx || !this.settings.sfxEnabled) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const amp = this.ctx.createGain();
      osc.frequency.setValueAtTime(from, now);
      osc.frequency.exponentialRampToValueAtTime(to, now + duration);
      amp.gain.setValueAtTime(0.16, now);
      amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(amp);
      amp.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + duration);
    }

    noise(duration, frequency) {
      if (!this.ctx || !this.settings.sfxEnabled) return;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.35));
      const source = this.ctx.createBufferSource();
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = frequency;
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(this.sfxGain);
      source.start();
    }

    startMusic() {
      if (!this.ctx || this.musicTimer || !this.settings.musicEnabled) return;
      const notes = [220, 261.63, 293.66, 329.63, 392];
      let step = 0;
      this.musicTimer = setInterval(() => {
        if (!this.ctx || !this.settings.musicEnabled) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const amp = this.ctx.createGain();
        osc.type = step % 4 === 0 ? 'triangle' : 'sine';
        osc.frequency.value = notes[step % notes.length] / (step % 8 === 0 ? 2 : 1);
        amp.gain.setValueAtTime(0.035, now);
        amp.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(amp);
        amp.connect(this.musicGain);
        osc.start(now);
        osc.stop(now + 0.75);
        step += 1;
      }, 420);
    }

    stopMusic() {
      if (this.musicTimer) clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  window.AudioEngine = AudioEngine;
})();
