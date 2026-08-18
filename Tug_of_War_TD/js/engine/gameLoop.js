(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};

  function BattleSession(level) {
    this.level = level;
    this.elapsed = 0;
    this.timeRemaining = level.maxTime;
    this.playerUnits = new app.PlayerUnits();
    this.enemyUnits = new app.EnemyUnits();
    this.playerBase = new app.Base("player", 75, level.baseHp);
    this.enemyBase = new app.Base("enemy", 925, level.baseHp);
    this.resource = new app.ResourceSystem(level);
    this.cooldowns = {};
    this.spawnSystem = new app.SpawnSystem();
    this.aiSystem = new app.AISystem(level);
    this.battleSystem = new app.BattleSystem();
    this.effects = [];
    this.kills = 0;
    this.hitSoundTimer = 0;
    this.result = null;
    this.paused = false;
    this.lastAnnounce = 0;
  }

  BattleSession.prototype.update = function (delta) {
    if (this.paused || this.result) {
      return;
    }
    this.elapsed += delta;
    this.timeRemaining = Math.max(0, this.level.maxTime - this.elapsed);
    this.resource.update(delta);
    this.spawnSystem.update(this, delta);
    this.aiSystem.update(this, delta);
    this.battleSystem.update(this, delta);
    this.playerBase.update(delta);
    this.enemyBase.update(delta);
    this.hitSoundTimer = Math.max(0, this.hitSoundTimer - delta);
    this.effects.forEach(function (effect) { effect.life -= delta; });
    this.effects = this.effects.filter(function (effect) { return effect.life > 0; });
  };

  BattleSession.prototype.finish = function (outcome, reason) {
    if (this.result) {
      return;
    }
    var playerPercent = this.playerBase.getPercent();
    var enemyPercent = this.enemyBase.getPercent();
    var stars = 0;
    if (outcome === "victory") {
      stars = playerPercent >= 80 && this.timeRemaining >= this.level.maxTime * .35 ? 3 : playerPercent >= 45 && this.timeRemaining >= this.level.maxTime * .15 ? 2 : 1;
    }
    this.result = {
      outcome: outcome,
      reason: reason || "time",
      stars: stars,
      timeRemaining: this.timeRemaining,
      playerHp: this.playerBase.hp,
      enemyHp: this.enemyBase.hp,
      playerPercent: playerPercent,
      enemyPercent: enemyPercent,
      kills: this.kills,
      levelId: this.level.id
    };
  };

  BattleSession.prototype.snapshot = function () {
    return {
      levelId: this.level.id,
      elapsed: this.elapsed,
      timeRemaining: this.timeRemaining,
      playerUnits: this.playerUnits.snapshot(),
      enemyUnits: this.enemyUnits.snapshot(),
      playerBase: this.playerBase.snapshot(),
      enemyBase: this.enemyBase.snapshot(),
      resource: this.resource.snapshot(),
      cooldowns: Object.assign({}, this.cooldowns),
      kills: this.kills
    };
  };

  BattleSession.fromSnapshot = function (snapshot) {
    var level = (global.LEVELS_DATA || []).find(function (item) { return item.id === Number(snapshot.levelId); }) || global.LEVELS_DATA[0];
    var session = new BattleSession(level);
    session.elapsed = Number(snapshot.elapsed || 0);
    session.timeRemaining = Number(snapshot.timeRemaining !== undefined ? snapshot.timeRemaining : level.maxTime);
    session.playerUnits = app.PlayerUnits.fromSnapshot(snapshot.playerUnits);
    session.enemyUnits = app.EnemyUnits.fromSnapshot(snapshot.enemyUnits);
    session.playerBase = app.Base.fromSnapshot(snapshot.playerBase || session.playerBase.snapshot());
    session.enemyBase = app.Base.fromSnapshot(snapshot.enemyBase || session.enemyBase.snapshot());
    session.resource.restore(snapshot.resource);
    session.cooldowns = Object.assign({}, snapshot.cooldowns || {});
    session.kills = Number(snapshot.kills || 0);
    return session;
  };

  function GameLoop(session, renderer, onUpdate, onFinish) {
    this.session = session;
    this.renderer = renderer;
    this.onUpdate = onUpdate || function () {};
    this.onFinish = onFinish || function () {};
    this.running = false;
    this.frame = 0;
    this.lastTime = 0;
    this.boundTick = this.tick.bind(this);
  }

  GameLoop.prototype.start = function () {
    if (this.running) {
      return;
    }
    this.running = true;
    this.session.paused = false;
    this.lastTime = global.performance.now();
    this.frame = global.requestAnimationFrame(this.boundTick);
  };
  GameLoop.prototype.pause = function () {
    this.running = false;
    this.session.paused = true;
    if (this.frame) {
      global.cancelAnimationFrame(this.frame);
    }
  };
  GameLoop.prototype.resume = function () {
    if (!this.session.result) {
      this.start();
    }
  };
  GameLoop.prototype.stop = function () {
    this.running = false;
    if (this.frame) {
      global.cancelAnimationFrame(this.frame);
    }
  };
  GameLoop.prototype.tick = function (time) {
    if (!this.running) {
      return;
    }
    var delta = Math.min(app.Config.maxDelta, Math.max(0, (time - this.lastTime) / 1000));
    this.lastTime = time;
    this.session.update(delta);
    this.renderer.render(this.session, delta);
    this.onUpdate(this.session);
    if (this.session.result) {
      this.running = false;
      this.onFinish(this.session.result, this.session);
      return;
    }
    this.frame = global.requestAnimationFrame(this.boundTick);
  };

  app.BattleSession = BattleSession;
  app.GameLoop = GameLoop;
})(window);
