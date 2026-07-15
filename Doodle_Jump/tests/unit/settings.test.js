(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("設定會校正音量與未知主題", "settings", function () {
    var settings = Game.SettingsStore.sanitize({
      language: "unknown",
      theme: "unknown",
      audio: { master: 200, bgm: -1, sfx: 50 },
    });
    assert.equal(settings.language, "zh-TW");
    assert.equal(settings.theme, "pastel-sky");
    assert.equal(settings.audio.master, 100);
    assert.equal(settings.audio.bgm, 0);
  });

  Test.test("設定包含所有無障礙預設值", "settings", function () {
    var settings = Game.SettingsStore.defaults();
    assert.equal(settings.accessibility.reducedMotion, "system");
    assert.equal(settings.accessibility.particles, "medium");
    assert.equal(settings.accessibility.screenShake, true);
  });
})(window.DJGame, window.DJTest);
