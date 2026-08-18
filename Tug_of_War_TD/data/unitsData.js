(function (global) {
  global.UNITS_DATA = {
    basic: {
      id: "basic", nameKey: "unit_basic_name", descriptionKey: "unit_basic_desc", roleKey: "unit_role_tank",
      icon: "🐱", color: "#e984a8", hp: 150, atk: 18, speed: 45, range: 34, cost: 8, cooldown: .75,
      attribute: "normal", attackType: "melee", size: 22, knockbackForce: 10
    },
    ranger: {
      id: "ranger", nameKey: "unit_ranger_name", descriptionKey: "unit_ranger_desc", roleKey: "unit_role_ranged",
      icon: "🏹", color: "#5ba4df", hp: 78, atk: 34, speed: 31, range: 155, cost: 16, cooldown: 1.5,
      attribute: "angel", attackType: "ranged", size: 20, knockbackForce: 8
    },
    tank: {
      id: "tank", nameKey: "unit_tank_name", descriptionKey: "unit_tank_desc", roleKey: "unit_role_heavy",
      icon: "🛡️", color: "#bf8a56", hp: 420, atk: 12, speed: 18, range: 38, cost: 26, cooldown: 2.8,
      attribute: "metal", attackType: "melee", size: 30, knockbackForce: 58
    },
    striker: {
      id: "striker", nameKey: "unit_striker_name", descriptionKey: "unit_striker_desc", roleKey: "unit_role_burst",
      icon: "💥", color: "#f07855", hp: 92, atk: 108, speed: 38, range: 40, cost: 38, cooldown: 4,
      attribute: "red", attackType: "melee", size: 23, knockbackForce: 14
    },
    healer: {
      id: "healer", nameKey: "unit_healer_name", descriptionKey: "unit_healer_desc", roleKey: "unit_role_support",
      icon: "💚", color: "#5cbc84", hp: 105, atk: 13, heal: 27, speed: 27, range: 105, cost: 30, cooldown: 4.8,
      attribute: "angel", attackType: "support", size: 21, knockbackForce: 8
    },
    scout: {
      id: "scout", nameKey: "unit_scout_name", descriptionKey: "unit_scout_desc", roleKey: "unit_role_speed",
      icon: "🐰", color: "#a58be0", hp: 90, atk: 24, speed: 70, range: 34, cost: 10, cooldown: .8,
      attribute: "normal", attackType: "melee", size: 19, knockbackForce: 10
    },
    guard: {
      id: "guard", nameKey: "unit_guard_name", descriptionKey: "unit_guard_desc", roleKey: "unit_role_guard",
      icon: "🧱", color: "#71849b", hp: 250, atk: 26, speed: 32, range: 38, cost: 20, cooldown: 1.5,
      attribute: "metal", attackType: "melee", size: 25, knockbackForce: 28
    },
    catapult: {
      id: "catapult", nameKey: "unit_catapult_name", descriptionKey: "unit_catapult_desc", roleKey: "unit_role_siege",
      icon: "🪨", color: "#d28d5d", hp: 120, atk: 65, speed: 20, range: 190, cost: 29, cooldown: 2.4,
      attribute: "red", attackType: "ranged", size: 24, knockbackForce: 8
    },
    berserker: {
      id: "berserker", nameKey: "unit_berserker_name", descriptionKey: "unit_berserker_desc", roleKey: "unit_role_special",
      ability: "rage", abilityKey: "unit_ability_rage", icon: "🦁", color: "#e65b55", hp: 170, atk: 52, speed: 58, range: 38, cost: 34, cooldown: 2,
      attribute: "red", attackType: "melee", size: 24, knockbackForce: 18, special: true
    },
    frostMage: {
      id: "frostMage", nameKey: "unit_frost_name", descriptionKey: "unit_frost_desc", roleKey: "unit_role_special",
      ability: "frost", abilityKey: "unit_ability_frost", icon: "❄️", color: "#62c5e8", hp: 120, atk: 42, speed: 25, range: 180, cost: 36, cooldown: 2.5,
      attribute: "angel", attackType: "ranged", size: 22, knockbackForce: 8, special: true
    },
    thunderMage: {
      id: "thunderMage", nameKey: "unit_thunder_name", descriptionKey: "unit_thunder_desc", roleKey: "unit_role_special",
      ability: "chain", abilityKey: "unit_ability_chain", icon: "⚡", color: "#d0a2ef", hp: 140, atk: 70, speed: 23, range: 165, cost: 44, cooldown: 3.6,
      attribute: "demon", attackType: "ranged", size: 23, knockbackForce: 8, special: true
    },
    guardian: {
      id: "guardian", nameKey: "unit_guardian_name", descriptionKey: "unit_guardian_desc", roleKey: "unit_role_special",
      ability: "barrier", abilityKey: "unit_ability_barrier", icon: "🪽", color: "#83b4d8", hp: 280, atk: 20, speed: 24, range: 105, cost: 40, cooldown: 5.4,
      attribute: "metal", attackType: "support", size: 27, knockbackForce: 10, barrier: 48, special: true
    },
    summoner: {
      id: "summoner", nameKey: "unit_summoner_name", descriptionKey: "unit_summoner_desc", roleKey: "unit_role_special",
      ability: "summon", abilityKey: "unit_ability_summon", icon: "🔮", color: "#b77de1", hp: 210, atk: 15, speed: 21, range: 90, cost: 50, cooldown: 6.5,
      abilityCooldown: 8, attribute: "normal", attackType: "support", size: 26, knockbackForce: 10, special: true
    },
    boss: {
      id: "boss", nameKey: "unit_boss_name", descriptionKey: "unit_boss_desc", roleKey: "unit_role_boss",
      icon: "👑", color: "#8b4d9e", hp: 1250, atk: 58, speed: 21, range: 48, cost: 0, cooldown: 2.3,
      attribute: "demon", attackType: "melee", size: 43, knockbackForce: 5, isBoss: true
    }
  };

  global.ATTRIBUTE_ADVANTAGE = {
    red: "angel",
    angel: "demon",
    demon: "metal",
    metal: "red"
  };
  global.UNIT_ORDER = ["basic", "ranger", "tank", "striker", "healer", "scout", "guard", "catapult", "berserker", "frostMage", "thunderMage", "guardian", "summoner"];
})(window);
