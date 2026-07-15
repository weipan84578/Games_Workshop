(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("低品質模式會同步降低 Canvas DPR", "rendering", function () {
    var applied = null;
    var renderer = new Game.Renderer({
      ctx: {},
      setQuality: function (quality) {
        applied = quality;
      },
    });
    renderer.setQuality("low");
    assert.equal(renderer.quality, "low");
    assert.equal(applied, "low");
  });

  Test.test("減少動態會取消並阻止畫面震動", "rendering", function () {
    var renderer = new Game.Renderer({ ctx: {} });
    renderer.shake(8, 200);
    assert.truthy(renderer.shakeUntil > Game.now());
    renderer.setReducedMotion(true);
    assert.equal(renderer.shakeUntil, 0);
    renderer.shake(8, 200);
    assert.equal(renderer.shakeUntil, 0);
  });
})(window.DJGame, window.DJTest);
