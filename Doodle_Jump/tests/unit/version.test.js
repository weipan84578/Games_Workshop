(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("本次修正版號為 1.1.0", "version", function () {
    assert.equal(Game.version, "1.1.0");
  });
})(window.DJGame, window.DJTest);
