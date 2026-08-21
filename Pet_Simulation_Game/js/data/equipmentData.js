(function (PSG) {
  'use strict';

  var stages = [
    { id: 1, key: 'sprout', threshold: 1000, price: 200, budget: 3, consumablePrice: 60 },
    { id: 2, key: 'bronze', threshold: 750, price: 600, budget: 5, consumablePrice: 120 },
    { id: 3, key: 'silver', threshold: 500, price: 1200, budget: 7, consumablePrice: 200 },
    { id: 4, key: 'gold', threshold: 250, price: 2200, budget: 9, consumablePrice: 320 },
    { id: 5, key: 'stellar', threshold: 100, price: 3800, budget: 11, consumablePrice: 500 },
    { id: 6, key: 'champion', threshold: 25, price: 6000, budget: 13, consumablePrice: 800 }
  ];
  var luck = [2, 4, 6, 9, 12, 15];
  var templates = [
    {
      key: 'vital',
      slot: 'armor',
      bonuses: function (b) {
        return { hp: b / 100 };
      }
    },
    {
      key: 'guard',
      slot: 'armor',
      bonuses: function (b) {
        return { defense: b * 0.006, spDefense: b * 0.006 };
      }
    },
    {
      key: 'strike',
      slot: 'accessory',
      bonuses: function (b) {
        return { attack: b * 0.006, speed: b * 0.004 };
      }
    },
    {
      key: 'spirit',
      slot: 'accessory',
      bonuses: function (b) {
        return { spAttack: b * 0.006, speed: b * 0.004 };
      }
    },
    {
      key: 'gale',
      slot: 'emblem',
      bonuses: function (b) {
        return { mobility: b * 0.006, speed: b * 0.004 };
      }
    },
    {
      key: 'fortune',
      slot: 'emblem',
      bonuses: function (b, stage) {
        return { crit: luck[stage - 1] / 100 };
      }
    }
  ];
  var items = [];
  stages.forEach(function (stage) {
    templates.forEach(function (template) {
      items.push({
        id: 'eq_' + stage.id + '_' + template.key,
        stage: stage.id,
        stageKey: stage.key,
        templateKey: template.key,
        slot: template.slot,
        price: stage.price,
        bonuses: template.bonuses(stage.budget, stage.id),
        image: 'assets/images/equipment/eq_' + stage.id + '_' + template.key + '.svg',
        icon: template.slot === 'armor' ? '🛡️' : template.slot === 'accessory' ? '📿' : '✦'
      });
    });
  });
  PSG.data.equipmentStages = stages;
  PSG.data.equipment = items;
  PSG.data.equipmentById = items.reduce(function (map, item) {
    map[item.id] = item;
    return map;
  }, {});
})(window.PSG);
