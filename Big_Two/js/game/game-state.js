(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config;
  var Game = BigTwo.Game = BigTwo.Game || {};

  function scoreForPlayer(scores, id, index) {
    var entry;
    if (Array.isArray(scores)) {
      entry = scores[index];
      if (entry && typeof entry === 'object') {
        return Number(entry.score != null ? entry.score : entry.totalScore) || 0;
      }
      return Number(entry) || 0;
    }
    if (scores && typeof scores === 'object') {
      entry = scores[id];
      if (entry && typeof entry === 'object') {
        return Number(entry.score != null ? entry.score : entry.totalScore) || 0;
      }
      return Number(entry) || 0;
    }
    return 0;
  }

  function createPlayers(hands, scores) {
    return Config.PLAYER_IDS.map(function (id, index) {
      return {
        id: id,
        kind: index === 0 ? 'human' : 'ai',
        seat: index,
        hand: hands[index].map(BigTwo.Utils.deepClone),
        cardCount: hands[index].length,
        score: scoreForPlayer(scores, id, index),
        passedLastAction: false
      };
    });
  }

  function createNewGame(options) {
    var settings = options || {};
    var difficulty = settings.difficulty || 'normal';
    var rng;
    var deal;
    var players;
    var openingPlayer;
    if (Config.AI.difficulties.indexOf(difficulty) === -1) {
      throw new RangeError('Unsupported AI difficulty');
    }
    rng = settings.rng && typeof settings.rng.next === 'function' ? settings.rng :
      BigTwo.Utils.RNG.create(settings.rngState || settings.seed || 'big-two-default');
    deal = BigTwo.Deck.createDeal(rng);
    players = createPlayers(deal.hands, settings.scores);
    openingPlayer = players[deal.openingPlayerIndex];
    return {
      schemaVersion: Config.SCHEMA_VERSION,
      phase: 'playing',
      players: players,
      currentPlayerIndex: deal.openingPlayerIndex,
      trickLeaderId: openingPlayer.id,
      lastPlayedCards: [],
      lastHand: null,
      lastPlayedBy: null,
      consecutivePasses: 0,
      openingMoveRequired: true,
      roundNumber: Number.isInteger(settings.roundNumber) && settings.roundNumber > 0 ? settings.roundNumber : 1,
      rngState: deal.rngState,
      actionHistory: [],
      difficulty: difficulty,
      roundResult: null
    };
  }

  function cloneState(state) {
    return BigTwo.Utils.deepClone(state);
  }

  Game.createPlayers = createPlayers;
  Game.createNewGame = createNewGame;
  Game.createInitialState = createNewGame;
  Game.cloneState = cloneState;
}(window));
