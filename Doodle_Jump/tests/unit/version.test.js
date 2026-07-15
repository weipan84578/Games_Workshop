(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("本次功能版號為 1.2.0", "version", function () {
    assert.equal(Game.version, "1.2.0");
  });
})(window.DJGame, window.DJTest);
