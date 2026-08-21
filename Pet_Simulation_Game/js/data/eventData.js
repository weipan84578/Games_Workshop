(function (PSG) {
  'use strict';

  var definitions = {
    park: ['disc', 'fountain', 'fans', 'camera', 'picnic', 'ribbon', 'runner', 'sunset'],
    forest: ['tracks', 'stream', 'herbs', 'log', 'ranger', 'owl', 'rain', 'hill'],
    river: ['waves', 'stones', 'fisher', 'bridge', 'reeds', 'fireflies', 'splash', 'market']
  };
  var events = [];
  Object.keys(definitions).forEach(function (location) {
    definitions[location].forEach(function (key, index) {
      var rarity = index < 4 ? 'common' : index < 7 ? 'rare' : 'special';
      events.push({
        id: location + '_' + key,
        location: location,
        key: key,
        rarity: rarity,
        weight: rarity === 'common' ? 15 : rarity === 'rare' ? 8 : 16,
        reward: index % 4 === 0 ? 'coins' : index % 4 === 1 ? 'affection' : index % 4 === 2 ? 'xp' : 'consumable'
      });
    });
  });
  PSG.data.outingLocations = Object.keys(definitions);
  PSG.data.events = events;
})(window.PSG);
