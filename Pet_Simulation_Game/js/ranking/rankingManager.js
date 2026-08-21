(function (PSG) {
  'use strict';

  PSG.ranking.manager = {
    settle: function (save, opponentId, won) {
      var before = PSG.ranking.matchmaking.playerRank(save);
      var opponentIndex = save.ranking.rankOrder.indexOf(opponentId);
      var opponentRank = opponentIndex + 1;
      if (won && opponentRank < before) {
        save.ranking.rankOrder[before - 1] = opponentId;
        save.ranking.rankOrder[opponentIndex] = 'player';
      }
      var after = PSG.ranking.matchmaking.playerRank(save);
      save.player.bestRank = Math.min(save.player.bestRank, after);
      if (won && PSG.data.rivalById[opponentId] && save.progression.defeatedRivals.indexOf(opponentId) < 0)
        save.progression.defeatedRivals.push(opponentId);
      var mythicEquipment = [];
      if (after === 1) {
        save.progression.unlockedCosmetics = Array.isArray(save.progression.unlockedCosmetics)
          ? save.progression.unlockedCosmetics
          : [];
        if (!save.progression.championUnlocked) {
          save.progression.championUnlocked = true;
          save.progression.unlockedCosmetics.push('champion_emblem');
          save.completedAt = new Date().toISOString();
        }
        mythicEquipment = PSG.economy.equipment.grantMythic(save);
      }
      PSG.ranking.matchmaking.refresh(save);
      return {
        before: before,
        after: after,
        changed: before !== after,
        champion: after === 1,
        mythicEquipment: mythicEquipment
      };
    }
  };
})(window.PSG);
