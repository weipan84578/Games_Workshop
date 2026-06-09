(function () {
  const AudioSystem = {
    unlock() {
      const state = Pong.GameState;
      if (!state.audio.context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
          return;
        }

        state.audio.context = new AudioContext();
        state.audio.masterGain = state.audio.context.createGain();
        state.audio.musicGain = state.audio.context.createGain();
        state.audio.sfxGain = state.audio.context.createGain();

        state.audio.musicGain.connect(state.audio.masterGain);
        state.audio.sfxGain.connect(state.audio.masterGain);
        state.audio.masterGain.connect(state.audio.context.destination);
        AudioSystem.applySettings();
      }

      state.audio.unlocked = true;
      if (state.audio.context.state === "suspended") {
        state.audio.context.resume();
      }

      if (state.audio.desiredMusic && state.audio.currentMusic !== state.audio.desiredMusic) {
        const desiredMusic = state.audio.desiredMusic;
        setTimeout(() => {
          if (state.audio.desiredMusic === desiredMusic && state.audio.currentMusic !== desiredMusic) {
            AudioSystem.playMusic(desiredMusic);
          }
        }, 0);
      }
    },

    applySettings() {
      const state = Pong.GameState;
      const settings = state.settings || Pong.Storage.defaults();
      const muted = state.muted ? 0 : 1;

      if (state.audio.musicGain) {
        state.audio.musicGain.gain.setTargetAtTime(settings.musicVolume * muted, state.audio.context.currentTime, 0.03);
      }
      if (state.audio.sfxGain) {
        state.audio.sfxGain.gain.setTargetAtTime(settings.sfxVolume * muted, state.audio.context.currentTime, 0.01);
      }
    },

    setMusicDimmed(dimmed) {
      const state = Pong.GameState;
      if (!state.audio.musicGain || !state.settings) {
        return;
      }
      const base = state.muted ? 0 : state.settings.musicVolume;
      const target = dimmed ? base * 0.3 : base;
      state.audio.musicGain.gain.setTargetAtTime(target, state.audio.context.currentTime, 0.08);
    },

    toggleMute() {
      Pong.GameState.muted = !Pong.GameState.muted;
      AudioSystem.applySettings();
      AudioSystem.playSfx("button_click");
      return Pong.GameState.muted;
    },

    stopMusic() {
      const state = Pong.GameState;
      if (state.audio.musicTimer) {
        clearTimeout(state.audio.musicTimer);
        state.audio.musicTimer = 0;
      }
      state.audio.musicNodes.forEach((node) => {
        try {
          node.stop();
        } catch (error) {
          // Already stopped.
        }
      });
      state.audio.musicNodes = [];
      state.audio.currentMusic = null;
    },

    playMusic(name) {
      const state = Pong.GameState;
      state.audio.desiredMusic = name;
      if (!state.audio.unlocked) {
        return;
      }
      if (state.audio.currentMusic === name) {
        AudioSystem.setMusicDimmed(false);
        return;
      }

      AudioSystem.unlock();
      if (!state.audio.context || !state.audio.musicGain) {
        return;
      }

      AudioSystem.stopMusic();
      state.audio.currentMusic = name;

      const ctx = state.audio.context;
      const loop = !name.startsWith("result_");
      const schedule = () => {
        if (state.audio.currentMusic !== name) {
          return;
        }
        const duration = AudioSystem.scheduleMusicPattern(name, ctx.currentTime + 0.02);
        if (loop) {
          state.audio.musicTimer = setTimeout(schedule, Math.max(120, (duration - 0.04) * 1000));
        }
      };

      schedule();
    },

    scheduleMusicPattern(name, startAt) {
      const state = Pong.GameState;
      const pattern = AudioSystem.musicPattern(name);
      let time = startAt;

      pattern.forEach((note) => {
        const node = AudioSystem.tone(note.frequency, time, note.duration, note.type, state.audio.musicGain, note.gain);
        if (node) {
          state.audio.musicNodes.push(node);
        }
        time += note.duration;
      });

      return pattern.reduce((sum, note) => sum + note.duration, 0);
    },

    musicPattern(name) {
      const presets = {
        menu_theme: { base: 220, type: "sine", gain: 0.035, steps: [0, 7, 12, 7, 5, 10, 12, 10], duration: 0.28 },
        game_easy: { base: 262, type: "square", gain: 0.03, steps: [0, 4, 7, 12, 7, 4], duration: 0.18 },
        game_normal: { base: 196, type: "triangle", gain: 0.038, steps: [0, 7, 3, 10, 5, 12, 10, 7], duration: 0.16 },
        game_hard: { base: 164, type: "sawtooth", gain: 0.032, steps: [0, 12, 7, 19, 3, 15, 10, 22], duration: 0.12 },
        result_win: { base: 330, type: "triangle", gain: 0.07, steps: [0, 4, 7, 12, 16, 19], duration: 0.18 },
        result_lose: { base: 196, type: "sine", gain: 0.06, steps: [7, 3, 0, -5], duration: 0.26 }
      };
      const preset = presets[name] || presets.menu_theme;
      return preset.steps.map((step) => ({
        frequency: preset.base * Math.pow(2, step / 12),
        duration: preset.duration,
        type: preset.type,
        gain: preset.gain
      }));
    },

    tone(frequency, start, duration, type, destination, gainValue) {
      const ctx = Pong.GameState.audio.context;
      if (!ctx) {
        return null;
      }

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type || "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainValue || 0.08), start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(destination || Pong.GameState.audio.sfxGain);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);

      return oscillator;
    },

    playSfx(name, volume) {
      const state = Pong.GameState;
      if (!state.audio.context || !state.audio.sfxGain || state.muted) {
        return;
      }

      const ctx = state.audio.context;
      const now = ctx.currentTime;
      const v = volume == null ? 1 : volume;

      const burst = (notes, type, gain) => {
        notes.forEach((note, index) => {
          AudioSystem.tone(note[0], now + index * note[1], note[2], type, state.audio.sfxGain, gain * v);
        });
      };

      switch (name) {
        case "paddle_hit":
          AudioSystem.tone(420, now, 0.08, "square", state.audio.sfxGain, 0.11 * v);
          break;
        case "ai_hit":
          AudioSystem.tone(260, now, 0.09, "triangle", state.audio.sfxGain, 0.1 * v);
          break;
        case "wall_bounce":
          AudioSystem.tone(760, now, 0.05, "sine", state.audio.sfxGain, 0.08 * v);
          break;
        case "player_score":
          burst([[392, 0, 0.1], [523, 0.09, 0.1], [659, 0.18, 0.14]], "triangle", 0.11);
          break;
        case "ai_score":
          burst([[220, 0, 0.16], [164, 0.13, 0.18]], "sine", 0.11);
          break;
        case "game_start":
          burst([[440, 0, 0.08], [660, 0.08, 0.14]], "sawtooth", 0.09);
          break;
        case "game_win":
          burst([[330, 0, 0.12], [415, 0.1, 0.12], [523, 0.2, 0.18], [659, 0.32, 0.24]], "triangle", 0.11);
          break;
        case "game_lose":
          burst([[220, 0, 0.2], [196, 0.16, 0.2], [147, 0.32, 0.3]], "sine", 0.1);
          break;
        case "button_hover":
          AudioSystem.tone(880, now, 0.025, "sine", state.audio.sfxGain, 0.035 * v);
          break;
        case "button_click":
          AudioSystem.tone(520, now, 0.04, "square", state.audio.sfxGain, 0.055 * v);
          break;
        case "menu_open":
          burst([[330, 0, 0.08], [494, 0.06, 0.1]], "sine", 0.07);
          break;
        case "menu_close":
          burst([[494, 0, 0.08], [330, 0.06, 0.1]], "sine", 0.07);
          break;
        case "countdown":
          AudioSystem.tone(680, now, 0.08, "sine", state.audio.sfxGain, 0.08 * v);
          break;
        case "hard_speed_up":
          AudioSystem.tone(120, now, 0.08, "sawtooth", state.audio.sfxGain, 0.09 * v);
          AudioSystem.tone(960, now + 0.03, 0.05, "square", state.audio.sfxGain, 0.05 * v);
          break;
        case "match_point":
          burst([[620, 0, 0.08], [620, 0.12, 0.08], [620, 0.24, 0.08]], "square", 0.08);
          break;
        case "paddle_edge_hit":
          AudioSystem.tone(980, now, 0.06, "sawtooth", state.audio.sfxGain, 0.1 * v);
          break;
        default:
          AudioSystem.tone(440, now, 0.05, "sine", state.audio.sfxGain, 0.05 * v);
      }
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.Audio = AudioSystem;
})();
