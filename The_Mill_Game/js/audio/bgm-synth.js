(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};

  var TRACKS = [
    [196, 247, 294, 330, 294, 247, 220, 247],
    [174, 220, 261, 329, 392, 329, 261, 220],
    [220, 277, 330, 370, 330, 277, 247, 277],
    [164, 196, 246, 293, 329, 293, 246, 196],
    [146, 196, 233, 293, 349, 293, 233, 196]
  ];

  function playVoice(ctx, output, freq, start, duration, type, gainValue) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(gainValue, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(output);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  function playStep(ctx, output, trackIndex, step) {
    var notes = TRACKS[trackIndex % TRACKS.length];
    var now = ctx.currentTime;
    var base = notes[step % notes.length];
    var accent = step % 8 === 0 ? 1.15 : 1;
    playVoice(ctx, output, base, now, 0.34, "sine", 0.035 * accent);
    if (step % 4 === 0) {
      playVoice(ctx, output, base / 2, now, 0.62, "triangle", 0.03);
    }
    if (step % 8 === 6) {
      playVoice(ctx, output, base * 1.5, now + 0.08, 0.18, "sine", 0.026);
    }
  }

  NMM.BgmSynth = {
    tracks: TRACKS,
    playStep: playStep
  };
})(window);
