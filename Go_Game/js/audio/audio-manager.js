window.GoGame = window.GoGame || {};

GoGame.AudioManager = {
  enabled: true,
  currentBGM: null,
  bgmTimer: null,
  bgmStep: 0,
  unlocked: false,

  play(id) {
    const s = GoGame.State.settings();
    if (!s.sound || !this.enabled) return;
    const tone = GoGame.AudioConfig.tones[id] || GoGame.AudioConfig.tones["btn-click"];
    GoGame.AudioSynth.play(
      tone[0],
      tone[1],
      tone[2],
      (s.masterVolume ?? 0.7) * (s.sfxVolume ?? 0.75) * 0.45
    );
  },

  unlock() {
    if (this.unlocked) return;
    GoGame.AudioSynth.unlock();
    this.unlocked = true;
    if (this.currentBGM) this.startLoop(this.currentBGM);
  },

  playBGM(id) {
    this.currentBGM = id;
    if (!this.unlocked) return;
    this.startLoop(id);
  },

  startLoop(id) {
    this.stopLoopOnly();
    const cfg = GoGame.AudioConfig.bgm[id];
    if (!cfg) return;
    this.bgmStep = 0;
    const stepMs = 60000 / cfg.tempo;

    const playStep = () => {
      const s = GoGame.State.settings();
      if (!s.sound || !this.enabled || this.currentBGM !== id) return;
      const c = GoGame.AudioSynth.context();
      const vol = (s.masterVolume ?? 0.7) * (s.musicVolume ?? 0.25);
      const note = cfg.notes[this.bgmStep % cfg.notes.length];
      const bass = cfg.bassNotes[Math.floor(this.bgmStep / 2) % cfg.bassNotes.length];
      GoGame.AudioSynth.scheduleTone(note, (stepMs / 1000) * 0.82, cfg.wave, vol * 0.075, c.currentTime);
      if (this.bgmStep % 2 === 0) {
        GoGame.AudioSynth.scheduleTone(bass, (stepMs / 1000) * 1.7, cfg.bass, vol * 0.055, c.currentTime);
      }
      this.bgmStep++;
      this.bgmTimer = setTimeout(playStep, stepMs);
    };

    playStep();
  },

  stopLoopOnly() {
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  },

  stopBGM() {
    this.currentBGM = null;
    this.stopLoopOnly();
  },

  setMasterVolume(v) {
    GoGame.State.updateSettings({ masterVolume: v });
  },

  setSFXVolume(v) {
    GoGame.State.updateSettings({ sfxVolume: v });
  },

  setMusicVolume(v) {
    GoGame.State.updateSettings({ musicVolume: v });
  },

  toggleMute() {
    const sound = !GoGame.State.settings().sound;
    GoGame.State.updateSettings({ sound });
    if (sound && this.currentBGM) this.playBGM(this.currentBGM);
    else this.stopLoopOnly();
  },
};
