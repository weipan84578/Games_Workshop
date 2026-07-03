(function () {
  window.SicBo = window.SicBo || {};

  const BASE_BGM_VOLUME = 0.08;
  const DEFAULT_SFX_VOLUME = 0.6;
  const NOTE_INTERVAL_MS = 360;

  function createAudioManager() {
    let audioContext = null;
    let compressor = null;
    let bgmGain = null;
    let sfxGain = null;
    let bgmTimer = null;
    let currentThemeIndex = 0;
    let noteIndex = 0;
    let bgmVolume = BASE_BGM_VOLUME;
    let sfxVolume = DEFAULT_SFX_VOLUME;
    let mode = "menu";
    let started = false;

    function ensureContext() {
      if (!audioContext) {
        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) return null;
        audioContext = new AudioContextCtor();
        compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.value = -18;
        compressor.knee.value = 24;
        compressor.ratio.value = 8;
        compressor.attack.value = 0.004;
        compressor.release.value = 0.18;

        bgmGain = audioContext.createGain();
        sfxGain = audioContext.createGain();
        bgmGain.connect(compressor);
        sfxGain.connect(compressor);
        compressor.connect(audioContext.destination);
        updateGains();
      }
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      return audioContext;
    }

    function effectiveBGMVolume() {
      if (mode !== "game") return bgmVolume;
      const amplified = bgmVolume * 10;
      if (amplified > 1) {
        console.info("SicBo BGM gain clamped to 1.0 to avoid browser volume clipping.");
      }
      return Math.min(amplified, 1);
    }

    function updateGains() {
      if (!bgmGain || !sfxGain) return;
      bgmGain.gain.value = effectiveBGMVolume();
      sfxGain.gain.value = sfxVolume;
    }

    function playTone(frequency, duration, gain, destination, delay) {
      const context = ensureContext();
      if (!context || !destination) return;
      const startAt = context.currentTime + (delay || 0);
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, startAt);
      envelope.gain.setValueAtTime(0.0001, startAt);
      envelope.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), startAt + 0.012);
      envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      oscillator.connect(envelope);
      envelope.connect(destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.02);
    }

    function playBGMNote() {
      const playlist = window.SicBo.BGMPlaylist[currentThemeIndex % window.SicBo.BGMPlaylist.length];
      const frequency = playlist.notes[noteIndex % playlist.notes.length];
      noteIndex += 1;
      playTone(frequency, 0.26, 0.18, bgmGain, 0);
      playTone(frequency * 2, 0.09, 0.05, bgmGain, 0.014);
      if (noteIndex % playlist.notes.length === 0) {
        currentThemeIndex = (currentThemeIndex + 1) % window.SicBo.BGMPlaylist.length;
      }
    }

    function startBGM() {
      ensureContext();
      if (bgmTimer) return;
      started = true;
      playBGMNote();
      bgmTimer = window.setInterval(playBGMNote, NOTE_INTERVAL_MS);
    }

    function stopBGM() {
      if (bgmTimer) {
        window.clearInterval(bgmTimer);
        bgmTimer = null;
      }
    }

    function playSFX(id) {
      const def = window.SicBo.SFXMap[id];
      if (!def) return;
      ensureContext();
      def.notes.forEach(function (frequency, index) {
        playTone(frequency, def.duration, def.gain, sfxGain, index * def.duration * 0.74);
      });
    }

    return {
      BASE_BGM_VOLUME: BASE_BGM_VOLUME,
      ensureContext: ensureContext,
      playBGM: startBGM,
      playSFX: playSFX,
      setBGMVolume: function (value) {
        bgmVolume = Math.max(0, Math.min(1, Number(value)));
        updateGains();
      },
      setMode: function (nextMode) {
        mode = nextMode === "game" ? "game" : "menu";
        updateGains();
        if (started) startBGM();
      },
      setSFXVolume: function (value) {
        sfxVolume = Math.max(0, Math.min(1, Number(value)));
        updateGains();
      },
      stopBGM: stopBGM
    };
  }

  window.SicBo.AudioManager = {
    BASE_BGM_VOLUME: BASE_BGM_VOLUME,
    DEFAULT_SFX_VOLUME: DEFAULT_SFX_VOLUME,
    create: createAudioManager
  };
})();
