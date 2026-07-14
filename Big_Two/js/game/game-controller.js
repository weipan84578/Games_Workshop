(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Game = BigTwo.Game = BigTwo.Game || {};
  var Errors = BigTwo.Errors = BigTwo.Errors || {};

  function GameActionError(code, message) {
    this.name = 'GameActionError';
    this.code = code;
    this.message = message;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GameActionError);
    }
  }
  GameActionError.prototype = Object.create(Error.prototype);
  GameActionError.prototype.constructor = GameActionError;

  function invalid(code, message) {
    return { valid: false, code: code, message: message };
  }

  function validateAction(state, action) {
    var current;
    var ids;
    var selected;
    var evaluation;
    if (!state || typeof state !== 'object' || !Array.isArray(state.players)) {
      return invalid('INVALID_STATE', 'The game state is invalid');
    }
    if (!action || typeof action.type !== 'string') {
      return invalid('INVALID_ACTION', 'The action is invalid');
    }
    if (action.type === 'START_NEXT_ROUND') {
      return state.phase === 'finished' ? { valid: true } :
        invalid('ROUND_NOT_FINISHED', 'The current round has not finished');
    }
    if (state.phase !== 'playing') {
      return invalid('GAME_NOT_PLAYING', 'The game is not accepting turn actions');
    }
    current = Game.getCurrentPlayer(state);
    if (!current || action.playerId !== current.id) {
      return invalid('NOT_CURRENT_PLAYER', 'Only the current player may act');
    }
    if (action.type === 'PASS') {
      return Game.canPass(state) ? { valid: true } : invalid('CANNOT_PASS_ON_LEAD', 'The leading player cannot pass');
    }
    if (action.type !== 'PLAY_CARDS') {
      return invalid('UNKNOWN_ACTION', 'Unknown game action');
    }
    if (!Array.isArray(action.cardIds) || action.cardIds.length === 0) {
      return invalid('NO_CARDS_SELECTED', 'No cards were selected');
    }
    ids = BigTwo.Utils.unique(action.cardIds);
    if (ids.length !== action.cardIds.length || !ids.every(function (id) { return typeof id === 'string'; })) {
      return invalid('INVALID_CARD_IDS', 'Card ids must be unique strings');
    }
    selected = ids.map(function (id) {
      return current.hand.filter(function (card) { return card.id === id; })[0];
    });
    if (selected.some(function (card) { return !card; })) {
      return invalid('CARD_NOT_IN_HAND', 'A selected card is not in the current hand');
    }
    evaluation = BigTwo.Rules.classifyHand(selected);
    if (!evaluation.valid) {
      return invalid('INVALID_HAND', evaluation.reason);
    }
    if (!BigTwo.Rules.isOpeningMove(selected, { openingMoveRequired: state.openingMoveRequired })) {
      return invalid('OPENING_CARD_REQUIRED', 'The opening move must contain the three of clubs');
    }
    if (state.lastPlayedCards.length && !BigTwo.Rules.canBeat(selected, state.lastPlayedCards)) {
      return invalid('CANNOT_BEAT_TABLE', 'The selected cards cannot beat the table hand');
    }
    return { valid: true, cards: selected, evaluation: evaluation };
  }

  function applyPlay(state, action, validation) {
    var next = BigTwo.Utils.deepClone(state);
    var current = next.players[next.currentPlayerIndex];
    var selectedIds = {};
    var selected;
    var roundResult;
    validation.cards.forEach(function (card) { selectedIds[card.id] = true; });
    selected = validation.cards.map(BigTwo.Utils.deepClone);
    current.hand = current.hand.filter(function (card) { return !selectedIds[card.id]; });
    current.cardCount = current.hand.length;
    current.passedLastAction = false;
    next.lastPlayedCards = selected;
    next.lastHand = BigTwo.Utils.deepClone(validation.evaluation);
    next.lastPlayedBy = current.id;
    next.trickLeaderId = current.id;
    next.consecutivePasses = 0;
    next.openingMoveRequired = false;
    if (typeof action.rngState === 'string') {
      next.rngState = action.rngState;
    }
    next.actionHistory.push({
      type: 'PLAY_CARDS',
      playerId: current.id,
      cardIds: action.cardIds.slice(),
      cards: selected.map(BigTwo.Utils.deepClone),
      hand: BigTwo.Utils.deepClone(validation.evaluation),
      roundNumber: next.roundNumber
    });
    if (current.hand.length === 0) {
      next.phase = 'finished';
      roundResult = BigTwo.Rules.scoreRound(next.players, current.id);
      next.players.forEach(function (player) {
        player.score += roundResult.deltas[player.id];
      });
      next.roundResult = roundResult;
      return next;
    }
    next.currentPlayerIndex = (next.currentPlayerIndex + 1) % next.players.length;
    return next;
  }

  function applyPass(state, action) {
    var next = BigTwo.Utils.deepClone(state);
    var current = next.players[next.currentPlayerIndex];
    var leaderIndex;
    current.passedLastAction = true;
    if (typeof action.rngState === 'string') {
      next.rngState = action.rngState;
    }
    next.consecutivePasses += 1;
    next.actionHistory.push({
      type: 'PASS',
      playerId: current.id,
      roundNumber: next.roundNumber
    });
    if (next.consecutivePasses === next.players.length - 1) {
      leaderIndex = Game.findPlayerIndex(next, next.lastPlayedBy);
      next.lastPlayedCards = [];
      next.lastHand = null;
      next.lastPlayedBy = null;
      next.consecutivePasses = 0;
      next.currentPlayerIndex = leaderIndex;
      next.players.forEach(function (player) { player.passedLastAction = false; });
      return next;
    }
    next.currentPlayerIndex = (next.currentPlayerIndex + 1) % next.players.length;
    return next;
  }

  function applyAction(state, action) {
    var validation = validateAction(state, action);
    var scores;
    if (!validation.valid) {
      throw new GameActionError(validation.code, validation.message);
    }
    if (action.type === 'START_NEXT_ROUND') {
      scores = {};
      state.players.forEach(function (player) { scores[player.id] = player.score; });
      return Game.createNewGame({
        rngState: state.rngState,
        roundNumber: state.roundNumber + 1,
        scores: scores,
        difficulty: state.difficulty || 'normal'
      });
    }
    return action.type === 'PASS' ? applyPass(state, action) : applyPlay(state, action, validation);
  }

  Errors.GameActionError = GameActionError;
  Game.validateAction = validateAction;
  Game.applyAction = applyAction;
}(window));
