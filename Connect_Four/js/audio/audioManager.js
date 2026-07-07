(function initAudioManager(global) {
  const CF = global.CF || (global.CF = {});
  let audioContext = null;
  let bgmGain = null;
  let sfxGain = null;
  let trackIndex = 0;
  let noteTimer = null;
  let started = false;
  let inGame = false;

  function ensureContext() {
    if (!audioContext) {
      const AudioContext = global.AudioContext || global.webkitAudioContext;
      if (!AudioContext) return null;
      audioContext = new AudioContext();
      bgmGain = audioContext.createGain();
      sfxGain = audioContext.createGain();
      bgmGain.connect(audioContext.destination);
      sfxGain.connect(audioContext.destination);
      applySettings(CF.settingsManager.getSettings());
    }
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  }

  function applySettings(settings) {
    if (!bgmGain || !sfxGain) return;
    const modeBoost = inGame ? settings.bgmBoost : 0.72;
    const safeBgm = settings.bgmMuted ? 0 : CF.helpers.clamp(settings.bgmVolume * modeBoost, 0, 1.6);
    const safeSfx = settings.sfxMuted ? 0 : CF.helpers.clamp(settings.sfxVolume, 0, 1);
    bgmGain.gain.setTargetAtTime(safeBgm * 0.16, audioContext.currentTime, 0.08);
    sfxGain.gain.setTargetAtTime(safeSfx * 0.75, audioContext.currentTime, 0.02);
  }

  function playPianoNote(frequency, duration) {
    if (!audioContext || !bgmGain) return;
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const overtone = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    oscillator.type = "triangle";
    overtone.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    overtone.frequency.setValueAtTime(frequency * 2, now);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.22, now + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(envelope);
    overtone.connect(envelope);
    envelope.connect(bgmGain);
    oscillator.start(now);
    overtone.start(now);
    oscillator.stop(now + duration + 0.03);
    overtone.stop(now + duration + 0.03);
  }

  function scheduleTrack() {
    if (!started || !audioContext) return;
    const settings = CF.settingsManager.getSettings();
    const playlist = CF.bgmPlaylist;
    const track = playlist[trackIndex % playlist.length];
    const beatMs = 60000 / track.bpm;
    let note = 0;

    function step() {
      if (!started) return;
      const frequency = track.notes[note % track.notes.length];
      playPianoNote(frequency, (beatMs / 1000) * 0.72);
      note += 1;
      if (note >= track.notes.length) {
        trackIndex = settings.randomBgm ? Math.floor(Math.random() * playlist.length) : (trackIndex + 1) % playlist.length;
        noteTimer = global.setTimeout(scheduleTrack, beatMs * 1.8);
      } else {
        noteTimer = global.setTimeout(step, beatMs);
      }
    }

    step();
  }

  function startBgm() {
    if (!ensureContext() || started) return;
    started = true;
    scheduleTrack();
  }

  function stopBgm() {
    started = false;
    global.clearTimeout(noteTimer);
  }

  function setMode(nextMode) {
    inGame = nextMode === "game";
    if (audioContext) applySettings(CF.settingsManager.getSettings());
  }

  function playSfx(name) {
    ensureContext();
    CF.sfxPlayer.playSfx(audioContext, sfxGain, name);
  }

  CF.audioManager = { ensureContext, startBgm, stopBgm, setMode, applySettings, playSfx };
})(window);
