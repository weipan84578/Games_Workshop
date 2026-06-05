(function (window) {
  "use strict";

  var Pinball = window.Pinball;
  var CONFIG = Pinball.CONFIG;
  var Utils = Pinball.Utils;

  function Game(options) {
    this.screenManager = options.screenManager;
    this.settingsPanel = options.settingsPanel;
    this.hud = options.hud;
    this.menu = options.menu;
    this.canvas = document.getElementById("board");
    this.renderer = new Pinball.Renderer(this.canvas);
    this.loop = new Pinball.GameLoop(this.update.bind(this), this.render.bind(this));
    this.gameScreen = document.getElementById("screen-game");
    this.pauseOverlay = document.getElementById("pause-overlay");
    this.state = "idle";
    this.message = "準備";
    this.messageUntil = 0;
    this.wallSoundCooldown = 0;
    this.rampCooldown = 0;
    this.rampPulse = 0;
    this.shooterGatePulse = 0;
    this.resetTable();
  }

  Game.prototype.resetTable = function () {
    this.settings = this.settingsPanel.get();
    this.physics = CONFIG.DIFFICULTY[this.settings.difficulty] || CONFIG.DIFFICULTY.normal;
    this.walls = this.createWalls();
    this.bumpers = this.createBumpers();
    this.targets = this.createTargets();
    this.flippers = this.createFlippers();
    this.plunger = new Pinball.Plunger();
    this.balls = [];
    this.score = 0;
    this.highScore = Utils.loadNumber(CONFIG.STORAGE.HIGH_SCORE, 0);
    this.ballsRemaining = CONFIG.GAME.startingBalls;
    this.combo = 0;
    this.multiplier = 1;
    this.lastScoreTime = 0;
    this.jackpotProgress = 0;
    this.extraAwarded = false;
    this.ballSaveUntil = 0;
  };

  Game.prototype.createWalls = function () {
    return [
      new Pinball.Wall(266, 46, 142, 72, { kind: "rail" }),
      new Pinball.Wall(142, 72, 84, 132, { kind: "rail" }),
      new Pinball.Wall(84, 132, 58, 330, { kind: "rail" }),
      new Pinball.Wall(58, 330, 42, 702, { kind: "rail" }),
      new Pinball.Wall(42, 702, 92, 790, { kind: "rubber" }),
      new Pinball.Wall(92, 790, 198, 884, { kind: "rail" }),
      new Pinball.Wall(274, 46, 410, 70, { kind: "rail" }),
      new Pinball.Wall(410, 70, 502, 132, { kind: "rail" }),
      new Pinball.Wall(516, 134, 516, 912, { kind: "rail" }),
      new Pinball.Wall(454, 220, 454, 848, { kind: "rail" }),
      new Pinball.Wall(454, 848, 372, 904, { kind: "rail" }),
      new Pinball.Wall(512, 168, 454, 214, { kind: "gate" }),
      new Pinball.Wall(448, 790, 342, 884, { kind: "rail" }),
      new Pinball.Wall(128, 708, 202, 790, { kind: "rubber" }),
      new Pinball.Wall(412, 708, 338, 790, { kind: "rubber" }),
      new Pinball.Wall(110, 178, 185, 152, { kind: "rubber" }),
      new Pinball.Wall(355, 152, 430, 178, { kind: "rubber" }),
      new Pinball.Wall(470, 912, 516, 912, { kind: "rail" }),
      new Pinball.Wall(40, 912, 188, 940, { kind: "rail" }),
      new Pinball.Wall(352, 940, 470, 912, { kind: "rail" })
    ];
  };

  Game.prototype.createBumpers = function () {
    return [
      new Pinball.Bumper(212, 286, 34, { label: "A", value: CONFIG.SCORE.bumper }),
      new Pinball.Bumper(334, 304, 38, { label: "B", value: CONFIG.SCORE.bumper }),
      new Pinball.Bumper(274, 430, 36, { label: "C", value: CONFIG.SCORE.bumper })
    ];
  };

  Game.prototype.createTargets = function () {
    return [
      new Pinball.Target(128, 514, 26, 58, { bank: "left" }),
      new Pinball.Target(166, 506, 26, 58, { bank: "left" }),
      new Pinball.Target(204, 498, 26, 58, { bank: "left" }),
      new Pinball.Target(344, 500, 26, 58, { bank: "right" }),
      new Pinball.Target(382, 510, 26, 58, { bank: "right" }),
      new Pinball.Target(404, 236, 26, 60, { bank: "right" }),
      new Pinball.Target(150, 148, 46, 18, { kind: "rollover", value: CONFIG.SCORE.rollover }),
      new Pinball.Target(246, 132, 46, 18, { kind: "rollover", value: CONFIG.SCORE.rollover }),
      new Pinball.Target(342, 148, 46, 18, { kind: "rollover", value: CONFIG.SCORE.rollover })
    ];
  };

  Game.prototype.createFlippers = function () {
    var scale = this.physics.flipperScale || 1;
    var length = 96 * scale;
    var width = 22 * scale;

    return [
      new Pinball.Flipper({
        side: "left",
        pivotX: 150,
        pivotY: 825,
        length: length,
        width: width,
        restAngle: 0.24,
        activeAngle: -0.72
      }),
      new Pinball.Flipper({
        side: "right",
        pivotX: 390,
        pivotY: 825,
        length: length,
        width: width,
        restAngle: Math.PI - 0.24,
        activeAngle: Math.PI + 0.72
      })
    ];
  };

  Game.prototype.newGame = function () {
    Utils.clearStorage([CONFIG.STORAGE.SAVED_GAME]);
    this.resetTable();
    this.state = "playing";
    this.spawnShooterBall();
    this.setMessage("長按發射");
    this.screenManager.show("game");
    this.setPausedUi(false);
    this.loop.start();
    this.hud.update(this);
    this.menu.refresh();
  };

  Game.prototype.continueGame = function () {
    var saved = Utils.loadJSON(CONFIG.STORAGE.SAVED_GAME, null);
    if (!saved) {
      this.newGame();
      return;
    }

    this.resetTable();
    this.score = saved.score || 0;
    this.ballsRemaining = Math.max(1, saved.ballsRemaining || CONFIG.GAME.startingBalls);
    this.combo = saved.combo || 0;
    this.multiplier = saved.multiplier || 1;
    this.jackpotProgress = saved.jackpotProgress || 0;
    this.extraAwarded = Boolean(saved.extraAwarded);
    this.state = "playing";
    this.spawnShooterBall();
    this.setMessage("長按發射");
    this.screenManager.show("game");
    this.setPausedUi(false);
    this.loop.start();
    this.hud.update(this);
  };

  Game.prototype.spawnShooterBall = function () {
    var ball = new Pinball.Ball(CONFIG.BOARD.shooterX, CONFIG.BOARD.shooterRestY, { inShooter: true });
    this.balls = [ball];
    this.plunger.charge = 0;
    this.ballSaveUntil = performance.now() + this.physics.ballSaveMs;
  };

  Game.prototype.addMultiball = function () {
    var base = new Pinball.Ball(270, 410, { vx: -420, vy: -380 });
    var second = new Pinball.Ball(308, 390, { vx: 420, vy: -430 });
    this.balls.push(base, second);
    Pinball.AudioManager.playSFX("multiball");
    this.setMessage("MULTIBALL");
  };

  Game.prototype.updateSettings = function () {
    this.settings = this.settingsPanel.get();
    this.physics = CONFIG.DIFFICULTY[this.settings.difficulty] || CONFIG.DIFFICULTY.normal;
    this.flippers = this.createFlippers();
    Pinball.AudioManager.configure(this.settings);
    this.renderer.refreshTheme();
  };

  Game.prototype.update = function (dt) {
    if (this.state !== "playing") {
      this.updateMessage();
      return;
    }

    this.wallSoundCooldown = Math.max(0, this.wallSoundCooldown - dt);
    this.rampCooldown = Math.max(0, this.rampCooldown - dt);
    this.rampPulse = Math.max(0, this.rampPulse - dt * 2.6);
    this.shooterGatePulse = Math.max(0, this.shooterGatePulse - dt * 3);
    this.plunger.update(dt);
    this.flippers.forEach(function (flipper) { flipper.update(dt); });
    this.bumpers.forEach(function (bumper) { bumper.update(dt); });
    this.targets.forEach(function (target) { target.update(dt); });

    for (var i = this.balls.length - 1; i >= 0; i -= 1) {
      this.updateBall(this.balls[i], dt);
      if (this.balls[i] && this.balls[i].y > CONFIG.BOARD.drainY) {
        this.drainBall(i);
      }
    }

    this.updateMessage();
    this.hud.update(this);
  };

  Game.prototype.updateBall = function (ball, dt) {
    if (ball.inShooter) {
      ball.x = CONFIG.BOARD.shooterX;
      ball.y = CONFIG.BOARD.shooterRestY - this.plunger.charge * 10;
      ball.vx = 0;
      ball.vy = 0;
      ball.trail.length = 0;
      return;
    }

    ball.update(dt, this.physics);

    if (this.handleShooterLane(ball)) {
      return;
    }

    this.walls.forEach(function (wall) {
      var hit = Pinball.Collision.collideCircleSegment(ball, wall, this.physics.restitution);
      if (hit && this.wallSoundCooldown <= 0) {
        Pinball.AudioManager.playSFX("wall");
        this.wallSoundCooldown = 0.07;
      }
    }, this);

    this.bumpers.forEach(function (bumper) {
      if (bumper.collide(ball, this.physics)) {
        this.addScore(bumper.value, "彈柱", "bumper");
        this.advanceJackpot(0.25);
      }
    }, this);

    this.targets.forEach(function (target) {
      if (target.collide(ball, this.physics)) {
        var sfx = target.kind === "rollover" ? "score" : "target";
        this.addScore(target.value, target.kind === "rollover" ? "通道" : "目標", sfx);
        this.advanceJackpot(target.kind === "rollover" ? 0.5 : 1);
        this.checkTargetBanks();
      }
    }, this);

    this.flippers.forEach(function (flipper) {
      if (flipper.collide(ball, this.physics) && flipper.active) {
        Pinball.AudioManager.playSFX("flipper");
      }
    }, this);

    this.checkRamp(ball);
  };

  Game.prototype.handleShooterLane = function (ball) {
    if (!ball.fromShooter) {
      return false;
    }

    ball.x = CONFIG.BOARD.shooterX;
    ball.vx = 0;

    if (ball.y <= 225 && ball.vy < 0) {
      ball.fromShooter = false;
      ball.x = 442;
      ball.y = 190;
      ball.vx = -210;
      ball.vy = 120;
      ball.trail.length = 0;
      this.shooterGatePulse = 1;
      this.setMessage("閘門開啟");
      Pinball.AudioManager.playSFX("ramp");
      return true;
    }

    if (ball.vy > 0 && ball.y >= CONFIG.BOARD.shooterRestY - 8) {
      ball.setShooterRest();
      this.setMessage("重新發射");
      Pinball.AudioManager.playSFX("wall");
      return true;
    }

    return true;
  };

  Game.prototype.checkRamp = function (ball) {
    if (this.rampCooldown > 0) return;
    var inLeftRamp = ball.x > 92 && ball.x < 156 && ball.y > 390 && ball.y < 560 && ball.vy < 120;
    var inRightRamp = ball.x > 362 && ball.x < 430 && ball.y > 370 && ball.y < 555 && ball.vy < 180;
    if (!inLeftRamp && !inRightRamp) return;
    this.rampCooldown = 0.8;
    this.rampPulse = 1;
    ball.vy -= 260;
    ball.vx += inLeftRamp ? 380 : -380;
    this.addScore(CONFIG.SCORE.ramp, "坡道", "ramp");
    this.advanceJackpot(1);
  };

  Game.prototype.checkTargetBanks = function () {
    var banks = ["left", "right"];
    banks.forEach(function (bank) {
      var targets = this.targets.filter(function (target) {
        return target.bank === bank && target.kind !== "rollover";
      });
      if (targets.length && targets.every(function (target) { return target.down; })) {
        targets.forEach(function (target) { target.reset(); });
        this.multiplier = Math.min(5, this.multiplier + 1);
        this.addScore(900, "全組命中", "combo");
      }
    }, this);
  };

  Game.prototype.advanceJackpot = function (amount) {
    this.jackpotProgress = Math.min(7, this.jackpotProgress + amount);
    if (this.jackpotProgress >= 7) {
      this.awardJackpot();
    }
  };

  Game.prototype.awardJackpot = function () {
    this.jackpotProgress = 0;
    this.addScore(CONFIG.SCORE.jackpot, "大獎", "jackpot");
    if (this.balls.length < 3) {
      this.addMultiball();
    }
  };

  Game.prototype.addScore = function (base, label, sfx) {
    var now = performance.now();
    if (now - this.lastScoreTime <= CONFIG.GAME.comboWindowMs) {
      this.combo += 1;
    } else {
      this.combo = 1;
    }
    this.lastScoreTime = now;
    this.multiplier = Math.min(5, Math.max(this.multiplier, 1 + Math.floor(this.combo / 5)));

    var earned = Math.floor(base * this.multiplier);
    this.score += earned;
    this.highScore = Math.max(this.highScore, this.score);
    this.setMessage(label + " +" + Utils.formatScore(earned));
    Pinball.AudioManager.playSFX(sfx || "score", { level: this.combo });

    if (this.combo > 2 && this.combo % 4 === 0) {
      Pinball.AudioManager.playSFX("combo", { level: this.combo });
    }

    if (!this.extraAwarded && this.score >= CONFIG.SCORE.extraBallAt) {
      this.extraAwarded = true;
      this.ballsRemaining += 1;
      this.setMessage("追加球");
      Pinball.AudioManager.playSFX("extraBall");
    }
  };

  Game.prototype.drainBall = function (index) {
    var drained = this.balls[index];
    if (drained && drained.fromShooter) {
      drained.setShooterRest();
      this.setMessage("重新發射");
      return;
    }

    this.balls.splice(index, 1);

    if (this.balls.length > 0) {
      Pinball.AudioManager.playSFX("drain");
      return;
    }

    if (performance.now() < this.ballSaveUntil && this.state === "playing") {
      this.spawnShooterBall();
      this.setMessage("保球");
      Pinball.AudioManager.playSFX("launch");
      return;
    }

    Pinball.AudioManager.playSFX("drain");
    this.ballsRemaining -= 1;
    this.combo = 0;
    this.multiplier = 1;

    if (this.ballsRemaining > 0) {
      this.spawnShooterBall();
      this.setMessage("第 " + this.ballsRemaining + " 球");
    } else {
      this.gameOver();
    }
  };

  Game.prototype.gameOver = function () {
    this.state = "gameover";
    this.balls = [];
    this.setPausedUi(false);
    Utils.clearStorage([CONFIG.STORAGE.SAVED_GAME]);
    var previousHigh = Utils.loadNumber(CONFIG.STORAGE.HIGH_SCORE, 0);
    if (this.score > previousHigh) {
      Utils.saveNumber(CONFIG.STORAGE.HIGH_SCORE, this.score);
      Pinball.AudioManager.playSFX("newHighScore");
      this.setMessage("新紀錄");
    } else {
      Pinball.AudioManager.playSFX("gameOver");
      this.setMessage("遊戲結束");
    }
    this.menu.refresh();
    this.hud.update(this);
  };

  Game.prototype.saveGame = function () {
    if (this.state !== "playing" && this.state !== "paused") return;
    Utils.saveJSON(CONFIG.STORAGE.SAVED_GAME, {
      score: this.score,
      ballsRemaining: this.ballsRemaining,
      combo: this.combo,
      multiplier: this.multiplier,
      jackpotProgress: this.jackpotProgress,
      extraAwarded: this.extraAwarded
    });
    this.menu.refresh();
  };

  Game.prototype.pause = function () {
    if (this.state !== "playing") return;
    this.state = "paused";
    this.setControlsIdle();
    this.setPausedUi(true);
    this.saveGame();
  };

  Game.prototype.resume = function () {
    if (this.state !== "paused") return;
    this.state = "playing";
    this.setPausedUi(false);
  };

  Game.prototype.togglePause = function () {
    if (this.state === "playing") this.pause();
    else if (this.state === "paused") this.resume();
  };

  Game.prototype.quitToMenu = function (save) {
    if (save) {
      this.saveGame();
    }
    this.setPausedUi(false);
    this.state = "idle";
    this.screenManager.show("menu");
    this.menu.refresh();
  };

  Game.prototype.setFlipper = function (side, active) {
    if (this.state !== "playing") return;
    this.flippers.forEach(function (flipper) {
      if (flipper.side === side) {
        if (active && !flipper.active) {
          Pinball.AudioManager.playSFX("flipper");
        }
        flipper.setActive(active);
      }
    });
  };

  Game.prototype.setControlsIdle = function () {
    this.flippers.forEach(function (flipper) {
      flipper.setActive(false);
    });
    this.plunger.charging = false;
  };

  Game.prototype.setPausedUi = function (paused) {
    this.pauseOverlay.hidden = !paused;
    this.gameScreen.classList.toggle("is-paused", paused);
  };

  Game.prototype.startPlunger = function () {
    if (this.state !== "playing") return;
    if (this.balls.some(function (ball) { return ball.inShooter; })) {
      this.plunger.start();
    }
  };

  Game.prototype.releasePlunger = function () {
    if (this.state !== "playing") return;
    var power = this.plunger.release();
    if (!power) return;
    this.balls.forEach(function (ball) {
      if (ball.inShooter) {
        ball.launch(power);
        Pinball.AudioManager.playSFX("launch");
        this.setMessage("發射");
      }
    }, this);
  };

  Game.prototype.setMessage = function (message) {
    this.message = message;
    this.messageUntil = performance.now() + CONFIG.GAME.messageMs;
  };

  Game.prototype.updateMessage = function () {
    if (this.message && performance.now() > this.messageUntil && this.state !== "gameover") {
      if (this.balls.some(function (ball) { return ball.inShooter; })) {
        this.message = "長按發射";
      } else {
        this.message = "遊戲中";
      }
    }
  };

  Game.prototype.render = function () {
    this.renderer.render(this);
  };

  function boot() {
    var screenManager = new Pinball.ScreenManager();
    var settingsPanel = new Pinball.SettingsPanel();
    var hud = new Pinball.HUD();
    var menu = new Pinball.Menu(screenManager);
    var game = new Game({
      screenManager: screenManager,
      settingsPanel: settingsPanel,
      hud: hud,
      menu: menu
    });
    var input = new Pinball.InputController(game);

    settingsPanel.init(function () {
      game.updateSettings();
      drawAttractPreview();
    });
    settingsPanel.onReset = function () {
      menu.refresh();
      game.highScore = 0;
    };

    menu.init({
      start: function () { game.newGame(); },
      continueGame: function () { game.continueGame(); }
    });

    input.init();

    document.getElementById("btn-pause").addEventListener("click", function () {
      Pinball.AudioManager.unlock();
      game.togglePause();
    });
    document.getElementById("btn-resume").addEventListener("click", function () {
      Pinball.AudioManager.unlock();
      game.resume();
    });
    document.getElementById("btn-save-exit").addEventListener("click", function () {
      Pinball.AudioManager.unlock();
      game.quitToMenu(true);
    });
    document.getElementById("btn-restart").addEventListener("click", function () {
      Pinball.AudioManager.unlock();
      game.newGame();
    });
    document.getElementById("btn-back-menu").addEventListener("click", function () {
      Pinball.AudioManager.unlock();
      game.quitToMenu(true);
    });

    screenManager.onChange(function (name) {
      if (name === "menu") {
        menu.refresh();
        drawAttractPreview();
      }
    });

    function drawAttractPreview() {
      var canvas = document.getElementById("attract-canvas");
      if (canvas) {
        Pinball.drawAttract(canvas);
      }
    }

    drawAttractPreview();
    Pinball.AudioManager.configure(settingsPanel.get());
    Pinball.AudioManager.playBGM("menu");
    hud.update(game);

    window.PinballGame = game;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
