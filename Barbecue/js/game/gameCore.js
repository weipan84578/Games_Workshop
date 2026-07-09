(function exposeGameCore(root, factory) {
  var GameCore = factory(root);
  root.BBQ = root.BBQ || {};
  root.BBQ.GameCore = GameCore;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = GameCore;
  }
})(typeof window !== "undefined" ? window : globalThis, function gameCoreFactory(root) {
  "use strict";

  var GrillLogic = root.BBQ.GrillLogic;
  var OrderSystem = root.BBQ.OrderSystem.OrderSystem;
  var GameRenderer = root.BBQ.GameRenderer;
  var InputController = root.BBQ.InputController;
  var Helpers = root.BBQ.Helpers;

  function GameCore(options) {
    this.canvas = options.canvas;
    this.screen = options.screen;
    this.elements = options.elements;
    this.storage = options.storage;
    this.i18n = options.i18n;
    this.audio = options.audio;
    this.onExitToMenu = options.onExitToMenu || function noop() {};
    this.renderer = new GameRenderer(this.canvas);
    this.input = new InputController({
      canvas: this.canvas,
      renderer: this.renderer,
      game: this
    });
    this.state = "menu";
    this.foods = new Array(6).fill(null);
    this.selectedFoodType = "pork";
    this.selectedSlot = null;
    this.remainingMs = 90000;
    this.elapsedMs = 0;
    this.lastFrame = 0;
    this.lastSaveAt = 0;
    this.message = "";
    this.messageUntil = 0;
    this.orderSystem = new OrderSystem({ now: 0 });
    this.input.bind();
    this.bindControls();
    this.renderOnce();
  }

  GameCore.prototype.bindControls = function bindControls() {
    this.elements.foodButtons.forEach(function bindFood(button) {
      button.addEventListener("click", function selectFood() {
        this.selectFood(button.getAttribute("data-food"));
      }.bind(this));
    }, this);

    this.elements.flipButton.addEventListener("click", this.flipSelected.bind(this));
    this.elements.serveButton.addEventListener("click", this.serveSelected.bind(this));
    this.elements.discardButton.addEventListener("click", this.discardSelected.bind(this));
    this.elements.pauseButton.addEventListener("click", this.togglePause.bind(this));
    this.elements.menuButton.addEventListener("click", this.exitToMenu.bind(this));

    root.addEventListener("resize", function handleResize() {
      this.renderer.resize();
      this.renderOnce();
    }.bind(this));
    root.addEventListener("orientationchange", function handleOrientationChange() {
      setTimeout(function resizeLater() {
        this.renderer.resize();
        this.renderOnce();
      }.bind(this), 120);
    }.bind(this));
  };

  GameCore.prototype.newGame = function newGame() {
    this.foods = new Array(6).fill(null);
    this.selectedFoodType = "pork";
    this.selectedSlot = null;
    this.remainingMs = 90000;
    this.elapsedMs = 0;
    this.lastFrame = 0;
    this.lastSaveAt = 0;
    this.message = "";
    this.orderSystem = new OrderSystem({ now: 0 });
    this.show();
    this.setState("playing");
    this.audio.setScene("game");
    this.updateFoodButtons();
    this.say("status_select_slot");
    this.loop();
  };

  GameCore.prototype.loadGame = function loadGame() {
    var data = this.storage.loadGame();
    if (!data) {
      this.say("status_no_save");
      return false;
    }

    this.foods = new Array(6).fill(null);
    (data.foods || []).forEach(function restoreFood(serialized, slotId) {
      this.foods[slotId] = GrillLogic.restoreFood(serialized);
    }, this);
    this.selectedFoodType = data.selectedFoodType || "pork";
    this.selectedSlot = data.selectedSlot === null || data.selectedSlot === undefined ? null : data.selectedSlot;
    this.remainingMs = Math.max(0, Number(data.remainingMs) || 90000);
    this.elapsedMs = Math.max(0, Number(data.elapsedMs) || 0);
    this.orderSystem = root.BBQ.OrderSystem.OrderSystem.restore(data.orderSystem || {}, Math.random);
    this.show();
    this.setState("playing");
    this.audio.setScene("game");
    this.updateFoodButtons();
    this.say("status_loaded");
    this.loop();
    return true;
  };

  GameCore.prototype.show = function show() {
    this.screen.classList.add("active");
    this.renderer.resize();
    this.updateHud();
  };

  GameCore.prototype.hide = function hide() {
    this.screen.classList.remove("active");
  };

  GameCore.prototype.setState = function setState(nextState) {
    this.state = nextState;
    this.elements.pauseButton.querySelector("[data-i18n]").setAttribute("data-i18n", nextState === "paused" ? "action_resume" : "action_pause");
    this.i18n.translatePage(this.elements.pauseButton);
    this.updateHud();
  };

  GameCore.prototype.loop = function loop(timestamp) {
    if (this.state === "menu" || this.state === "gameover") {
      return;
    }
    root.requestAnimationFrame(this.loop.bind(this));

    if (!timestamp) {
      return;
    }

    if (!this.lastFrame) {
      this.lastFrame = timestamp;
      this.renderOnce();
      return;
    }

    var delta = Math.min(100, timestamp - this.lastFrame);
    this.lastFrame = timestamp;

    if (this.state === "playing") {
      this.update(delta);
    }
    this.renderOnce();
  };

  GameCore.prototype.update = function update(deltaMs) {
    this.elapsedMs += deltaMs;
    this.remainingMs = Math.max(0, this.remainingMs - deltaMs);

    this.foods.forEach(function cook(food) {
      if (food) {
        GrillLogic.updateFood(food, deltaMs);
        var foodState = GrillLogic.getFoodState(food);
        if (foodState === GrillLogic.DONENESS.BURNT && !food.burned) {
          food.burned = true;
          this.audio.playSfx("warning");
          this.setMessage(this.i18n.t("status_burnt"));
        } else if (!food.warned && GrillLogic.getWarningLevel(food) > 0.05) {
          food.warned = true;
          this.audio.playSfx("warning");
          this.setMessage(this.i18n.t("status_warning"));
        }
      }
    }, this);

    var orderUpdate = this.orderSystem.update(this.elapsedMs);
    if (orderUpdate.expired) {
      this.setMessage(this.i18n.t("status_order_expired"));
    }

    if (this.remainingMs <= 0) {
      this.endGame();
      return;
    }

    if (this.elapsedMs - this.lastSaveAt > 3500) {
      this.save();
    }

    this.updateHud();
  };

  GameCore.prototype.renderOnce = function renderOnce() {
    var message = this.messageUntil > this.elapsedMs ? this.message : "";
    this.renderer.render({
      foods: this.foods,
      selectedSlot: this.selectedSlot,
      paused: this.state === "paused",
      pauseText: this.i18n.t("status_paused"),
      message: message
    });
  };

  GameCore.prototype.handleSlot = function handleSlot(slotId) {
    if (this.state !== "playing") {
      return;
    }
    var food = this.foods[slotId];
    if (food) {
      this.selectedSlot = slotId;
      this.updateSelectedText();
      this.audio.playSfx("click");
      return;
    }
    this.placeFood(slotId);
  };

  GameCore.prototype.placeFood = function placeFood(slotId) {
    if (this.foods[slotId]) {
      return false;
    }
    var food = GrillLogic.createFood(this.selectedFoodType, slotId, this.elapsedMs);
    this.foods[slotId] = food;
    this.selectedSlot = slotId;
    this.audio.playSfx("click");
    this.say("status_placed", { food: this.foodLabel(food.typeId) });
    this.save();
    return true;
  };

  GameCore.prototype.selectFood = function selectFood(typeId) {
    this.selectedFoodType = typeId;
    this.updateFoodButtons();
    this.audio.playSfx("click");
  };

  GameCore.prototype.updateFoodButtons = function updateFoodButtons() {
    this.elements.foodButtons.forEach(function updateButton(button) {
      button.classList.toggle("active", button.getAttribute("data-food") === this.selectedFoodType);
    }, this);
  };

  GameCore.prototype.flipSelected = function flipSelected() {
    var food = this.getSelectedFood();
    if (!food || this.state !== "playing") {
      return false;
    }
    GrillLogic.flipFood(food, this.elapsedMs);
    this.audio.playSfx("flip");
    this.say("status_flipped", { food: this.foodLabel(food.typeId) });
    this.save();
    return true;
  };

  GameCore.prototype.serveSelected = function serveSelected() {
    var food = this.getSelectedFood();
    if (!food || this.state !== "playing") {
      return false;
    }
    var result = this.orderSystem.serve(food, this.elapsedMs);
    if (!result.accepted) {
      this.audio.playSfx(result.reason === "burnt" ? "warning" : "click");
      this.say(result.reason === "wrong_food" ? "status_wrong_food" : result.reason === "burnt" ? "status_burnt" : "status_not_ready");
      this.updateHud();
      return false;
    }

    var slot = food.slotId;
    this.foods[slot] = null;
    this.selectedSlot = null;
    this.audio.playSfx(result.state === GrillLogic.DONENESS.PERFECT ? "perfect" : "serve");
    this.say(result.state === GrillLogic.DONENESS.PERFECT ? "status_perfect" : "status_served", {
      food: this.foodLabel(food.typeId),
      score: result.scoreDelta
    });
    this.updateHud();
    this.save();
    return true;
  };

  GameCore.prototype.discardSelected = function discardSelected() {
    var food = this.getSelectedFood();
    if (!food || this.state !== "playing") {
      return false;
    }
    this.foods[food.slotId] = null;
    this.selectedSlot = null;
    this.orderSystem.score = Math.max(0, this.orderSystem.score - 8);
    this.audio.playSfx("warning");
    this.say("status_discarded");
    this.updateHud();
    this.save();
    return true;
  };

  GameCore.prototype.togglePause = function togglePause() {
    if (this.state === "playing") {
      this.setState("paused");
      this.say("status_paused");
      this.save();
      return;
    }
    if (this.state === "paused") {
      this.lastFrame = 0;
      this.setState("playing");
    }
  };

  GameCore.prototype.exitToMenu = function exitToMenu() {
    if (this.state !== "menu") {
      this.save();
    }
    this.state = "menu";
    this.audio.setScene("menu");
    this.hide();
    this.onExitToMenu();
  };

  GameCore.prototype.endGame = function endGame() {
    this.setState("gameover");
    this.storage.clearGame();
    this.audio.setScene("menu");
    this.say("status_game_over", { score: this.orderSystem.score });
    this.updateHud();
  };

  GameCore.prototype.getSelectedFood = function getSelectedFood() {
    if (this.selectedSlot === null || this.selectedSlot === undefined) {
      return null;
    }
    return this.foods[this.selectedSlot] || null;
  };

  GameCore.prototype.updateSelectedText = function updateSelectedText() {
    var food = this.getSelectedFood();
    if (!food) {
      this.elements.selectedText.textContent = this.i18n.t("status_select_slot");
      return;
    }
    this.elements.selectedText.textContent = this.i18n.t("status_selected", {
      food: this.foodLabel(food.typeId),
      state: this.i18n.t("state_" + GrillLogic.getFoodState(food))
    });
  };

  GameCore.prototype.updateHud = function updateHud() {
    this.elements.scoreValue.textContent = String(this.orderSystem.score);
    this.elements.timeValue.textContent = Helpers.formatSeconds(this.remainingMs);
    this.elements.comboValue.textContent = String(this.orderSystem.combo);
    this.elements.orderText.textContent = this.orderText();
    this.elements.orderProgress.value = this.orderSystem.getTimeRatio(this.elapsedMs);
    this.updateSelectedText();
  };

  GameCore.prototype.orderText = function orderText() {
    var remaining = root.BBQ.OrderSystem.getRemainingItems(this.orderSystem.currentOrder);
    var items = remaining.map(function mapOrderItem(item) {
      return this.i18n.t("order_item", {
        food: this.foodLabel(item.typeId),
        count: item.count
      });
    }, this).join(" / ");
    return this.i18n.t("order_request", { items: items || "OK" });
  };

  GameCore.prototype.foodLabel = function foodLabel(typeId) {
    var type = GrillLogic.getFoodType(typeId);
    return this.i18n.t(type.labelKey);
  };

  GameCore.prototype.say = function say(key, params) {
    this.setMessage(this.i18n.t(key, params || {}));
  };

  GameCore.prototype.setMessage = function setMessage(message) {
    this.message = message;
    this.messageUntil = this.elapsedMs + 2300;
    this.elements.messageText.textContent = message;
  };

  GameCore.prototype.save = function save() {
    if (this.state === "gameover" || this.state === "menu") {
      return;
    }
    this.lastSaveAt = this.elapsedMs;
    this.storage.saveGame({
      foods: this.foods.map(GrillLogic.serializeFood),
      selectedFoodType: this.selectedFoodType,
      selectedSlot: this.selectedSlot,
      remainingMs: this.remainingMs,
      elapsedMs: this.elapsedMs,
      orderSystem: this.orderSystem.serialize()
    });
  };

  return GameCore;
});
