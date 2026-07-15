(function (Game) {
  "use strict";
  function Session(bus) {
    this.bus = bus;
    this.state = null;
    this.paused = false;
  }
  Session.prototype.start = function (seed) {
    this.state = Game.GameState.create(seed || Game.seedFromTime());
    this.paused = false;
    if (this.bus) this.bus.emit(Game.Events.STARTED, this.state);
    return this.state;
  };
  Session.prototype.restore = function (snapshot) {
    this.state = Game.GameState.fromSnapshot(snapshot);
    this.paused = false;
    return this.state;
  };
  Session.prototype.update = function (input, dt) {
    var state = this.state;
    if (!state || state.over || this.paused) return null;
    state.time += dt * 1000;
    var slowFactor = state.player.buffs.slow > 0 ? 0.65 : 1;
    var difficulty = Game.Difficulty.get(state.score.maxHeight);
    var wind =
      Math.sin(state.time * 0.0008) * difficulty.wind * 120 * slowFactor;
    Game.Physics.update(
      state.player,
      input || { left: false, right: false },
      dt,
      { slowFactor: slowFactor, wind: wind },
    );
    state.platforms.forEach(function (platform) {
      Game.Platform.update(platform, dt * slowFactor, state.time);
    });
    state.items.forEach(function (item) {
      Game.Item.update(item, dt, state.time);
    });
    state.enemies.forEach(function (enemy) {
      Game.Enemy.update(enemy, dt * slowFactor, state.time);
    });
    var landing = Game.Collision.platformLanding(state.player, state.platforms);
    if (landing) {
      Game.Platform.touch(landing.platform);
      Game.Player.land(state.player, landing.multiplier);
      var combo = Game.ScoreService.landed(state.score, landing.platform.id);
      if (this.bus)
        this.bus.emit(Game.Events.LANDED, {
          platform: landing.platform,
          combo: combo,
        });
    }

    var spikeHits = Game.Collision.hitHazards(state.player, state.platforms);
    if (spikeHits.length) {
      var spikeDamage = Game.Player.hurt(state.player);
      if (spikeDamage === true) {
        spikeHits.forEach(function (platform) {
          platform.active = false;
        });
        if (this.bus)
          this.bus.emit(Game.Events.DAMAGED, {
            blocked: true,
            hazard: spikeHits[0],
          });
      } else if (spikeDamage === null) {
        this.end("spike");
      }
    }
    var collected = Game.Collision.collectItems(state.player, state.items);
    collected.forEach(function (item) {
      item.active = false;
      Game.Item.effect(state.player, item);
      Game.ScoreService.addItem(state.score, item.type);
      if (this.bus) this.bus.emit(Game.Events.COLLECTED, item);
    }, this);
    var hits = Game.Collision.hitEnemies(state.player, state.enemies);
    hits.forEach(function (enemy) {
      if (!enemy.active) return;
      if (
        state.player.vy > 0 &&
        state.player.previousY + state.player.height <= enemy.y + 8 &&
        enemy.type === "monster"
      ) {
        enemy.active = false;
        state.player.vy = Game.Constants.JUMP_VELOCITY * 0.9;
        Game.ScoreService.addEnemy(state.score);
        if (this.bus) this.bus.emit(Game.Events.DEFEATED, enemy);
        return;
      }
      var hurt = Game.Player.hurt(state.player);
      if (hurt === true) {
        enemy.active = false;
        if (this.bus)
          this.bus.emit(Game.Events.DAMAGED, { blocked: true, enemy: enemy });
      }
      if (hurt === null) this.end("enemy");
    }, this);
    if (
      !state.over &&
      state.player.y > state.camera.y + Game.Constants.DEATH_LINE
    )
      this.end("fall");
    Game.Camera.update(state.camera, state.player, dt);
    Game.ScoreService.updateHeight(state.score, state.player.y);
    var milestones = Game.ScoreService.milestones(state.score);
    state.environment = Game.GameState.environmentFor(state.score.maxHeight);
    if (this.bus) {
      if (milestones.length)
        this.bus.emit(Game.Events.MILESTONE, milestones[0]);
      this.bus.emit(Game.Events.SCORE, state.score);
    }
    Game.WorldGenerator.ensure(state);
    Game.WorldGenerator.cleanup(state);
    return state;
  };
  Session.prototype.end = function (reason) {
    if (!this.state || this.state.over) return;
    this.state.over = true;
    this.state.reason = reason || "fall";
    if (this.bus) {
      this.bus.emit(Game.Events.DIED, this.state);
      this.bus.emit(Game.Events.OVER, this.state);
    }
  };
  Session.prototype.pause = function () {
    if (!this.state || this.state.over) return;
    this.paused = true;
    if (this.bus) this.bus.emit(Game.Events.PAUSED, this.state);
  };
  Session.prototype.resume = function () {
    if (!this.state || this.state.over) return;
    this.paused = false;
    if (this.bus) this.bus.emit(Game.Events.RESUMED, this.state);
  };
  Session.prototype.snapshot = function () {
    return this.state ? Game.GameState.snapshot(this.state) : null;
  };
  Session.prototype.isActive = function () {
    return Boolean(this.state && !this.state.over);
  };
  Game.GameSession = Session;
})(window.DJGame);
