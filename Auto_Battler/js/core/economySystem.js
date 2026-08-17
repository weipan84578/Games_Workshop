(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};

  function streakBonus(streak) {
    var count = Math.abs(streak);
    return count >= 5 ? 2 : count >= 3 ? 1 : 0;
  }

  function addPlayerExperience(state, amount) {
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

  function highestOwnedStar(state) {
    return app.BoardSystem.allInstances(state).reduce(function (highest, unit) {
      return Math.max(highest, Math.min(app.UnitData.maxStar, Math.floor(Number(unit.star) || 1)));
    }, 1);
  }

  function cardExperienceOffer(state) {
    var highestStar = highestOwnedStar(state);
    return {
      highestStar: highestStar,
      cost: 4 + (highestStar - 1) * 2,
      amount: Math.max(1, 5 - highestStar)
    };
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
      var levelUps = addPlayerExperience(state, 2);
      state.bestRound = Math.max(state.bestRound, state.round);
      battleResult.income = income;
      battleResult.levelUps = levelUps;
      battleResult.gameOver = state.health <= 0;
      if (!battleResult.gameOver) state.round += 1;
      return battleResult;
    },
    getCardExperienceOffer: cardExperienceOffer,
    buyExperience: function (state) {
      var offer = cardExperienceOffer(state);
      if (state.gold < offer.cost) return { ok: false, reason: "gold", cost: offer.cost, amount: offer.amount };
      state.gold -= offer.cost;
      var unitExperience = app.BoardSystem.addExperienceToAll(state, offer.amount);
      var merged = app.BoardSystem.autoMerge(state);
      return { ok: true, cost: offer.cost, amount: offer.amount, highestStar: offer.highestStar, unitExperience: unitExperience, merged: merged, levelUps: [] };
    },
    streakBonus: streakBonus
  };
}(window));
