(function (global) {
  "use strict";
  var CCC = global.CCC;

  function pauseForLifecycle() {
    var session = CCC.state.session;
    if (session && session.running && !session.paused) {
      CCC.state.pausedByLifecycle = true;
      session.pause("lifecycle");
    }
    CCC.audio.suspend();
  }

  function resumeFromLifecycle() {
    var session = CCC.state.session;
    if (session && CCC.state.pausedByLifecycle && !CCC.state.dialogOpen && CCC.state.screen === "game") {
      CCC.state.pausedByLifecycle = false;
      session.resume("lifecycle");
    }
    CCC.audio.resume();
  }

  CCC.lifecycle = {
    init: function () {
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) { pauseForLifecycle(); } else { resumeFromLifecycle(); }
      });
      global.addEventListener("blur", pauseForLifecycle);
      global.addEventListener("focus", resumeFromLifecycle);
      global.addEventListener("resize", function () { CCC.events.emit("viewportchange"); });
      global.addEventListener("orientationchange", function () {
        if (CCC.ui && CCC.ui.input) { CCC.ui.input.cancelDrag(); }
        CCC.events.emit("viewportchange");
      });
    }
  };
}(typeof window !== "undefined" ? window : globalThis));
