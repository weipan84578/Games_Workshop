(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("高度只計算新的最高值", "score", function () {
    var score = Game.ScoreService.create(500);
    Game.ScoreService.updateHeight(score, 400);
    Game.ScoreService.updateHeight(score, 450);
    assert.equal(score.maxHeight, 10);
    assert.equal(score.total, 10);
  });

  Test.test("連擊倍率上限為三倍", "score", function () {
    var score = Game.ScoreService.create(500);
    Game.ScoreService.landed(score, "a");
    Game.ScoreService.landed(score, "b");
    Game.ScoreService.landed(score, "c");
    Game.ScoreService.landed(score, "d");
    assert.equal(score.currentCombo, 4);
    assert.equal(score.bestCombo, 4);
    assert.equal(score.comboScore, 90);
  });

  Test.test("里程碑只獎勵一次", "score", function () {
    var score = Game.ScoreService.create(500);
    Game.ScoreService.updateHeight(score, -4500);
    assert.equal(Game.ScoreService.milestones(score).length, 1);
    assert.equal(Game.ScoreService.milestones(score).length, 0);
  });
})(window.DJGame, window.DJTest);
