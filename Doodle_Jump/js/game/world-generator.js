(function (Game) {
  "use strict";
  function chooseType(rng, difficulty, forceSpecial) {
    var total = difficulty.specialPlatformChance;
    if (total <= 0) return "normal";
    var roll = rng.next();
    if (forceSpecial) roll *= total;
    if (roll < difficulty.cloudChance) return "cloud";
    roll -= difficulty.cloudChance;
    if (roll < difficulty.vanishChance) return "vanishing";
    roll -= difficulty.vanishChance;
    if (roll < difficulty.springChance) return "spring";
    roll -= difficulty.springChance;
    if (roll < difficulty.brittleChance) return "brittle";
    roll -= difficulty.brittleChance;
    if (roll < difficulty.movingChance) return "moving";
    return "normal";
  }
  function chooseItemType(rng, difficulty, luckyActive) {
    var rareChance = Game.Math.clamp(
      difficulty.rareItemChance + (luckyActive ? 0.25 : 0),
      0,
      0.85,
    );
    if (difficulty.stage === 0 || rng.next() >= rareChance)
      return "star";
    var choices = ["spring", "shield", "magnet"];
    if (difficulty.stage >= 2) choices.push("rocket", "slow");
    if (difficulty.stage >= 3) choices.push("lucky");
    return rng.pick(choices);
  }
  function createOpeningPlatforms(state) {
    var platforms = [];
    var y = 660;
    var width = state.rng.int(114, 132);
    var x = Game.Math.clamp(
      150 + state.rng.range(-20, 20),
      12,
      Game.Constants.LOGICAL_WIDTH - width - 12,
    );
    for (var index = 0; index < 6; index += 1) {
      if (index > 0) {
        y -= state.rng.range(104, 124);
        width = state.rng.int(108, 132);
        x = Game.Math.clamp(
          x + state.rng.range(-132, 132),
          12,
          Game.Constants.LOGICAL_WIDTH - width - 12,
        );
      }
      platforms.push(
        Game.Platform.create(
          "platform-" + index,
          Math.round(x),
          Math.round(y),
          width,
          "normal",
        ),
      );
    }
    return platforms;
  }
  function populate(state) {
    state.platforms = createOpeningPlatforms(state);
    state.enemies = [];
    state.nextId = 6;
    var starPlatform = state.platforms[state.rng.int(2, 4)];
    starPlatform.itemType = "star";
    state.items = [
      Game.Item.create(
        "item-" + state.nextId++,
        Math.round(starPlatform.x + starPlatform.width * 0.5 - 12),
        starPlatform.y - 40,
        "star",
      ),
    ];
  }
  function appendNext(state) {
    var platforms = state.platforms.filter(function (platform) {
      return platform.active && platform.type !== "spike";
    });
    var last = platforms.reduce(function (current, platform) {
      return !current || platform.y < current.y ? platform : current;
    }, null);
    if (!last) return;
    var difficulty = Game.Difficulty.get(state.score.maxHeight);
    var gap = state.rng.range(difficulty.gapMin, difficulty.gapMax);
    var reach = Math.min(120, 105 + difficulty.platformWidth * 0.12);
    var x = Game.Math.clamp(
      last.x + state.rng.range(-reach, reach),
      10,
      Game.Constants.LOGICAL_WIDTH - difficulty.platformWidth - 10,
    );
    var recentPlatforms = platforms.slice(-4);
    var forceSpecial =
      recentPlatforms.length === 4 &&
      recentPlatforms.every(function (platform) {
        return platform.type === "normal";
      });
    var type = chooseType(state.rng, difficulty, forceSpecial);
    var lastIsFragile = last.type === "brittle" || last.type === "cloud";
    var nextIsFragile = type === "brittle" || type === "cloud";
    if (lastIsFragile && nextIsFragile) type = "normal";
    var platform = Game.Platform.create(
      "platform-" + state.nextId++,
      x,
      last.y - gap,
      difficulty.platformWidth + state.rng.int(-8, 12),
      type,
      { phase: state.rng.range(0, 6.28), speed: state.rng.range(35, 65) },
    );
    state.platforms.push(platform);

    var fragile = type === "brittle" || type === "cloud";
    var hazardAllowed = !last.hazardType && !fragile;
    var hazardRoll = state.rng.next();
    if (hazardAllowed && hazardRoll < difficulty.enemyChance) {
      var enemyType =
        state.rng.next() < difficulty.flyerChance ? "flyer" : "monster";
      platform.hazardType = enemyType;
      state.enemies.push(
        Game.Enemy.create(
          "enemy-" + state.nextId++,
          Game.Math.clamp(x + state.rng.range(-40, platform.width), 15, 375),
          platform.y - 34,
          enemyType,
          state.rng,
        ),
      );
    } else if (
      hazardAllowed &&
      hazardRoll < difficulty.enemyChance + difficulty.spikeChance
    ) {
      platform.hazardType = "spike";
      var spikeWidth = state.rng.int(42, 64);
      var spikeX = Game.Math.clamp(
        x + state.rng.range(-95, platform.width + 60),
        8,
        Game.Constants.LOGICAL_WIDTH - spikeWidth - 8,
      );
      state.platforms.push(
        Game.Platform.create(
          "platform-" + state.nextId++,
          spikeX,
          platform.y + 12,
          spikeWidth,
          "spike",
        ),
      );
    } else if (
      hazardAllowed &&
      hazardRoll <
        difficulty.enemyChance + difficulty.spikeChance + difficulty.holeChance
    ) {
      platform.hazardType = "hole";
      state.enemies.push(
        Game.Enemy.create(
          "enemy-" + state.nextId++,
          Game.Math.clamp(
            x + state.rng.range(-90, platform.width + 45),
            18,
            Game.Constants.LOGICAL_WIDTH - 65,
          ),
          platform.y - state.rng.range(80, 145),
          "hole",
          state.rng,
        ),
      );
    }

    var recentItemPlatforms = platforms.slice(-3);
    var forceItem =
      recentItemPlatforms.length === 3 &&
      recentItemPlatforms.every(function (recentPlatform) {
        return !recentPlatform.itemType;
      });
    var itemRoll = state.rng.next();
    if (forceItem || itemRoll < difficulty.itemChance) {
      var itemType = chooseItemType(
        state.rng,
        difficulty,
        Boolean(state.player.buffs.lucky > 0),
      );
      platform.itemType = itemType;
      state.items.push(
        Game.Item.create(
          "item-" + state.nextId++,
          x + platform.width * 0.5 - 12,
          platform.y - 44,
          itemType,
        ),
      );
    }
  }
  function ensure(state) {
    var targetY = state.camera.y - 360;
    function highestActive() {
      return state.platforms.reduce(function (min, platform) {
        return platform.active && platform.type !== "spike"
          ? Math.min(min, platform.y)
          : min;
      }, Infinity);
    }
    var highest = highestActive();
    var guard = 0;
    while (highest > targetY && guard < 8) {
      appendNext(state);
      highest = highestActive();
      guard += 1;
    }
  }
  function cleanup(state) {
    var bottom = state.camera.y + Game.Constants.LOGICAL_HEIGHT + 180;
    state.platforms = state.platforms
      .filter(function (platform) {
        return platform.y < bottom && platform.y > state.camera.y - 500;
      })
      .slice(-Game.Constants.MAX_PLATFORMS);
    state.items = state.items
      .filter(function (item) {
        return item.active && item.y < bottom && item.y > state.camera.y - 500;
      })
      .slice(-Game.Constants.MAX_ITEMS);
    state.enemies = state.enemies
      .filter(function (enemy) {
        return (
          enemy.active && enemy.y < bottom && enemy.y > state.camera.y - 500
        );
      })
      .slice(-Game.Constants.MAX_ENEMIES);
  }
  Game.WorldGenerator = Object.freeze({
    populate: populate,
    ensure: ensure,
    cleanup: cleanup,
    chooseItemType: chooseItemType,
  });
})(window.DJGame);
