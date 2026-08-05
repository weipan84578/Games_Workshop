import { GAME_BGM_GAIN_MULTIPLIER, MAX_SAFE_GAIN } from "../utils/constants.js";
import { clamp } from "../utils/helpers.js";
import { SOUND_LIBRARY } from "./soundLibrary.js";

export function calculateBgmGain(userVolume, inGame = false) {
  const multiplier = inGame ? GAME_BGM_GAIN_MULTIPLIER : 1;
  return Math.min(clamp(Number(userVolume) || 0, 0, 1) * multiplier, MAX_SAFE_GAIN);
}

function createMelodyBuffer(context, trackIndex) {
  const sampleRate = context.sampleRate || 44100;
  const duration = 8;
  const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
  const channel = buffer.getChannelData(0);
  const melodies = [
    [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23],
    [392, 493.88, 587.33, 493.88, 349.23, 440, 523.25, 440],
    [329.63, 392, 493.88, 392, 261.63, 329.63, 392, 523.25],
    [440, 523.25, 659.25, 523.25, 392, 493.88, 587.33, 493.88],
  ];
  const notes = melodies[trackIndex % melodies.length];
  const noteLength = duration / notes.length;
  for (let i = 0; i < channel.length; i += 1) {
    const time = i / sampleRate;
    const noteIndex = Math.floor(time / noteLength) % notes.length;
    const noteTime = time % noteLength;
    const envelope = Math.min(1, noteTime * 30) * Math.min(1, (noteLength - noteTime) * 4);
    const frequency = notes[noteIndex];
    // Keep the melody synthesized so the game remains completely offline.
    channel[i] = (Math.sin(time * frequency * Math.PI * 2) * 0.13 + Math.sin(time * frequency * 2 * Math.PI * 2) * 0.04) * envelope;
  }
  return buffer;
}

export function createAudioManager({ audioContextFactory } = {}) {
  let context;
  let bgmGain;
  let sfxGain;
  let compressor;
  let source;
  let userBgmVolume = 0.5;
  let userSfxVolume = 0.7;
  let inGame = false;
  let trackIndex = 0;
  let currentScreen = null;
  let bgmWanted = false;
  let bgmStartPromise = null;

  function ensureContext() {
    if (context) return context;
    const Factory = audioContextFactory || globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Factory) return null;
    context = new Factory();
    bgmGain = context.createGain();
    sfxGain = context.createGain();
    compressor = context.createDynamicsCompressor();
    bgmGain.connect(compressor).connect(context.destination);
    sfxGain.connect(context.destination);
    applyVolumes();
    return context;
  }

  function applyVolumes() {
    if (!context) return;
    const now = context.currentTime;
    bgmGain?.gain.setTargetAtTime(calculateBgmGain(userBgmVolume, inGame), now, 0.05);
    sfxGain?.gain.setTargetAtTime(clamp(userSfxVolume), now, 0.05);
  }

  async function unlock() {
    const audioContext = ensureContext();
    if (!audioContext) return null;
    if (audioContext.state === "suspended") {
      try {
        await audioContext.resume();
      } catch {
        // Browsers can reject autoplay before the first user gesture.
        return null;
      }
    }
    return audioContext;
  }

  function stopBgm() {
    bgmWanted = false;
    if (!source) return;
    try {
      source.stop();
      source.disconnect();
    } catch {
      // The source may already have ended.
    }
    source = null;
  }

  async function playBgm() {
    bgmWanted = true;
    if (source) return true;
    if (bgmStartPromise) return bgmStartPromise;

    // Serialise starts so a menu transition cannot create two overlapping tracks.
    bgmStartPromise = (async () => {
      const audioContext = await unlock();
      if (!audioContext || !bgmWanted || source) return false;
      const bufferSource = audioContext.createBufferSource();
      bufferSource.buffer = createMelodyBuffer(audioContext, trackIndex);
      bufferSource.loop = true;
      bufferSource.connect(bgmGain);
      bufferSource.start();
      bufferSource.onended = () => {
        if (source === bufferSource) source = null;
      };
      source = bufferSource;
      trackIndex = (trackIndex + 1) % SOUND_LIBRARY.bgm.length;
      return true;
    })()
      .catch(() => false)
      .finally(() => {
        bgmStartPromise = null;
      });

    return bgmStartPromise;
  }

  function setScreen(screen) {
    if (currentScreen !== null && currentScreen !== screen) stopBgm();
    currentScreen = screen;
    inGame = screen === "game";
    if (context) applyVolumes();
  }

  function setBgmVolume(value) {
    userBgmVolume = clamp(Number(value) || 0);
    if (context) applyVolumes();
  }

  function setSfxVolume(value) {
    userSfxVolume = clamp(Number(value) || 0);
    if (context) applyVolumes();
  }

  async function playSfx(name) {
    const definition = SOUND_LIBRARY.sfx[name];
    if (!definition) return false;
    let audioContext;
    try {
      audioContext = await unlock();
    } catch {
      return false;
    }
    if (!definition || !audioContext) return false;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = audioContext.currentTime;
    oscillator.type = definition.type;
    oscillator.frequency.setValueAtTime(definition.frequency, start);
    if (definition.sweep) oscillator.frequency.linearRampToValueAtTime(definition.frequency + definition.sweep, start + definition.duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.22, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + definition.duration);
    oscillator.connect(gain).connect(sfxGain);
    oscillator.start(start);
    oscillator.stop(start + definition.duration + 0.02);
    return true;
  }

  return {
    unlock,
    playBgm,
    stopBgm,
    playSfx,
    setScreen,
    setBgmVolume,
    setSfxVolume,
    getState: () => ({ userBgmVolume, userSfxVolume, inGame, trackIndex, currentScreen, hasContext: Boolean(context) }),
  };
}
