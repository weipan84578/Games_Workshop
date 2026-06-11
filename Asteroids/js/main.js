(function () {
  "use strict";

  var STATES = Game.Constants.STATES;

  function aliveOnly(entity) {
    return entity.alive;
  }

  var App = {
    canvas: null,
    ctx: null,
    dpr: 1,
    width: Game.Constants.WORLD.WIDTH,
    height: Game.Constants.WORLD.HEIGHT,
    settings: null,
    scoreManager: null,
    ship: null,
    level: 1,
    lives: 3,
    time: 0,
    bullets: [],
    enemyBullets: [],
    asteroids: [],
    ufos: [],
    powerups: [],
    particles: [],
    stars: [],
    ufoTimer: 0,
    levelClearTimer: 0,
    thrustFxTimer: 0,
    shake: 0,
    fps: 60,
    resizeObserver: null,

    init: function () {
      this.canvas = document.getElementById("game-canvas");
      this.ctx = this.canvas.getContext("2d");
      this.settings = Game.Storage.loadSettings();
      Game.I18n.setLanguage(this.settings.language);
      this.scoreManager = Game.Score.create();
      this.ship = Game.Ship.create(this.width / 2, this.height / 2);

      Game.Input.init();
      Game.Hud.init();
      Game.Menu.init(this);
      Game.HelpUI.init();
      Game.SettingsUI.init(this);
      Game.TouchControls.init();

      this.resize();
      window.addEventListener("resize", this.resize.bind(this));
      window.addEventListener("orientationchange", function () {
        App.resize();
        setTimeout(function () { App.resize(); }, 180);
      });
      if (window.ResizeObserver && this.canvas.parentElement) {
        this.resizeObserver = new ResizeObserver(function () {
          App.resize();
        });
        this.resizeObserver.observe(this.canvas.parentElement);
      }
      window.addEventListener("blur", function () {
        if (Game.State.is(STATES.PLAYING)) App.pause();
      });

      Game.Music.play("menu");
      Game.GameLoop.start();
      this.updateHud();
    },

    resize: function () {
      var rectTarget = this.canvas.parentElement || this.canvas;
      var rect = rectTarget.getBoundingClientRect();
      var cssWidth = rect.width || window.innerWidth || Game.Constants.WORLD.WIDTH;
      var cssHeight = rect.height || window.innerHeight || Game.Constants.WORLD.HEIGHT;
      this.dpr = Math.min(window.devicePixelRatio || 1, Game.Constants.WORLD.MAX_DPR);
      this.canvas.width = Math.floor(cssWidth * this.dpr);
      this.canvas.height = Math.floor(cssHeight * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.width = cssWidth;
      this.height = cssHeight;
      if (this.ship) {
        this.ship.x = Game.Utils.clamp(this.ship.x, 0, this.width);
        this.ship.y = Game.Utils.clamp(this.ship.y, 0, this.height);
      }
      this.makeStars();
    },

    makeStars: function () {
      this.stars = [];
      var count = Math.round(Game.Utils.clamp(this.width * this.height / 6200, 70, 190));
      for (var i = 0; i < count; i += 1) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          r: Math.random() * 1.6 + 0.4,
          speed: Math.random() * 18 + 4,
          alpha: Math.random() * 0.65 + 0.25
        });
      }
    },

    clearEntities: function () {
      this.bullets = [];
      this.enemyBullets = [];
      this.asteroids = [];
      this.ufos = [];
      this.powerups = [];
      this.particles = [];
    },

    newGame: function () {
      Game.Audio.resume();
      Game.Screens.hideAllModals();
      Game.Screens.show("screen-game");
      this.resize();
      this.clearEntities();
      this.time = 0;
      this.level = 1;
      this.lives = this.settings.startLives || 3;
      this.scoreManager = Game.Score.create();
      this.scoreManager.nextExtraLifeAt = Game.Constants.SCORE.EXTRA_LIFE_EVERY;
      Game.Ship.reset(this.ship, this);
      this.spawnLevel();
      Game.Storage.clearSave();
      Game.State.set(STATES.PLAYING);
      Game.Music.play("game");
      Game.Music.setGameIntensity(this.level);
      this.updateHud();
    },

    continueGame: function () {
      var save = Game.Storage.loadSave();
      if (!save) return;
      Game.Audio.resume();
      Game.Screens.hideAllModals();
      Game.Screens.show("screen-game");
      this.resize();
      this.clearEntities();
      this.time = 0;
      this.level = save.level || 1;
      this.lives = save.lives || this.settings.startLives || 3;
      this.scoreManager = Game.Score.create();
      this.scoreManager.score = save.score || 0;
      this.scoreManager.nextExtraLifeAt = (Math.floor(this.scoreManager.score / Game.Constants.SCORE.EXTRA_LIFE_EVERY) + 1) * Game.Constants.SCORE.EXTRA_LIFE_EVERY;
      Game.Ship.reset(this.ship, this);
      this.spawnLevel();
      Game.State.set(STATES.PLAYING);
      Game.Music.play("game");
      Game.Music.setGameIntensity(this.level);
      this.updateHud();
    },

    spawnLevel: function () {
      var data = Game.Levels.get(this.level);
      this.bullets = [];
      this.enemyBullets = [];
      this.asteroids = [];
      this.ufos = [];
      this.powerups = [];
      this.levelClearTimer = 0;
      this.ufoTimer = Game.Utils.rand(data.ufoDelay, data.ufoDelay + 8);
      Game.Ship.reset(this.ship, this);
      Game.Spawner.asteroids(this, data.asteroidCount);
      Game.Sfx.play("levelUp");
      Game.Music.setGameIntensity(this.level);
    },

    pause: function () {
      if (!Game.State.is(STATES.PLAYING)) return;
      Game.State.set(STATES.PAUSED);
      Game.Storage.saveGame({ level: this.level, score: this.scoreManager.score, lives: this.lives });
      Game.Screens.showModal("modal-pause");
      Game.Music.pause();
      Game.Menu.refresh();
    },

    resume: function () {
      if (!Game.State.is(STATES.PAUSED)) return;
      Game.Screens.hideModal("modal-pause");
      Game.State.set(STATES.PLAYING);
      this.resize();
      Game.Music.resume();
    },

    showMenu: function () {
      if (Game.State.is(STATES.PLAYING) || Game.State.is(STATES.PAUSED)) {
        Game.Storage.saveGame({ level: this.level, score: this.scoreManager.score, lives: this.lives });
      }
      Game.Screens.hideAllModals();
      Game.Screens.show("screen-menu");
      Game.State.set(STATES.MENU);
      Game.Music.play("menu");
      Game.Menu.refresh();
    },

    gameOver: function () {
      Game.State.set(STATES.GAME_OVER);
      Game.Storage.clearSave();
      Game.Screens.showModal("modal-gameover");
      this.refreshLocalizedText();
      Game.Sfx.play("gameOver");
      Game.Music.play("gameover");
      Game.Menu.refresh();
    },

    toggleMute: function () {
      this.settings.muted = !this.settings.muted;
      Game.Storage.saveSettings(this.settings);
      Game.SettingsUI.apply(this.settings);
    },

    updateHud: function () {
      Game.Hud.update(this);
    },

    refreshLocalizedText: function () {
      this.updateHud();
      document.getElementById("gameover-score").textContent = Game.I18n.t("game.scoreLine", {
        score: Game.Utils.formatScore(this.scoreManager.score)
      });
      document.getElementById("gameover-highscore").textContent = Game.I18n.t("game.highLine", {
        score: Game.Utils.formatScore(this.scoreManager.highscore)
      });
    },

    update: function (dt) {
      if (Game.Input.consume("mute")) {
        this.toggleMute();
      }
      if (Game.Input.consume("pause")) {
        if (Game.State.is(STATES.PLAYING)) this.pause();
        else if (Game.State.is(STATES.PAUSED)) this.resume();
      }

      if (!Game.State.is(STATES.PLAYING)) {
        this.drawMenuBackground(dt);
        return;
      }

      this.time += dt;
      this.shake = Math.max(0, this.shake - dt * 18);
      this.updatePlaying(dt);
      this.updateHud();
    },

    drawMenuBackground: function (dt) {
      this.time += dt * 0.28;
    },

    updatePlaying: function (dt) {
      Game.Ship.update(this.ship, dt, this);

      this.ufoTimer -= dt;
      if (this.ufoTimer <= 0 && this.ufos.length === 0) {
        Game.Spawner.ufo(this);
        var data = Game.Levels.get(this.level);
        this.ufoTimer = Game.Utils.rand(data.ufoDelay, data.ufoDelay + 12);
      }

      this.bullets.forEach(function (bullet) { Game.Bullet.update(bullet, dt, App); });
      this.enemyBullets.forEach(function (bullet) { Game.Bullet.update(bullet, dt, App); });
      this.asteroids.forEach(function (asteroid) { Game.Asteroid.update(asteroid, dt, App); });
      this.ufos.forEach(function (ufo) { Game.Ufo.update(ufo, dt, App); });
      this.powerups.forEach(function (powerup) { Game.Powerup.update(powerup, dt, App); });
      this.particles.forEach(function (particle) { Game.Particle.update(particle, dt); });

      this.resolveCollisions();
      this.bullets = this.bullets.filter(aliveOnly);
      this.enemyBullets = this.enemyBullets.filter(aliveOnly);
      this.asteroids = this.asteroids.filter(aliveOnly);
      this.ufos = this.ufos.filter(aliveOnly);
      this.powerups = this.powerups.filter(aliveOnly);
      this.particles = this.particles.filter(aliveOnly);

      if (this.asteroids.length === 0) {
        if (this.levelClearTimer === 0) {
          this.levelClearTimer = 1.4;
          Game.Sfx.play("levelUp");
        }
        this.levelClearTimer -= dt;
        if (this.levelClearTimer <= 0) {
          this.level += 1;
          this.spawnLevel();
        }
      }
    },

    resolveCollisions: function () {
      var newAsteroids = [];

      this.bullets.forEach(function (bullet) {
        if (!bullet.alive) return;

        App.asteroids.forEach(function (asteroid) {
          if (!bullet.alive || !asteroid.alive || !Game.Collision.circles(bullet, asteroid)) return;
          bullet.alive = false;
          asteroid.alive = false;
          App.destroyAsteroid(asteroid, newAsteroids);
        });

        App.ufos.forEach(function (ufo) {
          if (!bullet.alive || !ufo.alive || !Game.Collision.circles(bullet, ufo)) return;
          bullet.alive = false;
          ufo.alive = false;
          Game.Score.add(App.scoreManager, ufo.small ? Game.Constants.UFO.SMALL_SCORE : Game.Constants.UFO.LARGE_SCORE, App);
          Game.Particle.burst(App, ufo.x, ufo.y, Game.Utils.cssColor("--c-accent-2"), 34, 190);
          Game.Sfx.play("ufoExplode");
          App.screenShake(0.55);
        });
      });

      Array.prototype.push.apply(this.asteroids, newAsteroids);

      this.enemyBullets.forEach(function (bullet) {
        if (bullet.alive && Game.Collision.circles(bullet, App.ship)) {
          bullet.alive = false;
          App.damageShip();
        }
      });

      this.asteroids.forEach(function (asteroid) {
        if (Game.Collision.circles(App.ship, asteroid)) {
          App.damageShip();
        }
      });

      this.ufos.forEach(function (ufo) {
        if (Game.Collision.circles(App.ship, ufo)) {
          ufo.alive = false;
          App.damageShip();
          Game.Particle.burst(App, ufo.x, ufo.y, Game.Utils.cssColor("--c-accent-2"), 28, 160);
        }
      });

      this.powerups.forEach(function (powerup) {
        if (Game.Collision.circles(App.ship, powerup)) {
          Game.Powerup.apply(powerup, App.ship, App);
        }
      });
    },

    destroyAsteroid: function (asteroid, newAsteroids) {
      var shape = Game.Constants.ASTEROIDS.SHAPES[asteroid.type];
      Game.Score.add(this.scoreManager, shape.score, this);
      Array.prototype.push.apply(newAsteroids, Game.Asteroid.split(asteroid, this));
      Game.Spawner.powerup(this, asteroid.x, asteroid.y);
      Game.Particle.burst(this, asteroid.x, asteroid.y, Game.Utils.cssColor("--c-asteroid"), asteroid.type === "large" ? 34 : 20, asteroid.radius * 5);
      Game.Sfx.play(asteroid.type === "large" ? "asteroidLarge" : asteroid.type === "medium" ? "asteroidMedium" : "asteroidSmall");
      this.screenShake(asteroid.type === "large" ? 0.42 : 0.22);
    },

    damageShip: function () {
      if (!Game.Ship.damage(this.ship, this)) return;
      this.lives -= 1;
      Game.Particle.burst(this, this.ship.x, this.ship.y, Game.Utils.cssColor("--c-danger"), 54, 230);
      Game.Sfx.play("shipExplode");
      this.screenShake(0.8);
      if (this.lives <= 0) {
        this.gameOver();
      } else {
        Game.Ship.reset(this.ship, this);
      }
    },

    screenShake: function (amount) {
      if (!this.settings.screenShake) return;
      this.shake = Math.max(this.shake, amount);
    },

    draw: function () {
      var ctx = this.ctx;
      ctx.save();
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.fillStyle = Game.Utils.cssColor("--c-bg");
      ctx.fillRect(0, 0, this.width, this.height);

      if (this.shake > 0) {
        ctx.translate(Game.Utils.rand(-this.shake * 8, this.shake * 8), Game.Utils.rand(-this.shake * 8, this.shake * 8));
      }

      this.drawStars(ctx);

      if (Game.State.is(STATES.PLAYING) || Game.State.is(STATES.PAUSED) || Game.State.is(STATES.GAME_OVER)) {
        this.powerups.forEach(function (powerup) { Game.Powerup.draw(ctx, powerup); });
        this.asteroids.forEach(function (asteroid) { Game.Asteroid.draw(ctx, asteroid); });
        this.ufos.forEach(function (ufo) { Game.Ufo.draw(ctx, ufo); });
        this.bullets.forEach(function (bullet) { Game.Bullet.draw(ctx, bullet); });
        this.enemyBullets.forEach(function (bullet) { Game.Bullet.draw(ctx, bullet); });
        Game.Ship.draw(ctx, this.ship, this);
        this.particles.forEach(function (particle) { Game.Particle.draw(ctx, particle); });

        if (this.levelClearTimer > 0) {
          this.drawCenterText(
            Game.I18n.t("game.levelTitle", { level: String(this.level + 1) }),
            Game.I18n.t("game.incomingField")
          );
        }
      }

      if (this.settings.showFps) {
        this.drawFps(ctx);
      }
      ctx.restore();
    },

    drawStars: function (ctx) {
      ctx.save();
      ctx.fillStyle = Game.Utils.cssColor("--c-fg");
      for (var i = 0; i < this.stars.length; i += 1) {
        var star = this.stars[i];
        var y = (star.y + this.time * star.speed) % this.height;
        ctx.globalAlpha = star.alpha;
        ctx.fillRect(star.x, y, star.r, star.r);
      }
      ctx.restore();
    },

    drawCenterText: function (title, subtitle) {
      var ctx = this.ctx;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 44px Arial Black, system-ui";
      ctx.fillStyle = Game.Utils.cssColor("--c-accent");
      ctx.shadowColor = Game.Utils.cssColor("--c-accent");
      ctx.shadowBlur = 18;
      ctx.fillText(title, this.width / 2, this.height / 2 - 18);
      ctx.font = "700 18px Segoe UI, system-ui";
      ctx.fillStyle = Game.Utils.cssColor("--c-fg");
      ctx.fillText(subtitle, this.width / 2, this.height / 2 + 28);
      ctx.restore();
    },

    drawFps: function (ctx) {
      ctx.save();
      ctx.font = "700 12px system-ui";
      ctx.textAlign = "left";
      ctx.fillStyle = Game.Utils.cssColor("--c-muted");
      ctx.fillText(Game.I18n.t("game.fps", { fps: Math.round(this.fps || 0) }), 12, this.height - 12);
      ctx.restore();
    }
  };

  Game.App = App;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { App.init(); });
  } else {
    App.init();
  }
}());
