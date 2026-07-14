(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config;
  var SaveSchema = BigTwo.SaveSchema = BigTwo.SaveSchema || {};

  function checksumFor(value) {
    var text = BigTwo.Utils.stableStringify(value);
    var hash = 2166136261;
    var index;
    for (index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return ('00000000' + (hash >>> 0).toString(16)).slice(-8);
  }

  function snapshotPayload(snapshot) {
    return {
      schemaVersion: snapshot.schemaVersion,
      savedAt: snapshot.savedAt,
      appVersion: snapshot.appVersion,
      gameState: snapshot.gameState
    };
  }

  function createSnapshot(gameState, options) {
    var settings = options || {};
    var snapshot = {
      schemaVersion: Config.SCHEMA_VERSION,
      savedAt: settings.savedAt || new Date().toISOString(),
      appVersion: settings.appVersion || Config.APP_VERSION,
      gameState: BigTwo.Utils.deepClone(gameState)
    };
    snapshot.checksum = checksumFor(snapshotPayload(snapshot));
    return snapshot;
  }

  function fail(reason) {
    return { valid: false, reason: reason };
  }

  function validateGameState(state) {
    var phases = ['dealing', 'playing', 'resolving', 'finished'];
    var ids = {};
    var seats = {};
    var playerById = {};
    var playerBySeat = {};
    var cards = {};
    var playedCards = {};
    var playActions = [];
    var tableEvaluation;
    var knownDeck;
    var emptyHands = 0;
    if (!state || typeof state !== 'object' || state.schemaVersion !== Config.SCHEMA_VERSION) {
      return fail('unsupportedGameSchema');
    }
    if (phases.indexOf(state.phase) === -1 || !Array.isArray(state.players) || state.players.length !== 4) {
      return fail('invalidPlayersOrPhase');
    }
    if (!Number.isInteger(state.currentPlayerIndex) || state.currentPlayerIndex < 0 || state.currentPlayerIndex > 3) {
      return fail('invalidCurrentPlayerIndex');
    }
    if (!Number.isInteger(state.roundNumber) || state.roundNumber < 1 || typeof state.rngState !== 'string' ||
        !Array.isArray(state.actionHistory) || typeof state.openingMoveRequired !== 'boolean' ||
        !Number.isInteger(state.consecutivePasses) || state.consecutivePasses < 0 || state.consecutivePasses > 2) {
      return fail('invalidStateFields');
    }
    state.players.forEach(function (player) {
      if (!player || typeof player.id !== 'string' || ids[player.id] ||
          (player.kind !== 'human' && player.kind !== 'ai') ||
          !Number.isInteger(player.seat) || player.seat < 0 || player.seat > 3 || seats[player.seat] ||
          !Array.isArray(player.hand) || player.hand.length > 13 ||
          typeof player.score !== 'number' || !isFinite(player.score) ||
          typeof player.passedLastAction !== 'boolean') {
        return;
      }
      ids[player.id] = true;
      seats[player.seat] = true;
      playerById[player.id] = player;
      playerBySeat[player.seat] = player;
      if (player.hand.length === 0) { emptyHands += 1; }
      if (typeof player.cardCount === 'number' && player.cardCount !== player.hand.length) {
        cards.__invalidCount = true;
      }
      player.hand.forEach(function (card) {
        if (!BigTwo.Utils.Validation.isCard(card) || cards[card.id]) {
          cards.__invalid = true;
        } else {
          cards[card.id] = true;
        }
      });
    });
    if (Object.keys(ids).length !== 4 || Object.keys(seats).length !== 4 || cards.__invalid || cards.__invalidCount) {
      return fail('invalidPlayerData');
    }
    state.actionHistory.forEach(function (action) {
      if (!action || ['PLAY_CARDS', 'PASS'].indexOf(action.type) === -1 || !ids[action.playerId]) {
        playedCards.__invalid = true;
        return;
      }
      if (action.type === 'PLAY_CARDS') {
        var actionCards;
        if (!Array.isArray(action.cardIds) || !action.cardIds.length) {
          playedCards.__invalid = true;
          return;
        }
        action.cardIds.forEach(function (cardId) {
          if (!BigTwo.Card.parse(cardId) || cards[cardId] || playedCards[cardId]) {
            playedCards.__invalid = true;
          } else {
            playedCards[cardId] = true;
          }
        });
        actionCards = action.cardIds.map(function (cardId) { return BigTwo.Card.parse(cardId); });
        if (!BigTwo.Rules.classifyHand(actionCards).valid) {
          playedCards.__invalid = true;
        }
        playActions.push(action);
      }
    });
    if (playedCards.__invalid) {
      return fail('invalidActionHistory');
    }
    if (state.actionHistory.length) {
      var expectedPlayerId = state.actionHistory[0].playerId;
      var reconstructedLastPlayer = null;
      var reconstructedPasses = 0;
      var tableActive = false;
      var sequenceInvalid = false;
      state.actionHistory.forEach(function (action, actionIndex) {
        var actor = playerById[action.playerId];
        if (!actor || action.playerId !== expectedPlayerId) {
          sequenceInvalid = true;
          return;
        }
        if (action.type === 'PLAY_CARDS') {
          if (actionIndex === 0 && action.cardIds.indexOf(Config.OPENING_CARD_ID) === -1) {
            sequenceInvalid = true;
          }
          reconstructedLastPlayer = actor.id;
          reconstructedPasses = 0;
          tableActive = true;
          expectedPlayerId = playerBySeat[(actor.seat + 1) % 4].id;
        } else {
          if (!tableActive) {
            sequenceInvalid = true;
            return;
          }
          reconstructedPasses += 1;
          if (reconstructedPasses === 3) {
            tableActive = false;
            reconstructedPasses = 0;
            expectedPlayerId = reconstructedLastPlayer;
          } else {
            expectedPlayerId = playerBySeat[(actor.seat + 1) % 4].id;
          }
        }
      });
      if (sequenceInvalid || state.openingMoveRequired ||
          tableActive !== (state.lastPlayedCards.length > 0) ||
          reconstructedPasses !== state.consecutivePasses ||
          (tableActive ? state.lastPlayedBy !== reconstructedLastPlayer : state.lastPlayedBy !== null) ||
          (state.phase === 'playing' && state.players[state.currentPlayerIndex].id !== expectedPlayerId) ||
          (state.phase === 'finished' && state.players[state.currentPlayerIndex].id !== reconstructedLastPlayer)) {
        return fail('invalidActionSequence');
      }
    } else {
      if (!state.openingMoveRequired || state.lastPlayedCards.length || state.consecutivePasses !== 0 ||
          !state.players[state.currentPlayerIndex].hand.some(function (card) {
            return card.id === Config.OPENING_CARD_ID;
          })) {
        return fail('invalidOpeningState');
      }
    }
    knownDeck = Object.keys(cards).concat(Object.keys(playedCards));
    if (knownDeck.length !== 52 || BigTwo.Utils.unique(knownDeck).length !== 52) {
      return fail('incompleteOrDuplicateDeck');
    }
    if (!Array.isArray(state.lastPlayedCards) || !state.lastPlayedCards.every(BigTwo.Utils.Validation.isCard)) {
      return fail('invalidLastPlayedCards');
    }
    if (state.lastPlayedCards.length) {
      if (!state.lastPlayedCards.every(function (card) { return playedCards[card.id]; })) {
        return fail('lastPlayedCardsNotInHistory');
      }
      tableEvaluation = BigTwo.Rules.classifyHand(state.lastPlayedCards);
      if (!tableEvaluation.valid || !state.lastHand || state.lastHand.valid !== true ||
          state.lastHand.cardCount !== state.lastPlayedCards.length || state.lastHand.reason !== null ||
          tableEvaluation.type !== state.lastHand.type ||
          !BigTwo.Utils.deepEqual(tableEvaluation.tieBreakers, state.lastHand.tieBreakers)) {
        return fail('invalidLastHand');
      }
      if (typeof state.lastPlayedBy !== 'string' || !ids[state.lastPlayedBy]) {
        return fail('invalidLastPlayedBy');
      }
    } else if (state.lastHand !== null || state.lastPlayedBy !== null) {
      return fail('staleTableState');
    }
    if (state.trickLeaderId !== null && !ids[state.trickLeaderId]) {
      return fail('invalidTrickLeader');
    }
    if (state.phase === 'finished' && emptyHands < 1) {
      return fail('finishedWithoutWinner');
    }
    if (state.phase === 'playing' && emptyHands > 0) {
      return fail('playingWithEmptyHand');
    }
    return { valid: true, reason: null };
  }

  function validateSnapshot(snapshot) {
    var stateResult;
    if (!snapshot || typeof snapshot !== 'object' || snapshot.schemaVersion !== Config.SCHEMA_VERSION) {
      return fail('unsupportedSnapshotSchema');
    }
    if (typeof snapshot.savedAt !== 'string' || !isFinite(Date.parse(snapshot.savedAt)) ||
        typeof snapshot.appVersion !== 'string' || typeof snapshot.checksum !== 'string') {
      return fail('invalidSnapshotFields');
    }
    stateResult = validateGameState(snapshot.gameState);
    if (!stateResult.valid) {
      return stateResult;
    }
    if (checksumFor(snapshotPayload(snapshot)) !== snapshot.checksum) {
      return fail('checksumMismatch');
    }
    return { valid: true, reason: null };
  }

  SaveSchema.checksumFor = checksumFor;
  SaveSchema.createSnapshot = createSnapshot;
  SaveSchema.validateGameState = validateGameState;
  SaveSchema.validateSnapshot = validateSnapshot;
}(window));
