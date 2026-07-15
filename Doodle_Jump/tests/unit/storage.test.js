(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("Storage 可以 round-trip JSON", "storage", function () {
    var key = "djgame.test.roundtrip";
    Game.Storage.write(key, { value: 7 });
    assert.deepEqual(
      Game.Storage.read(
        key,
        function (value) {
          return value.value === 7;
        },
        null,
      ).value,
      { value: 7 },
    );
    Game.Storage.remove(key);
  });

  Test.test("損壞 JSON 會安全回傳 fallback", "storage", function () {
    var key = "djgame.test.invalid";
    try {
      window.localStorage.setItem(key, "{bad");
    } catch (error) {}
    assert.equal(
      Game.Storage.read(
        key,
        function () {
          return true;
        },
        "fallback",
      ).value,
      "fallback",
    );
    Game.Storage.remove(key);
  });
})(window.DJGame, window.DJTest);
