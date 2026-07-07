(function initSfxPlayer(global) {
  const CF = global.CF || (global.CF = {});

  function playTone(audioContext, gainNode, frequency, duration, type) {
    if (!audioContext || !gainNode) return;
    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = type || "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.18, now + 0.015);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(envelope).connect(gainNode);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  function playSfx(audioContext, gainNode, name) {
    const patterns = {
      drop: [[680, 0.08, "triangle"], [420, 0.1, "sine"]],
      win: [[523, 0.09, "triangle"], [659, 0.09, "triangle"], [784, 0.16, "triangle"]],
      lose: [[330, 0.12, "sine"], [294, 0.16, "sine"]],
      draw: [[440, 0.1, "triangle"], [440, 0.1, "triangle"]],
      click: [[900, 0.055, "triangle"]],
      error: [[210, 0.12, "sine"]],
      toggle: [[620, 0.07, "triangle"], [820, 0.08, "triangle"]]
    };
    (patterns[name] || patterns.click).forEach(([frequency, duration, type], index) => {
      global.setTimeout(() => playTone(audioContext, gainNode, frequency, duration, type), index * 80);
    });
  }

  CF.sfxPlayer = { playSfx, playTone };
})(window);
