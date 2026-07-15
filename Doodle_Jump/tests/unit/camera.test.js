(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("鏡頭會平滑追上目標而不是單幀跳到定位", "camera", function () {
    var camera = { y: 0, previousY: 0 };
    var player = { y: 200 };
    var target = player.y - Game.Constants.CAMERA_TRIGGER_Y;
    Game.Camera.update(camera, player, Game.Constants.FIXED_STEP);

    assert.truthy(camera.y < 0);
    assert.truthy(camera.y > target);
    for (var index = 0; index < 240; index += 1)
      Game.Camera.update(camera, player, Game.Constants.FIXED_STEP);
    assert.closeTo(camera.y, target, 0.01);
  });

  Test.test("鏡頭不會在玩家下落時向下倒退", "camera", function () {
    var camera = { y: -100, previousY: -100 };
    Game.Camera.update(camera, { y: 500 }, Game.Constants.FIXED_STEP);
    assert.equal(camera.y, -100);
  });
})(window.DJGame, window.DJTest);
