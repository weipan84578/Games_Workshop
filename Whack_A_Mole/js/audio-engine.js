(function (app) {
  "use strict";

  class AudioEngine {
    constructor(save) {
      this.save = save;
      this.ctx = null;
      this.masterGain = null;
      this.musicGain = null;
      this.sfxGain = null;
      this.sequenceId = null;
      this.step = 0;
      this.nextNoteTime = 0;
      this.bpm = 120;
      this.pattern = [];
      this.musicMode = null;
    }

    ensure() {
      if (this.ctx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this.applyVolumes();
    }

    applyVolumes() {
      if (!this.ctx) return;
      this.musicGain.gain.value = this.save.data.settings.musicVolume;
      this.sfxGain.gain.value = this.save.data.settings.sfxVolume;
      this.masterGain.gain.value = 0.72;
    }

    resume() {
      this.ensure();
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    }

    buildPattern(level) {
      if (level.home) {
        const root = 196;
        return [
          { step: 0, freq: root, type: "triangle", dur: 1.8, gain: 0.1 },
          { step: 2, freq: root * 1.25, type: "sine", dur: 0.8, gain: 0.12 },
          { step: 4, freq: root * 1.5, type: "sine", dur: 0.8, gain: 0.12 },
          { step: 6, freq: root * 2, type: "triangle", dur: 1.2, gain: 0.1 },
          { step: 8, freq: root * 1.5, type: "sine", dur: 0.8, gain: 0.11 },
          { step: 10, freq: root * 1.25, type: "sine", dur: 0.8, gain: 0.11 },
          { step: 12, freq: root * 0.75, type: "triangle", dur: 1.8, gain: 0.1 },
          { step: 14, freq: root * 1.125, type: "sine", dur: 0.7, gain: 0.09 }
        ];
      }
      const root = 220 * Math.pow(2, (level.id % 5) / 12);
      const scale = level.boss ? [0, 3, 5, 6, 7, 10] : [0, 2, 4, 7, 9, 12];
      return [
        { step: 0, freq: root * 2 ** (scale[0] / 12), type: "triangle", dur: 1.4, gain: 0.12 },
        { step: 2, freq: root * 2 ** (scale[2] / 12), type: "sine", dur: 0.7, gain: 0.16 },
        { step: 4, freq: root * 2 ** (scale[3] / 12), type: "sine", dur: 0.7, gain: 0.16 },
        { step: 6, freq: root * 2 ** (scale[5] / 12), type: level.boss ? "sawtooth" : "sine", dur: 1.2, gain: 0.13 },
        { step: 8, freq: root * 2 ** (scale[3] / 12), type: "sine", dur: 0.7, gain: 0.14 },
        { step: 10, freq: root * 2 ** (scale[1] / 12), type: "sine", dur: 0.7, gain: 0.14 },
        { step: 12, freq: root / 2, type: "triangle", dur: 1.6, gain: 0.13 },
        { step: 14, freq: root * 2 ** (scale[2] / 12), type: "square", dur: 0.45, gain: 0.05 }
      ];
    }

    startMusic(level) {
      this.resume();
      if (!this.ctx) return;
      this.stopMusic();
      this.musicMode = level.home ? "home" : "game";
      this.bpm = level.bpm;
      this.pattern = this.buildPattern(level);
      this.step = 0;
      this.nextNoteTime = this.ctx.currentTime + 0.05;
      this.sequenceId = setInterval(() => this.scheduler(), 25);
    }

    startHomeMusic() {
      this.resume();
      if (!this.ctx || this.musicMode === "home") return;
      this.startMusic({ id: 0, bpm: 88, home: true, boss: false });
    }

    stopMusic() {
      if (this.sequenceId) clearInterval(this.sequenceId);
      this.sequenceId = null;
      this.musicMode = null;
    }

    scheduler() {
      const stepLen = (60 / this.bpm) / 4;
      while (this.nextNoteTime < this.ctx.currentTime + 0.12) {
        this.pattern.forEach(note => {
          if (note.step === this.step) this.note(note.freq, note.type, this.nextNoteTime, note.dur * stepLen, note.gain, this.musicGain);
        });
        this.step = (this.step + 1) % 16;
        this.nextNoteTime += stepLen;
      }
    }

    note(freq, type, start, duration, gainValue, target) {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(20, freq), start);
      gain.gain.setValueAtTime(Math.max(0.001, gainValue), start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain).connect(target);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    }

    noise(duration, start, filterType, freq, gainValue) {
      if (!this.ctx) return;
      const length = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
      const source = this.ctx.createBufferSource();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      source.buffer = buffer;
      filter.type = filterType;
      filter.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(gainValue, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      source.connect(filter).connect(gain).connect(this.sfxGain);
      source.start(start);
    }

    sfx(name) {
      this.resume();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      if (name === "hit") {
        this.note(440, "sine", now, 0.13, 0.38, this.sfxGain);
        this.note(220, "triangle", now + 0.02, 0.12, 0.18, this.sfxGain);
        this.noise(0.045, now, "bandpass", 1300, 0.18);
      } else if (name === "bad") {
        this.note(160, "sawtooth", now, 0.25, 0.28, this.sfxGain);
        this.noise(0.18, now, "lowpass", 420, 0.22);
      } else if (name === "power") {
        [523, 659, 784, 1046].forEach((f, i) => this.note(f, "sine", now + i * 0.045, 0.16, 0.2, this.sfxGain));
      } else if (name === "miss") {
        this.note(260, "square", now, 0.12, 0.16, this.sfxGain);
      } else if (name === "boss") {
        this.note(70, "sine", now, 0.55, 0.45, this.sfxGain);
        this.noise(0.35, now, "lowpass", 780, 0.26);
      } else if (name === "win") {
        [392, 523, 659, 784, 1046].forEach((f, i) => this.note(f, "triangle", now + i * 0.07, 0.22, 0.22, this.sfxGain));
      }
    }
  }

  app.AudioEngine = AudioEngine;
})(window.MoleMayhem = window.MoleMayhem || {});
