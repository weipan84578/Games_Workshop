(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};

  function streakBonus(streak) {
    var count = Math.abs(streak);
    return count >= 5 ? 2 : count >= 3 ? 1 : 0;
  }

  function addExperience(state, amount) {
    var levels = [];
    state.xp += amount;
    while (state.level < 8 && state.xp >= state.xpToNext) {
      state.xp -= state.xpToNext;
      state.level += 1;
      state.xpToNext = 4 + state.level * 2;
      levels.push(state.level);
    }
    return levels;
  }

  app.EconomySystem = {
    getIncome: function (state) {
      var base = 5;
      var interest = Math.min(5, Math.floor(state.gold / 10));
      var streak = streakBonus(state.streak);
      return { base: base, interest: interest, streak: streak, total: base + interest + streak };
    },
    settle: function (state, battleResult) {
      var won = battleResult.winner === "player";
      var draw = battleResult.winner === "draw";
      if (won) {
        state.wins += 1;
        state.streak = state.streak >= 0 ? state.streak + 1 : 1;
      } else if (!draw) {
        state.losses += 1;
        state.streak = state.streak <= 0 ? state.streak - 1 : -1;
        state.health = Math.max(0, state.health - battleResult.damage);
      } else {
        state.streak = 0;
      }
      var income = this.getIncome(state);
      state.gold += income.total;
      var levelUps = addExperience(state, 2);
      state.bestRound = Math.max(state.bestRound, state.round);
      battleResult.income = income;
      battleResult.levelUps = levelUps;
      battleResult.gameOver = state.health <= 0;
      if (!battleResult.gameOver) state.round += 1;
      return battleResult;
    },
    buyExperience: function (state) {
      var cost = 4;
      if (state.gold < cost || state.level >= 8) return { ok: false, reason: state.level >= 8 ? "max-level" : "gold" };
      state.gold -= cost;
      var levelUps = addExperience(state, 4);
      return { ok: true, cost: cost, amount: 4, levelUps: levelUps };
    },
    streakBonus: streakBonus
  };
}(window));
