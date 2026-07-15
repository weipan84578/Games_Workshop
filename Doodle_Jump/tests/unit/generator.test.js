(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  function signature(seed) {
    var state = Game.GameState.create(seed);
    for (var i = 0; i < 5; i += 1) Game.WorldGenerator.ensure(state);
    return state.platforms.map(function (platform) {
      return [platform.x, platform.y, platform.type];
    });
  }

  function sampleGeneration(height) {
    var sample = {
      total: 0,
      special: 0,
      items: 0,
      hazards: 0,
      itemTypes: {},
      hazardTypes: {},
    };
    for (var seed = 1; seed <= 40; seed += 1) {
      var state = Game.GameState.create(seed);
      state.score.maxHeight = height;
      for (var round = 0; round < 10; round += 1) {
        state.camera.y = state.platforms.reduce(function (highest, platform) {
          return platform.type === "spike"
            ? highest
            : Math.min(highest, platform.y);
        }, Infinity);
        Game.WorldGenerator.ensure(state);
      }
      state.platforms
        .filter(function (platform) {
          return platform.type !== "spike";
        })
        .slice(6)
        .forEach(function (platform) {
          sample.total += 1;
          if (platform.type !== "normal") sample.special += 1;
          if (platform.itemType) {
            sample.items += 1;
            sample.itemTypes[platform.itemType] = true;
          }
          if (platform.hazardType) {
            sample.hazards += 1;
            sample.hazardTypes[platform.hazardType] = true;
          }
        });
    }
    return sample;
  }

  Test.test("同一 seed 產生完全相同的平台序列", "generator", function () {
    assert.deepEqual(signature(12345), signature(12345));
  });

  Test.test("不同 seed 會產生不同的可重現序列", "generator", function () {
    assert.truthy(
      JSON.stringify(signature(12345)) !== JSON.stringify(signature(54321)),
    );
  });

  Test.test(
    "每個 seed 都會產生不同但可安全起步的平台",
    "generator",
    function () {
      var first = Game.GameState.create(101);
      var second = Game.GameState.create(202);
      var firstOpening = first.platforms.slice(0, 6);
      var secondOpening = second.platforms.slice(0, 6);
      assert.truthy(
        JSON.stringify(firstOpening) !== JSON.stringify(secondOpening),
      );
      assert.truthy(
        firstOpening.every(function (platform) {
          return platform.type === "normal";
        }),
      );
      assert.truthy(
        Game.Math.horizontalOverlap(first.player, firstOpening[0]) >=
          first.player.width * 0.5,
      );
      for (var seed = 1; seed <= 100; seed += 1) {
        var state = Game.GameState.create(seed);
        var opening = state.platforms.slice(0, 6);
        assert.truthy(
          Game.Math.horizontalOverlap(state.player, opening[0]) >=
            state.player.width * 0.5,
        );
        opening.forEach(function (platform, index) {
          assert.equal(platform.type, "normal");
          assert.truthy(platform.x >= 12);
          assert.truthy(
            platform.x + platform.width <= Game.Constants.LOGICAL_WIDTH - 12,
          );
          if (index > 0) {
            var gap = opening[index - 1].y - platform.y;
            assert.truthy(gap >= 104 && gap <= 124);
          }
        });
      }
    },
  );

  Test.test("關卡由平靜開場逐步加入移動、敵人與危險", "generator", function () {
    var opening = Game.Difficulty.get(0);
    var middle = Game.Difficulty.get(700);
    var late = Game.Difficulty.get(2400);
    assert.equal(opening.movingChance, 0);
    assert.equal(opening.enemyChance, 0);
    assert.equal(opening.rareItemChance, 0);
    assert.truthy(middle.movingChance > 0);
    assert.truthy(middle.enemyChance > 0);
    assert.truthy(late.spikeChance > 0);
    assert.truthy(late.holeChance > 0);
    assert.truthy(late.platformWidth < opening.platformWidth);
  });

  Test.test("平台、道具與危險機率會隨高度持續上升", "generator", function () {
    var heights = [0, 100, 300, 700, 1500, 3000, 6000];
    var chanceKeys = [
      "specialPlatformChance",
      "itemChance",
      "rareItemChance",
      "hazardChance",
      "flyerChance",
    ];
    chanceKeys.forEach(function (key) {
      for (var index = 1; index < heights.length; index += 1) {
        assert.truthy(
          Game.Difficulty.get(heights[index])[key] >=
            Game.Difficulty.get(heights[index - 1])[key],
        );
      }
      assert.truthy(
        Game.Difficulty.get(heights[heights.length - 1])[key] >
          Game.Difficulty.get(heights[0])[key],
      );
    });
  });

  Test.test("高空實際生成會明顯增加變化與危險種類", "generator", function () {
    var low = sampleGeneration(100);
    var high = sampleGeneration(3000);
    assert.truthy(high.special / high.total > low.special / low.total + 0.25);
    assert.truthy(high.items / high.total > low.items / low.total + 0.05);
    assert.truthy(high.hazards / high.total > low.hazards / low.total + 0.2);
    ["spring", "shield", "magnet", "rocket", "slow", "lucky"].forEach(
      function (type) {
        assert.truthy(high.itemTypes[type]);
      },
    );
    ["monster", "flyer", "spike", "hole"].forEach(function (type) {
      assert.truthy(high.hazardTypes[type]);
    });
  });

  Test.test("教學區不會生成危險平台或敵人", "generator", function () {
    var state = Game.GameState.create(42);
    Game.WorldGenerator.ensure(state);
    assert.truthy(state.enemies.length === 0);
    assert.truthy(
      state.platforms.every(function (platform) {
        return platform.type !== "spike";
      }),
    );
  });

  Test.test("高難度仍保留安全節奏與道具供應", "generator", function () {
    for (var seed = 1; seed <= 100; seed += 1) {
      var state = Game.GameState.create(seed);
      state.score.maxHeight = 3000;
      for (var round = 0; round < 20; round += 1) {
        state.camera.y = state.platforms.reduce(function (highest, platform) {
          return platform.type === "spike"
            ? highest
            : Math.min(highest, platform.y);
        }, Infinity);
        Game.WorldGenerator.ensure(state);
      }
      var mainPath = state.platforms.filter(function (platform) {
        return platform.type !== "spike";
      });
      for (var index = 1; index < mainPath.length; index += 1) {
        var previousFragile =
          mainPath[index - 1].type === "brittle" ||
          mainPath[index - 1].type === "cloud";
        var currentFragile =
          mainPath[index].type === "brittle" ||
          mainPath[index].type === "cloud";
        assert.equal(previousFragile && currentFragile, false);
        assert.equal(
          Boolean(mainPath[index - 1].hazardType) &&
            Boolean(mainPath[index].hazardType),
          false,
        );
      }
      var itemDrought = 0;
      mainPath.slice(6).forEach(function (platform) {
        itemDrought = platform.itemType ? 0 : itemDrought + 1;
        assert.truthy(itemDrought <= 3);
      });
    }
  });
})(window.DJGame, window.DJTest);
