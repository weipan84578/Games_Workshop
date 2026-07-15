(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("磁鐵只會吸引範圍內的星星", "item", function () {
    var player = Game.Player.create(100, 100);
    var nearby = Game.Item.create("near", 180, 100, "star");
    var distant = Game.Item.create("far", 390, 600, "star");
    var before = Game.Math.distance(nearby, player);

    assert.equal(Game.Item.attract(nearby, player, 0.1), true);
    assert.truthy(Game.Math.distance(nearby, player) < before);
    assert.equal(Game.Item.attract(distant, player, 0.1), false);
  });

  Test.test("幸運狀態會提高稀有道具判定率", "item", function () {
    function fakeRng() {
      return {
        next: function () {
          return 0.3;
        },
        pick: function (values) {
          return values[0];
        },
      };
    }
    var difficulty = { stage: 1, rareItemChance: 0.16 };

    assert.equal(
      Game.WorldGenerator.chooseItemType(fakeRng(), difficulty, false),
      "star",
    );
    assert.equal(
      Game.WorldGenerator.chooseItemType(fakeRng(), difficulty, true),
      "spring",
    );
  });
})(window.DJGame, window.DJTest);
