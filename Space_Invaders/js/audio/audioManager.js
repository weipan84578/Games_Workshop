/* js/audio/audioManager.js */
(function() {
  let audioCtx = null;
  let musicGainNode = null;
  let sfxGainNode = null;
  let noiseBuffer = null;

  // Music sequencer handles
  let currentTrackName = null;
  let musicIntervalId = null;

  // Settings states (0 to 1)
  let musicVolume = 0.5;
  let sfxVolume = 0.5;
  let isMuted = false;

  // UFO flying sound handle
  let ufoSource = null;

  // Helper to generate retro noise buffer (for explosions)
  function createNoiseBuffer() {
    if (!audioCtx) return null;
    const bufferSize = audioCtx.sampleRate * 1.5; // 1.5 seconds of noise
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Synthesize a single basic note
  function playSynthNote(freq, startTime, duration, type = 'square', maxVol = 0.1) {
    if (!audioCtx || isMuted) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      // Volume envelope (ADSR)
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(maxVol * musicVolume, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(musicGainNode);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch(e) {
      console.warn("Failed to play synth note:", e);
    }
  }

  // Sequencer loop functions
  function stopMusicSequencer() {
    if (musicIntervalId) {
      clearInterval(musicIntervalId);
      musicIntervalId = null;
    }
  }

  function startMenuMusic() {
    stopMusicSequencer();
    let step = 0;
    // Classic 8-bit minor key arpeggio loop for tension and style
    const notes = [
      110.00, 164.81, 220.00, 261.63, 329.63, 261.63, 220.00, 164.81, // Am (A2 to E4)
      116.54, 174.61, 233.08, 277.18, 349.23, 277.18, 233.08, 174.61, // A#m (A#2 to F4)
      123.47, 185.00, 246.94, 293.66, 369.99, 293.66, 246.94, 185.00, // Bm (B2 to F#4)
      116.54, 174.61, 233.08, 277.18, 349.23, 277.18, 233.08, 174.61  // Bb/A#
    ];
    
    const interval = 160; // ms
    musicIntervalId = setInterval(() => {
      if (!audioCtx || isMuted || musicVolume <= 0) return;
      const now = audioCtx.currentTime;
      const freq = notes[step % notes.length];
      playSynthNote(freq, now, 0.14, 'triangle', 0.15);
      step++;
    }, interval);
  }

  function startBossMusic() {
    stopMusicSequencer();
    let step = 0;
    // Heavy metal style rapid 8-bit bassline
    const bass = [
      82.41, 82.41, 164.81, 82.41, 98.00, 98.00, 196.00, 98.00,
      110.00, 110.00, 220.00, 110.00, 104.82, 104.82, 209.64, 104.82
    ];
    const interval = 120; // fast
    musicIntervalId = setInterval(() => {
      if (!audioCtx || isMuted || musicVolume <= 0) return;
      const now = audioCtx.currentTime;
      const freq = bass[step % bass.length];
      playSynthNote(freq, now, 0.1, 'sawtooth', 0.12);
      step++;
    }, interval);
  }

  function startGameoverMusic() {
    stopMusicSequencer();
    let step = 0;
    const melody = [
      220.00, 207.65, 196.00, 185.00, 174.61, 164.81, 155.56, 146.83
    ];
    const interval = 320;
    musicIntervalId = setInterval(() => {
      if (!audioCtx || isMuted || musicVolume <= 0) return;
      const now = audioCtx.currentTime;
      const freq = melody[step % melody.length];
      playSynthNote(freq, now, 0.28, 'sine', 0.2);
      step++;
    }, interval);
  }

  window.AudioManager = {
    // Initialize Web Audio Context (requires interaction gesture)
    init: function() {
      if (audioCtx) return;
      
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
        
        musicGainNode = audioCtx.createGain();
        sfxGainNode = audioCtx.createGain();
        
        musicGainNode.connect(audioCtx.destination);
        sfxGainNode.connect(audioCtx.destination);
        
        noiseBuffer = createNoiseBuffer();
        
        // Sync volume
        this.updateVolumes();
        
        console.log("Web Audio Context synthesized successfully.");
      } catch (e) {
        console.error("Web Audio API not supported", e);
      }
    },

    resumeContext: function() {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    },

    // 1. MUSIC CONTROL (BGM)
    playMusic: function(trackName, opts = {}) {
      this.init();
      this.resumeContext();
      
      if (!audioCtx) return;
      if (currentTrackName === trackName) return; // Keep playing
      
      currentTrackName = trackName;
      
      if (trackName === 'menu-theme') {
        startMenuMusic();
      } else if (trackName === 'boss-theme') {
        startBossMusic();
      } else if (trackName === 'gameover-theme') {
        startGameoverMusic();
      } else if (trackName === 'gameplay-theme') {
        // Gameplay uses invader-move-1 to 4 steps as its core theme
        // So we mute or stop the background melodic synth tracks
        stopMusicSequencer();
      } else {
        stopMusicSequencer();
      }
    },

    stopMusic: function() {
      currentTrackName = null;
      stopMusicSequencer();
    },

    // 2. SFX CONTROL (Sound Effects)
    playSfx: function(sfxName) {
      this.init();
      this.resumeContext();
      if (!audioCtx || isMuted || sfxVolume <= 0) return;

      const now = audioCtx.currentTime;

      try {
        if (sfxName === 'shoot') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
          
          gain.gain.setValueAtTime(0.2 * sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
          
          osc.connect(gain);
          gain.connect(sfxGainNode);
          osc.start(now);
          osc.stop(now + 0.15);
        }
        else if (sfxName.startsWith('invader-move-')) {
          // 4-step descending marching sounds
          const stepNum = parseInt(sfxName.replace('invader-move-', ''), 10) || 1;
          const freqs = [105, 95, 85, 75];
          const freq = freqs[stepNum - 1] || 85;
          
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now);
          
          gain.gain.setValueAtTime(0.12 * sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
          
          osc.connect(gain);
          gain.connect(sfxGainNode);
          osc.start(now);
          osc.stop(now + 0.08);
        }
        else if (sfxName === 'invader-killed') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.linearRampToValueAtTime(600, now + 0.08);
          osc.frequency.linearRampToValueAtTime(80, now + 0.16);
          
          gain.gain.setValueAtTime(0.25 * sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
          
          osc.connect(gain);
          gain.connect(sfxGainNode);
          osc.start(now);
          osc.stop(now + 0.16);
        }
        else if (sfxName === 'player-explosion') {
          if (!noiseBuffer) return;
          const bufferSource = audioCtx.createBufferSource();
          bufferSource.buffer = noiseBuffer;
          
          const filter = audioCtx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, now);
          filter.frequency.exponentialRampToValueAtTime(80, now + 0.8);
          
          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0.45 * sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
          
          bufferSource.connect(filter);
          filter.connect(gain);
          gain.connect(sfxGainNode);
          bufferSource.start(now);
          bufferSource.stop(now + 1.2);
        }
        else if (sfxName === 'barrier-hit') {
          if (!noiseBuffer) return;
          const bufferSource = audioCtx.createBufferSource();
          bufferSource.buffer = noiseBuffer;
          
          const filter = audioCtx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(450, now);
          
          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0.18 * sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
          
          bufferSource.connect(filter);
          filter.connect(gain);
          gain.connect(sfxGainNode);
          bufferSource.start(now);
          bufferSource.stop(now + 0.15);
        }
        else if (sfxName === 'ufo-fly') {
          if (ufoSource) return; // already active
          
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(700, now);
          
          // LFO frequency sweeps
          const lfo = audioCtx.createOscillator();
          const lfoGain = audioCtx.createGain();
          lfo.frequency.setValueAtTime(8, now); // 8 Hz LFO speed
          lfoGain.gain.setValueAtTime(120, now); // scale amplitude by 120Hz
          
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          
          gain.gain.setValueAtTime(0.06 * sfxVolume, now);
          
          osc.connect(gain);
          gain.connect(sfxGainNode);
          
          lfo.start(now);
          osc.start(now);
          
          ufoSource = { osc, lfo, gain };
        }
        else if (sfxName === 'ufo-killed') {
          this.stopUfoFlySfx();
          // Sparkling arcade sweep
          playSynthNote(523.25, now, 0.06, 'triangle', 0.2);
          playSynthNote(659.25, now + 0.06, 0.06, 'triangle', 0.2);
          playSynthNote(783.99, now + 0.12, 0.06, 'triangle', 0.2);
          playSynthNote(1046.50, now + 0.18, 0.12, 'triangle', 0.2);
        }
        else if (sfxName === 'level-up') {
          playSynthNote(261.63, now, 0.08, 'square', 0.15);
          playSynthNote(329.63, now + 0.08, 0.08, 'square', 0.15);
          playSynthNote(392.00, now + 0.16, 0.08, 'square', 0.15);
          playSynthNote(523.25, now + 0.24, 0.24, 'square', 0.2);
        }
        else if (sfxName === 'extra-life') {
          playSynthNote(440.00, now, 0.1, 'square', 0.15);
          playSynthNote(554.37, now + 0.1, 0.25, 'square', 0.15);
        }
        else if (sfxName === 'game-start') {
          playSynthNote(196.00, now, 0.08, 'square', 0.15);
          playSynthNote(261.63, now + 0.08, 0.08, 'square', 0.15);
          playSynthNote(329.63, now + 0.16, 0.08, 'square', 0.15);
          playSynthNote(392.00, now + 0.24, 0.2, 'square', 0.15);
        }
        else if (sfxName === 'ui-click') {
          playSynthNote(600, now, 0.05, 'triangle', 0.1);
        }
        else if (sfxName === 'ui-hover') {
          playSynthNote(800, now, 0.03, 'triangle', 0.05);
        }
      } catch(e) {
        console.warn(`Failed to play SFX: ${sfxName}`, e);
      }
    },

    stopUfoFlySfx: function() {
      if (ufoSource) {
        try {
          ufoSource.osc.stop();
          ufoSource.lfo.stop();
        } catch(e) {}
        ufoSource = null;
      }
    },

    // 3. SETTINGS INTERFACE
    setMusicVolume: function(volPercent) {
      musicVolume = GameHelpers.clamp(volPercent / 100, 0, 1);
      this.updateVolumes();
    },

    setSfxVolume: function(volPercent) {
      sfxVolume = GameHelpers.clamp(volPercent / 100, 0, 1);
      this.updateVolumes();
    },

    muteAll: function(muteBool) {
      isMuted = !!muteBool;
      this.updateVolumes();
    },

    getMusicVolume: function() { return musicVolume; },
    getSfxVolume: function() { return sfxVolume; },
    isMuted: function() { return isMuted; },

    updateVolumes: function() {
      if (!audioCtx) return;
      try {
        const targetMusicGain = isMuted ? 0 : musicVolume;
        const targetSfxGain = isMuted ? 0 : sfxVolume;
        
        musicGainNode.gain.setValueAtTime(targetMusicGain, audioCtx.currentTime);
        sfxGainNode.gain.setValueAtTime(targetSfxGain, audioCtx.currentTime);
      } catch(e) {}
    },

    // Cross-duck BGM on pause
    duckMusic: function(duckBool) {
      if (!audioCtx || isMuted || !musicGainNode) return;
      try {
        const vol = duckBool ? (musicVolume * 0.25) : musicVolume;
        musicGainNode.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.1);
      } catch(e) {}
    }
  };
})();
