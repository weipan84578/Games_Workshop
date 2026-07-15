(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("消失平台會先淡出再淡入", "platform", function () {
    var platform = Game.Platform.create("vanish", 10, 20, 100, "vanishing");
    Game.Platform.touch(platform);

    assert.closeTo(Game.Platform.opacity(platform), 1, 0.001);
    Game.Platform.update(platform, 2, 0);
    assert.closeTo(Game.Platform.opacity(platform), 0, 0.001);
    Game.Platform.update(platform, 1, 1000);
    assert.closeTo(Game.Platform.opacity(platform), 0.5, 0.001);
    Game.Platform.update(platform, 1, 2000);

    assert.closeTo(Game.Platform.opacity(platform), 1, 0.001);
    assert.equal(platform.touched, false);
  });
})(window.DJGame, window.DJTest);
