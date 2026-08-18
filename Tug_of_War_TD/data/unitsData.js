(function (global) {
  global.UNITS_DATA = {
    basic: {
      id: "basic", nameKey: "unit_basic_name", descriptionKey: "unit_basic_desc", roleKey: "unit_role_tank",
      icon: "🐱", color: "#e984a8", hp: 150, atk: 18, speed: 45, range: 34, cost: 18, cooldown: 1.1,
      attribute: "normal", attackType: "melee", size: 22
    },
    ranger: {
      id: "ranger", nameKey: "unit_ranger_name", descriptionKey: "unit_ranger_desc", roleKey: "unit_role_ranged",
      icon: "🏹", color: "#5ba4df", hp: 78, atk: 34, speed: 31, range: 155, cost: 32, cooldown: 2.2,
      attribute: "angel", attackType: "ranged", size: 20
    },
    tank: {
      id: "tank", nameKey: "unit_tank_name", descriptionKey: "unit_tank_desc", roleKey: "unit_role_heavy",
      icon: "🛡️", color: "#bf8a56", hp: 420, atk: 12, speed: 18, range: 38, cost: 48, cooldown: 4.2,
      attribute: "metal", attackType: "melee", size: 30
    },
    striker: {
      id: "striker", nameKey: "unit_striker_name", descriptionKey: "unit_striker_desc", roleKey: "unit_role_burst",
      icon: "💥", color: "#f07855", hp: 92, atk: 108, speed: 38, range: 40, cost: 62, cooldown: 6.2,
      attribute: "red", attackType: "melee", size: 23
    },
    healer: {
      id: "healer", nameKey: "unit_healer_name", descriptionKey: "unit_healer_desc", roleKey: "unit_role_support",
      icon: "💚", color: "#5cbc84", hp: 105, atk: 13, heal: 27, speed: 27, range: 105, cost: 55, cooldown: 7.1,
      attribute: "angel", attackType: "support", size: 21
    }
  };

  global.ATTRIBUTE_ADVANTAGE = {
    red: "angel",
    angel: "demon",
    demon: "metal",
    metal: "red"
  };
  global.UNIT_ORDER = ["basic", "ranger", "tank", "striker", "healer"];
})(window);
