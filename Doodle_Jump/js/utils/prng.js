(function (Game) {
  "use strict";
  function PRNG(seed) {
    this.seed = seed >>> 0 || 0x9e3779b9;
    this.initialSeed = this.seed;
  }
  PRNG.prototype.next = function () {
    var x = this.seed;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.seed = x >>> 0;
    return this.seed / 4294967296;
  };
  PRNG.prototype.range = function (min, max) {
    return min + (max - min) * this.next();
  };
  PRNG.prototype.int = function (min, max) {
    return Math.floor(this.range(min, max + 1));
  };
  PRNG.prototype.pick = function (items) {
    return items[Math.floor(this.next() * items.length)];
  };
  PRNG.prototype.fork = function () {
    return new PRNG((this.next() * 4294967296) >>> 0);
  };
  Game.PRNG = PRNG;
  Game.seedFromTime = function () {
    return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
  };
})(window.DJGame);
