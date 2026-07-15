(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  Test.test("狀態機允許合法轉換並拒絕非法轉換", "state-machine", function () {
    var machine = new Game.StateMachine("HOME", {
      HOME: ["PLAYING"],
      PLAYING: ["PAUSED"],
      PAUSED: ["PLAYING"],
    });
    assert.truthy(machine.transition("PLAYING"));
    assert.equal(machine.state, "PLAYING");
    assert.equal(machine.transition("HOME"), false);
  });

  Test.test("事件匯流排可取消訂閱", "state-machine", function () {
    var bus = new Game.EventBus();
    var calls = 0;
    var off = bus.on("test", function () {
      calls += 1;
    });
    bus.emit("test");
    off();
    bus.emit("test");
    assert.equal(calls, 1);
  });
})(window.DJGame, window.DJTest);
