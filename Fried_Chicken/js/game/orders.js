(function (global) {
  "use strict";
  var CCC = global.CCC;

  function OrderManager(session) {
    this.session = session;
    this.items = [];
    this.spawnDelay = 0;
    this.lastFlavors = [];
  }

  OrderManager.prototype.availableRecipes = function () {
    return CCC.data.recipes.slice(0, this.session.level.recipes);
  };

  OrderManager.prototype.chooseRecipe = function () {
    var recipes = this.availableRecipes();
    if (recipes.length === 1) { return recipes[0]; }
    var available = recipes;
    if (this.lastFlavors.length >= 2 && this.lastFlavors[0] === this.lastFlavors[1]) {
      available = recipes.filter(function (recipe) { return recipe.id !== this.lastFlavors[0]; }, this);
    }
    return CCC.utils.randomChoice(available);
  };

  OrderManager.prototype.spawn = function () {
    if (this.items.length >= this.session.level.maxOrders || this.session.remaining <= 0) { return null; }
    var recipe = this.chooseRecipe();
    var counterLevel = this.session.upgrades.counter;
    var patienceBoost = counterLevel === 2 ? 1.10 : (counterLevel >= 3 ? 1.20 : 1);
    var basePatience = this.session.level.patience * patienceBoost;
    var customer = CCC.utils.randomChoice(CCC.data.customers);
    var order = {
      id: CCC.utils.uid("order"),
      recipeId: recipe.id,
      price: recipe.price,
      patience: basePatience,
      maxPatience: basePatience,
      customer: customer,
      isNew: true
    };
    this.items.push(order);
    this.lastFlavors.unshift(recipe.id);
    this.lastFlavors = this.lastFlavors.slice(0, 2);
    setTimeout(function () { order.isNew = false; }, 420);
    CCC.audio.play("order");
    CCC.events.emit("orderchange");
    if (!this.session.selectedOrderId) { this.session.selectedOrderId = order.id; }
    return order;
  };

  OrderManager.prototype.fill = function () {
    while (this.items.length < this.session.level.maxOrders && this.session.remaining > 2) { this.spawn(); }
  };

  OrderManager.prototype.update = function (delta) {
    var self = this;
    this.items.slice().forEach(function (order) {
      order.patience -= delta;
      if (order.patience <= 0) {
        if (self.session.upgrades.counter >= 3 && self.session.combo > 0 && !self.session.graceUsed) {
          self.session.graceUsed = true;
          order.patience = 2;
          CCC.events.emit("feedback", { key: "status.grace", tone: "warning" });
          return;
        }
        self.remove(order.id);
        self.session.onOrderLeft(order);
      }
    });
    if (this.items.length < this.session.level.maxOrders) {
      this.spawnDelay -= delta;
      if (this.spawnDelay <= 0) {
        this.spawn();
        this.spawnDelay = 1.0 + Math.random() * 1.2;
      }
    }
  };

  OrderManager.prototype.get = function (id) {
    return this.items.find(function (item) { return item.id === id; }) || null;
  };

  OrderManager.prototype.remove = function (id) {
    var index = this.items.findIndex(function (item) { return item.id === id; });
    if (index < 0) { return null; }
    var removed = this.items.splice(index, 1)[0];
    if (this.session.selectedOrderId === id) {
      this.session.selectedOrderId = this.items[0] ? this.items[0].id : null;
    }
    CCC.events.emit("orderchange");
    return removed;
  };

  CCC.game = CCC.game || {};
  CCC.game.OrderManager = OrderManager;
}(typeof window !== "undefined" ? window : globalThis));
