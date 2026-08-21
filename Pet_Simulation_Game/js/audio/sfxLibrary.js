(function (PSG) {
  'use strict';
  var names = [
    'click',
    'confirm',
    'cancel',
    'error',
    'coin',
    'equip',
    'countdown',
    'hit',
    'miss',
    'gold',
    'bond',
    'attack',
    'special',
    'dodge',
    'critical',
    'shield',
    'victory',
    'defeat',
    'xp',
    'level',
    'rank',
    'champion'
  ];
  PSG.audio.sfxTracks = names.reduce(function (map, name) {
    map[name] = 'assets/audio/sfx/' + name + '.wav';
    return map;
  }, {});
})(window.PSG);
