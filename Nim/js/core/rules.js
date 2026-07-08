(function (NimGame) {
  'use strict';

  var PRESETS = {
    classic: [3, 4, 5],
    standard: [1, 3, 5, 7],
    advanced: [2, 4, 6, 8, 10]
  };

  function clonePiles(piles) {
    return piles.map(function (count) {
      return Math.max(0, parseInt(count, 10) || 0);
    });
  }

  function isGameOver(piles) {
    return clonePiles(piles).every(function (count) {
      return count === 0;
    });
  }

  function getWinner(rule, actorTakingLast) {
    if (rule === 'misere') {
      return actorTakingLast === 'player' ? 'ai' : 'player';
    }
    return actorTakingLast;
  }

  function getPresetPiles(settings) {
    var setup = settings.setup || 'classic';
    if (setup === 'custom') {
      return clonePiles(settings.customPiles || PRESETS.classic).slice(0, 6).map(function (count) {
        return NimGame.dom.clamp(count, 1, 20);
      });
    }
    return clonePiles(PRESETS[setup] || PRESETS.classic);
  }

  function getFirstTurn(mode) {
    if (mode === 'ai') {
      return 'ai';
    }
    if (mode === 'random') {
      return Math.random() < 0.5 ? 'player' : 'ai';
    }
    return 'player';
  }

  NimGame.Rules = {
    presets: PRESETS,
    clonePiles: clonePiles,
    isGameOver: isGameOver,
    getWinner: getWinner,
    getPresetPiles: getPresetPiles,
    getFirstTurn: getFirstTurn
  };
}(window.NimGame = window.NimGame || {}));
