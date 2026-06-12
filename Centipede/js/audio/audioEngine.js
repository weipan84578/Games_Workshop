(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};

  class AudioEngine {
    constructor(settings) {
      this.settings = settings;
      this.ctx = null;
      this.masterGain = null;
      this.sfxGain = null;
      this.musicGain = null;
      this.musicFilter = null;
      this.musicTimer = 0;
      this.musicId = "";
      this.musicStep = 0;
      this.musicLevel = 1;
      this.paused = false;
      this.unlocked = false;
      document.addEventListener("visibilitychange", () => {
        if (!this.ctx) {
          return;
        }
        if (document.hidden) {
          this.ctx.suspend();
        } else if (this.unlocked) {
          this.ctx.resume();
        }
      });
    }

    ensure() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
          return false;
        }
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();
        this.musicFilter = this.ctx.createBiquadFilter();
        this.musicFilter.type = "lowpass";
        this.musicFilter.frequency.value = 9000;
        this.sfxGain.connect(this.masterGain);
        this.musicGain.connect(this.musicFilter);
        this.musicFilter.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
        this.applySettings(this.settings);
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      this.unlocked = true;
      return true;
    }

    resumePendingMusic() {
      if (this.musicId && !this.musicTimer) {
        this.startMusic(this.musicId, this.musicLevel);
      }
    }

    applySettings(settings) {
      this.settings = Object.assign({}, this.settings, settings);
      if (!this.ctx) {
        return;
      }
      const musicValue = (this.settings.musicVol || 0) / 100;
      const sfxValue = (this.settings.sfxVol || 0) / 100;
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(0.85, now, 0.02);
      this.musicGain.gain.setTargetAtTime(this.paused ? musicValue * 0.3 : musicValue, now, 0.04);
      this.sfxGain.gain.setTargetAtTime(sfxValue, now, 0.02);
    }

    tone(freq, duration, type, gain, options) {
      if (!this.ensure()) {
        return;
      }
      const opts = options || {};
      const targetGain = opts.music ? (gain || 0.14) : Math.min(0.36, (gain || 0.14) * 1.85);
      const now = this.ctx.currentTime + (opts.delay || 0);
      const osc = this.ctx.createOscillator();
      const amp = this.ctx.createGain();
      osc.type = type || "square";
      osc.frequency.setValueAtTime(freq, now);
      if (opts.to) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.to), now + duration);
      }
      if (opts.detune) {
        osc.detune.setValueAtTime(opts.detune, now);
      }
      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetGain), now + 0.01);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(amp);
      amp.connect(opts.music ? this.musicGain : this.sfxGain);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    noise(duration, gain, filterFreq, options) {
      if (!this.ensure()) {
        return;
      }
      const opts = options || {};
      const targetGain = opts.music ? (gain || 0.1) : Math.min(0.34, (gain || 0.1) * 1.9);
      const sampleRate = this.ctx.sampleRate;
      const buffer = this.ctx.createBuffer(1, Math.max(1, sampleRate * duration), sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = Math.random() * 2 - 1;
      }
      const source = this.ctx.createBufferSource();
      const filter = this.ctx.createBiquadFilter();
      const amp = this.ctx.createGain();
      const now = this.ctx.currentTime + (opts.delay || 0);
      filter.type = opts.type || "bandpass";
      filter.frequency.setValueAtTime(filterFreq || 700, now);
      amp.gain.setValueAtTime(Math.max(0.0001, targetGain), now);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(amp);
      amp.connect(opts.music ? this.musicGain : this.sfxGain);
      source.start(now);
      source.stop(now + duration);
    }

    startMusic(id, level) {
      this.musicId = id;
      this.musicLevel = level || 1;
      this.musicStep = 0;
      if (!this.unlocked || !this.ensure()) {
        return;
      }
      this.stopMusicTimer();
      this.paused = false;
      this.applySettings(this.settings);
      this.scheduleMusicTick();
    }

    stopMusicTimer() {
      if (this.musicTimer) {
        window.clearTimeout(this.musicTimer);
        this.musicTimer = 0;
      }
    }

    stopMusic() {
      this.stopMusicTimer();
      this.musicId = "";
    }

    setPaused(paused) {
      this.paused = paused;
      if (!this.ctx) {
        return;
      }
      const musicValue = (this.settings.musicVol || 0) / 100;
      const now = this.ctx.currentTime;
      this.musicGain.gain.setTargetAtTime(paused ? musicValue * 0.3 : musicValue, now, 0.08);
      this.musicFilter.frequency.setTargetAtTime(paused ? 800 : 9000, now, 0.08);
    }

    scheduleMusicTick() {
      if (!this.musicId) {
        return;
      }
      const id = this.musicId;
      const battleBpm = Math.min(168, 120 + Math.max(0, this.musicLevel - 1) * 6);
      const stepMs = id === "menu_theme" ? 200 : Math.round(60000 / battleBpm / 2);
      this.musicTimer = window.setTimeout(() => {
        this.musicTick();
        this.scheduleMusicTick();
      }, stepMs);
    }

    musicTick() {
      if (!this.ctx || this.paused && this.musicStep % 4 !== 0) {
        this.musicStep += 1;
        return;
      }
      if (this.musicId === "menu_theme") {
        const notes = [196, 247, 294, 247, 196, 330, 294, 247];
        const note = notes[this.musicStep % notes.length];
        this.tone(note, 0.08, "triangle", 0.035, { music: true });
        if (this.musicStep % 4 === 0) {
          this.tone(note / 2, 0.14, "square", 0.028, { music: true });
        }
      } else if (this.musicId === "battle_theme") {
        const bass = [110, 110, 147, 110, 165, 147, 110, 196];
        const lead = [440, 0, 494, 0, 523, 494, 440, 392];
        const idx = this.musicStep % bass.length;
        this.tone(bass[idx], 0.07, "square", 0.04, { music: true });
        if (lead[idx]) {
          this.tone(lead[idx], 0.045, "sawtooth", 0.025, { music: true });
        }
        if (this.musicStep % 2 === 0) {
          this.noise(0.025, 0.015, 3800, { music: true });
        }
      }
      this.musicStep += 1;
    }

    playGameOverJingle() {
      this.stopMusicTimer();
      this.musicId = "gameover_jingle";
      if (!this.ensure()) {
        return;
      }
      const notes = [392, 330, 262, 196];
      notes.forEach((note, index) => {
        this.tone(note, 0.22, "triangle", 0.11, { delay: index * 0.22, to: note * 0.86 });
      });
    }
  }

  Game.AudioEngine = AudioEngine;
})(window);
