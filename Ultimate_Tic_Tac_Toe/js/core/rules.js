(function () {
  "use strict";

  function isBoardPlayable(state, br, bc) {
    return state &&
      state.phase === "playing" &&
      window.BoardUtils.isInRange(br) &&
      window.BoardUtils.isInRange(bc) &&
      !state.megaBoard[br][bc];
  }

  function getNextBoard(cr, cc) {
    if (!window.BoardUtils.isInRange(cr) || !window.BoardUtils.isInRange(cc)) return null;
    return { br: cr, bc: cc };
  }

  function mustPlayBoard(state) {
    if (state.nextBoard && isBoardPlayable(state, state.nextBoard.br, state.nextBoard.bc)) {
      return state.nextBoard;
    }
    return null;
  }

  function isValidMove(state, br, bc, cr, cc) {
    if (!state || state.phase !== "playing") return false;
    if (![br, bc, cr, cc].every(window.BoardUtils.isInRange)) return false;
    if (!isBoardPlayable(state, br, bc)) return false;
    if (state.boards[br][bc][cr][cc]) return false;

    var target = mustPlayBoard(state);
    if (target && (target.br !== br || target.bc !== bc)) return false;

    return true;
  }

  window.Rules = {
    isBoardPlayable: isBoardPlayable,
    getNextBoard: getNextBoard,
    mustPlayBoard: mustPlayBoard,
    isValidMove: isValidMove
  };
})();
