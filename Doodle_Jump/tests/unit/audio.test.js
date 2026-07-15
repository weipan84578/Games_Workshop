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

  Test.test("BGM 等待音訊解鎖後才開始排程", "audio", function () {
    var starts = 0;
    var manager = new Game.AudioManager(function () {
      return {
        audio: { master: 70, bgm: 55, sfx: 75, muted: false, track: "auto" },
      };
    });
    manager.context = { state: "suspended" };
    manager.bgm = {
      start: function () {
        starts += 1;
      },
    };
    manager.supported = true;
    manager.startBgm();
    assert.equal(starts, 0);
    assert.truthy(manager.pendingBgm);
    manager.context.state = "running";
    manager.startBgm();
    assert.equal(starts, 1);
    assert.equal(manager.pendingBgm, false);
  });

  Test.test("自動曲目會跟隨遊戲環境更新", "audio", function () {
    var selected = null;
    var manager = new Game.AudioManager(function () {
      return {
        audio: { master: 70, bgm: 55, sfx: 75, muted: false, track: "auto" },
      };
    });
    manager.bgm = {
      setTrack: function (track) {
        selected = track;
      },
    };
    manager.setAutoTrack(2);
    assert.equal(manager.autoTrack, 2);
    assert.equal(selected, 2);
  });
})(window.DJGame, window.DJTest);
