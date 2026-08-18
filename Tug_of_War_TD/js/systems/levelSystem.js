(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function getLevel(id) {
    return (global.LEVELS_DATA || []).find(function (level) { return level.id === Number(id); }) || global.LEVELS_DATA[0];
  }
  function isUnlocked(id) {
    return Number(id) <= Number(app.SaveManager.getProgression().unlockedLevel || 1);
  }
  function stars(id) {
    return Number(app.SaveManager.getProgression().stars[id] || 0);
  }
  function starMarkup(value) {
    var result = "";
    for (var index = 1; index <= 3; index += 1) {
      result += index <= value ? "★" : "☆";
    }
    return result;
  }
  function renderCards(container, onSelect) {
    if (!container) {
      return;
    }
    var progress = app.SaveManager.getProgression();
    container.innerHTML = "";
    global.LEVELS_DATA.forEach(function (level, index) {
      var unlocked = level.id <= Number(progress.unlockedLevel || 1);
      var card = document.createElement("article");
      card.className = "level-card " + (unlocked ? "is-unlocked" : "is-locked");
      card.style.setProperty("--level-accent", level.accent);
      var starsValue = Number(progress.stars[level.id] || 0);
      var bestTime = Number(progress.bestTimes[level.id] || 0);
      card.innerHTML =
        '<div class="level-visual"><span class="level-number">' + String(level.id).padStart(2, "0") + '</span><span class="level-scene-icon">' + ["🍓", "🌊", "🌲", "🌇", "🌙"][index] + '</span><span class="level-node">' + (unlocked ? "●" : "🔒") + '</span></div>' +
        '<div class="level-card-body"><div class="level-card-top"><span class="difficulty-pill">' + app.t(level.difficultyKey) + '</span><span class="level-stars">' + starMarkup(starsValue) + '</span></div><h3>' + app.t(level.nameKey) + '</h3><p>' + app.t(level.descriptionKey) + '</p><div class="level-meta"><span>⏱️ ' + app.utils.formatTime(level.maxTime) + '</span><span>⚡ ' + level.energyMax + '</span></div><button class="level-play-button ' + (unlocked ? "" : "is-disabled") + '" type="button" ' + (unlocked ? "" : "disabled") + '><span>' + (unlocked ? "🚩" : "🔒") + '</span><span>' + app.t(unlocked ? "level_play" : "level_locked") + '</span></button>' + (bestTime ? '<small class="level-best">🏅 ' + app.t("level_best") + ': ' + app.utils.formatTime(bestTime) + '</small>' : '') + '</div>';
      card.querySelector("button").addEventListener("click", function () {
        if (unlocked && onSelect) {
          app.AudioManager.playSfx("click");
          onSelect(level);
        }
      });
      container.appendChild(card);
    });
  }

  app.LevelSystem = { getLevel: getLevel, getLevels: function () { return global.LEVELS_DATA.slice(); }, isUnlocked: isUnlocked, getStars: stars, renderCards: renderCards };
})(window);
