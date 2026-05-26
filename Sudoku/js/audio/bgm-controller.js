(function (global) {
  "use strict";

  let context = null;
  let gain = null;
  let oscillator = null;
  let activeTrack = null;
  let enabled = false;
  let volume = 0.5;

  const TRACK_FREQUENCIES = {
    home: 196,
    settings: 220,
    gameEasy: 247,
    gameMedium: 262,
    gameHard: 294,
    gameExpert: 330,
  };

  function ensureContext() {
    if (!context) {
      context = new (window.AudioContext || window.webkitAudioContext)();
      gain = context.createGain();
      gain.gain.value = 0;
      gain.connect(context.destination);
    }
    return context;
  }

  function setGain(target) {
    if (!gain || !context) {
      return;
    }
    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.linearRampToValueAtTime(target, context.currentTime + 0.35);
  }

  function stop() {
    if (!oscillator || !context) {
      return;
    }
    setGain(0);
    const old = oscillator;
    window.setTimeout(() => {
      try {
        old.stop();
      } catch (error) {
        // Oscillator may already be stopped by the browser.
      }
    }, 380);
    oscillator = null;
    activeTrack = null;
  }

  function play(track) {
    if (!enabled) {
      stop();
      return;
    }

    const ctx = ensureContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    if (activeTrack === track && oscillator) {
      setGain(volume * 0.035);
      return;
    }

    stop();
    activeTrack = track;
    oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = TRACK_FREQUENCIES[track] || TRACK_FREQUENCIES.home;
    oscillator.connect(gain);
    oscillator.start();
    setGain(volume * 0.035);
  }

  global.BGMController = {
    configure(settings) {
      enabled = Boolean(settings.bgmEnabled);
      volume = Number(settings.bgmVolume) / 100;
      if (!enabled) {
        stop();
      } else if (activeTrack) {
        play(activeTrack);
      }
    },
    unlock() {
      const ctx = ensureContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
    },
    play,
    stop,
  };
})(window);
