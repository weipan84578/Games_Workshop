(function () {
  "use strict";

  var NOTES = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66];

  function playNote(context, frequency, time, duration, volume) {
    var oscillator = context.createOscillator();
    var gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), time + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.03);
  }

  function create(context, getVolume) {
    var timer = null;
    var step = 0;

    function schedule() {
      if (!context) return;
      var now = context.currentTime;
      var baseVolume = Math.min(0.32, Math.max(0, getVolume()));
      playNote(context, NOTES[step % NOTES.length], now, 0.36, baseVolume);
      if (step % 2 === 0) playNote(context, NOTES[(step + 2) % NOTES.length] / 2, now, 0.58, baseVolume * 0.42);
      step += 1;
      timer = window.setTimeout(schedule, 520);
    }

    return {
      start: function () {
        if (!timer) schedule();
      },
      stop: function () {
        if (timer) window.clearTimeout(timer);
        timer = null;
      }
    };
  }

  window.BgmGenerator = {
    create: create
  };
})();
