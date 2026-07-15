(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("角色下降跨過平台頂面時會落地", "collision", function () {
    var player = Game.Player.create(100, 80);
    player.previousY = 80;
    player.y = 130;
    player.vy = 100;
    var platform = Game.Platform.create("p", 90, 160, 100, "normal");
    var result = Game.Collision.platformLanding(player, [platform]);
    assert.equal(result.platform.id, "p");
    assert.equal(player.y, 118);
  });

  Test.test("角色上升時不會穿過平台頂面而觸發落地", "collision", function () {
    var player = Game.Player.create(100, 130);
    player.previousY = 140;
    player.y = 120;
    player.vy = -100;
    var platform = Game.Platform.create("p", 90, 160, 100, "normal");
    assert.equal(Game.Collision.platformLanding(player, [platform]), null);
  });

  Test.test("平台至少需要百分之二十角色寬度重疊", "collision", function () {
    var player = Game.Player.create(0, 80);
    player.previousY = 80;
    player.y = 130;
    player.vy = 100;
    var platform = Game.Platform.create("p", 30, 160, 30, "normal");
    assert.equal(Game.Collision.platformLanding(player, [platform]), null);
  });
})(window.DJGame, window.DJTest);
