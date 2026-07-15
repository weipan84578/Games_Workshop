(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  function signature(seed) {
    var state = Game.GameState.create(seed);
    for (var i = 0; i < 5; i += 1) Game.WorldGenerator.ensure(state);
    return state.platforms.map(function (platform) {
      return [platform.x, platform.y, platform.type];
    });
  }

  Test.test("同一 seed 產生完全相同的平台序列", "generator", function () {
    assert.deepEqual(signature(12345), signature(12345));
  });

  Test.test("不同 seed 會產生不同的可重現序列", "generator", function () {
    assert.truthy(
      JSON.stringify(signature(12345)) !== JSON.stringify(signature(54321)),
    );
  });

  Test.test(
    "每個 seed 都會產生不同但可安全起步的平台",
    "generator",
    function () {
      var first = Game.GameState.create(101);
      var second = Game.GameState.create(202);
      var firstOpening = first.platforms.slice(0, 6);
      var secondOpening = second.platforms.slice(0, 6);
      assert.truthy(
        JSON.stringify(firstOpening) !== JSON.stringify(secondOpening),
      );
      assert.truthy(
        firstOpening.every(function (platform) {
          return platform.type === "normal";
        }),
      );
      assert.truthy(
        Game.Math.horizontalOverlap(first.player, firstOpening[0]) >=
          first.player.width * 0.5,
      );
      for (var seed = 1; seed <= 100; seed += 1) {
        var state = Game.GameState.create(seed);
        var opening = state.platforms.slice(0, 6);
        assert.truthy(
          Game.Math.horizontalOverlap(state.player, opening[0]) >=
            state.player.width * 0.5,
        );
        opening.forEach(function (platform, index) {
          assert.equal(platform.type, "normal");
          assert.truthy(platform.x >= 12);
          assert.truthy(
            platform.x + platform.width <= Game.Constants.LOGICAL_WIDTH - 12,
          );
          if (index > 0) {
            var gap = opening[index - 1].y - platform.y;
            assert.truthy(gap >= 104 && gap <= 124);
          }
        });
      }
    },
  );

  Test.test("關卡由平靜開場逐步加入移動、敵人與危險", "generator", function () {
    var opening = Game.Difficulty.get(0);
    var middle = Game.Difficulty.get(700);
    var late = Game.Difficulty.get(2400);
    assert.equal(opening.movingChance, 0);
    assert.equal(opening.enemyChance, 0);
    assert.equal(opening.rareItemChance, 0);
    assert.truthy(middle.movingChance > 0);
    assert.truthy(middle.enemyChance > 0);
    assert.truthy(late.spikeChance > 0);
    assert.truthy(late.holeChance > 0);
    assert.truthy(late.platformWidth < opening.platformWidth);
  });

  Test.test("教學區不會生成危險平台或敵人", "generator", function () {
    var state = Game.GameState.create(42);
    Game.WorldGenerator.ensure(state);
    assert.truthy(state.enemies.length === 0);
    assert.truthy(
      state.platforms.every(function (platform) {
        return platform.type !== "spike";
      }),
    );
  });
})(window.DJGame, window.DJTest);
