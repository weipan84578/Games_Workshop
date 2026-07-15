(function (Game) {
  "use strict";
  function create(startY) {
    return {
      total: 0,
      height: 0,
      maxHeight: 0,
      itemScore: 0,
      enemyScore: 0,
      comboScore: 0,
      milestoneScore: 0,
      currentCombo: 0,
      bestCombo: 0,
      collected: 0,
      lastPlatformId: null,
      comboPeakY: null,
      reachedMilestones: [],
      startY: startY,
    };
  }
  function updateHeight(score, playerY) {
    var height = Math.max(0, Math.floor((score.startY - playerY) / 10));
    score.height = height;
    if (height > score.maxHeight) {
      score.total += height - score.maxHeight;
      score.maxHeight = height;
    }
    return height;
  }
  function landed(score, platformId, playerY) {
    if (score.lastPlatformId !== platformId) {
      if (!score.currentCombo || !Number.isFinite(score.comboPeakY))
        score.comboPeakY = Number.isFinite(playerY) ? playerY : score.startY;
      else if (Number.isFinite(playerY))
        score.comboPeakY = Math.min(score.comboPeakY, playerY);
      score.currentCombo += 1;
      score.bestCombo = Math.max(score.bestCombo, score.currentCombo);
      var points = Math.min(score.currentCombo, 3) * 10;
      score.comboScore += points;
      score.total += points;
      score.lastPlatformId = platformId;
    }
    return score.currentCombo;
  }
  function breakCombo(score) {
    score.currentCombo = 0;
    score.lastPlatformId = null;
    score.comboPeakY = null;
  }
  function updateComboDrop(score, playerY, threshold) {
    if (!score.currentCombo || !Number.isFinite(playerY)) return false;
    if (!Number.isFinite(score.comboPeakY)) score.comboPeakY = playerY;
    score.comboPeakY = Math.min(score.comboPeakY, playerY);
    if (playerY - score.comboPeakY <= threshold) return false;
    breakCombo(score);
    return true;
  }
  function addItem(score, type) {
    var points = type === "lucky" ? 250 : type === "star" ? 50 : 25;
    score.itemScore += points;
    score.total += points;
    score.collected += 1;
    return points;
  }
  function addEnemy(score) {
    score.enemyScore += 200;
    score.total += 200;
  }
  function milestones(score) {
    var reached = [];
    var next = Math.floor(score.maxHeight / 500) * 500;
    if (
      next >= 500 &&
      score.maxHeight >= next &&
      score.reachedMilestones.indexOf(next) === -1
    ) {
      score.reachedMilestones.push(next);
      score.milestoneScore += 500;
      score.total += 500;
      reached.push(next);
    }
    return reached;
  }
  function calculate(state) {
    return (
      (state.height || 0) +
      (state.itemScore || 0) +
      (state.enemyScore || 0) +
      (state.comboScore || 0) +
      (state.milestoneScore || 0)
    );
  }
  Game.ScoreService = Object.freeze({
    create: create,
    updateHeight: updateHeight,
    landed: landed,
    breakCombo: breakCombo,
    updateComboDrop: updateComboDrop,
    addItem: addItem,
    addEnemy: addEnemy,
    milestones: milestones,
    calculate: calculate,
  });
})(window.DJGame);
