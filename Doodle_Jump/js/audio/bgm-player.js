(function (Game) {
  "use strict";
  var tracks = [
    [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23],
    [392, 493.88, 587.33, 493.88, 440, 523.25, 659.25, 523.25],
    [220, 277.18, 329.63, 415.3, 369.99, 440, 554.37, 440],
  ];
  function BgmPlayer(context, boostNode) {
    this.context = context;
    this.boostNode = boostNode;
    this.track = 0;
    this.note = 0;
    this.timer = 0;
    this.active = false;
  }
  BgmPlayer.prototype.setTrack = function (index) {
    this.track = Math.max(0, Math.min(2, Number(index) || 0));
    this.note = 0;
  };
  BgmPlayer.prototype.playNote = function () {
    if (!this.context || !this.boostNode || !this.active) return;
    var frequency = tracks[this.track][this.note % tracks[this.track].length];
    this.note += 1;
    var oscillator = this.context.createOscillator();
    var envelope = this.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(0.018, this.context.currentTime);
    envelope.gain.exponentialRampToValueAtTime(
      0.0001,
      this.context.currentTime + 0.22,
    );
    oscillator.connect(envelope);
    envelope.connect(this.boostNode);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.24);
  };
  BgmPlayer.prototype.start = function (track) {
    if (!this.context) return;
    if (track !== undefined && track !== "auto") this.setTrack(track);
    if (this.active) return;
    this.active = true;
    this.playNote();
    var self = this;
    this.timer = window.setInterval(function () {
      self.playNote();
    }, 260);
  };
  BgmPlayer.prototype.pause = function () {
    this.active = false;
    if (this.timer) window.clearInterval(this.timer);
    this.timer = 0;
  };
  BgmPlayer.prototype.stop = function () {
    this.pause();
    this.note = 0;
  };
  Game.BgmPlayer = BgmPlayer;
})(window.DJGame);
