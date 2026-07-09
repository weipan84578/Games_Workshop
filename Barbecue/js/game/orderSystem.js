(function exposeOrderSystem(root, factory) {
  var api = factory(root);
  root.BBQ = root.BBQ || {};
  root.BBQ.OrderSystem = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis, function orderSystemFactory(root) {
  "use strict";

  var GrillLogic = root.BBQ && root.BBQ.GrillLogic ? root.BBQ.GrillLogic : null;
  var Helpers = root.BBQ && root.BBQ.Helpers ? root.BBQ.Helpers : {};
  var randomChoice = Helpers.randomChoice || function fallbackChoice(items, rng) {
    return items[Math.floor((rng || Math.random)() * items.length)];
  };
  var clamp = Helpers.clamp || function fallbackClamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  };

  var FOOD_IDS = ["pork", "corn", "mushroom", "shrimp", "sausage"];

  function createOrder(options) {
    options = options || {};
    var rng = options.rng || Math.random;
    var level = Math.max(1, options.level || 1);
    var now = Math.max(0, options.now || 0);
    var itemKinds = clamp(1 + Math.floor(level / 3), 1, 3);
    var totalCount = clamp(1 + Math.floor(level / 2) + Math.floor(rng() * 2), 1, 5);
    var selected = [];
    var available = FOOD_IDS.slice();

    while (selected.length < itemKinds && available.length) {
      var picked = randomChoice(available, rng);
      selected.push(picked);
      available.splice(available.indexOf(picked), 1);
    }

    var items = selected.map(function createItem(typeId) {
      return { typeId: typeId, count: 1, served: 0 };
    });

    for (var index = items.length; index < totalCount; index += 1) {
      randomChoice(items, rng).count += 1;
    }

    var duration = clamp(47000 - level * 2200, 26000, 47000);
    return {
      id: "order-" + String(now) + "-" + String(Math.floor(rng() * 1000000)),
      level: level,
      createdAt: now,
      expiresAt: now + duration,
      items: items,
      completed: false
    };
  }

  function cloneOrder(order) {
    return {
      id: order.id,
      level: order.level,
      createdAt: order.createdAt,
      expiresAt: order.expiresAt,
      completed: Boolean(order.completed),
      items: order.items.map(function cloneItem(item) {
        return { typeId: item.typeId, count: item.count, served: item.served };
      })
    };
  }

  function getRemainingItems(order) {
    if (!order) {
      return [];
    }
    return order.items
      .map(function remainingItem(item) {
        return {
          typeId: item.typeId,
          count: Math.max(0, item.count - item.served)
        };
      })
      .filter(function hasRemaining(item) {
        return item.count > 0;
      });
  }

  function isComplete(order) {
    return getRemainingItems(order).length === 0;
  }

  function OrderSystem(options) {
    options = options || {};
    this.rng = options.rng || Math.random;
    this.level = Math.max(1, options.level || 1);
    this.score = Math.max(0, options.score || 0);
    this.combo = Math.max(0, options.combo || 0);
    this.completedOrders = Math.max(0, options.completedOrders || 0);
    this.currentOrder = options.currentOrder ? cloneOrder(options.currentOrder) : createOrder({
      rng: this.rng,
      level: this.level,
      now: options.now || 0
    });
  }

  OrderSystem.prototype.startNewOrder = function startNewOrder(now) {
    this.level = 1 + Math.floor(this.completedOrders / 2);
    this.currentOrder = createOrder({
      rng: this.rng,
      level: this.level,
      now: now || 0
    });
    return this.currentOrder;
  };

  OrderSystem.prototype.update = function update(now) {
    if (this.currentOrder && !this.currentOrder.completed && now >= this.currentOrder.expiresAt) {
      this.score = Math.max(0, this.score - 35);
      this.combo = 0;
      this.startNewOrder(now);
      return { expired: true, scoreDelta: -35 };
    }
    return { expired: false, scoreDelta: 0 };
  };

  OrderSystem.prototype.serve = function serve(food, now) {
    var state = GrillLogic ? GrillLogic.getFoodState(food) : "raw";
    if (!GrillLogic || !GrillLogic.canServe(food)) {
      var rawPenalty = state === "burnt" ? -45 : -12;
      this.score = Math.max(0, this.score + rawPenalty);
      return { accepted: false, reason: state === "burnt" ? "burnt" : "not_ready", scoreDelta: rawPenalty, state: state };
    }

    var item = this.currentOrder.items.find(function matchItem(orderItem) {
      return orderItem.typeId === food.typeId && orderItem.served < orderItem.count;
    });

    if (!item) {
      this.score = Math.max(0, this.score - 25);
      this.combo = 0;
      return { accepted: false, reason: "wrong_food", scoreDelta: -25, state: state };
    }

    item.served += 1;
    var baseScore = GrillLogic.scoreFood(food);
    var timeRatio = clamp((this.currentOrder.expiresAt - now) / (this.currentOrder.expiresAt - this.currentOrder.createdAt), 0, 1);
    var complete = isComplete(this.currentOrder);
    var bonus = complete ? Math.round(50 + 30 * timeRatio + this.combo * 12) : 0;
    var scoreDelta = baseScore + bonus;
    this.score = Math.max(0, this.score + scoreDelta);

    if (complete) {
      this.currentOrder.completed = true;
      this.completedOrders += 1;
      this.combo += 1;
      this.startNewOrder(now);
    }

    return {
      accepted: true,
      reason: complete ? "order_complete" : "served",
      complete: complete,
      scoreDelta: scoreDelta,
      state: state
    };
  };

  OrderSystem.prototype.getTimeRatio = function getTimeRatio(now) {
    if (!this.currentOrder) {
      return 0;
    }
    var total = Math.max(1, this.currentOrder.expiresAt - this.currentOrder.createdAt);
    return clamp((this.currentOrder.expiresAt - now) / total, 0, 1);
  };

  OrderSystem.prototype.serialize = function serialize() {
    return {
      level: this.level,
      score: this.score,
      combo: this.combo,
      completedOrders: this.completedOrders,
      currentOrder: cloneOrder(this.currentOrder)
    };
  };

  OrderSystem.restore = function restore(data, rng) {
    return new OrderSystem({
      rng: rng || Math.random,
      level: data && data.level,
      score: data && data.score,
      combo: data && data.combo,
      completedOrders: data && data.completedOrders,
      currentOrder: data && data.currentOrder
    });
  };

  return {
    OrderSystem: OrderSystem,
    createOrder: createOrder,
    getRemainingItems: getRemainingItems,
    isComplete: isComplete,
    FOOD_IDS: FOOD_IDS
  };
});
