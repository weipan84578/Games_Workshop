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
  function populate(state) {
    state.platforms = [];
    state.platforms.push(
      Game.Platform.create("platform-0", 150, 660, 120, "normal"),
    );
    state.platforms.push(
      Game.Platform.create("platform-1", 90, 548, 128, "normal"),
    );
    state.platforms.push(
      Game.Platform.create("platform-2", 240, 430, 116, "normal"),
    );
    state.platforms.push(
      Game.Platform.create("platform-3", 120, 310, 125, "normal"),
    );
    state.platforms.push(
      Game.Platform.create("platform-4", 272, 185, 115, "normal"),
    );
    state.platforms.push(
      Game.Platform.create("platform-5", 164, 64, 120, "normal"),
    );
    state.items = [
      {
        id: "item-0",
        x: 282,
        y: 392,
        width: 24,
        height: 24,
        type: "star",
        active: true,
        phase: 1,
        baseY: 392,
      },
    ];
    state.enemies = [];
    state.nextId = 6;
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
      var itemType =
        state.rng.next() < 0.7
          ? "star"
          : Game.Item.types[state.rng.int(1, Game.Item.types.length - 1)];
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
