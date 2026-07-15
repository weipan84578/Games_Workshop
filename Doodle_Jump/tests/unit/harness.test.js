(function (Game, Test) {
  "use strict";
  var assert = Test.assert;
  var asyncCompleted = false;

  Test.test("測試框架會等待 Promise 完成", "framework", function () {
    return Promise.resolve().then(function () {
      asyncCompleted = true;
    });
  });

  Test.test("非同步測試依註冊順序執行", "framework", function () {
    assert.equal(asyncCompleted, true);
  });
})(window.DJGame, window.DJTest);
