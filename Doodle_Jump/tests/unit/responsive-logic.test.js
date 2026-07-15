(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  function layout(width, height) {
    if (height < 520 && width > height) return "landscape-safe-rails";
    if (width < 480) return "small-portrait";
    if (width < 900) return "tablet-portrait";
    return "desktop";
  }

  Test.test("320px 直向使用底部控制列", "responsive", function () {
    assert.equal(layout(320, 568), "small-portrait");
  });

  Test.test("568×320 橫向使用左右安全欄", "responsive", function () {
    assert.equal(layout(568, 320), "landscape-safe-rails");
  });

  Test.test("1366px 桌面使用側欄版面", "responsive", function () {
    assert.equal(layout(1366, 768), "desktop");
  });
})(window.DJGame, window.DJTest);
