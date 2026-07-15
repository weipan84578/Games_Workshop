(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("BGM 固定 boost 是十倍", "audio", function () {
    assert.equal(Game.Constants.BGM_BOOST, 10.0);
  });

  Test.test("使用者音量採平方曲線", "audio", function () {
    var manager = new Game.AudioManager(function () {
      return {
        audio: { master: 70, bgm: 55, sfx: 75, muted: false, track: "auto" },
      };
    });
    assert.closeTo(manager.gainFor(50), 0.25, 0.0001);
    assert.equal(manager.gainFor(0), 0);
  });
})(window.DJGame, window.DJTest);
