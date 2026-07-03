(function () {
  window.SicBo = window.SicBo || {};

  function normalizeBets(bets) {
    const normalized = {};
    (bets || []).forEach(function (bet) {
      if (bet && window.SicBo.BetTypes.byId[bet.id] && bet.amount > 0) {
        normalized[bet.id] = (normalized[bet.id] || 0) + Number(bet.amount);
      }
    });
    return normalized;
  }

  function betsToArray(bets) {
    return Object.keys(bets || {}).map(function (id) {
      return { id: id, amount: bets[id] };
    }).filter(function (bet) {
      return bet.amount > 0;
    });
  }

  function totalBets(bets) {
    return Object.keys(bets || {}).reduce(function (sum, id) {
      return sum + Number(bets[id] || 0);
    }, 0);
  }

  function create(initial) {
    const state = {
      balance: initial && typeof initial.balance === "number" ? initial.balance : 10000,
      betStack: [],
      currentBets: normalizeBets(initial && initial.currentBets),
      lastBets: Array.isArray(initial && initial.lastBets) ? initial.lastBets.slice() : [],
      locked: false,
      selectedChip: initial && initial.selectedChip ? initial.selectedChip : window.SicBo.BetTypes.CHIP_VALUES[0]
    };

    function placeBet(id, amount) {
      const stake = Number(amount || state.selectedChip);
      if (state.locked || !window.SicBo.BetTypes.byId[id] || stake <= 0) {
        return { ok: false, reason: "invalid" };
      }
      if (state.balance < stake) {
        return { ok: false, reason: "insufficient" };
      }
      state.balance -= stake;
      state.currentBets[id] = (state.currentBets[id] || 0) + stake;
      state.betStack.push({ id: id, amount: stake });
      return { ok: true, amount: stake, bet: window.SicBo.BetTypes.byId[id] };
    }

    function undoLastBet() {
      if (state.locked || state.betStack.length === 0) return false;
      const last = state.betStack.pop();
      state.currentBets[last.id] -= last.amount;
      if (state.currentBets[last.id] <= 0) delete state.currentBets[last.id];
      state.balance += last.amount;
      return true;
    }

    function clearCurrentBets() {
      if (state.locked) return 0;
      const amount = totalBets(state.currentBets);
      state.balance += amount;
      state.currentBets = {};
      state.betStack = [];
      return amount;
    }

    function repeatBets() {
      if (state.locked || state.lastBets.length === 0) return { ok: false, reason: "empty" };
      const needed = state.lastBets.reduce(function (sum, bet) { return sum + bet.amount; }, 0);
      if (state.balance < needed) return { ok: false, reason: "insufficient" };
      state.lastBets.forEach(function (bet) {
        placeBet(bet.id, bet.amount);
      });
      return { ok: true, amount: needed };
    }

    function setCurrentBets(bets) {
      state.currentBets = normalizeBets(betsToArray(bets));
      state.betStack = betsToArray(state.currentBets);
    }

    return {
      state: state,
      betsToArray: function () { return betsToArray(state.currentBets); },
      clearCurrentBets: clearCurrentBets,
      getBetTotal: function () { return totalBets(state.currentBets); },
      getCurrentBetsObject: function () { return Object.assign({}, state.currentBets); },
      lock: function () { state.locked = true; },
      normalizeBets: normalizeBets,
      placeBet: placeBet,
      repeatBets: repeatBets,
      setCurrentBets: setCurrentBets,
      setLastBets: function (bets) { state.lastBets = betsToArray(normalizeBets(bets)); },
      setSelectedChip: function (value) { state.selectedChip = Number(value); },
      totalBets: totalBets,
      undoLastBet: undoLastBet,
      unlock: function () { state.locked = false; }
    };
  }

  window.SicBo.BettingLogic = {
    betsToArray: betsToArray,
    create: create,
    normalizeBets: normalizeBets,
    totalBets: totalBets
  };
})();
