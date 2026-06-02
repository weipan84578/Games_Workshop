import { BGMPlayer } from "./BGMPlayer.js";

const SFX = {
  keyCorrect: [660, 0.05, "sine"],
  keyWrong: [130, 0.11, "sawtooth"],
  wordComplete: [880, 0.12, "triangle"],
  combo: [1046, 0.18, "square"],
  comboBreak: [98, 0.18, "sawtooth"],
  levelUp: [1174, 0.16, "triangle"],
  countdown: [440, 0.09, "sine"],
  gameStart: [784, 0.22, "triangle"],
  gameOver: [165, 0.3, "sawtooth"],
  newRecord: [1318, 0.32, "triangle"],
  buttonClick: [520, 0.06, "square"],
  buttonHover: [390, 0.04, "sine"],
  screenIn: [300, 0.08, "triangle"],
  screenOut: [220, 0.08, "triangle"],
};

export class AudioManager {
  constructor(state) {
    this.state = state;
    this.context = null;
    this.unlocked = false;
    this.muted = false;
    this.lastScreenName = "menu";
    this.lastDifficulty = this.state.getSettings().difficulty;
    this.bgm = new BGMPlayer(() => this.context, () => this.bgmVolume());
  }

  initGestureUnlock() {
    const unlock = () => {
      this.ensureContext();
      if (this.context?.state === "suspended") {
        this.context.resume().catch(() => {});
      }
      this.unlocked = true;
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
  }

  ensureContext() {
    if (!this.context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      this.context = new AudioContextClass();
    }
    return this.context;
  }

  refreshSettings() {
    if (this.muted) return;
    this.bgm.playStep();
  }

  masterVolume() {
    return this.muted ? 0 : this.state.getSettings().masterVolume / 100;
  }

  bgmVolume() {
    const settings = this.state.getSettings();
    return this.masterVolume() * (settings.bgmVolume / 100);
  }

  sfxVolume() {
    const settings = this.state.getSettings();
    return this.masterVolume() * (settings.sfxVolume / 100);
  }

  playBgm(screenName, difficulty) {
    this.lastScreenName = screenName;
    this.lastDifficulty = difficulty;
    const settings = this.state.getSettings();
    if (this.muted) {
      this.bgm.stop();
      return;
    }
    if (!settings.persistBGM && screenName !== "game") {
      this.bgm.stop();
      return;
    }
    if (!this.unlocked) return;
    this.bgm.start(screenName, difficulty);
  }

  stopBgm() {
    this.bgm.stop();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBgm();
    } else {
      this.playBgm(this.lastScreenName, this.lastDifficulty);
    }
  }

  playSfx(name) {
    const [frequency, duration, type] = SFX[name] ?? SFX.buttonClick;
    const volume = this.sfxVolume();
    if (!this.unlocked || volume <= 0) return;
    const context = this.ensureContext();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(volume * 0.18, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration + 0.02);
  }
}
