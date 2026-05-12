class AudioController {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.musicTimers = [];
    this.currentMusic = "menu";
    this.musicStep = 0;
    this.noiseBuffer = null;
  }

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      if (this.musicTimers.length === 0) this.playMusic(this.currentMusic);
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
    this.playMusic("menu");
  }

  setSettings(settings) {
    this.settings = settings;
  }

  volume(kind) {
    if (this.settings.muted) return 0;
    const value = kind === "music" ? this.settings.musicVolume : this.settings.sfxVolume;
    return Math.max(0, Math.min(1, value / 100));
  }

  tone(freq, duration, type = "square", gain = 0.08) {
    if (!this.ctx || this.settings.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    amp.gain.setValueAtTime(gain * this.volume("sfx"), now);
    amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(amp).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  sfx(id) {
    if (id === "gun") {
      this.gunshot();
      return;
    }
    if (id === "help") {
      this.helpVoice();
      return;
    }
    const map = {
      hit: [95, 0.09, "square", 0.12],
      head: [620, 0.08, "triangle", 0.12],
      hostage: [260, 0.28, "sine", 0.14],
      miss: [120, 0.07, "triangle", 0.08],
      empty: [70, 0.08, "square", 0.09],
      reload: [360, 0.1, "triangle", 0.1],
      attack: [55, 0.18, "sawtooth", 0.15],
      clear: [760, 0.18, "triangle", 0.15],
      over: [85, 0.38, "sawtooth", 0.14],
      combo: [880, 0.12, "sine", 0.13]
    };
    this.tone(...(map[id] || map.hit));
  }

  playMusic(id) {
    this.currentMusic = id;
    if (!this.ctx) return;
    this.stopMusic();
    this.musicStep = 0;
    this.musicTimers.push(window.setInterval(() => this.playMusicStep(id), this.musicTempo(id)));
    this.musicTimers.push(window.setInterval(() => this.playMusicDrone(id), 2200));
    this.playMusicStep(id);
    this.playMusicDrone(id);
  }

  stopMusic() {
    this.musicTimers.forEach((timer) => window.clearInterval(timer));
    this.musicTimers = [];
  }

  musicTempo(id) {
    if (id === "menu") return 300;
    if (id === "result") return 460;
    if (id === "stage5") return 230;
    if (id === "endless") return 210;
    return 255;
  }

  playMusicStep(id) {
    if (!this.ctx || this.settings.muted) return;
    const now = this.ctx.currentTime;
    const volume = this.volume("music");
    const root = this.musicRoot(id);
    const bassPattern = [0, 0, 3, 0, 6, 0, 5, 3];
    const leadPattern = [12, 15, 12, 18, 17, 15, 13, 15];
    const step = this.musicStep % 8;

    this.note(this.pitch(root, bassPattern[step]), 0.16, "sawtooth", 0.07 * volume, now);
    if (step % 2 === 0) this.noiseHit(0.045, 0.045 * volume, 900, 3200, now);
    if (id !== "menu" || step % 4 === 0) {
      this.note(this.pitch(root, leadPattern[step]), 0.1, "square", 0.04 * volume, now + 0.025);
    }
    if (step === 7 && id !== "result") this.riser(now, volume);
    this.musicStep += 1;
  }

  playMusicDrone(id) {
    if (!this.ctx || this.settings.muted) return;
    const now = this.ctx.currentTime;
    const volume = this.volume("music");
    const root = this.musicRoot(id);
    this.note(this.pitch(root, -12), 1.8, "triangle", 0.06 * volume, now);
    this.note(this.pitch(root, -5), 1.7, "sine", 0.034 * volume, now + 0.05);
  }

  musicRoot(id) {
    const roots = {
      menu: 110,
      stage1: 130.81,
      stage2: 146.83,
      stage3: 116.54,
      stage4: 103.83,
      stage5: 98,
      endless: 138.59,
      result: 164.81
    };
    return roots[id] || 55;
  }

  pitch(root, semitone) {
    return root * Math.pow(2, semitone / 12);
  }

  note(freq, duration, type, gain, startAt) {
    if (!this.ctx || gain <= 0) return;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startAt);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(type === "square" ? 1800 : 520, startAt);
    amp.gain.setValueAtTime(0.0001, startAt);
    amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), startAt + 0.018);
    amp.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.connect(filter).connect(amp).connect(this.ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.04);
  }

  riser(startAt, volume) {
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, startAt);
    osc.frequency.exponentialRampToValueAtTime(520, startAt + 0.26);
    amp.gain.setValueAtTime(0.0001, startAt);
    amp.gain.exponentialRampToValueAtTime(0.018 * volume, startAt + 0.08);
    amp.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.28);
    osc.connect(amp).connect(this.ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + 0.32);
  }

  gunshot() {
    if (!this.ctx || this.settings.muted) return;
    const now = this.ctx.currentTime;
    const volume = this.volume("sfx");
    this.noiseHit(0.12, 0.42 * volume, 260, 7200, now);
    this.noiseHit(0.18, 0.12 * volume, 90, 1100, now + 0.018);
    this.gunThump(now, volume);
    this.gunCrack(now, volume);
  }

  helpVoice() {
    if (!this.ctx || this.settings.muted) return;
    const now = this.ctx.currentTime;
    const volume = this.volume("sfx");
    this.voiceSyllable(420, 620, 0.18, 0.26 * volume, now);
    this.voiceSyllable(520, 760, 0.16, 0.22 * volume, now + 0.16);
    this.voiceSyllable(760, 500, 0.32, 0.28 * volume, now + 0.31);
    this.noiseHit(0.08, 0.04 * volume, 700, 1900, now + 0.05);
  }

  voiceSyllable(startFreq, endFreq, duration, gain, startAt) {
    const osc = this.ctx.createOscillator();
    const formant = this.ctx.createBiquadFilter();
    const amp = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(startFreq, startAt);
    osc.frequency.linearRampToValueAtTime(endFreq, startAt + duration * 0.55);
    osc.frequency.linearRampToValueAtTime(endFreq * 0.92, startAt + duration);
    formant.type = "bandpass";
    formant.frequency.setValueAtTime(950, startAt);
    formant.frequency.linearRampToValueAtTime(1350, startAt + duration);
    formant.Q.setValueAtTime(7, startAt);
    amp.gain.setValueAtTime(0.0001, startAt);
    amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), startAt + 0.035);
    amp.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.connect(formant).connect(amp).connect(this.ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.03);
  }

  gunThump(startAt, volume) {
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(95, startAt);
    osc.frequency.exponentialRampToValueAtTime(38, startAt + 0.16);
    amp.gain.setValueAtTime(0.32 * volume, startAt);
    amp.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.18);
    osc.connect(amp).connect(this.ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + 0.2);
  }

  gunCrack(startAt, volume) {
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = "square";
    osc.frequency.setValueAtTime(1700, startAt);
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1200, startAt);
    amp.gain.setValueAtTime(0.18 * volume, startAt);
    amp.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.035);
    osc.connect(filter).connect(amp).connect(this.ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + 0.045);
  }

  noiseHit(duration, gain, lowFreq, highFreq, startAt) {
    if (!this.ctx || gain <= 0) return;
    const source = this.ctx.createBufferSource();
    const band = this.ctx.createBiquadFilter();
    const high = this.ctx.createBiquadFilter();
    const amp = this.ctx.createGain();
    source.buffer = this.getNoiseBuffer();
    band.type = "bandpass";
    band.frequency.setValueAtTime(highFreq, startAt);
    band.Q.setValueAtTime(0.8, startAt);
    high.type = "highpass";
    high.frequency.setValueAtTime(lowFreq, startAt);
    amp.gain.setValueAtTime(Math.max(0.0001, gain), startAt);
    amp.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    source.connect(high).connect(band).connect(amp).connect(this.ctx.destination);
    source.start(startAt);
    source.stop(startAt + duration);
  }

  getNoiseBuffer() {
    if (this.noiseBuffer) return this.noiseBuffer;
    const length = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }
}
