window.GoGame = window.GoGame || {};

GoGame.AudioSynth = (() => {
  let ctx;

  function context() {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function scheduleTone(freq = 440, dur = 0.08, type = "sine", vol = 0.4, when = 0, dest = null) {
    const c = context();
    const start = when || c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain).connect(dest || c.destination);
    osc.start(start);
    osc.stop(start + dur + 0.04);
    return osc;
  }

  return {
    context,
    unlock() {
      const c = context();
      if (c.state === "suspended") c.resume();
    },
    play(freq = 440, dur = 0.08, type = "sine", vol = 0.4) {
      scheduleTone(freq, dur, type, vol);
    },
    scheduleTone,
  };
})();
