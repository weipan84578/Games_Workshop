(function () {
  "use strict";

  function tone(context, frequency, duration, type, volume) {
    var now = context.currentTime;
    var oscillator = context.createOscillator();
    var gain = context.createGain();
    oscillator.type = type || "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  function play(context, name, volume) {
    if (!context) return;
    var loud = Math.min(0.75, volume * 5);
    if (name === "moveX") tone(context, 880, 0.08, "sine", loud * 0.18);
    else if (name === "moveO") tone(context, 660, 0.09, "triangle", loud * 0.16);
    else if (name === "win") {
      tone(context, 784, 0.13, "triangle", loud * 0.18);
      window.setTimeout(function () { tone(context, 1046.5, 0.18, "triangle", loud * 0.2); }, 100);
    } else if (name === "draw") tone(context, 392, 0.2, "sine", loud * 0.12);
    else if (name === "invalid") tone(context, 150, 0.12, "sawtooth", loud * 0.1);
    else tone(context, 520, 0.06, "sine", loud * 0.12);
  }

  window.SfxGenerator = {
    play: play
  };
})();
