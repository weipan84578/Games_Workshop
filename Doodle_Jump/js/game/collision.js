(function (Game) {
  "use strict";
  function platformLanding(player, platforms) {
    if (player.vy <= 0) return null;
    var previousBottom = player.previousY + player.height;
    var currentBottom = player.y + player.height;
    var candidates = platforms
      .filter(function (platform) {
        if (!platform.active || platform.type === "spike") return false;
        var overlap = Game.Math.horizontalOverlap(player, platform);
        return (
          overlap >= player.width * 0.2 &&
          previousBottom <= platform.y + 2 &&
          currentBottom >= platform.y
        );
      })
      .sort(function (a, b) {
        return a.y - b.y;
      });
    if (!candidates.length) return null;
    var platform = candidates[0];
    player.y = platform.y - player.height;
    return {
      platform: platform,
      multiplier: platform.type === "spring" ? 1.45 : 1,
    };
  }
  function collectItems(player, items) {
    return items.filter(function (item) {
      return (
        item.active && Game.Math.rectsOverlap(Game.Player.rect(player), item)
      );
    });
  }
  function hitEnemies(player, enemies) {
    return enemies.filter(function (enemy) {
      return (
        enemy.active && Game.Math.rectsOverlap(Game.Player.rect(player), enemy)
      );
    });
  }

  function hitHazards(player, platforms) {
    var playerRect = Game.Player.rect(player);
    return platforms.filter(function (platform) {
      return (
        platform.active &&
        platform.type === "spike" &&
        Game.Math.rectsOverlap(playerRect, platform)
      );
    });
  }

  Game.Collision = Object.freeze({
    platformLanding: platformLanding,
    collectItems: collectItems,
    hitEnemies: hitEnemies,
    hitHazards: hitHazards,
  });
})(window.DJGame);
