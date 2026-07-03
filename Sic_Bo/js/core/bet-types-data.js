(function () {
  window.SicBo = window.SicBo || {};

  const totalPayouts = {
    4: 60,
    5: 30,
    6: 17,
    7: 12,
    8: 8,
    9: 6,
    10: 6,
    11: 6,
    12: 6,
    13: 8,
    14: 12,
    15: 17,
    16: 30,
    17: 60
  };

  const baseBets = [
    { id: "big", kind: "base", payout: 1, group: "basic", size: "wide" },
    { id: "small", kind: "base", payout: 1, group: "basic", size: "wide" },
    { id: "odd", kind: "base", payout: 1, group: "basic" },
    { id: "even", kind: "base", payout: 1, group: "basic" },
    { id: "any-triple", kind: "anyTriple", payout: 30, group: "triple" }
  ];

  const totalBets = Object.keys(totalPayouts).map(function (value) {
    const total = Number(value);
    return {
      id: "total-" + total,
      kind: "total",
      value: total,
      payout: totalPayouts[total],
      group: "total"
    };
  });

  const singleBets = [1, 2, 3, 4, 5, 6].map(function (value) {
    return {
      id: "single-" + value,
      kind: "single",
      value: value,
      payout: null,
      group: "single"
    };
  });

  const doubleBets = [1, 2, 3, 4, 5, 6].map(function (value) {
    return {
      id: "double-" + value,
      kind: "double",
      value: value,
      payout: 10,
      group: "double"
    };
  });

  const tripleBets = [1, 2, 3, 4, 5, 6].map(function (value) {
    return {
      id: "triple-" + value,
      kind: "triple",
      value: value,
      payout: 180,
      group: "triple"
    };
  });

  const comboBets = [];
  for (let a = 1; a <= 5; a += 1) {
    for (let b = a + 1; b <= 6; b += 1) {
      comboBets.push({
        id: "combo-" + a + "-" + b,
        kind: "combo",
        values: [a, b],
        payout: 6,
        group: "combo"
      });
    }
  }

  const betTypes = baseBets.concat(totalBets, singleBets, doubleBets, tripleBets, comboBets);
  const betTypeById = betTypes.reduce(function (map, bet) {
    map[bet.id] = bet;
    return map;
  }, {});

  window.SicBo.BetTypes = {
    CHIP_VALUES: [10, 50, 100, 500, 1000],
    GROUPS: ["basic", "total", "single", "double", "triple", "combo"],
    TOTAL_PAYOUTS: totalPayouts,
    all: betTypes,
    byId: betTypeById
  };

  window.SicBo.Format = {
    money: function (value) {
      return Number(value || 0).toLocaleString();
    }
  };
})();
