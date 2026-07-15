(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("持續低 FPS 會降級且穩定恢復後才升級", "performance", function () {
    var changes = [];
    var monitor = new Game.PerformanceMonitor(function (quality) {
      changes.push(quality);
    });
    var time = 0;
    for (var slow = 0; slow < 70; slow += 1) {
      time += 100;
      monitor.sample(30, time);
    }
    assert.equal(monitor.quality, "low");

    for (var fast = 0; fast < 400; fast += 1) {
      time += 100;
      monitor.sample(16, time);
    }
    assert.equal(monitor.quality, "high");
    assert.deepEqual(changes, ["low", "high"]);
  });
})(window.DJGame, window.DJTest);
