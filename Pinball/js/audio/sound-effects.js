(function (window) {
  "use strict";

  var Pinball = window.Pinball;

  function playTone(ctx, output, options) {
    options = options || {};
    var now = ctx.currentTime + (options.delay || 0);
    var osc = ctx.createOscillator();
    var env = ctx.createGain();
    var filter = ctx.createBiquadFilter();
    var duration = options.duration || 0.14;
    var gain = options.gain || 0.24;

    osc.type = options.type || "sine";
    osc.frequency.setValueAtTime(options.freq || 440, now);
    if (options.sweepTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, options.sweepTo), now + duration);
    }

    filter.type = options.filterType || "lowpass";
    filter.frequency.setValueAtTime(options.filter || 9000, now);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(gain, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter).connect(env).connect(output);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playNoise(ctx, output, options) {
    options = options || {};
    var now = ctx.currentTime + (options.delay || 0);
    var duration = options.duration || 0.12;
    var bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    var source = ctx.createBufferSource();
    var filter = ctx.createBiquadFilter();
    var env = ctx.createGain();
    source.buffer = buffer;
    filter.type = options.filterType || "bandpass";
    filter.frequency.setValueAtTime(options.filter || 1200, now);
    env.gain.setValueAtTime(options.gain || 0.2, now);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(filter).connect(env).connect(output);
    source.start(now);
  }

  var library = {
    launch: function (ctx, out) {
      playTone(ctx, out, { type: "sawtooth", freq: 170, sweepTo: 980, duration: 0.42, gain: 0.24, filter: 2500 });
      playNoise(ctx, out, { duration: 0.18, gain: 0.08, filter: 1800 });
    },
    flipper: function (ctx, out) {
      playTone(ctx, out, { type: "square", freq: 130, sweepTo: 260, duration: 0.055, gain: 0.18, filter: 1400 });
      playNoise(ctx, out, { duration: 0.035, gain: 0.12, filter: 900 });
    },
    bumper: function (ctx, out) {
      playTone(ctx, out, { type: "sine", freq: 520, sweepTo: 760, duration: 0.12, gain: 0.28 });
      playTone(ctx, out, { type: "triangle", freq: 1040, duration: 0.09, gain: 0.12, delay: 0.025 });
    },
    wall: function (ctx, out) {
      playTone(ctx, out, { type: "triangle", freq: 230, duration: 0.07, gain: 0.12, filter: 2000 });
    },
    target: function (ctx, out) {
      playTone(ctx, out, { type: "sine", freq: 660, duration: 0.1, gain: 0.19 });
      playTone(ctx, out, { type: "sine", freq: 880, duration: 0.11, gain: 0.16, delay: 0.055 });
    },
    score: function (ctx, out) {
      playTone(ctx, out, { type: "triangle", freq: 880, duration: 0.055, gain: 0.1 });
    },
    combo: function (ctx, out, options) {
      var level = options.level || 1;
      playTone(ctx, out, { type: "sine", freq: 520 + level * 40, duration: 0.08, gain: 0.18 });
      playTone(ctx, out, { type: "sine", freq: 760 + level * 55, duration: 0.1, gain: 0.16, delay: 0.065 });
    },
    jackpot: function (ctx, out) {
      [0, 4, 7, 12, 16].forEach(function (semi, i) {
        playTone(ctx, out, { type: "triangle", freq: 440 * Math.pow(2, semi / 12), duration: 0.18, gain: 0.22, delay: i * 0.08 });
      });
    },
    extraBall: function (ctx, out) {
      [523, 659, 784, 1047].forEach(function (freq, i) {
        playTone(ctx, out, { type: "sine", freq: freq, duration: 0.16, gain: 0.18, delay: i * 0.075 });
      });
    },
    multiball: function (ctx, out) {
      [196, 247, 294, 392, 494].forEach(function (freq, i) {
        playTone(ctx, out, { type: "sawtooth", freq: freq, duration: 0.2, gain: 0.13, delay: i * 0.06, filter: 2200 });
      });
    },
    drain: function (ctx, out) {
      playTone(ctx, out, { type: "sawtooth", freq: 440, sweepTo: 65, duration: 0.42, gain: 0.2, filter: 1600 });
    },
    gameOver: function (ctx, out) {
      [392, 330, 262, 196].forEach(function (freq, i) {
        playTone(ctx, out, { type: "triangle", freq: freq, duration: 0.26, gain: 0.18, delay: i * 0.17 });
      });
    },
    uiClick: function (ctx, out) {
      playTone(ctx, out, { type: "square", freq: 620, duration: 0.045, gain: 0.09 });
    },
    uiHover: function (ctx, out) {
      playTone(ctx, out, { type: "sine", freq: 900, duration: 0.035, gain: 0.04 });
    },
    screenChange: function (ctx, out) {
      playTone(ctx, out, { type: "triangle", freq: 260, sweepTo: 620, duration: 0.16, gain: 0.1 });
    },
    newHighScore: function (ctx, out) {
      [523, 659, 784, 988, 1175, 1319].forEach(function (freq, i) {
        playTone(ctx, out, { type: "triangle", freq: freq, duration: 0.14, gain: 0.15, delay: i * 0.07 });
      });
    },
    countdown: function (ctx, out) {
      playTone(ctx, out, { type: "square", freq: 520, duration: 0.07, gain: 0.12 });
    },
    ramp: function (ctx, out) {
      playTone(ctx, out, { type: "sine", freq: 360, sweepTo: 920, duration: 0.22, gain: 0.16 });
    }
  };

  function play(key, ctx, output, options) {
    if (library[key]) {
      library[key](ctx, output, options || {});
    }
  }

  Pinball.SFX = {
    play: play,
    library: library
  };
})(window);
