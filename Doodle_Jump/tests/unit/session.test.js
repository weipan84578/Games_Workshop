(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("收集開場星星不會中斷遊戲或拋出事件錯誤", "session", function () {
    var bus = new Game.EventBus();
    var collected = 0;
    bus.on(Game.Events.COLLECTED, function () {
      collected += 1;
    });
    var session = new Game.GameSession(bus);
    var state = session.start(4567);
    var star = state.items[0];
    state.player.x = star.x;
    state.player.y = star.y;
    state.player.previousX = star.x;
    state.player.previousY = star.y;
    state.player.vx = 0;
    state.player.vy = 0;

    session.update({ left: false, right: false }, Game.Constants.FIXED_STEP);

    assert.equal(collected, 1);
    assert.equal(state.score.itemScore, 50);
    assert.equal(state.over, false);
  });

  Test.test("字串 id 的道具仍會得到有效動畫相位", "session", function () {
    var item = Game.Item.create("item-42", 20, 30, "star");
    Game.Item.update(item, Game.Constants.FIXED_STEP, 100);
    assert.truthy(Number.isFinite(item.phase));
    assert.truthy(Number.isFinite(item.y));
  });
})(window.DJGame, window.DJTest);
