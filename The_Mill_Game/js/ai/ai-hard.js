(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;
  NMM.AI = NMM.AI || {};

  function choose(state) {
    var phase = NMM.GameState.currentPhaseFor(state, C.PLAYERS.AI);
    var depth = phase === C.PHASES.PLACING ? 3 : 4;
    if (NMM.GameState.getOnBoard(state, C.PLAYERS.AI) === 3 || NMM.GameState.getOnBoard(state, C.PLAYERS.PLAYER) === 3) {
      depth += 1;
    }
    return NMM.AI.Search.chooseBySearch(state, depth, 1300);
  }

  NMM.AI.Hard = {
    choose: choose
  };
})(window);
