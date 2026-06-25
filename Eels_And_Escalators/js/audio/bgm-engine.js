(function () {
  window.EAE = window.EAE || {};

  class BGMEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.volume = 0.75;
      this.enabled = true;
      this.isPlaying = false;
      this.timer = null;
      this.step = 0;
      this.tempo = 120;
      this.baseVolume = 0.08;
      this.sequence = [
        [523, 0.5], [659, 0.5], [784, 0.5], [880, 0.5],
        [988, 1], [784, 0.5], [659, 0.5], [523, 1],
        [440, 0.5], [523, 0.5], [659, 1], [523, 1],
        [392, 0.5], [494, 0.5], [659, 0.5], [784, 0.5],
        [880, 1], [659, 1], [587, 0.5], [523, 1.5]
      ];
    }

    init() {
      if (this.ctx) return;
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;
      this.ctx = new AudioCtor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._targetGain();
      this.masterGain.connect(this.ctx.destination);
    }

    resume() {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    }

    play() {
      if (!this.enabled || this.isPlaying) return;
      this.resume();
      if (!this.ctx || !this.masterGain) return;
      this.isPlaying = true;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this._targetGain(), this.ctx.currentTime + 0.4);
      this._tick();
      this.timer = setInterval(() => this._tick(), 250);
    }

    stop() {
      this.isPlaying = false;
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
      if (this.ctx && this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.35);
      }
    }

    setVolume(value) {
      this.volume = Number(value);
      if (this.masterGain) this.masterGain.gain.value = this.enabled && this.isPlaying ? this._targetGain() : 0;
    }

    setEnabled(enabled, autoplay) {
      this.enabled = Boolean(enabled);
      if (this.enabled && autoplay) this.play();
      else this.stop();
    }

    _tick() {
      if (!this.ctx || !this.isPlaying) return;
      const note = this.sequence[this.step % this.sequence.length];
      const secondsPerBeat = 60 / this.tempo;
      this._scheduleNote(note[0], this.ctx.currentTime, note[1] * secondsPerBeat);
      this.step += 1;
    }

    _scheduleNote(freq, startTime, duration) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.75, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + Math.max(0.08, duration * 0.55));
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.04);
    }

    _targetGain() {
      return this.baseVolume * 5 * this.volume;
    }
  }

  window.EAE.BGMEngine = BGMEngine;
})();
