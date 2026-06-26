(function (window) {
  'use strict';

  const BGM = {
    ctx: null,
    gain: null,
    volume: 0.6,
    muted: false,
    timer: null,
    step: 0,
    melody: [261.63, 329.63, 392.0, 523.25, 493.88, 392.0, 329.63, 261.63],

    init(ctx) {
      this.ctx = ctx;
      this.gain = ctx.createGain();
      this.gain.connect(ctx.destination);
      this.applyVolume();
    },

    setVolume(value) {
      this.volume = Helpers.clamp(value / 100, 0, 1);
      this.applyVolume();
    },

    setMuted(muted) {
      this.muted = muted;
      this.applyVolume();
    },

    applyVolume() {
      if (!this.gain) return;
      this.gain.gain.value = this.muted ? 0 : Math.min(this.volume * 5, 1);
    },

    play() {
      if (!this.ctx || this.timer) return;
      this.timer = window.setInterval(() => this.tick(), 250);
      this.tick();
    },

    stop() {
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
    },

    tick() {
      if (!this.ctx || !this.gain || this.muted || this.volume <= 0) {
        this.step = (this.step + 1) % this.melody.length;
        return;
      }
      const freq = this.melody[this.step];
      this.note(freq, 0.2, 0.09, 'triangle');
      if (this.step % 2 === 0) this.note(this.step % 4 === 0 ? 130.81 : 196, 0.18, 0.045, 'sine');
      this.step = (this.step + 1) % this.melody.length;
    },

    note(freq, duration, level, type) {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(level, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(this.gain);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    }
  };

  window.BGM = BGM;
})(window);
