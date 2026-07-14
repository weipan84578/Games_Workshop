(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Game = BigTwo.Game = BigTwo.Game || {};

  function getCurrentPlayer(state) {
    if (!state || !Array.isArray(state.players)) {
      return null;
    }
    return state.players[state.currentPlayerIndex] || null;
  }

  function findPlayerIndex(state, playerId) {
    var index;
    if (!state || !Array.isArray(state.players)) {
      return -1;
    }
    for (index = 0; index < state.players.length; index += 1) {
      if (state.players[index].id === playerId) {
        return index;
      }
    }
    return -1;
  }

  function canPass(state) {
    return !!(state && state.phase === 'playing' && Array.isArray(state.lastPlayedCards) &&
      state.lastPlayedCards.length > 0);
  }

  function getLegalMovesForCurrentPlayer(state) {
    var player = getCurrentPlayer(state);
    if (!player || state.phase !== 'playing') {
      return [];
    }
    return BigTwo.Rules.getLegalMoves(player.hand, state.lastPlayedCards || [], {
      openingMoveRequired: state.openingMoveRequired === true
    });
  }

  function getLegalActions(state) {
    var player = getCurrentPlayer(state);
    var actions;
    if (!player) {
      return [];
    }
    actions = getLegalMovesForCurrentPlayer(state).map(function (cards) {
      return { type: 'PLAY_CARDS', playerId: player.id, cardIds: cards.map(function (card) { return card.id; }) };
    });
    if (canPass(state)) {
      actions.push({ type: 'PASS', playerId: player.id });
    }
    return actions;
  }

  Game.getCurrentPlayer = getCurrentPlayer;
  Game.findPlayerIndex = findPlayerIndex;
  Game.canPass = canPass;
  Game.getLegalMovesForCurrentPlayer = getLegalMovesForCurrentPlayer;
  Game.getLegalActions = getLegalActions;
}(window));
