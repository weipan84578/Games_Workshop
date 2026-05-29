(function (BS) {
  var App = {
    canvas: null,
    renderer: null,
    loop: null,
    state: null,
    pointerDown: false,

    init: function () {
      var settings = BS.Storage.getSettings();
      document.documentElement.setAttribute("data-theme", settings.theme);

      BS.Audio.init();
      BS.UI.Screens.init();

      this.canvas = document.getElementById("game-canvas");
      this.renderer = new BS.Game.Renderer(this.canvas);
      this.loop = new BS.Core.Loop(this.update.bind(this), this.render.bind(this));

      BS.UI.Menu.init();
      BS.UI.Settings.init();
      BS.UI.Instructions.init();
      BS.UI.HUD.init();
      this.bindInput();

      BS.UI.Screens.show("menu");
      BS.UI.Menu.refresh();
      BS.Audio.playBGM("menu");
    },

    bindInput: function () {
      var self = this;

      this.canvas.addEventListener("pointerdown", function (event) {
        BS.Utils.prevent(event);
        if (!self.canControl()) {
          return;
        }
        self.pointerDown = true;
        if (self.canvas.setPointerCapture) {
          self.canvas.setPointerCapture(event.pointerId);
        }
        self.aimFromEvent(event);
      });

      this.canvas.addEventListener("pointermove", function (event) {
        if (!self.canControl()) {
          return;
        }
        self.aimFromEvent(event);
      });

      this.canvas.addEventListener("pointerup", function (event) {
        BS.Utils.prevent(event);
        if (!self.canControl()) {
          self.pointerDown = false;
          return;
        }
        self.aimFromEvent(event);
        self.pointerDown = false;
        self.shoot();
      });

      this.canvas.addEventListener("pointercancel", function () {
        self.pointerDown = false;
      });

      ["touchstart", "touchmove", "touchend"].forEach(function (name) {
        self.canvas.addEventListener(name, BS.Utils.prevent, { passive: false });
      });

      window.addEventListener("resize", function () {
        self.renderer.resize();
      });

      document.addEventListener("keydown", function (event) {
        if (BS.UI.Screens.getActive() !== "game" || !self.state) {
          return;
        }

        if (event.key === "Escape") {
          if (self.state.status === BS.Core.Status.PAUSED) {
            self.resumeGame();
          } else {
            self.pauseGame();
          }
          return;
        }

        if (self.state.status !== BS.Core.Status.PLAYING) {
          return;
        }

        if (event.key === "ArrowLeft") {
          self.state.shooter.adjustAim(-0.055);
        } else if (event.key === "ArrowRight") {
          self.state.shooter.adjustAim(0.055);
        } else if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          self.shoot();
        }
      });

      document.addEventListener("visibilitychange", function () {
        if (document.hidden && self.state && self.state.status === BS.Core.Status.PLAYING) {
          self.pauseGame();
        }
      });

      window.addEventListener("beforeunload", function () {
        self.saveCurrentGame();
      });
    },

    canControl: function () {
      return this.state &&
        this.state.status === BS.Core.Status.PLAYING &&
        BS.UI.Screens.getActive() === "game";
    },

    aimFromEvent: function (event) {
      var point = BS.Utils.getCanvasPoint(this.canvas, event);
      this.state.shooter.setAim(point.x, point.y, this.renderer.getMetrics());
    },

    newGame: function () {
      BS.UI.Screens.modal("pause", false);
      BS.UI.Screens.modal("result", false);
      BS.Storage.clearGame();
      this.state = BS.Core.createGameState(null);
      this.enterGame();
    },

    continueGame: function () {
      var saved = BS.Storage.loadGame();
      if (!saved) {
        this.newGame();
        return;
      }

      BS.UI.Screens.modal("pause", false);
      BS.UI.Screens.modal("result", false);
      this.state = BS.Core.createGameState(saved);
      this.enterGame();
    },

    enterGame: function () {
      this.state.status = BS.Core.Status.PLAYING;
      BS.UI.Screens.show("game");
      BS.Audio.duck(false);
      BS.Audio.playBGM("game");
      this.renderer.resize();
      BS.UI.HUD.update(this.state);
      this.loop.start();
      this.saveCurrentGame();
    },

    pauseGame: function () {
      if (!this.state || this.state.status !== BS.Core.Status.PLAYING) {
        return;
      }

      this.state.status = BS.Core.Status.PAUSED;
      this.saveCurrentGame();
      BS.Audio.duck(true);
      BS.UI.Screens.modal("pause", true);
      BS.UI.HUD.update(this.state);
    },

    resumeGame: function () {
      if (!this.state || this.state.status !== BS.Core.Status.PAUSED) {
        return;
      }

      this.state.status = BS.Core.Status.PLAYING;
      BS.Audio.duck(false);
      BS.UI.Screens.modal("pause", false);
      BS.UI.HUD.update(this.state);
    },

    backToMenu: function (keepSave) {
      if (keepSave) {
        this.saveCurrentGame();
      } else {
        BS.Storage.clearGame();
      }

      this.state = null;
      BS.UI.Screens.modal("pause", false);
      BS.UI.Screens.modal("result", false);
      BS.UI.Screens.show("menu");
      BS.Audio.duck(false);
      BS.Audio.playBGM("menu");
      BS.UI.Menu.refresh();
    },

    shoot: function () {
      if (!this.canControl() || this.state.activeBubble) {
        return;
      }

      var pool = this.state.grid.getActiveColors();
      this.state.activeBubble = this.state.shooter.shoot(this.renderer.getMetrics(), pool);
      this.state.shots += 1;
      BS.Audio.playSFX("shoot");
      BS.UI.HUD.update(this.state);
    },

    update: function (dt) {
      if (!this.state || this.state.status !== BS.Core.Status.PLAYING) {
        return;
      }

      if (this.state.activeBubble) {
        var hit = BS.Game.Collision.stepShot(
          this.state.activeBubble,
          this.state.grid,
          this.renderer.getMetrics(),
          dt
        );

        if (hit && hit.type === "bounce") {
          BS.Audio.playSFX("bounce");
        } else if (hit) {
          this.resolveShot(hit);
        }
      } else {
        this.updatePressure(dt);
      }
    },

    render: function (time) {
      if (BS.UI.Screens.getActive() === "game") {
        this.renderer.render(this.state, time);
      }
    },

    resolveShot: function (hit) {
      var config = BS.Core.Config.game;
      var bubble = this.state.activeBubble;
      var attachedCell = this.state.grid.attachBubble(bubble, hit, this.renderer.getMetrics());
      this.state.activeBubble = null;

      if (!attachedCell) {
        this.endGame("lose");
        return;
      }

      BS.Audio.playSFX("attach");
      var match = BS.Game.Match.resolve(this.state.grid, attachedCell, config);

      if (match.matched) {
        this.state.combo += 1;
        this.state.misses = 0;
        this.state.pressureTimer = 0;
        this.state.score += match.popped.length * config.pointsPerPop;
        this.state.score += match.dropped.length * config.pointsPerDrop;
        if (this.state.combo > 1) {
          this.state.score += (this.state.combo - 1) * config.comboBonus;
          BS.Audio.playSFX("combo");
        }
        BS.Audio.playSFX("pop");
        if (match.dropped.length) {
          BS.Audio.playSFX("drop");
        }
      } else {
        var difficulty = BS.Core.getDifficulty(this.state.difficulty);
        this.state.combo = 0;
        this.state.misses += 1;
        if (this.state.misses >= difficulty.addRowEveryMisses) {
          this.state.misses = 0;
          if (this.pushDownRows()) {
            return;
          }
        }
      }

      BS.Storage.setHighScore(this.state.score);

      if (this.state.grid.isEmpty()) {
        this.endGame("win");
        return;
      }

      this.state.shooter.refreshPalette(this.state.grid.getActiveColors());

      if (this.state.grid.hasReachedDanger()) {
        this.endGame("lose");
        return;
      }

      BS.UI.HUD.update(this.state);
      this.saveCurrentGame();
    },

    updatePressure: function (dt) {
      var difficulty = BS.Core.getDifficulty(this.state.difficulty);

      if (!difficulty.pressureInterval) {
        return;
      }

      this.state.pressureTimer += dt;
      if (this.state.pressureTimer >= difficulty.pressureInterval) {
        this.pushDownRows();
      }
    },

    pushDownRows: function () {
      var config = BS.Core.Config.game;

      this.state.pressureTimer = 0;
      this.state.grid.addPressureRow(config.colorCount);
      this.state.shooter.refreshPalette(this.state.grid.getActiveColors());
      BS.Audio.playSFX("drop");

      if (this.state.grid.hasReachedDanger()) {
        this.endGame("lose");
        return true;
      }

      BS.UI.HUD.update(this.state);
      this.saveCurrentGame();
      return false;
    },

    endGame: function (result) {
      this.state.status = BS.Core.Status.OVER;
      this.state.result = result;
      this.state.activeBubble = null;
      BS.Storage.setHighScore(this.state.score);
      BS.Storage.clearGame();

      if (result === "win") {
        BS.Audio.playSFX("win");
        BS.Audio.playBGM("victory");
      } else {
        BS.Audio.playSFX("lose");
        BS.Audio.playBGM(null);
      }

      BS.UI.HUD.update(this.state);
      BS.UI.HUD.showResult(this.state);
      BS.UI.Screens.modal("pause", false);
      BS.UI.Screens.modal("result", true);
      BS.UI.Menu.refresh();
    },

    saveCurrentGame: function () {
      if (!this.state ||
          this.state.status === BS.Core.Status.OVER ||
          BS.UI.Screens.getActive() !== "game") {
        return;
      }

      var serialized = BS.Core.serializeGameState(this.state);
      if (serialized) {
        BS.Storage.saveGame(serialized);
        BS.UI.Menu.refresh();
      }
    }
  };

  BS.App = App;

  document.addEventListener("DOMContentLoaded", function () {
    BS.App.init();
  });
})(window.BubbleShooter);
