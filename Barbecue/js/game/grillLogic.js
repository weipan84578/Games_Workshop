(function exposeGrillLogic(root, factory) {
  var api = factory(root);
  root.BBQ = root.BBQ || {};
  root.BBQ.GrillLogic = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis, function grillLogicFactory(root) {
  "use strict";

  var helpers = root.BBQ && root.BBQ.Helpers ? root.BBQ.Helpers : null;
  var clamp = helpers ? helpers.clamp : function fallbackClamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  };

  var FOOD_TYPES = Object.freeze({
    pork: Object.freeze({
      id: "pork",
      labelKey: "food_pork",
      cookMs: 5800,
      burnMs: 11200,
      color: "#ff8f7b",
      accent: "#fff1d0",
      score: 110
    }),
    corn: Object.freeze({
      id: "corn",
      labelKey: "food_corn",
      cookMs: 7000,
      burnMs: 13600,
      color: "#ffd447",
      accent: "#f2a91f",
      score: 125
    }),
    mushroom: Object.freeze({
      id: "mushroom",
      labelKey: "food_mushroom",
      cookMs: 4700,
      burnMs: 9200,
      color: "#d9534f",
      accent: "#ffe2bf",
      score: 100
    }),
    shrimp: Object.freeze({
      id: "shrimp",
      labelKey: "food_shrimp",
      cookMs: 4100,
      burnMs: 8100,
      color: "#ff9a76",
      accent: "#fff3dc",
      score: 105
    }),
    sausage: Object.freeze({
      id: "sausage",
      labelKey: "food_sausage",
      cookMs: 6200,
      burnMs: 12100,
      color: "#c94f3d",
      accent: "#ffd3a8",
      score: 115
    })
  });

  var DONENESS = Object.freeze({
    RAW: "raw",
    SEARING: "searing",
    READY: "ready",
    PERFECT: "perfect",
    BURNT: "burnt"
  });

  var foodCounter = 0;

  function getFoodType(typeId) {
    return FOOD_TYPES[typeId] || FOOD_TYPES.pork;
  }

  function createFood(typeId, slotId, now) {
    var type = getFoodType(typeId);
    foodCounter += 1;
    return {
      id: "food-" + String(now || 0) + "-" + foodCounter,
      typeId: type.id,
      slotId: slotId,
      activeSide: 0,
      sideCook: [0, 0],
      flips: 0,
      placedAt: now || 0,
      lastFlipAt: now || 0,
      warned: false,
      burned: false
    };
  }

  function restoreFood(data) {
    if (!data || !FOOD_TYPES[data.typeId]) {
      return null;
    }
    return {
      id: data.id || "food-restored-" + data.slotId,
      typeId: data.typeId,
      slotId: Number(data.slotId) || 0,
      activeSide: data.activeSide === 1 ? 1 : 0,
      sideCook: [
        clamp(Number(data.sideCook && data.sideCook[0]) || 0, 0, 60000),
        clamp(Number(data.sideCook && data.sideCook[1]) || 0, 0, 60000)
      ],
      flips: Math.max(0, Number(data.flips) || 0),
      placedAt: Number(data.placedAt) || 0,
      lastFlipAt: Number(data.lastFlipAt) || 0,
      warned: Boolean(data.warned),
      burned: Boolean(data.burned)
    };
  }

  function serializeFood(food) {
    if (!food) {
      return null;
    }
    return {
      id: food.id,
      typeId: food.typeId,
      slotId: food.slotId,
      activeSide: food.activeSide,
      sideCook: food.sideCook.slice(),
      flips: food.flips,
      placedAt: food.placedAt,
      lastFlipAt: food.lastFlipAt,
      warned: food.warned,
      burned: food.burned
    };
  }

  function updateFood(food, deltaMs, heat) {
    if (!food) {
      return null;
    }
    var type = getFoodType(food.typeId);
    var appliedHeat = Number.isFinite(heat) ? heat : 1;
    var amount = Math.max(0, deltaMs || 0) * appliedHeat;
    food.sideCook[food.activeSide] = clamp(food.sideCook[food.activeSide] + amount, 0, type.burnMs);
    return food;
  }

  function flipFood(food, now) {
    if (!food) {
      return null;
    }
    food.activeSide = food.activeSide === 0 ? 1 : 0;
    food.flips += 1;
    food.lastFlipAt = now || food.lastFlipAt;
    food.warned = false;
    return food;
  }

  function getSideRatio(type, cookedMs) {
    return clamp(cookedMs / type.cookMs, 0, 1);
  }

  function getFoodState(food) {
    if (!food) {
      return DONENESS.RAW;
    }
    var type = getFoodType(food.typeId);
    var sideA = food.sideCook[0];
    var sideB = food.sideCook[1];
    var maxSide = Math.max(sideA, sideB);
    var sideAReady = sideA >= type.cookMs;
    var sideBReady = sideB >= type.cookMs;

    if (sideA >= type.burnMs || sideB >= type.burnMs) {
      return DONENESS.BURNT;
    }

    if (sideAReady && sideBReady) {
      return DONENESS.PERFECT;
    }

    if (sideAReady || sideBReady) {
      return DONENESS.READY;
    }

    if (maxSide >= type.cookMs * 0.35) {
      return DONENESS.SEARING;
    }

    return DONENESS.RAW;
  }

  function getWarningLevel(food) {
    if (!food || getFoodState(food) === DONENESS.BURNT) {
      return 0;
    }
    var type = getFoodType(food.typeId);
    var activeCook = food.sideCook[food.activeSide];
    return clamp((activeCook - type.cookMs) / (type.burnMs - type.cookMs), 0, 1);
  }

  function getCookProgress(food) {
    if (!food) {
      return [0, 0];
    }
    var type = getFoodType(food.typeId);
    return [getSideRatio(type, food.sideCook[0]), getSideRatio(type, food.sideCook[1])];
  }

  function canServe(food) {
    var state = getFoodState(food);
    return state === DONENESS.PERFECT;
  }

  function scoreFood(food) {
    var type = getFoodType(food && food.typeId);
    var state = getFoodState(food);
    if (state === DONENESS.PERFECT) {
      return type.score;
    }
    if (state === DONENESS.BURNT) {
      return -45;
    }
    return -12;
  }

  return {
    FOOD_TYPES: FOOD_TYPES,
    DONENESS: DONENESS,
    createFood: createFood,
    restoreFood: restoreFood,
    serializeFood: serializeFood,
    updateFood: updateFood,
    flipFood: flipFood,
    getFoodType: getFoodType,
    getFoodState: getFoodState,
    getWarningLevel: getWarningLevel,
    getCookProgress: getCookProgress,
    canServe: canServe,
    scoreFood: scoreFood
  };
});
