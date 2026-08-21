(function (PSG) {
  'use strict';

  var values = {
    energy: [10, 15, 20, 25, 30, 35],
    shield: [3, 4, 5, 6, 7, 8],
    focus: [2, 3, 4, 5, 6, 7]
  };
  var icons = { energy: '⚡', shield: '🫓', focus: '🍬' };
  var items = [];
  PSG.data.equipmentStages.forEach(function (stage) {
    Object.keys(values).forEach(function (type) {
      items.push({
        id: 'con_' + stage.id + '_' + type,
        stage: stage.id,
        type: type,
        value: values[type][stage.id - 1],
        price: stage.consumablePrice,
        image: 'assets/images/equipment/con_' + stage.id + '_' + type + '.svg',
        icon: icons[type]
      });
    });
  });
  PSG.data.consumables = items;
  PSG.data.consumableById = items.reduce(function (map, item) {
    map[item.id] = item;
    return map;
  }, {});
})(window.PSG);
