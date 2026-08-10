(function (global) {
  "use strict";
  var CCC = global.CCC;

  function GameSession(day) {
    this.day = day;
    this.level = CCC.data.levels[day - 1];
    this.upgrades = CCC.utils.deepClone(CCC.state.progress.upgrades);
    this.remaining = this.level.duration;
    this.elapsed = 0;
    this.revenue = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.mistakes = 0;
    this.waste = 0;
    this.qualityScores = [];
    this.satisfactionScores = [];
    this.running = false;
    this.paused = true;
    this.finished = false;
    this.graceUsed = false;
    this.selectedOrderId = null;
    this.orders = new CCC.game.OrderManager(this);
    this.cooking = new CCC.game.CookingManager(this);
    this.frame = null;
    this.lastTime = 0;
    this.lastUiUpdate = 0;
  }

  GameSession.prototype.start = function () {
    if (this.finished) { return; }
    this.running = true;
    this.paused = false;
    this.orders.fill();
    this.lastTime = performance.now();
    this.loop(this.lastTime);
    CCC.events.emit("sessionstate", "running");
  };

  GameSession.prototype.loop = function (now) {
    var self = this;
    if (!this.running || this.finished) { return; }
    var delta = Math.min(.1, Math.max(0, (now - this.lastTime) / 1000));
    this.lastTime = now;
    if (!this.paused) {
      this.update(delta);
      if (now - this.lastUiUpdate > 80) {
        this.lastUiUpdate = now;
        CCC.events.emit("gametick", this);
      }
    }
    if (!this.finished) { this.frame = requestAnimationFrame(function (time) { self.loop(time); }); }
  };

  GameSession.prototype.update = function (delta) {
    this.elapsed += delta;
    this.remaining = Math.max(0, this.remaining - delta);
    this.orders.update(delta);
    this.cooking.update(delta);
    if (this.remaining <= 10 && Math.ceil(this.remaining) !== Math.ceil(this.remaining + delta)) { CCC.audio.play("countdown"); }
    if (this.remaining <= 0) { this.finish(); }
  };

  GameSession.prototype.pause = function (reason) {
    if (!this.running || this.finished) { return; }
    this.paused = true;
    CCC.events.emit("sessionstate", reason || "paused");
  };

  GameSession.prototype.resume = function (reason) {
    if (!this.running || this.finished || CCC.state.dialogOpen) { return; }
    this.paused = false;
    this.lastTime = performance.now();
    CCC.events.emit("sessionstate", reason || "running");
  };

  GameSession.prototype.stop = function () {
    this.running = false;
    if (this.frame) { cancelAnimationFrame(this.frame); this.frame = null; }
  };

  GameSession.prototype.selectOrder = function (id) {
    if (this.orders.get(id)) { this.selectedOrderId = id; CCC.events.emit("orderchange"); }
  };

  GameSession.prototype.deliver = function (piece, order) {
    var quality = CCC.rules.totalQuality(piece);
    var grade = CCC.rules.grade(quality.total);
    if (grade.id === "perfect" || grade.id === "delicious") { this.combo += 1; }
    else if (grade.id === "pass") { this.combo = 0; }
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    var patienceRatio = CCC.utils.clamp(order.patience / order.maxPatience, 0, 1);
    var income = CCC.rules.income(order.price, quality.total, patienceRatio, this.combo);
    this.revenue += income;
    this.qualityScores.push(quality.total);
    this.satisfactionScores.push(Math.round(patienceRatio * 100));
    this.orders.remove(order.id);
    CCC.audio.play(grade.id === "perfect" ? "perfect" : "deliver");
    CCC.events.emit("feedback", { key: grade.id === "perfect" ? "status.perfect" : "status.delivered", tone: "success", values: { income: income } });
    CCC.events.emit("delivery", { income: income, quality: quality, grade: grade });
  };

  GameSession.prototype.onOrderLeft = function () {
    this.mistakes += 1;
    this.combo = 0;
    this.satisfactionScores.push(0);
    CCC.audio.play("impatient");
    CCC.events.emit("feedback", { key: "status.orderLeft", tone: "error" });
  };

  GameSession.prototype.onWaste = function () {
    this.waste += 1;
    this.mistakes += 1;
    this.combo = 0;
    CCC.audio.play("error");
    CCC.events.emit("feedback", { key: "status.takeChicken", tone: "warning" });
  };

  GameSession.prototype.finish = function () {
    if (this.finished) { return; }
    this.finished = true;
    this.stop();
    CCC.events.emit("feedback", { key: "status.timeUp", tone: "info" });
    var quality = this.qualityScores.length ? Math.round(this.qualityScores.reduce(function (sum, value) { return sum + value; }, 0) / this.qualityScores.length) : 0;
    var satisfaction = this.satisfactionScores.length ? Math.round(this.satisfactionScores.reduce(function (sum, value) { return sum + value; }, 0) / this.satisfactionScores.length) : 0;
    var success = this.revenue >= this.level.goal;
    var stars = CCC.rules.stars(this.revenue, this.level.goal, satisfaction, this.waste);
    var result = {
      day: this.day, success: success, stars: stars, revenue: this.revenue, quality: quality,
      satisfaction: satisfaction, mistakes: this.mistakes, waste: this.waste, bestCombo: this.bestCombo
    };

    if (success) {
      var progress = CCC.state.progress;
      progress.coins += this.revenue;
      progress.highestCompletedDay = Math.max(progress.highestCompletedDay, this.day);
      progress.currentDay = Math.min(10, Math.max(progress.currentDay, this.day + 1));
      progress.completed = progress.highestCompletedDay >= 10;
      progress.unlockedRecipes = CCC.data.recipes.filter(function (recipe) { return recipe.unlockDay <= progress.currentDay; }).map(function (recipe) { return recipe.id; });
      var record = progress.records[this.day];
      record.stars = Math.max(record.stars, stars);
      record.revenue = Math.max(record.revenue, this.revenue);
      record.combo = Math.max(record.combo, this.bestCombo);
      progress.tutorialsSeen[this.day] = true;
      CCC.storage.saveProgress();
      CCC.audio.play("coin");
    }
    CCC.state.lastResult = result;
    setTimeout(function () { CCC.router.go("result", { result: result }); }, 280);
  };

  CCC.game = CCC.game || {};
  CCC.game.GameSession = GameSession;
}(typeof window !== "undefined" ? window : globalThis));
