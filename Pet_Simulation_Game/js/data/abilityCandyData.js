(function (PSG) {
  'use strict';

  var presentation = {
    hp: { icon: '♥', accent: '#ff6b81', gain: 3, priceWeight: 2 },
    attack: { icon: '⚔', accent: '#ff7043', gain: 1, priceWeight: 8 },
    spAttack: { icon: '✦', accent: '#ab47bc', gain: 1, priceWeight: 8 },
    defense: { icon: '🛡', accent: '#42a5f5', gain: 1, priceWeight: 8 },
    spDefense: { icon: '◇', accent: '#26a69a', gain: 1, priceWeight: 8 },
    mobility: { icon: '🪽', accent: '#7e57c2', gain: 1, priceWeight: 8 },
    speed: { icon: '➤', accent: '#ffa726', gain: 1, priceWeight: 8 }
  };
  var displayOrder = ['attack', 'spAttack', 'defense', 'spDefense', 'mobility', 'speed', 'hp'];

  var items = displayOrder.map(function (stat) {
    return {
      id: 'candy_' + stat,
      category: 'candy',
      stat: stat,
      gain: presentation[stat].gain,
      priceWeight: presentation[stat].priceWeight,
      icon: presentation[stat].icon,
      accent: presentation[stat].accent
    };
  });

  PSG.data.abilityCandies = items;
  PSG.data.abilityCandyById = items.reduce(function (map, item) {
    map[item.id] = item;
    return map;
  }, {});
})(window.PSG);
