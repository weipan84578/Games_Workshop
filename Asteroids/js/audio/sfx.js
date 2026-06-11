(function () {
  "use strict";

  var lastPlayed = {};

  function throttle(name, ms) {
    var now = performance.now();
    if (lastPlayed[name] && now - lastPlayed[name] < ms) return false;
    lastPlayed[name] = now;
    return true;
  }

  var Sfx = {
    shoot: function () {
      Game.Audio.playTone({ freq: 880, toFreq: 220, type: "square", duration: 0.08, gain: 0.13 });
    },

    rapid: function () {
      Game.Audio.playTone({ freq: 1020, toFreq: 420, type: "square", duration: 0.055, gain: 0.1 });
    },

    thrust: function () {
      if (!throttle("thrust", 70)) return;
      Game.Audio.playNoise({ duration: 0.07, gain: 0.025, filter: 450, filterType: "bandpass" });
    },

    asteroidLarge: function () {
      Game.Audio.playNoise({ duration: 0.52, gain: 0.22, filter: 120, filterType: "lowpass" });
      Game.Audio.playTone({ freq: 70, toFreq: 42, type: "sawtooth", duration: 0.35, gain: 0.1 });
    },

    asteroidMedium: function () {
      Game.Audio.playNoise({ duration: 0.34, gain: 0.16, filter: 250, filterType: "lowpass" });
      Game.Audio.playTone({ freq: 120, toFreq: 70, type: "triangle", duration: 0.22, gain: 0.08 });
    },

    asteroidSmall: function () {
      Game.Audio.playNoise({ duration: 0.18, gain: 0.1, filter: 650, filterType: "bandpass" });
      Game.Audio.playTone({ freq: 220, toFreq: 120, type: "triangle", duration: 0.13, gain: 0.06 });
    },

    shipExplode: function () {
      Game.Audio.playNoise({ duration: 0.86, gain: 0.3, filter: 180, filterType: "lowpass" });
      Game.Audio.playTone({ freq: 180, toFreq: 38, type: "sawtooth", duration: 0.75, gain: 0.18 });
    },

    ufoHum: function () {
      Game.Audio.playTone({ freq: 550, toFreq: 440, type: "sine", duration: 0.22, gain: 0.08 });
      Game.Audio.playTone({ freq: 440, toFreq: 550, type: "sine", duration: 0.22, gain: 0.06, detune: 8 });
    },

    ufoShoot: function () {
      Game.Audio.playTone({ freq: 660, toFreq: 330, type: "square", duration: 0.1, gain: 0.11 });
    },

    ufoExplode: function () {
      Game.Audio.playNoise({ duration: 0.55, gain: 0.2, filter: 420, filterType: "bandpass" });
      Game.Audio.playTone({ freq: 260, toFreq: 80, type: "sawtooth", duration: 0.42, gain: 0.12 });
    },

    powerup: function () {
      [523, 659, 784].forEach(function (freq, index) {
        setTimeout(function () {
          Game.Audio.playTone({ freq: freq, type: "triangle", duration: 0.12, gain: 0.11 });
        }, index * 55);
      });
    },

    shield: function () {
      Game.Audio.playTone({ freq: 360, toFreq: 720, type: "sine", duration: 0.24, gain: 0.13 });
    },

    shieldHit: function () {
      Game.Audio.playNoise({ duration: 0.18, gain: 0.12, filter: 1200, filterType: "bandpass" });
      Game.Audio.playTone({ freq: 420, toFreq: 260, type: "triangle", duration: 0.22, gain: 0.12 });
    },

    warp: function () {
      Game.Audio.playTone({ freq: 200, toFreq: 1000, type: "sawtooth", duration: 0.34, gain: 0.13 });
      Game.Audio.playNoise({ duration: 0.28, gain: 0.08, filter: 900, filterType: "highpass" });
    },

    extraLife: function () {
      [523, 659, 784, 1046].forEach(function (freq, index) {
        setTimeout(function () {
          Game.Audio.playTone({ freq: freq, type: "triangle", duration: 0.14, gain: 0.12 });
        }, index * 90);
      });
    },

    levelUp: function () {
      Game.Audio.playChord([330, 440, 660], { type: "triangle", duration: 0.42, gain: 0.14 });
      setTimeout(function () {
        Game.Audio.playChord([392, 523, 784], { type: "triangle", duration: 0.38, gain: 0.13 });
      }, 180);
    },

    gameOver: function () {
      Game.Audio.playTone({ freq: 220, toFreq: 55, type: "sawtooth", duration: 1.15, gain: 0.18 });
      Game.Audio.playNoise({ duration: 0.75, gain: 0.1, filter: 150, filterType: "lowpass" });
    },

    ui: function () {
      Game.Audio.playTone({ freq: 880, type: "triangle", duration: 0.035, gain: 0.065 });
    },

    heartbeat: function () {
      Game.Audio.playTone({ freq: 55, type: "sine", duration: 0.08, gain: 0.08 });
      setTimeout(function () {
        Game.Audio.playTone({ freq: 49, type: "sine", duration: 0.08, gain: 0.06 });
      }, 110);
    }
  };

  Game.Sfx = {
    play: function (name) {
      if (!Sfx[name]) return;
      Game.Audio.resume();
      Sfx[name]();
    }
  };
}());
