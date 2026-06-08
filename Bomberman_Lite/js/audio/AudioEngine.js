(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class AudioEngine {
    constructor(settings) {
      this.settings = settings || root.SaveManager.getSettings();
      this.ctx = null;
      this.masterGain = null;
      this.sfxBus = null;
      this.bgmBus = null;
      this.ready = false;
    }

    unlock() {
      if (this.ready) {
        if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
        return;
      }
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.sfxBus = this.ctx.createGain();
      this.bgmBus = this.ctx.createGain();
      this.sfxBus.connect(this.masterGain);
      this.bgmBus.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this.ready = true;
      this.applySettings(this.settings);
    }

    applySettings(settings) {
      this.settings = Object.assign({}, this.settings, settings);
      if (!this.ready) return;
      this.masterGain.gain.value = 0.9;
      this.sfxBus.gain.value = (this.settings.sfxVolume || 0) / 100;
      this.bgmBus.gain.value = (this.settings.bgmVolume || 0) / 100;
    }

    play(name) {
      if (!this.ready) return;
      root.SoundEffects.play(name, this);
    }

    tone(freq, duration, options) {
      if (!this.ready || !freq) return;
      const opts = options || {};
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = opts.type || "square";
      osc.frequency.setValueAtTime(freq, now);
      if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.slideTo), now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(opts.gain || 0.08, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(opts.bus === "bgm" ? this.bgmBus : this.sfxBus);
      osc.start(now);
      osc.stop(now + duration + 0.03);
    }

    noise(duration, options) {
      if (!this.ready) return;
      const opts = options || {};
      const size = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
      const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < size; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 2);
      }
      const source = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const now = this.ctx.currentTime;
      source.buffer = buffer;
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(opts.lowpass || 800, now);
      gain.gain.setValueAtTime(opts.gain || 0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxBus);
      source.start(now);
      source.stop(now + duration + 0.02);
    }
  }

  root.AudioEngine = AudioEngine;
}());
