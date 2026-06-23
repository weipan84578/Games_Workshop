(function (global) {
  const BG = global.Backgammon || (global.Backgammon = {});

  BG.AudioEngine = {
    context: null,
    masterGain: null,
    bgmGain: null,
    sfxGain: null,
    bgmTimers: [],
    isBgmPlaying: false,
    enabled: true,
    unlocked: false,

    init(settings) {
      this.enabled = settings ? settings.soundEnabled !== false : true;
      if (!this.context) {
        const AudioContextClass = global.AudioContext || global.webkitAudioContext;
        if (!AudioContextClass) return;
        this.context = new AudioContextClass();
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        this.bgmGain = this.context.createGain();
        this.bgmGain.connect(this.masterGain);
        this.sfxGain = this.context.createGain();
        this.sfxGain.connect(this.masterGain);
      }
      this.setBgmVolume(settings ? settings.bgmVolume : 0.75);
      this.setSfxVolume(settings ? settings.sfxVolume : 1);
    },

    unlock(settings) {
      if (!this.enabled) return;
      this.init(settings || (BG.GameState && BG.GameState.settings));
      if (!this.context) return;
      if (this.context.state === "suspended") this.context.resume();
      this.unlocked = true;
      this.startBgm();
    },

    setEnabled(value) {
      this.enabled = Boolean(value);
      if (!this.enabled) this.stopBgm();
      if (this.masterGain) this.masterGain.gain.value = this.enabled ? 1 : 0;
    },

    setBgmVolume(value) {
      if (!this.bgmGain) return;
      this.bgmGain.gain.value = BG.clamp(Number(value) || 0, 0, 1) * 5;
    },

    setSfxVolume(value) {
      if (!this.sfxGain) return;
      this.sfxGain.gain.value = BG.clamp(Number(value) || 0, 0, 1);
    },

    playNote(frequency, duration, type, gain, destination) {
      if (!this.enabled || !this.context || !this.unlocked) return;
      const now = this.context.currentTime;
      const osc = this.context.createOscillator();
      const gainNode = this.context.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(frequency, now);
      gainNode.gain.setValueAtTime(gain || 0.35, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gainNode);
      gainNode.connect(destination || this.sfxGain);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    },

    playSfx(name) {
      if (!this.enabled) return;
      const map = {
        dice_roll: () => this.playRapid([1046, 1175, 1319, 1568], 0.045),
        dice_land: () => this.playNote(1568, 0.1, "triangle", 0.55),
        piece_move: () => this.playNote(880, 0.08, "triangle", 0.38),
        piece_hit: () => this.playNote(1319, 0.15, "square", 0.28),
        bear_off: () => this.playRapid([1046, 1319, 1568], 0.08),
        turn_start: () => this.playNote(698, 0.1, "sine", 0.35),
        win: () => this.playChord([523, 659, 784], 1.1),
        lose: () => this.playRapid([392, 330, 262], 0.2),
        no_moves: () => this.playNote(220, 0.2, "sine", 0.3),
        btn_click: () => this.playNote(1319, 0.06, "triangle", 0.24),
        double: () => this.playChord([1046, 1319], 0.3),
      };
      if (map[name]) map[name]();
    },

    playRapid(frequencies, duration) {
      if (!this.context) return;
      frequencies.forEach((frequency, index) => {
        const timer = global.setTimeout(() => this.playNote(frequency, duration, "triangle", 0.32), index * duration * 700);
        this.bgmTimers.push(timer);
      });
    },

    playChord(frequencies, duration) {
      frequencies.forEach((frequency) => this.playNote(frequency, duration, "triangle", 0.24));
    },

    startBgm() {
      if (!this.enabled || !this.context || this.isBgmPlaying) return;
      this.isBgmPlaying = true;
      const melody = [
        [523.25, 0.3], [659.25, 0.3], [783.99, 0.3], [659.25, 0.3],
        [587.33, 0.3], [349.23, 0.3], [440, 0.3], [349.23, 0.3],
        [523.25, 0.6], [392, 0.6], [659.25, 0.3], [587.33, 0.3], [523.25, 0.6],
      ];

      const schedule = () => {
        if (!this.isBgmPlaying || !this.context) return;
        let start = this.context.currentTime + 0.05;
        melody.forEach(([frequency, duration]) => {
          const osc = this.context.createOscillator();
          const gainNode = this.context.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(frequency, start);
          gainNode.gain.setValueAtTime(0.045, start);
          gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration * 0.92);
          osc.connect(gainNode);
          gainNode.connect(this.bgmGain);
          osc.start(start);
          osc.stop(start + duration);
          start += duration;
        });
        const total = melody.reduce((sum, note) => sum + note[1], 0);
        this.bgmTimers.push(global.setTimeout(schedule, total * 1000 - 80));
      };
      schedule();
    },

    stopBgm() {
      this.isBgmPlaying = false;
      this.bgmTimers.forEach((timer) => global.clearTimeout(timer));
      this.bgmTimers = [];
    },
  };
})(window);
