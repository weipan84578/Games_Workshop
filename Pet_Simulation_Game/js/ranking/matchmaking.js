(function (PSG) {
  'use strict';

  function playerRank(save) { return save.ranking.rankOrder.indexOf('player') + 1; }
  function candidates(save) {
    var rank = playerRank(save);
    var playerBp = PSG.pet.stats.battlePower(save);
    var seed = save.ranking.rankingSeed;
    var language = PSG.i18n.current;
    var higher = [], lower = [];
    save.ranking.rankOrder.forEach(function (id, index) {
      if (id === 'player') return;
      var currentRank = index + 1;
      var ai = PSG.ranking.generator.getAI(id, seed, language);
      var row = { id: id, rank: currentRank, ai: ai, diff: Math.abs(ai.bp - playerBp) };
      (currentRank < rank ? higher : lower).push(row);
    });
    function sorter(a, b) { return a.diff - b.diff || Math.abs(a.rank - rank) - Math.abs(b.rank - rank) || a.id.localeCompare(b.id); }
    higher.sort(sorter); lower.sort(sorter);
    // Spec §13.5: prefer three higher ranks and two lower ranks, then fill edge shortages.
    var result = higher.slice(0, 3).concat(lower.slice(0, 2));
    if (result.length < 5) {
      var used = result.map(function (item) { return item.id; });
      higher.concat(lower).sort(sorter).forEach(function (item) { if (result.length < 5 && used.indexOf(item.id) < 0) { used.push(item.id); result.push(item); } });
    }
    return result;
  }
  function refresh(save) { save.ranking.candidateIds = candidates(save).map(function (row) { return row.id; }); return save.ranking.candidateIds; }

  PSG.ranking.matchmaking = { playerRank: playerRank, candidates: candidates, refresh: refresh };
})(window.PSG);
