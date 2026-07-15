(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("排行榜依分數再依高度排序", "leaderboard", function () {
    var entries = [
      Game.TestData.validLeaderboardEntry("a", 10),
      Game.TestData.validLeaderboardEntry("b", 20),
      Game.TestData.validLeaderboardEntry("c", 20),
    ];
    entries[2].height = 300;
    var sorted = Game.LeaderboardStore.sanitize(entries);
    assert.equal(sorted[0].id, "c");
    assert.equal(sorted[1].id, "b");
  });

  Test.test("同一 submission id 不會重複加入", "leaderboard", function () {
    Game.LeaderboardStore.clear();
    var entry = Game.TestData.validLeaderboardEntry("duplicate-id", 999);
    assert.truthy(Game.LeaderboardStore.add(entry).ok);
    assert.truthy(Game.LeaderboardStore.add(entry).duplicate);
    Game.LeaderboardStore.clear();
  });

  Test.test("排行榜最多保留二十筆", "leaderboard", function () {
    var entries = [];
    for (var i = 0; i < 24; i += 1)
      entries.push(Game.TestData.validLeaderboardEntry("entry-" + i, i));
    assert.equal(Game.LeaderboardStore.sanitize(entries).length, 20);
  });
})(window.DJGame, window.DJTest);
