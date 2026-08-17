(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};

  app.SynergyData = [
    { key: "forest", type: "race", thresholds: [{ count: 2, stat: "defensePct", value: 0.12 }, { count: 3, stat: "defensePct", value: 0.2 }] },
    { key: "flame", type: "race", thresholds: [{ count: 2, stat: "attackPct", value: 0.15 }, { count: 3, stat: "attackPct", value: 0.25 }] },
    { key: "tide", type: "race", thresholds: [{ count: 2, stat: "manaPct", value: 0.2 }, { count: 3, stat: "manaPct", value: 0.35 }] },
    { key: "sky", type: "race", thresholds: [{ count: 2, stat: "speedPct", value: 0.15 }, { count: 3, stat: "speedPct", value: 0.25 }] },
    { key: "crystal", type: "race", thresholds: [{ count: 2, stat: "healthPct", value: 0.18 }, { count: 3, stat: "healthPct", value: 0.3 }] },
    { key: "guardian", type: "class", thresholds: [{ count: 2, stat: "guardianDamagePct", value: 0.15 }, { count: 3, stat: "guardianDamagePct", value: 0.25 }] },
    { key: "striker", type: "class", thresholds: [{ count: 2, stat: "strikerAttackPct", value: 0.12 }, { count: 3, stat: "strikerAttackPct", value: 0.2 }] },
    { key: "mystic", type: "class", thresholds: [{ count: 2, stat: "spellPct", value: 0.18 }, { count: 3, stat: "spellPct", value: 0.3 }] },
    { key: "ranger", type: "class", thresholds: [{ count: 2, stat: "rangerSpeedPct", value: 0.12 }, { count: 3, stat: "rangerSpeedPct", value: 0.2 }] },
    { key: "mage", type: "class", thresholds: [{ count: 2, stat: "mageMana", value: 20 }, { count: 3, stat: "mageMana", value: 35 }] }
  ];
}(window));
