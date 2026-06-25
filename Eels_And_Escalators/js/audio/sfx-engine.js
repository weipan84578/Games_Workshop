(function () {
  window.EAE = window.EAE || {};

  class SFXEngine {
    constructor() {
      this.ctx = null;
      this.gainNode = null;
      this.volume = 0.8;
      this.enabled = true;
    }

    init() {
      if (this.ctx) return;
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;
      this.ctx = new AudioCtor();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this.volume;
      this.gainNode.connect(this.ctx.destination);
    }

    resume() {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    }

    setVolume(value) {
      this.volume = Number(value);
      if (this.gainNode) this.gainNode.gain.value = this.enabled ? this.volume : 0;
    }

    setEnabled(enabled) {
      this.enabled = Boolean(enabled);
      if (this.gainNode) this.gainNode.gain.value = this.enabled ? this.volume : 0;
    }

    playClick() {
      this._playTone(660, 0.04, "square", 0.18);
    }

    playDiceRoll() {
      this._playNoise(0.08);
      setTimeout(() => this._playTone(900, 0.06, "triangle", 0.2), 90);
    }

    playStep() {
      this._playTone(880, 0.05, "sine", 0.12);
    }

    playTurnChange() {
      this._playTone(523, 0.08, "triangle", 0.14);
      setTimeout(() => this._playTone(659, 0.08, "triangle", 0.14), 90);
    }

    playEscalator() {
      [523, 659, 784].forEach((freq, index) => {
        setTimeout(() => this._playTone(freq, 0.15, "sine", 0.2), index * 100);
      });
    }

    playEel() {
      [400, 350, 280, 220].forEach((freq, index) => {
        setTimeout(() => this._playTone(freq, 0.18, "sawtooth", 0.14), index * 80);
      });
    }

    playVictory() {
      [523, 659, 784, 1047].forEach((freq, index) => {
        setTimeout(() => this._playTone(freq, 0.28, "triangle", 0.22), index * 120);
      });
    }

    playDefeat() {
      [440, 370, 311, 260].forEach((freq, index) => {
        setTimeout(() => this._playTone(freq, 0.28, "sawtooth", 0.12), index * 150);
      });
    }

    _playTone(freq, duration, type, level) {
      if (!this.enabled) return;
      this.resume();
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(level || 0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.start();
      osc.stop(this.ctx.currentTime + duration + 0.02);
    }

    _playNoise(duration) {
      if (!this.enabled) return;
      this.resume();
      if (!this.ctx || !this.gainNode) return;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < bufferSize; index += 1) {
        data[index] = Math.random() * 2 - 1;
      }
      const source = this.ctx.createBufferSource();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      filter.type = "bandpass";
      filter.frequency.value = 1200;
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);
      source.start();
    }
  }

  window.EAE.SFXEngine = SFXEngine;
})();
