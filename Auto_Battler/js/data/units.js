(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};

  var units = [
    { id: "mossling", nameKey: "units.mossling.name", abilityKey: "units.mossling.ability", icon: "🌱", color: "#78c995", cost: 1, race: "forest", classId: "guardian", health: 180, attack: 25, defense: 20, attackSpeed: 0.76, manaMax: 60, ability: { type: "shield", value: 0.18 } },
    { id: "emberfox", nameKey: "units.emberfox.name", abilityKey: "units.emberfox.ability", icon: "🦊", color: "#ff9b61", cost: 1, race: "flame", classId: "striker", health: 125, attack: 34, defense: 10, attackSpeed: 1.08, manaMax: 70, ability: { type: "burn", value: 1.25 } },
    { id: "tidepup", nameKey: "units.tidepup.name", abilityKey: "units.tidepup.ability", icon: "🐶", color: "#79d8e2", cost: 2, race: "tide", classId: "mystic", health: 165, attack: 29, defense: 14, attackSpeed: 0.86, manaMax: 70, ability: { type: "heal", value: 0.24 } },
    { id: "moonmoth", nameKey: "units.moonmoth.name", abilityKey: "units.moonmoth.ability", icon: "🦋", color: "#bda4ed", cost: 2, race: "sky", classId: "ranger", health: 128, attack: 40, defense: 10, attackSpeed: 1.1, manaMax: 80, ability: { type: "burst", value: 1.65 } },
    { id: "stoneback", nameKey: "units.stoneback.name", abilityKey: "units.stoneback.ability", icon: "🐢", color: "#b7a477", cost: 2, race: "forest", classId: "guardian", health: 265, attack: 22, defense: 34, attackSpeed: 0.56, manaMax: 100, ability: { type: "shield", value: 0.3 } },
    { id: "cloudmage", nameKey: "units.cloudmage.name", abilityKey: "units.cloudmage.ability", icon: "🧙", color: "#9bc5ff", cost: 3, race: "sky", classId: "mage", health: 148, attack: 46, defense: 12, attackSpeed: 0.82, manaMax: 80, ability: { type: "aoe", value: 0.82 } },
    { id: "thornknight", nameKey: "units.thornknight.name", abilityKey: "units.thornknight.ability", icon: "🛡️", color: "#70bb83", cost: 3, race: "forest", classId: "striker", health: 235, attack: 49, defense: 24, attackSpeed: 0.72, manaMax: 90, ability: { type: "burst", value: 1.2 } },
    { id: "starseer", nameKey: "units.starseer.name", abilityKey: "units.starseer.ability", icon: "🔭", color: "#c59be8", cost: 4, race: "crystal", classId: "mystic", health: 195, attack: 64, defense: 16, attackSpeed: 0.86, manaMax: 110, ability: { type: "aoe", value: 1.1 } },
    { id: "sunlion", nameKey: "units.sunlion.name", abilityKey: "units.sunlion.ability", icon: "🦁", color: "#ffc85c", cost: 4, race: "flame", classId: "guardian", health: 305, attack: 53, defense: 28, attackSpeed: 0.66, manaMax: 100, ability: { type: "heal", value: 0.18 } },
    { id: "crystaldragon", nameKey: "units.crystaldragon.name", abilityKey: "units.crystaldragon.ability", icon: "🐉", color: "#8dd8e8", cost: 5, race: "crystal", classId: "mage", health: 345, attack: 80, defense: 22, attackSpeed: 0.76, manaMax: 120, ability: { type: "aoe", value: 1.3 } }
  ];

  var byId = {};
  units.forEach(function (unit) { byId[unit.id] = unit; });

  app.UnitData = {
    all: units,
    byId: byId,
    get: function (id) { return byId[id]; },
    create: function (typeId, star) {
      var base = byId[typeId];
      if (!base) return null;
      return { instanceId: app.Helpers.uid("unit"), typeId: typeId, star: star || 1 };
    },
    coefficient: function (star) {
      return star === 3 ? 3.2 : star === 2 ? 1.8 : 1;
    },
    getDisplay: function (instance) {
      var base = byId[instance.typeId];
      var coefficient = this.coefficient(instance.star || 1);
      return {
        id: instance.instanceId,
        typeId: instance.typeId,
        star: instance.star || 1,
        name: app.I18n ? app.I18n.t(base.nameKey) : base.id,
        ability: app.I18n ? app.I18n.t(base.abilityKey) : base.id,
        icon: base.icon,
        color: base.color,
        cost: base.cost,
        race: base.race,
        classId: base.classId,
        health: Math.round(base.health * coefficient),
        attack: Math.round(base.attack * coefficient),
        defense: Math.round(base.defense * (0.9 + coefficient * 0.1)),
        attackSpeed: base.attackSpeed,
        manaMax: base.manaMax,
        ability: base.ability
      };
    }
  };
}(window));
