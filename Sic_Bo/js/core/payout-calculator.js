(function () {
  window.SicBo = window.SicBo || {};

  function statsForDice(dice) {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const total = dice.reduce(function (sum, value) {
      counts[value] += 1;
      return sum + value;
    }, 0);
    const isTriple = dice[0] === dice[1] && dice[1] === dice[2];
    return { counts: counts, isTriple: isTriple, total: total };
  }

  function profitMultiplier(bet, dice) {
    const stats = statsForDice(dice);
    if (!bet) return 0;

    if (bet.id === "big") {
      return !stats.isTriple && stats.total >= 11 && stats.total <= 17 ? bet.payout : 0;
    }
    if (bet.id === "small") {
      return !stats.isTriple && stats.total >= 4 && stats.total <= 10 ? bet.payout : 0;
    }
    if (bet.id === "odd") {
      return !stats.isTriple && stats.total % 2 === 1 ? bet.payout : 0;
    }
    if (bet.id === "even") {
      return !stats.isTriple && stats.total % 2 === 0 ? bet.payout : 0;
    }
    if (bet.kind === "total") {
      return stats.total === bet.value ? bet.payout : 0;
    }
    if (bet.kind === "single") {
      return stats.counts[bet.value];
    }
    if (bet.kind === "double") {
      return stats.counts[bet.value] >= 2 ? bet.payout : 0;
    }
    if (bet.kind === "anyTriple") {
      return stats.isTriple ? bet.payout : 0;
    }
    if (bet.kind === "triple") {
      return stats.counts[bet.value] === 3 ? bet.payout : 0;
    }
    if (bet.kind === "combo") {
      return stats.counts[bet.values[0]] > 0 && stats.counts[bet.values[1]] > 0 ? bet.payout : 0;
    }
    return 0;
  }

  function settleBet(bet, stake, dice) {
    const multiplier = profitMultiplier(bet, dice);
    const profit = stake * multiplier;
    return {
      bet: bet,
      profit: profit,
      returnAmount: multiplier > 0 ? stake + profit : 0,
      stake: stake,
      multiplier: multiplier,
      won: multiplier > 0
    };
  }

  function settleBets(currentBets, dice) {
    const details = Object.keys(currentBets).map(function (id) {
      return settleBet(window.SicBo.BetTypes.byId[id], currentBets[id], dice);
    });
    const returnAmount = details.reduce(function (sum, item) { return sum + item.returnAmount; }, 0);
    const profit = details.reduce(function (sum, item) { return sum + item.profit; }, 0);
    const stake = details.reduce(function (sum, item) { return sum + item.stake; }, 0);
    const winningBetIds = details.filter(function (item) { return item.won; }).map(function (item) { return item.bet.id; });
    return {
      details: details,
      dice: dice.slice(),
      profit: profit,
      returnAmount: returnAmount,
      stake: stake,
      stats: statsForDice(dice),
      winningBetIds: winningBetIds
    };
  }

  window.SicBo.PayoutCalculator = {
    profitMultiplier: profitMultiplier,
    settleBet: settleBet,
    settleBets: settleBets,
    statsForDice: statsForDice
  };
})();
