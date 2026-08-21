(function (PSG) {
  'use strict';

  var RANK_WINDOW = 12;
  var HIGHER_CANDIDATES = 3;
  var LOWER_CANDIDATES = 2;
  var TOTAL_CANDIDATES = HIGHER_CANDIDATES + LOWER_CANDIDATES;

  function playerRank(save) {
    return save.ranking.rankOrder.indexOf('player') + 1;
  }

  function createRow(id, rank, playerBp, seed, language) {
    var ai = PSG.ranking.generator.getAI(id, seed, language);
    return {
      id: id,
      rank: rank,
      ai: ai,
      diff: Math.abs(ai.bp - playerBp)
    };
  }

  function rankDistance(row, rank) {
    return Math.abs(row.rank - rank);
  }

  function compareRows(rank) {
    return function (a, b) {
      return a.diff - b.diff || rankDistance(a, rank) - rankDistance(b, rank) || a.id.localeCompare(b.id);
    };
  }

  function collectRows(save, rank, playerBp, seed, language, include) {
    var rows = [];
    save.ranking.rankOrder.forEach(function (id, index) {
      var currentRank = index + 1;
      if (id === 'player' || !include(currentRank)) return;
      rows.push(createRow(id, currentRank, playerBp, seed, language));
    });
    return rows;
  }

  function appendUnique(target, rows, limit) {
    rows.forEach(function (row) {
      if (
        target.length >= limit ||
        target.some(function (item) {
          return item.id === row.id;
        })
      )
        return;
      target.push(row);
    });
  }

  function candidates(save) {
    var rank = playerRank(save);
    var playerBp = PSG.pet.stats.battlePower(save);
    var seed = save.ranking.rankingSeed;
    var language = PSG.i18n.current;
    var sorter = compareRows(rank);
    var higher = collectRows(save, rank, playerBp, seed, language, function (currentRank) {
      return currentRank < rank && rank - currentRank <= RANK_WINDOW;
    });
    var lower = collectRows(save, rank, playerBp, seed, language, function (currentRank) {
      return currentRank > rank && currentRank - rank <= RANK_WINDOW;
    });

    higher.sort(sorter);
    lower.sort(sorter);
    var result = higher.slice(0, HIGHER_CANDIDATES).concat(lower.slice(0, LOWER_CANDIDATES));

    // The top and bottom ranks do not have five nearby opponents. Fill only those edge shortages.
    if (result.length < TOTAL_CANDIDATES) {
      var fallback = collectRows(save, rank, playerBp, seed, language, function () {
        return true;
      });
      fallback.sort(function (a, b) {
        return rankDistance(a, rank) - rankDistance(b, rank) || sorter(a, b);
      });
      appendUnique(result, fallback, TOTAL_CANDIDATES);
    }
    return result;
  }

  function refresh(save) {
    save.ranking.candidateIds = candidates(save).map(function (row) {
      return row.id;
    });
    return save.ranking.candidateIds;
  }

  PSG.ranking.matchmaking = { playerRank: playerRank, candidates: candidates, refresh: refresh };
})(window.PSG);
