(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("重力會讓角色向下加速", "physics", function () {
    var player = Game.Player.create(100, 100);
    Game.Physics.update(
      player,
      { left: false, right: false },
      Game.Constants.FIXED_STEP,
    );
    assert.truthy(player.vy > 0);
    assert.truthy(player.y > 100);
  });

  Test.test("左右輸入不會超過最大水平速度", "physics", function () {
    var player = Game.Player.create(100, 100);
    for (var i = 0; i < 120; i += 1)
      Game.Physics.update(
        player,
        { left: false, right: true },
        Game.Constants.FIXED_STEP,
      );
    assert.equal(player.vx, Game.Constants.MAX_HORIZONTAL_SPEED);
  });

  Test.test("角色可以從左側穿牆回到右側", "physics", function () {
    var player = Game.Player.create(-40, 100);
    player.vx = -30;
    Game.Physics.update(
      player,
      { left: true, right: false },
      Game.Constants.FIXED_STEP,
    );
    assert.truthy(player.x > 300);
  });
})(window.DJGame, window.DJTest);
