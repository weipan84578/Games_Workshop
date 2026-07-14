(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config = BigTwo.Config || {};

  Config.APP_VERSION = '4.0.0';
  Config.SCHEMA_VERSION = 1;
  Config.RANKS = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
  Config.SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
  Config.RANK_VALUES = {
    '3': 0, '4': 1, '5': 2, '6': 3, '7': 4, '8': 5, '9': 6,
    '10': 7, J: 8, Q: 9, K: 10, A: 11, '2': 12
  };
  Config.SUIT_VALUES = { clubs: 0, diamonds: 1, hearts: 2, spades: 3 };
  Config.SUIT_SYMBOLS = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
  Config.HAND_TYPES = [
    'single', 'pair', 'triple', 'straight', 'flush',
    'fullHouse', 'fourOfAKind', 'straightFlush'
  ];
  Config.FIVE_CARD_STRENGTH = {
    straight: 0,
    flush: 1,
    fullHouse: 2,
    fourOfAKind: 3,
    straightFlush: 4
  };
  Config.OPENING_CARD_ID = '3-clubs';
  Config.PLAYER_IDS = ['human', 'ai1', 'ai2', 'ai3'];
  Config.STORAGE_KEYS = {
    settings: 'bigTwo.settings.v1',
    activeGame: 'bigTwo.activeGame.v1',
    statistics: 'bigTwo.statistics.v1',
    audioNoticeSeen: 'bigTwo.audioNoticeSeen.v1'
  };
  Config.DEFAULT_SETTINGS = {
    difficulty: 'normal',
    theme: 'realistic',
    locale: 'zh-Hant',
    animationsEnabled: true,
    musicEnabled: true,
    musicVolume: 40,
    sfxEnabled: true,
    sfxVolume: 70,
    musicTrack: 'auto'
  };
  Config.DEFAULT_STATISTICS = {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    currentWinStreak: 0,
    bestWinStreak: 0,
    totalScore: 0,
    winsByDifficulty: { easy: 0, normal: 0, hard: 0 }
  };
  Config.AI = {
    difficulties: ['easy', 'normal', 'hard'],
    hardNodeLimit: 6000,
    hardTimeLimitMs: 450
  };
}(window));
