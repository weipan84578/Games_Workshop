class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicTimer = null;
    this.settings = SaveSystem.load().settings;
  }
  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    const compressor = this.ctx.createDynamicsCompressor();
    this.musicGain.connect(compressor);
    this.sfxGain.connect(compressor);
    compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
    this.applySettings(this.settings);
  }
  applySettings(settings) {
    this.settings = settings;
    if (!this.ctx) return;
    this.masterGain.gain.value = settings.masterVolume;
    this.musicGain.gain.value = settings.musicVolume;
    this.sfxGain.gain.value = settings.sfxVolume;
  }
  beep(freq, duration, volume = .35, type = 'sine', target = 'sfx') {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + duration);
    osc.connect(gain);
    gain.connect(target === 'music' ? this.musicGain : this.sfxGain);
    osc.start(now);
    osc.stop(now + duration + .02);
  }
  noise(duration = .2, cutoff = 1000, volume = .4) {
    if (!this.ctx) return;
    const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + duration);
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    source.start();
  }
  sfx(id) {
    if (!this.ctx) return;
    const map = {
      collect: () => { this.beep(440, .08); this.beep(880, .16, .28); },
      plant: () => { this.beep(600, .08, .25, 'triangle'); this.beep(420, .12, .18, 'triangle'); },
      shoot: () => this.noise(.05, 1600, .12),
      hit: () => this.noise(.08, 900, .18),
      freeze: () => { this.beep(800, .12, .2, 'sine'); this.beep(400, .2, .16, 'triangle'); },
      boom: () => this.noise(.75, 600, .65),
      bite: () => this.noise(.09, 350, .2),
      die: () => { this.beep(300, .12, .22, 'sawtooth'); this.beep(160, .22, .18, 'sawtooth'); },
      wave: () => { this.beep(220, .12, .25, 'square'); this.beep(440, .2, .22, 'square'); },
      click: () => this.beep(880, .05, .18, 'square'),
      mower: () => this.noise(.55, 450, .5)
    };
    (map[id] || map.click)();
  }
  startMusic(mode) {
    this.stopMusic();
    if (!this.ctx) return;
    const menu = [523, 659, 784, 659, 880, 784, 698, 659, 587, 523];
    const battle = [196, 196, 262, 233, 196, 294, 262, 233, 220, 196, 330, 294];
    const notes = mode === 'battle' ? battle : menu;
    let i = 0;
    const play = () => {
      if (!this.ctx) return;
      const n = notes[i++ % notes.length];
      this.beep(n, mode === 'battle' ? .16 : .22, mode === 'battle' ? .09 : .07, mode === 'battle' ? 'sawtooth' : 'triangle', 'music');
      if (mode === 'battle' && i % 4 === 0) this.beep(98, .08, .08, 'square', 'music');
    };
    play();
    this.musicTimer = setInterval(play, mode === 'battle' ? 230 : 300);
  }
  stopMusic() {
    clearInterval(this.musicTimer);
    this.musicTimer = null;
  }
}

const audio = new AudioEngine();

