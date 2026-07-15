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
