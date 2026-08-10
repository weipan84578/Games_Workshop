(function (global) {
  "use strict";
  var CCC = global.CCC;

  function CookingManager(session) {
    this.session = session;
    this.current = null;
    this.temperature = 172;
    this.fryers = [];
    this.wasIdeal = true;
    for (var index = 0; index < session.upgrades.fryer; index += 1) { this.fryers.push(null); }
  }

  CookingManager.prototype.feedback = function (key, tone, values) {
    CCC.events.emit("feedback", { key: key, tone: tone || "info", values: values || {} });
  };

  CookingManager.prototype.takeChicken = function () {
    if (this.current) { this.feedback("status.busy", "warning"); return false; }
    this.current = {
      id: CCC.utils.uid("food"), stage: "raw", location: "supply", marinade: 0,
      marinateActive: false, coating: 0, prepLevel: this.session.upgrades.prep,
      fry: null, selectedFlavor: null, seasoningAttempts: 0, flavorScore: 0, failed: false
    };
    CCC.audio.play("pickup");
    this.feedback("status.moveMarinade");
    CCC.events.emit("cookingchange");
    return true;
  };

  CookingManager.prototype.moveCurrent = function (target, options) {
    var piece = this.current;
    if (!piece) { this.feedback("status.invalid", "error"); return false; }
    if (target === "marinade" && piece.stage === "raw") {
      piece.location = "marinade"; piece.stage = "marinating";
      this.feedback("status.marinate"); CCC.events.emit("cookingchange"); return true;
    }
    if (target === "coating" && piece.stage === "marinated") {
      piece.location = "coating"; piece.stage = "coating";
      this.feedback("status.coat"); CCC.events.emit("cookingchange"); return true;
    }
    if (target === "fryer" && piece.stage === "coating") {
      return this.placeInFryer(options && options.basketIndex);
    }
    if (target === "seasoning" && piece.stage === "fried") {
      piece.location = "seasoning"; this.feedback("status.season"); CCC.events.emit("cookingchange"); return true;
    }
    if (target === "bagging" && piece.stage === "seasoned") { return this.bag(); }
    if (target === "waste" && piece.failed) { return this.discard(); }
    this.feedback("status.invalid", "error");
    return false;
  };

  CookingManager.prototype.startMarinate = function () {
    if (!this.current || this.current.stage !== "marinating") { this.feedback("status.invalid", "error"); return; }
    this.current.marinateActive = true;
  };

  CookingManager.prototype.stopMarinate = function () {
    var piece = this.current;
    if (!piece || piece.stage !== "marinating") { return; }
    piece.marinateActive = false;
    piece.stage = "marinated";
    CCC.audio.play("marinate");
    this.feedback("status.moveCoating");
    CCC.events.emit("cookingchange");
  };

  CookingManager.prototype.coat = function () {
    var piece = this.current;
    if (!piece || piece.stage !== "coating") { this.feedback("status.invalid", "error"); return; }
    var amount = piece.prepLevel >= 3 ? 31 : 26;
    piece.coating = Math.min(100, piece.coating + amount);
    CCC.audio.play("coat");
    if (piece.coating >= 70) { this.feedback("status.moveFryer"); }
    CCC.events.emit("cookingchange");
  };

  CookingManager.prototype.placeInFryer = function (requestedIndex) {
    var piece = this.current;
    var index = Number.isInteger(requestedIndex) && !this.fryers[requestedIndex] ? requestedIndex : this.fryers.findIndex(function (item) { return !item; });
    if (index < 0) { this.feedback("status.noBasket", "warning"); return false; }
    piece.stage = "frying";
    piece.location = "fryer";
    piece.fry = { doneness: 0, totalTime: 0, idealTime: 0, idealRatio: 0, flipAt: null };
    this.fryers[index] = piece;
    this.current = null;
    CCC.audio.play("sizzle");
    this.feedback("status.fry");
    CCC.events.emit("cookingchange");
    return true;
  };

  CookingManager.prototype.adjustTemperature = function (direction) {
    this.temperature = CCC.utils.clamp(this.temperature + direction * 7, 130, 215);
    CCC.audio.play(this.temperature >= 167 && this.temperature <= 183 ? "ideal" : "click");
    CCC.events.emit("cookingchange");
  };

  CookingManager.prototype.flip = function (index) {
    var piece = this.fryers[index];
    if (!piece) { this.feedback("status.invalid", "error"); return; }
    if (piece.fry.flipAt !== null) { this.feedback("status.invalid", "warning"); return; }
    piece.fry.flipAt = Math.round(piece.fry.doneness);
    CCC.audio.play("flip");
    CCC.events.emit("cookingchange");
  };

  CookingManager.prototype.collect = function (index) {
    var piece = this.fryers[index];
    if (!piece || this.current) { this.feedback(this.current ? "status.busy" : "status.invalid", "warning"); return false; }
    if (piece.fry.doneness < 80) { this.feedback("status.tooRaw", "warning"); return false; }
    if (piece.fry.flipAt === null && piece.fry.doneness <= 115) { this.feedback("status.mustFlip", "warning"); return false; }
    this.fryers[index] = null;
    this.current = piece;
    piece.location = "fryer";
    piece.stage = "fried";
    piece.failed = piece.fry.doneness > 115;
    if (piece.failed) {
      this.feedback("status.ruined", "error");
    } else {
      this.feedback("status.season");
    }
    CCC.events.emit("cookingchange");
    return true;
  };

  CookingManager.prototype.season = function (recipeId) {
    var piece = this.current;
    if (!piece || piece.stage !== "fried" || piece.failed) { this.feedback("status.invalid", "error"); return; }
    var order = this.session.orders.get(this.session.selectedOrderId) || this.session.orders.items[0];
    if (!order) { this.feedback("status.orderGone", "warning"); return; }
    piece.seasoningAttempts += 1;
    piece.selectedFlavor = recipeId;
    CCC.audio.play("season");
    if (recipeId !== order.recipeId) {
      if (piece.seasoningAttempts >= 2) {
        piece.failed = true;
        this.feedback("status.wrongAgain", "error");
      } else {
        this.feedback("status.wrongFlavor", "warning");
      }
    } else {
      piece.flavorScore = 100;
      piece.stage = "seasoned";
      piece.location = "seasoning";
      this.feedback("status.bag");
    }
    CCC.events.emit("cookingchange");
  };

  CookingManager.prototype.bag = function () {
    var piece = this.current;
    if (!piece || piece.stage !== "seasoned") { this.feedback("status.invalid", "error"); return false; }
    piece.stage = "bagged";
    piece.location = "bagging";
    CCC.audio.play("bag");
    this.feedback("status.deliver");
    CCC.events.emit("cookingchange");
    return true;
  };

  CookingManager.prototype.deliver = function (orderId) {
    var piece = this.current;
    var order = this.session.orders.get(orderId);
    if (!piece || piece.stage !== "bagged" || !order) { this.feedback("status.invalid", "error"); return false; }
    if (piece.selectedFlavor !== order.recipeId) { this.feedback("status.wrongOrder", "error"); return false; }
    this.session.deliver(piece, order);
    this.current = null;
    CCC.events.emit("cookingchange");
    return true;
  };

  CookingManager.prototype.discard = function () {
    if (!this.current || !this.current.failed) { this.feedback("status.invalid", "error"); return false; }
    this.current = null;
    this.session.onWaste();
    CCC.events.emit("cookingchange");
    return true;
  };

  CookingManager.prototype.update = function (delta) {
    var piece = this.current;
    if (piece && piece.stage === "marinating" && piece.marinateActive) {
      var speed = piece.prepLevel >= 3 ? 27 : 23;
      piece.marinade = Math.min(110, piece.marinade + delta * speed);
      if (piece.marinade >= 110) { this.stopMarinate(); }
    }

    var idealLow = this.session.upgrades.fryer >= 3 ? 167 : 170;
    var idealHigh = this.session.upgrades.fryer >= 3 ? 183 : 180;
    var drift = this.session.level.drift * (this.session.upgrades.fryer >= 2 ? .8 : 1);
    this.temperature += (164 - this.temperature) * delta * .055 + Math.sin(this.session.elapsed * .7) * drift * delta;
    this.temperature = CCC.utils.clamp(this.temperature, 125, 220);
    var ideal = this.temperature >= idealLow && this.temperature <= idealHigh;
    if (ideal && !this.wasIdeal && this.fryers.some(Boolean)) { CCC.audio.play("ideal"); }
    this.wasIdeal = ideal;

    this.fryers.forEach(function (fryingPiece) {
      if (!fryingPiece) { return; }
      var heatFactor = CCC.utils.clamp((this.temperature - 120) / 55, .55, 1.45);
      fryingPiece.fry.totalTime += delta;
      if (ideal) { fryingPiece.fry.idealTime += delta; }
      fryingPiece.fry.idealRatio = fryingPiece.fry.totalTime ? fryingPiece.fry.idealTime / fryingPiece.fry.totalTime : 0;
      fryingPiece.fry.doneness += delta * 10.8 * heatFactor;
    }, this);
  };

  CCC.game = CCC.game || {};
  CCC.game.CookingManager = CookingManager;
}(typeof window !== "undefined" ? window : globalThis));
