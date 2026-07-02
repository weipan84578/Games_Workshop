(function (ns) {
  "use strict";

  function Game(app) {
    this.app = app;
    this.canvas = ns.Helpers.$("#game-canvas");
    this.context = this.canvas.getContext("2d");
    this.tableRenderer = new ns.Table.Renderer(this.canvas);
    this.settings = ns.SaveManager.loadSettings();
    this.score = new ns.ScoreController(this.settings.targetScore);
    this.playerMallet = new ns.Mallet(ns.Constants.TABLE.WIDTH / 2, ns.Constants.TABLE.PLAYER_START_Y, true);
    this.aiMallet = new ns.Mallet(ns.Constants.TABLE.WIDTH / 2, ns.Constants.TABLE.AI_START_Y, false);
    this.puck = new ns.Puck(ns.Constants.TABLE.WIDTH / 2, ns.Constants.TABLE.HEIGHT / 2);
    this.difficulty = "normal";
    this.aiController = ns.AI.normal.create();
    this.state = "idle";
    this.stateBeforePause = "idle";
    this.pointerTarget = null;
    this.pointerSource = "";
    this.keyboardState = {};
    this.countdown = 0;
    this.lastCountdownNumber = 0;
    this.scoreDelay = 0;
    this.pendingWinner = null;
    this.serveDirection = -1;
    this.lastFrame = 0;
    this.particles = [];
    this.comboText = "";
    this.comboLife = 0;
  }

  Game.prototype.init = function () {
    ns.MouseInput.attach(this);
    ns.TouchInput.attach(this);
    ns.KeyboardInput.attach(this);

    var self = this;
    ns.Helpers.$("#pause-button").addEventListener("click", function () {
      self.pause();
    });
    ns.Helpers.$("#mute-button").addEventListener("click", function () {
      var settings = ns.SaveManager.loadSettings();
      self.app.applySettings(ns.SaveManager.patchSettings({ muted: !settings.muted }));
      self.updateMuteIcon();
    });

    window.addEventListener("beforeunload", function () {
      if (self.isInProgress()) {
        self.saveProgress();
      }
    });

    this.updateMuteIcon();
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  };

  Game.prototype.applySettings = function (settings) {
    this.settings = settings;
    this.score.targetScore = settings.targetScore;
    this.updateMuteIcon();
  };

  Game.prototype.updateMuteIcon = function () {
    var icon = ns.Helpers.$("#mute-icon");
    if (icon) {
      icon.textContent = ns.SaveManager.loadSettings().muted ? "×" : "♪";
    }
  };

  Game.prototype.startNew = function (difficulty) {
    this.settings = ns.SaveManager.loadSettings();
    this.difficulty = difficulty || "normal";
    this.aiController = (ns.AI[this.difficulty] || ns.AI.normal).create();
    this.score.reset(this.settings.targetScore);
    this.resetActors();
    this.puck.stop();
    this.pendingWinner = null;
    this.app.hud.updateScores(0, 0);
    this.app.audio.setMode("gameplay");
    ns.SaveManager.clearProgress();
    this.startCountdown(-1);
  };

  Game.prototype.continueFrom = function (progress) {
    this.settings = ns.SaveManager.loadSettings();
    this.difficulty = progress.difficulty;
    this.aiController = (ns.AI[this.difficulty] || ns.AI.normal).create();
    this.score.restore(progress);
    this.resetActors();
    this.puck.stop();
    this.pendingWinner = null;
    this.app.hud.updateScores(this.score.player, this.score.ai);
    this.app.audio.setMode("gameplay");
    this.startCountdown(this.score.lastScorer === "player" ? 1 : -1);
  };

  Game.prototype.resetActors = function () {
    this.playerMallet.reset(ns.Constants.TABLE.WIDTH / 2, ns.Constants.TABLE.PLAYER_START_Y);
    this.aiMallet.reset(ns.Constants.TABLE.WIDTH / 2, ns.Constants.TABLE.AI_START_Y);
    this.pointerTarget = { x: this.playerMallet.x, y: this.playerMallet.y };
    this.pointerSource = "";
    this.keyboardState = {};
    this.particles = [];
    this.comboText = "";
    this.comboLife = 0;
  };

  Game.prototype.startCountdown = function (direction) {
    this.state = "countdown";
    this.countdown = 3;
    this.lastCountdownNumber = 0;
    this.serveDirection = direction || -1;
    this.app.hud.setStatus("game.countdown");
    this.app.hud.setCountdown(3);
  };

  Game.prototype.setPointerTarget = function (point, source) {
    this.pointerTarget = point;
    this.pointerSource = source;
  };

  Game.prototype.clearPointerSource = function (source) {
    if (this.pointerSource === source) {
      this.pointerSource = "";
    }
  };

  Game.prototype.setKeyboardState = function (keys) {
    this.keyboardState = Object.assign({}, keys);
  };

  Game.prototype.pause = function () {
    if (!this.isInProgress()) {
      return;
    }
    this.stateBeforePause = this.state;
    this.state = "paused";
    this.saveProgress();
    this.app.screen.showModal("pause-modal");
  };

  Game.prototype.resume = function () {
    if (this.state !== "paused") {
      return;
    }
    this.state = this.stateBeforePause || "countdown";
    this.app.screen.hideModal("pause-modal");
    this.app.audio.setMode("gameplay");
  };

  Game.prototype.restart = function () {
    this.app.screen.hideAllModals();
    this.startNew(this.difficulty);
  };

  Game.prototype.exitToMenu = function () {
    if (this.isInProgress()) {
      this.saveProgress();
    }
    this.state = "idle";
    this.app.screen.hideAllModals();
    this.app.showMenu();
  };

  Game.prototype.playAgain = function () {
    this.app.screen.hideAllModals();
    this.startNew(this.difficulty);
  };

  Game.prototype.isInProgress = function () {
    return ["countdown", "playing", "scored", "paused"].indexOf(this.state) !== -1;
  };

  Game.prototype.saveProgress = function () {
    ns.SaveManager.saveProgress({
      difficulty: this.difficulty,
      playerScore: this.score.player,
      aiScore: this.score.ai,
      targetScore: this.score.targetScore
    });
    this.app.mainMenu.refreshContinue();
  };

  Game.prototype.loop = function (timestamp) {
    var dt = this.lastFrame ? Math.min((timestamp - this.lastFrame) / 1000, 0.033) : 0.016;
    this.lastFrame = timestamp;
    this.update(dt);
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  };

  Game.prototype.update = function (dt) {
    this.updateParticles(dt);
    if (this.comboLife > 0) {
      this.comboLife -= dt;
    }

    if (this.state === "countdown") {
      this.updateCountdown(dt);
      return;
    }
    if (this.state === "playing") {
      this.updatePlaying(dt);
      return;
    }
    if (this.state === "scored") {
      this.scoreDelay -= dt;
      if (this.scoreDelay <= 0) {
        if (this.pendingWinner) {
          this.showResult(this.pendingWinner);
        } else {
          this.startCountdown(this.serveDirection);
        }
      }
    }
  };

  Game.prototype.updateCountdown = function (dt) {
    var number = Math.max(1, Math.ceil(this.countdown));
    if (number !== this.lastCountdownNumber) {
      this.lastCountdownNumber = number;
      this.app.audio.playSfx(number === 1 ? "countdownFinal" : "countdown");
    }
    this.app.hud.setCountdown(number);
    this.countdown -= dt;
    if (this.countdown <= 0) {
      this.puck.reset(this.serveDirection);
      this.state = "playing";
      this.app.hud.setStatus("game.playing");
      this.app.hud.setCountdown("");
    }
  };

  Game.prototype.updatePlaying = function (dt) {
    this.updatePlayer(dt);
    this.updateAi(dt);

    var playerHit = ns.Physics.collideMallet(this.puck, this.playerMallet);
    var aiHit = ns.Physics.collideMallet(this.puck, this.aiMallet);
    if (playerHit || aiHit) {
      this.app.audio.playSfx("hitMallet");
      this.spawnParticles(this.puck.x, this.puck.y, "hit");
    }

    var events = ns.Physics.updatePuck(this.puck, dt);
    for (var i = 0; i < events.length; i += 1) {
      if (events[i].type === "wall") {
        this.handleWall(events[i]);
      }
      if (events[i].type === "goal") {
        this.handleGoal(events[i].scorer, events[i]);
        break;
      }
    }
  };

  Game.prototype.updatePlayer = function (dt) {
    var target = this.pointerTarget || { x: this.playerMallet.x, y: this.playerMallet.y };
    if (this.settings.keyboardEnabled) {
      var dx = 0;
      var dy = 0;
      if (this.keyboardState.ArrowLeft || this.keyboardState.a || this.keyboardState.A) {
        dx -= 1;
      }
      if (this.keyboardState.ArrowRight || this.keyboardState.d || this.keyboardState.D) {
        dx += 1;
      }
      if (this.keyboardState.ArrowUp || this.keyboardState.w || this.keyboardState.W) {
        dy -= 1;
      }
      if (this.keyboardState.ArrowDown || this.keyboardState.s || this.keyboardState.S) {
        dy += 1;
      }
      if (dx || dy) {
        target = {
          x: this.playerMallet.x + dx * 560 * dt,
          y: this.playerMallet.y + dy * 560 * dt
        };
        this.pointerTarget = target;
      }
    }

    var sensitivity = ns.Constants.TOUCH_MULTIPLIER[this.settings.touchSensitivity] || 1;
    var speed = this.pointerSource === "touch" ? 1500 * sensitivity : 1700;
    this.playerMallet.moveToward(target, speed, dt);
  };

  Game.prototype.updateAi = function (dt) {
    var decision = this.aiController.decide({
      puck: this.puck,
      player: this.playerMallet,
      ai: this.aiMallet,
      score: this.score
    }, dt);
    var target = ns.Table.clampMallet(decision, false);
    this.aiMallet.moveToward(target, decision.speed, dt);
  };

  Game.prototype.handleWall = function (event) {
    this.app.audio.playSfx("hitWall");
    this.spawnParticles(event.x, event.y, "wall");
    var frame = ns.Helpers.$("#table-frame");
    frame.classList.remove("shake");
    void frame.offsetWidth;
    frame.classList.add("shake");
  };

  Game.prototype.handleGoal = function (scorer, event) {
    this.state = "scored";
    this.scoreDelay = 1;
    this.serveDirection = scorer === "player" ? 1 : -1;
    this.pendingWinner = this.score.add(scorer);
    this.app.hud.updateScores(this.score.player, this.score.ai);
    this.app.hud.setStatus("game.scored");
    this.app.audio.playSfx("goal");
    this.spawnParticles(event.x, event.y, "goal");
    if (this.score.combo >= 2) {
      this.comboText = this.app.i18n.t("result.combo");
      this.comboLife = 1.25;
    }
    this.puck.stop();
  };

  Game.prototype.showResult = function (winner) {
    this.state = "result";
    ns.SaveManager.clearProgress();
    this.app.mainMenu.refreshContinue();
    this.app.audio.setMode("menu");
    var title = ns.Helpers.$("#result-title");
    var detail = ns.Helpers.$("#result-detail");
    var playerWon = winner === "player";
    title.textContent = this.app.i18n.t(playerWon ? "result.win" : "result.lose");
    detail.textContent = this.score.player + " - " + this.score.ai + " · " + this.app.i18n.t("result.detail");
    this.app.screen.showModal("result-modal");
  };

  Game.prototype.spawnParticles = function (x, y, type) {
    var quality = this.settings.effectsQuality || "medium";
    var limit = ns.Constants.EFFECT_LIMITS[quality] || 72;
    var count = type === "goal" ? Math.floor(limit / 2) : Math.floor(limit / 8);
    var colors = this.tableRenderer.getColors();
    for (var i = 0; i < count; i += 1) {
      var angle = Math.random() * Math.PI * 2;
      var speed = ns.Helpers.randomBetween(type === "goal" ? 130 : 60, type === "goal" ? 420 : 210);
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: ns.Helpers.randomBetween(0.35, 0.85),
        maxLife: 0.85,
        size: ns.Helpers.randomBetween(2, type === "goal" ? 7 : 4),
        color: type === "goal" ? (Math.random() > 0.5 ? colors.warn : colors.goal) : colors.line
      });
    }
    while (this.particles.length > limit) {
      this.particles.shift();
    }
  };

  Game.prototype.updateParticles = function (dt) {
    this.particles = this.particles.filter(function (particle) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= 0.97;
      particle.vy *= 0.97;
      particle.life -= dt;
      return particle.life > 0;
    });
    this.puck.trail.forEach(function (point) {
      point.life -= dt * 2.6;
    });
    this.puck.trail = this.puck.trail.filter(function (point) {
      return point.life > 0;
    });
  };

  Game.prototype.render = function () {
    var ctx = this.context;
    this.tableRenderer.draw();
    this.drawTrail(ctx);
    this.drawParticles(ctx);
    this.drawMallet(ctx, this.aiMallet, false);
    this.drawMallet(ctx, this.playerMallet, true);
    this.drawPuck(ctx);
    this.drawOverlayText(ctx);
  };

  Game.prototype.drawTrail = function (ctx) {
    var colors = this.tableRenderer.getColors();
    for (var i = 0; i < this.puck.trail.length; i += 1) {
      var point = this.puck.trail[i];
      ctx.save();
      ctx.globalAlpha = Math.max(point.life, 0) * 0.22;
      ctx.fillStyle = colors.puck;
      ctx.beginPath();
      ctx.arc(point.x, point.y, this.puck.radius * (0.7 + point.life * 0.2), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  Game.prototype.drawParticles = function (ctx) {
    this.particles.forEach(function (particle) {
      ctx.save();
      ctx.globalAlpha = Math.max(particle.life / particle.maxLife, 0);
      ctx.fillStyle = particle.color;
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  };

  Game.prototype.drawMallet = function (ctx, mallet, isPlayer) {
    var colors = this.tableRenderer.getColors();
    var color = isPlayer ? colors.player : colors.ai;
    var gradient = ctx.createRadialGradient(mallet.x - 12, mallet.y - 16, 4, mallet.x, mallet.y, mallet.radius);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.2, color);
    gradient.addColorStop(1, "rgba(0,0,0,0.36)");

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mallet.x, mallet.y, mallet.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(255,255,255,0.78)";
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(mallet.x - 8, mallet.y - 10, mallet.radius * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  Game.prototype.drawPuck = function (ctx) {
    var colors = this.tableRenderer.getColors();
    var gradient = ctx.createRadialGradient(this.puck.x - 6, this.puck.y - 8, 2, this.puck.x, this.puck.y, this.puck.radius);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.55, colors.puck);
    gradient.addColorStop(1, "rgba(0,0,0,0.45)");

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.puck.x, this.puck.y, this.puck.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,0.72)";
    ctx.stroke();
    ctx.restore();
  };

  Game.prototype.drawOverlayText = function (ctx) {
    if (this.state === "countdown") {
      ctx.save();
      ctx.fillStyle = this.tableRenderer.getColors().warn;
      ctx.font = "800 112px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 20;
      ctx.fillText(String(Math.max(1, Math.ceil(this.countdown))), ns.Constants.TABLE.WIDTH / 2, ns.Constants.TABLE.HEIGHT / 2);
      ctx.restore();
    }
    if (this.comboLife > 0 && this.comboText) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, this.comboLife);
      ctx.fillStyle = this.tableRenderer.getColors().warn;
      ctx.font = "800 42px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 14;
      ctx.fillText(this.comboText, ns.Constants.TABLE.WIDTH / 2, ns.Constants.TABLE.HEIGHT * 0.42);
      ctx.restore();
    }
  };

  ns.Game = Game;
})(window.AirHockey = window.AirHockey || {});
