(function (NimGame) {
  'use strict';

  function createGame(settings, savedState) {
    if (savedState && Array.isArray(savedState.piles)) {
      return {
        piles: NimGame.Rules.clonePiles(savedState.piles),
        currentTurn: savedState.currentTurn || 'player',
        rule: savedState.rule || settings.rule,
        difficulty: savedState.difficulty || settings.difficulty,
        setup: savedState.setup || settings.setup,
        firstTurn: savedState.firstTurn || settings.firstTurn,
        objectSkin: savedState.objectSkin || settings.objectSkin,
        startedAt: savedState.startedAt || Date.now(),
        lastActor: savedState.lastActor || null,
        status: savedState.status || 'playing'
      };
    }

    return {
      piles: NimGame.Rules.getPresetPiles(settings),
      currentTurn: NimGame.Rules.getFirstTurn(settings.firstTurn),
      rule: settings.rule,
      difficulty: settings.difficulty,
      setup: settings.setup,
      firstTurn: settings.firstTurn,
      objectSkin: settings.objectSkin,
      startedAt: Date.now(),
      lastActor: null,
      status: 'playing'
    };
  }

  function validateMove(game, pileIndex, amount) {
    var pile = game.piles[pileIndex];
    return game.status === 'playing' &&
      game.currentTurn === 'player' &&
      typeof pile === 'number' &&
      amount >= 1 &&
      amount <= pile;
  }

  function applyMove(game, actor, pileIndex, amount) {
    if (!game || game.status !== 'playing') {
      return { ok: false, reason: 'not-playing' };
    }
    if (actor !== game.currentTurn) {
      return { ok: false, reason: 'wrong-turn' };
    }
    if (typeof game.piles[pileIndex] !== 'number' || amount < 1 || amount > game.piles[pileIndex]) {
      return { ok: false, reason: 'invalid-move' };
    }

    game.piles[pileIndex] -= amount;
    game.lastActor = actor;

    if (NimGame.Rules.isGameOver(game.piles)) {
      game.status = 'ended';
      game.winner = NimGame.Rules.getWinner(game.rule, actor);
      return { ok: true, ended: true, winner: game.winner };
    }

    game.currentTurn = actor === 'player' ? 'ai' : 'player';
    return { ok: true, ended: false, nextTurn: game.currentTurn };
  }

  NimGame.GameEngine = {
    createGame: createGame,
    validateMove: validateMove,
    applyMove: applyMove
  };
}(window.NimGame = window.NimGame || {}));
