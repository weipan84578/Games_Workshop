(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var GS = NMM.GameState;
  NMM.AI = NMM.AI || {};

  function chooseMove(state, difficulty) {
    var draft = GS.clone(state);
    var level = difficulty || state.difficulty || "normal";
    if (level === "easy") {
      return NMM.AI.Easy.choose(draft);
    }
    if (level === "hard") {
      return NMM.AI.Hard.choose(draft);
    }
    return NMM.AI.Normal.choose(draft);
  }

  function getDelay(difficulty) {
    if (difficulty === "easy") {
      return 360 + Math.floor(Math.random() * 220);
    }
    if (difficulty === "hard") {
      return 520;
    }
    return 460;
  }

  NMM.AI.Dispatcher = {
    chooseMove: chooseMove,
    getDelay: getDelay
  };
})(window);
