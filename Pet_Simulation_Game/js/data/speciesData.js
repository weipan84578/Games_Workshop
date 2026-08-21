(function (PSG) {
  'use strict';

  PSG.data.species = {
    eagle: {
      id: 'eagle',
      icon: '🦅',
      image: 'assets/images/pets/eagle/portrait.png',
      nameKey: 'species.eagle',
      color: '#c86d32',
      strengths: ['mobility', 'accuracy', 'speed', 'attack'],
      base: { hp: 100, attack: 16, accuracy: 16, defense: 10, mobility: 18, spAttack: 12, spDefense: 10, speed: 18 },
      growth: {
        hp: 3.6,
        attack: 0.95,
        accuracy: 0.9,
        defense: 0.62,
        mobility: 1.0,
        spAttack: 0.7,
        spDefense: 0.62,
        speed: 1.0
      },
      normal: { key: 'attack.eagle.normal', power: 80 },
      special: { key: 'attack.eagle.special', power: 105 }
    },
    lion: {
      id: 'lion',
      icon: '🦁',
      image: 'assets/images/pets/lion/portrait.png',
      nameKey: 'species.lion',
      color: '#d89536',
      strengths: ['attack', 'spAttack', 'speed'],
      base: { hp: 110, attack: 18, accuracy: 14, defense: 11, mobility: 11, spAttack: 18, spDefense: 11, speed: 16 },
      growth: {
        hp: 4.0,
        attack: 1.05,
        accuracy: 0.8,
        defense: 0.68,
        mobility: 0.65,
        spAttack: 1.05,
        spDefense: 0.68,
        speed: 0.9
      },
      normal: { key: 'attack.lion.normal', power: 80 },
      special: { key: 'attack.lion.special', power: 120 }
    },
    crocodile: {
      id: 'crocodile',
      icon: '🐊',
      image: 'assets/images/pets/crocodile/portrait.png',
      nameKey: 'species.crocodile',
      color: '#5c8c62',
      strengths: ['hp', 'defense', 'spDefense'],
      base: { hp: 130, attack: 13, accuracy: 10, defense: 18, mobility: 7, spAttack: 13, spDefense: 18, speed: 8 },
      growth: {
        hp: 4.6,
        attack: 0.78,
        accuracy: 0.55,
        defense: 1.05,
        mobility: 0.42,
        spAttack: 0.78,
        spDefense: 1.05,
        speed: 0.48
      },
      normal: { key: 'attack.crocodile.normal', power: 80 },
      special: { key: 'attack.crocodile.special', power: 100 }
    }
  };
})(window.PSG);
