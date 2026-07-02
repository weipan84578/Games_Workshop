(function (ns) {
  "use strict";

  ns.SfxMap = {
    button: { notes: [880], duration: 0.045, type: "sine", gain: 0.28 },
    hitWall: { notes: [1175, 1568], duration: 0.06, type: "triangle", gain: 0.22 },
    hitMallet: { notes: [784, 1175], duration: 0.07, type: "triangle", gain: 0.24 },
    goal: { notes: [784, 988, 1319, 1760], duration: 0.13, type: "sine", gain: 0.22 },
    countdown: { notes: [1047], duration: 0.08, type: "sine", gain: 0.2 },
    countdownFinal: { notes: [1568], duration: 0.12, type: "sine", gain: 0.24 }
  };
})(window.AirHockey = window.AirHockey || {});
