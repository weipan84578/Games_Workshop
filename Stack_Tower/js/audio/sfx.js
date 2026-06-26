(function (window) {
  'use strict';

  const SFX = {
    ctx: null,
    gain: null,
    volume: 0.75,
    muted: false,

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
      this.gain.gain.value = this.muted ? 0 : this.volume;
    },

    tone(freq, duration, options = {}) {
      if (!this.ctx || !this.gain || this.muted || this.volume <= 0) return;
      const now = this.ctx.currentTime + (options.delay || 0);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = options.type || 'sine';
      osc.frequency.setValueAtTime(freq, now);
      if (options.endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, options.endFreq), now + duration);
      }
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(options.level || 0.34, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(this.gain);
      osc.start(now);
      osc.stop(now + duration + 0.03);
    },

    play(name) {
      switch (name) {
        case 'place':
          this.tone(440, 0.12, { endFreq: 880, type: 'triangle', level: 0.24 });
          break;
        case 'perfect':
          [440, 554, 659].forEach((freq, index) => this.tone(freq, 0.3, { delay: index * 0.018, type: 'sine', level: 0.2 }));
          break;
        case 'cut':
          this.tone(800, 0.08, { endFreq: 400, type: 'sawtooth', level: 0.18 });
          break;
        case 'gameover':
          [392, 330, 262].forEach((freq, index) => this.tone(freq, 0.2, { delay: index * 0.18, type: 'triangle', level: 0.22 }));
          break;
        case 'click':
          this.tone(600, 0.06, { type: 'sine', level: 0.16 });
          break;
        case 'combo':
          [523, 659, 784, 1046].forEach((freq, index) => this.tone(freq, 0.08, { delay: index * 0.07, type: 'triangle', level: 0.18 }));
          break;
        default:
          break;
      }
    }
  };

  window.SFX = SFX;
})(window);
