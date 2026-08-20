(function (PSG) {
  'use strict';

  PSG.data.rivals = [
    [900, 'rival_sora', 'eagle', 'speed'], [800, 'rival_leon', 'lion', 'offense'],
    [700, 'rival_goro', 'crocodile', 'defense'], [600, 'rival_aria', 'eagle', 'special'],
    [500, 'rival_nova', 'lion', 'special'], [400, 'rival_bruno', 'crocodile', 'defense'],
    [300, 'rival_ren', 'eagle', 'speed'], [200, 'rival_regulus', 'lion', 'offense'],
    [100, 'rival_titan', 'crocodile', 'defense'], [50, 'rival_marea', 'crocodile', 'defense'],
    [10, 'rival_zenith', 'eagle', 'speed'], [1, 'rival_crown', 'lion', 'offense']
  ].map(function (row) { return { rank: row[0], id: row[1], speciesId: row[2], tactic: row[3], milestone: true }; });
  PSG.data.rivalByRank = PSG.data.rivals.reduce(function (map, rival) { map[rival.rank] = rival; return map; }, {});
  PSG.data.rivalById = PSG.data.rivals.reduce(function (map, rival) { map[rival.id] = rival; return map; }, {});
})(window.PSG);
