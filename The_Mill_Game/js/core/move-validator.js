(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;
  var GS = NMM.GameState;
  var Rules = NMM.Rules;

  function canSelectPiece(state, actor, index) {
    if (state.gameOver || state.awaitingRemoval || state.currentTurn !== actor) {
      return false;
    }
    return state.board[index] === actor && GS.currentPhaseFor(state, actor) !== C.PHASES.PLACING;
  }

  function canPlaceAt(state, actor, index) {
    return state.currentTurn === actor && GS.currentPhaseFor(state, actor) === C.PHASES.PLACING && Rules.isEmpty(state, index);
  }

  function canMoveTo(state, actor, from, to) {
    return Rules.getLegalDestinations(state, actor, from).indexOf(to) >= 0;
  }

  function canRemoveAt(state, index) {
    if (!state.awaitingRemoval) {
      return false;
    }
    var targetActor = GS.opponent(state.awaitingRemoval.by);
    return Rules.getRemovablePieces(state, targetActor).indexOf(index) >= 0;
  }

  NMM.MoveValidator = {
    canSelectPiece: canSelectPiece,
    canPlaceAt: canPlaceAt,
    canMoveTo: canMoveTo,
    canRemoveAt: canRemoveAt
  };
})(window);
