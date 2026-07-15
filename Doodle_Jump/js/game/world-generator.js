(function (Game) {
  "use strict";
  function chooseType(rng, difficulty) {
    var roll = rng.next();
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
  function chooseItemType(rng, difficulty) {
    if (difficulty.stage === 0 || rng.next() >= difficulty.rareItemChance)
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
      return platform.active;
    });
    var last = platforms.reduce(function (current, platform) {
      return !current || platform.y < current.y ? platform : current;
    }, null);
    if (!last) return;
    var difficulty = Game.Difficulty.get(state.score.maxHeight);
    var gap = state.rng.range(difficulty.gapMin, difficulty.gapMax);
    var reach = 150 + difficulty.platformWidth * 0.28;
    var x = Game.Math.clamp(
      last.x + state.rng.range(-reach, reach),
      10,
      Game.Constants.LOGICAL_WIDTH - difficulty.platformWidth - 10,
    );
    var type = chooseType(state.rng, difficulty);
    var platform = Game.Platform.create(
      "platform-" + state.nextId++,
      x,
      last.y - gap,
      difficulty.platformWidth + state.rng.int(-8, 12),
      type,
      { phase: state.rng.range(0, 6.28), speed: state.rng.range(35, 65) },
    );
    state.platforms.push(platform);

    if (
      state.score.maxHeight > 1000 &&
      state.rng.next() < difficulty.spikeChance
    ) {
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
    }

    if (state.rng.next() < difficulty.itemChance) {
      var itemType = chooseItemType(state.rng, difficulty);
      state.items.push(
        Game.Item.create(
          "item-" + state.nextId++,
          x + platform.width * 0.5 - 12,
          platform.y - 44,
          itemType,
        ),
      );
    }
    if (
      state.score.maxHeight > 300 &&
      state.rng.next() < difficulty.enemyChance
    ) {
      var enemyType =
        state.score.maxHeight > 1100 && state.rng.next() < 0.25
          ? "flyer"
          : "monster";
      state.enemies.push(
        Game.Enemy.create(
          "enemy-" + state.nextId++,
          Game.Math.clamp(x + state.rng.range(-40, platform.width), 15, 375),
          platform.y - 34,
          enemyType,
          state.rng,
        ),
      );
    }

    if (
      state.score.maxHeight > 1500 &&
      state.rng.next() < difficulty.holeChance
    ) {
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
  }
  function ensure(state) {
    var targetY = state.camera.y - 360;
    var highest = state.platforms.reduce(function (min, platform) {
      return Math.min(min, platform.y);
    }, Infinity);
    var guard = 0;
    while (highest > targetY && guard < 8) {
      appendNext(state);
      highest = state.platforms.reduce(function (min, platform) {
        return Math.min(min, platform.y);
      }, Infinity);
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
  });
})(window.DJGame);
