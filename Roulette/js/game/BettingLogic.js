(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};
  const { normalizeResult } = R;

  function formatCompact(value) {
    if (value >= 1000) return `${Math.round(value / 100) / 10}k`;
    return String(value);
  }

  function covers(def, result) {
    const normalized = normalizeResult(result);
    return def.covers.some((item) => String(item) === String(normalized));
  }

  function createBet(def, amount) {
    return {
      id: def.id,
      type: def.type,
      label: def.label,
      covers: [...def.covers],
      payout: def.payout,
      amount,
    };
  }

  function calculateSettlement(bets, result) {
    return bets.reduce((summary, bet) => {
      summary.totalBet += bet.amount;
      if (covers(bet, result)) {
        summary.gross += bet.amount * (bet.payout + 1);
        summary.winningBets.push(bet);
      }
      return summary;
    }, { totalBet: 0, gross: 0, winningBets: [] });
  }

  function sumBets(bets) {
    return bets.reduce((sum, bet) => sum + bet.amount, 0);
  }

  Object.assign(R, { formatCompact, covers, createBet, calculateSettlement, sumBets });
})();
