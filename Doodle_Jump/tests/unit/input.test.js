(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("左右同時輸入會互相抵銷", "input", function () {
    var manager = Object.create(Game.InputManager.prototype);
    manager.keyboard = { state: { left: true, right: true } };
    manager.pointer = { state: { left: false, right: false } };
    manager.tilt = { enabled: false, value: 0 };
    assert.deepEqual(manager.getState(), { left: false, right: false });
  });

  Test.test("PRNG 不依賴未注入的世界亂數", "input", function () {
    var first = new Game.PRNG(88);
    var second = new Game.PRNG(88);
    assert.equal(first.next(), second.next());
  });
})(window.DJGame, window.DJTest);
