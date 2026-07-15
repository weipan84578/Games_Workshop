(function (Game) {
  "use strict";
  function SfxPlayer(context, output) {
    this.context = context;
    this.output = output;
    this.activeVoices = 0;
    this.lastPlayed = Object.create(null);
  }
  SfxPlayer.prototype.play = function (name) {
    if (!this.context || !this.output || this.activeVoices >= 8) return;
    var now = this.context.currentTime;
    if (this.lastPlayed[name] && now - this.lastPlayed[name] < 0.055) return;
    this.lastPlayed[name] = now;
    this.activeVoices += 1;
    var frequencies = {
      land: 420,
      spring: 620,
      collect: 760,
      power: 520,
      shield: 280,
      hit: 180,
      confirm: 660,
      back: 330,
      over: 150,
      record: 880,
    };
    var oscillator = this.context.createOscillator();
    var gain = this.context.createGain();
    oscillator.type = name === "hit" ? "triangle" : "sine";
    oscillator.frequency.value =
      (frequencies[name] || 440) * (1 + (Math.random() * 0.06 - 0.03));
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + (name === "record" ? 0.45 : 0.18),
    );
    oscillator.connect(gain);
    gain.connect(this.output);
    oscillator.start(now);
    oscillator.stop(now + 0.5);
    var self = this;
    window.setTimeout(function () {
      self.activeVoices = Math.max(0, self.activeVoices - 1);
    }, 520);
  };
  Game.SfxPlayer = SfxPlayer;
})(window.DJGame);
