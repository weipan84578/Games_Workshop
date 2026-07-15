(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  function appShell(state) {
    var app = Object.create(Game.AppClass.prototype);
    app.appState = new Game.StateMachine(state || "HOME", Game.AppTransitions);
    return app;
  }

  Test.test("App 使用正式狀態機與路由映射", "integration", function () {
    var app = appShell("HOME");
    assert.equal(app.routeState("settings"), "SETTINGS");
    assert.equal(app.transitionTo("PLAYING"), true);
    assert.equal(app.transitionTo("HOME"), false);
    assert.equal(app.appState.state, "PLAYING");
  });

  Test.test("App 會把環境同步成自動 BGM 曲目", "integration", function () {
    var selected = null;
    var app = appShell("PLAYING");
    app.session = {
      state: { environment: "night", trackIndex: 0 },
    };
    app.audio = {
      setAutoTrack: function (track) {
        selected = track;
      },
    };
    assert.equal(app.syncAutoTrack(), 2);
    assert.equal(app.session.state.trackIndex, 2);
    assert.equal(selected, 2);
  });

  Test.test("遊玩中取消返回首頁會恢復遊戲", "integration", function () {
    var app = appShell("PLAYING");
    var resumed = false;
    app.session = {
      paused: false,
      isActive: function () {
        return true;
      },
      pause: function () {
        this.paused = true;
      },
    };
    app.modal = {
      confirm: function () {
        return Promise.resolve(false);
      },
    };
    app.resumeGame = function () {
      resumed = true;
    };
    return app.confirmReturnHome().then(function () {
      assert.equal(app.session.paused, true);
      assert.equal(resumed, true);
    });
  });
})(window.DJGame, window.DJTest);
