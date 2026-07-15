(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  function digest(state) {
    return {
      time: state.time,
      player: [state.player.x, state.player.y, state.player.vx, state.player.vy],
      camera: [state.camera.y, state.camera.previousY],
      score: [state.score.total, state.score.maxHeight, state.score.currentCombo],
      rng: state.rng.seed,
      platforms: state.platforms.map(function (platform) {
        return [platform.id, platform.x, platform.y, platform.type, platform.active];
      }),
      items: state.items.map(function (item) {
        return [item.id, item.x, item.y, item.type, item.active];
      }),
      enemies: state.enemies.map(function (enemy) {
        return [enemy.id, enemy.x, enemy.y, enemy.type, enemy.active];
      }),
    };
  }

  Test.test("存檔恢復後以相同輸入維持完全確定性", "integration", function () {
    var first = new Game.GameSession();
    first.start(24680);
    for (var warmup = 0; warmup < 120; warmup += 1)
      first.update({ left: warmup < 45, right: false }, Game.Constants.FIXED_STEP);

    var second = new Game.GameSession();
    assert.truthy(second.restore(first.snapshot()));
    for (var frame = 0; frame < 240; frame += 1) {
      var input = { left: frame % 120 < 30, right: frame % 120 >= 90 };
      first.update(input, Game.Constants.FIXED_STEP);
      second.update(input, Game.Constants.FIXED_STEP);
    }
    assert.deepEqual(digest(second.state), digest(first.state));
  });

  Test.test("長時間固定更新維持有限數值與物件上限", "integration", function () {
    var session = new Game.GameSession();
    var state = session.start(13579);
    for (var frame = 0; frame < 2400 && !state.over; frame += 1)
      session.update({ left: false, right: false }, Game.Constants.FIXED_STEP);

    assert.truthy(Number.isFinite(state.player.x));
    assert.truthy(Number.isFinite(state.player.y));
    assert.truthy(state.platforms.length <= Game.Constants.MAX_PLATFORMS);
    assert.truthy(state.items.length <= Game.Constants.MAX_ITEMS);
    assert.truthy(state.enemies.length <= Game.Constants.MAX_ENEMIES);
  });
})(window.DJGame, window.DJTest);
