(function (global) {
  "use strict";

  let context = null;
  let enabled = true;
  let volume = 0.8;

  const SFX = {
    click: { frequency: 420, duration: 0.045 },
    select: { frequency: 540, duration: 0.035 },
    input: { frequency: 660, duration: 0.06 },
    erase: { frequency: 260, duration: 0.07 },
    error: { frequency: 140, duration: 0.12 },
    hint: { frequency: 760, duration: 0.09 },
    victory: { frequency: 880, duration: 0.18 },
    gameOver: { frequency: 110, duration: 0.22 },
    undo: { frequency: 320, duration: 0.06 },
  };

  function ensureContext() {
    if (!context) {
      context = new (window.AudioContext || window.webkitAudioContext)();
    }
    return context;
  }

  function play(name) {
    if (!enabled) {
      return;
    }

    const sound = SFX[name] || SFX.click;
    const ctx = ensureContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = sound.frequency;
    gain.gain.value = volume * 0.12;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sound.duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + sound.duration);
  }

  global.SFXController = {
    configure(settings) {
      enabled = Boolean(settings.sfxEnabled);
      volume = Number(settings.sfxVolume) / 100;
    },
    unlock() {
      const ctx = ensureContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
    },
    play,
  };
})(window);
