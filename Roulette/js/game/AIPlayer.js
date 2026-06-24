(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};
  const { DIFFICULTY, clamp, getResultColor, randomPick, createBet } = R;

  class AIPlayer {
    decideBets(state, board) {
      const config = DIFFICULTY[state.difficulty] || DIFFICULTY.normal;
      const balance = state.ai.balance;
      const maxBudget = Math.max(5, Math.floor(balance * config.aiRatio / 5) * 5);
      const budget = Math.min(balance, maxBudget);
      if (budget < 5) return [];
      const defs = board.betDefs;
      const bets = [];
      const addBet = (id) => {
        const def = defs.get(id);
        if (def && !bets.some((bet) => bet.id === id)) bets.push(def);
      };

      if (state.difficulty === "easy") {
        addBet(randomPick(["outside:red", "outside:black", "outside:odd", "outside:even", "outside:low", "outside:high"]));
      } else if (state.difficulty === "normal") {
        addBet(this.pickOuterByHistory(state));
        if (Math.random() < 0.55) addBet(randomPick(["dozen:1", "dozen:2", "dozen:3"]));
        if (Math.random() < 0.25) addBet(randomPick(["column:top", "column:middle", "column:bottom"]));
        if (Math.random() < 0.1 && state.player.bets[0]) addBet(state.player.bets[0].id);
      } else {
        addBet(this.pickOuterByHistory(state));
        addBet(randomPick(["dozen:1", "dozen:2", "dozen:3"]));
        addBet(randomPick(["column:top", "column:middle", "column:bottom"]));
        const hot = this.hotNumber(state);
        if (hot !== null) addBet(`number:${hot}`);
        if (Math.random() < 0.25 && state.player.bets[0]) addBet(state.player.bets[0].id);
      }

      const diversity = clamp(config.aiDiversity, 1, bets.length || 1);
      const selected = bets.slice(0, diversity);
      const lastNet = state.ai.winHistory[0] || 0;
      const martingale = state.difficulty === "hard" && lastNet < 0 && Math.random() < 0.3 ? 2 : 1;
      const perBet = Math.max(5, Math.floor((budget * martingale) / selected.length / 5) * 5);
      let spent = 0;
      return selected.map((def) => {
        const amount = Math.min(perBet, balance - spent);
        spent += amount;
        return createBet(def, amount);
      }).filter((bet) => bet.amount >= 5);
    }

    pickOuterByHistory(state) {
      const recent = state.wheel.lastResults.slice(0, 5).filter((value) => value !== 0 && value !== "00");
      if (recent.length < 3 || Math.random() > 0.45) {
        return randomPick(["outside:red", "outside:black", "outside:odd", "outside:even", "outside:low", "outside:high"]);
      }
      const redCount = recent.filter((value) => getResultColor(value) === "red").length;
      const oddCount = recent.filter((value) => Number(value) % 2 === 1).length;
      if (redCount >= 3) return "outside:black";
      if (redCount <= 1) return "outside:red";
      if (oddCount >= 3) return "outside:even";
      return "outside:odd";
    }

    hotNumber(state) {
      const counts = new Map();
      state.wheel.lastResults.slice(0, 10).forEach((value) => {
        if (value === "00") return;
        const number = Number(value);
        counts.set(number, (counts.get(number) || 0) + 1);
      });
      let hot = null;
      let count = 0;
      counts.forEach((value, key) => {
        if (value > count) {
          count = value;
          hot = key;
        }
      });
      return hot ?? Math.floor(Math.random() * 37);
    }
  }

  Object.assign(R, { AIPlayer });
})();
