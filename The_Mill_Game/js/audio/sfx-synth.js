(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};

  var PRESETS = {
    click: { freq: 520, end: 380, duration: 0.055, type: "triangle", gain: 0.12 },
    place: { freq: 280, end: 210, duration: 0.09, type: "sine", gain: 0.18 },
    move: { freq: 360, end: 460, duration: 0.12, type: "triangle", gain: 0.14 },
    mill: { freq: 520, end: 820, duration: 0.22, type: "sine", gain: 0.18 },
    remove: { freq: 190, end: 90, duration: 0.16, type: "sawtooth", gain: 0.11 },
    win: { freq: 420, end: 720, duration: 0.32, type: "triangle", gain: 0.2 },
    lose: { freq: 240, end: 120, duration: 0.28, type: "sine", gain: 0.18 }
  };

  function play(ctx, output, name) {
    var preset = PRESETS[name] || PRESETS.click;
    var now = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = preset.type;
    osc.frequency.setValueAtTime(preset.freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, preset.end), now + preset.duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(preset.gain, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + preset.duration);
    osc.connect(gain);
    gain.connect(output);
    osc.start(now);
    osc.stop(now + preset.duration + 0.03);
  }

  NMM.SfxSynth = {
    play: play
  };
})(window);
