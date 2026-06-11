(function () {
  "use strict";

  var current = null;
  var timer = null;
  var step = 0;
  var gameDelay = 620;

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function menuTick() {
    var chords = [
      [146.83, 220, 293.66],
      [164.81, 246.94, 329.63],
      [130.81, 196, 261.63],
      [174.61, 261.63, 349.23]
    ];
    Game.Audio.playChord(chords[step % chords.length], { music: true, type: "sine", duration: 0.9, gain: 0.12, attack: 0.05 });
    step += 1;
  }

  function gameTick() {
    Game.Audio.playTone({ music: true, freq: 55, type: "sine", duration: 0.08, gain: 0.08 });
    setTimeout(function () {
      Game.Audio.playTone({ music: true, freq: 49, type: "sine", duration: 0.08, gain: 0.06 });
    }, 110);
    var notes = [110, 146.83, 164.81, 196];
    Game.Audio.playTone({ music: true, freq: notes[step % notes.length], type: "triangle", duration: 0.18, gain: 0.055 });
    step += 1;
  }

  function gameOverTick() {
    Game.Audio.playChord([55, 82.41, 110], { music: true, type: "sine", duration: 1.6, gain: 0.1, attack: 0.08 });
  }

  function startTrack(track) {
    stopTimer();
    step = 0;
    current = track;
    if (track === "menu") {
      menuTick();
      timer = setInterval(menuTick, 980);
    } else if (track === "game") {
      gameTick();
      timer = setInterval(gameTick, gameDelay);
    } else if (track === "gameover") {
      gameOverTick();
      timer = setInterval(gameOverTick, 1600);
    }
  }

  Game.Music = {
    play: function (track) {
      if (current === track) return;
      Game.Audio.resume();
      Game.Audio.setMusicScale(0, 0.28);
      setTimeout(function () {
        startTrack(track);
        Game.Audio.setMusicScale(1, 0.8);
      }, 300);
    },

    stop: function () {
      stopTimer();
      current = null;
    },

    pause: function () {
      Game.Audio.setMusicScale(0.3, 0.25);
    },

    resume: function () {
      Game.Audio.setMusicScale(1, 0.35);
    },

    setGameIntensity: function (level) {
      gameDelay = Math.max(310, 620 - level * 22);
      if (current === "game") {
        startTrack("game");
      }
    }
  };
}());
