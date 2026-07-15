(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("有效存檔可通過 schema 驗證", "save-store", function () {
    var state = Game.GameState.create(101);
    var snapshot = Game.GameState.snapshot(state);
    assert.truthy(Game.SaveStore.isValid(snapshot));
  });

  Test.test("NaN 或過大的陣列會被拒絕", "save-store", function () {
    var state = Game.GameState.snapshot(Game.GameState.create(102));
    state.player.x = NaN;
    assert.equal(Game.SaveStore.isValid(state), false);
    state.platforms = new Array(41).fill({});
    assert.equal(Game.SaveStore.isValid(state), false);
  });
})(window.DJGame, window.DJTest);
