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
        return { attack: b * 0.006, accuracy: b * 0.004, speed: b * 0.004 };
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
  var mythicTemplates = [
    {
      id: 'mythic_armor',
      key: 'mythicArmor',
      slot: 'armor',
      bonuses: { hp: 0.18, defense: 0.09, spDefense: 0.09 },
      icon: '🛡️'
    },
    {
      id: 'mythic_accessory',
      key: 'mythicAccessory',
      slot: 'accessory',
      bonuses: { attack: 0.09, spAttack: 0.09, accuracy: 0.06 },
      icon: '🎯'
    },
    {
      id: 'mythic_emblem',
      key: 'mythicEmblem',
      slot: 'emblem',
      bonuses: { speed: 0.07, mobility: 0.075, crit: 0.2 },
      icon: '👑'
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
  var mythicItems = mythicTemplates.map(function (template) {
    return {
      id: template.id,
      stage: 7,
      stageKey: 'mythic',
      templateKey: template.key,
      slot: template.slot,
      price: 0,
      bonuses: Object.assign({}, template.bonuses),
      mythic: true,
      upgradeBasePrice: 10000,
      upgradePriceRate: 0.1,
      icon: template.icon,
      accent: '#d9a441'
    };
  });
  var allItems = items.concat(mythicItems);
  PSG.data.equipmentStages = stages;
  PSG.data.equipment = items;
  PSG.data.mythicEquipment = mythicItems;
  PSG.data.equipmentById = allItems.reduce(function (map, item) {
    map[item.id] = item;
    return map;
  }, {});
})(window.PSG);
