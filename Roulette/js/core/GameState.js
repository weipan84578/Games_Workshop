(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};
  const { DIFFICULTY } = R;

  function createGameState(settings) {
    const difficulty = settings.difficulty;
    const config = DIFFICULTY[difficulty] || DIFFICULTY.normal;
    return {
      gameId: globalThis.crypto && typeof globalThis.crypto.randomUUID === "function" ? globalThis.crypto.randomUUID() : `game-${Date.now()}`,
      difficulty,
      round: 1,
      targetBalance: config.target,
      player: {
        balance: config.player,
        totalBet: 0,
        bets: [],
        winHistory: [],
      },
      ai: {
        balance: config.ai,
        totalBet: 0,
        bets: [],
        strategy: null,
        thinkingDuration: 0,
        winHistory: [],
      },
      wheel: {
        type: settings.wheelType,
        lastResults: [],
        currentResult: null,
        isSpinning: false,
      },
      betHistory: [],
      resultHistory: [],
      settings: { ...settings },
    };
  }

  Object.assign(R, { createGameState });
})();
