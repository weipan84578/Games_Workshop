(function (root, factory) {
  var api = factory();
  root.WormsGame = root.WormsGame || {};
  root.WormsGame.TutorialController = api.TutorialController;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  var STEPS = Object.freeze([
    {
      title: "tutorial.moveTitle",
      copy: "tutorial.moveCopy",
      keys: ["A", "W", "D", "S"],
    },
    {
      title: "tutorial.aimTitle",
      copy: "tutorial.aimCopy",
      keys: ["↑", "↓", "Space"],
    },
    {
      title: "tutorial.grenadeTitle",
      copy: "tutorial.grenadeCopy",
      keys: ["Q / E", "Space"],
    },
    {
      title: "tutorial.terrainTitle",
      copy: "tutorial.terrainCopy",
      keys: ["Space"],
    },
  ]);

  /** Small fixed-seed practice scene for the four onboarding stages. */
  function TutorialController(canvas, i18n, callbacks) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.i18n = i18n;
    this.callbacks = callbacks || {};
    this.step = 0;
    this.running = false;
    this.time = 0;
    this.wormX = 245;
    this.wormY = 385;
    this.projectile = null;
    this.completedAction = false;
    this.listeners = [];
    this.frameId = null;
    this.lastTime = 0;
    this.frame = this.frame.bind(this);
  }

  TutorialController.prototype.listen = function (target, event, handler) {
    target.addEventListener(event, handler);
    this.listeners.push(function () {
      target.removeEventListener(event, handler);
    });
  };

  TutorialController.prototype.start = function () {
    if (this.running) return;
    var self = this;
    this.running = true;
    this.step = 0;
    this.renderCopy();
    this.listen(window, "keydown", function (event) {
      if (
        [
          "KeyA",
          "KeyD",
          "KeyW",
          "KeyS",
          "Space",
          "ArrowUp",
          "ArrowDown",
        ].indexOf(event.code) >= 0
      )
        event.preventDefault();
      if (self.step === 0) {
        if (event.code === "KeyA") self.wormX -= 22;
        if (event.code === "KeyD") self.wormX += 22;
        if (event.code === "KeyW" || event.code === "KeyS")
          self.completedAction = true;
      }
      if (event.code === "Space" && !event.repeat && self.step > 0)
        self.launchDemo();
    });
    this.frameId = requestAnimationFrame(this.frame);
  };

  TutorialController.prototype.renderCopy = function () {
    var step = STEPS[this.step];
    var touch =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    var touchKeys = [
      ["◀", "跳", "▶", "翻"],
      ["拖曳瞄準", "放開發射"],
      ["武器", "拖曳投擲"],
      ["瞄準地面", "發射"],
    ];
    document.getElementById("tutorial-progress").textContent =
      this.step + 1 + " / " + STEPS.length;
    document.getElementById("tutorial-title").textContent = this.i18n.t(
      step.title,
    );
    document.getElementById("tutorial-copy").textContent = this.i18n.t(
      step.copy,
    );
    var keys = document.getElementById("tutorial-keys");
    keys.textContent = "";
    (touch ? touchKeys[this.step] : step.keys).forEach(function (key) {
      var element = document.createElement("kbd");
      element.textContent = key;
      keys.appendChild(element);
    });
  };

  TutorialController.prototype.launchDemo = function () {
    this.completedAction = false;
    this.projectile = {
      x: this.wormX + 28,
      y: this.wormY - 20,
      vx: this.step === 1 ? 260 : 205,
      vy: this.step === 1 ? -185 : -280,
      age: 0,
    };
  };

  TutorialController.prototype.next = function () {
    if (this.step >= STEPS.length - 1) {
      this.stop();
      if (this.callbacks.complete) this.callbacks.complete();
      return;
    }
    this.step += 1;
    this.projectile = null;
    this.completedAction = false;
    this.renderCopy();
  };

  TutorialController.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    var ratio = Math.min(2, window.devicePixelRatio || 1);
    var width = Math.round(rect.width * ratio);
    var height = Math.round(rect.height * ratio);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.context.setTransform(
      (ratio * rect.width) / 960,
      0,
      0,
      (ratio * rect.height) / 540,
      0,
      0,
    );
  };

  TutorialController.prototype.update = function (dt) {
    this.time += dt;
    if (!this.projectile) return;
    this.projectile.age += dt;
    this.projectile.vy += 480 * dt;
    this.projectile.x += this.projectile.vx * dt;
    this.projectile.y += this.projectile.vy * dt;
    if (this.projectile.y > 390 || this.projectile.age > 3) {
      this.completedAction = true;
      this.projectile = null;
    }
  };

  TutorialController.prototype.drawWorm = function (context) {
    context.fillStyle = "#f47ba3";
    context.strokeStyle = "#34294f";
    context.lineWidth = 5;
    context.beginPath();
    context.ellipse(this.wormX, this.wormY, 22, 30, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = "#fff";
    context.beginPath();
    context.arc(this.wormX - 7, this.wormY - 9, 6, 0, Math.PI * 2);
    context.arc(this.wormX + 8, this.wormY - 9, 6, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#34294f";
    context.beginPath();
    context.arc(this.wormX - 5, this.wormY - 8, 2, 0, Math.PI * 2);
    context.arc(this.wormX + 10, this.wormY - 8, 2, 0, Math.PI * 2);
    context.fill();
  };

  TutorialController.prototype.draw = function () {
    this.resize();
    var context = this.context;
    var gradient = context.createLinearGradient(0, 0, 0, 540);
    gradient.addColorStop(0, "#91dff0");
    gradient.addColorStop(1, "#fff1cf");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 960, 540);
    context.fillStyle = "rgba(255,255,255,.75)";
    context.beginPath();
    context.ellipse(150, 95, 85, 30, 0, 0, Math.PI * 2);
    context.ellipse(765, 135, 110, 34, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#8ad28b";
    context.beginPath();
    context.moveTo(0, 400);
    context.quadraticCurveTo(190, 350, 380, 405);
    context.quadraticCurveTo(570, 455, 760, 385);
    context.quadraticCurveTo(870, 350, 960, 395);
    context.lineTo(960, 540);
    context.lineTo(0, 540);
    context.fill();
    context.strokeStyle = "#5ab56c";
    context.lineWidth = 16;
    context.beginPath();
    context.moveTo(0, 400);
    context.quadraticCurveTo(190, 350, 380, 405);
    context.quadraticCurveTo(570, 455, 760, 385);
    context.quadraticCurveTo(870, 350, 960, 395);
    context.stroke();
    if (this.step >= 1) {
      context.fillStyle = "#fff";
      context.strokeStyle = "#34294f";
      context.lineWidth = 4;
      context.beginPath();
      context.arc(730, 330, 42, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.strokeStyle = "#ed5d8f";
      context.lineWidth = 8;
      context.beginPath();
      context.arc(730, 330, 24, 0, Math.PI * 2);
      context.stroke();
    }
    if (this.step >= 2) {
      context.fillStyle = "#a27d65";
      context.fillRect(480, 310, 70, 100);
    }
    if (this.step === 3) {
      context.font = "54px sans-serif";
      context.fillText("🎯", 710, 360);
      context.fillStyle = "#5bbde1";
      context.fillRect(600, 455, 360, 85);
    }
    this.drawWorm(context);
    if (this.projectile) {
      context.font = "26px sans-serif";
      context.fillText(
        this.step === 1 ? "🚀" : "💣",
        this.projectile.x,
        this.projectile.y,
      );
    }
    if (this.completedAction) {
      context.font = "bold 34px sans-serif";
      context.fillStyle = "#fff";
      context.strokeStyle = "#34294f";
      context.lineWidth = 7;
      context.strokeText("✓", 820, 260);
      context.fillText("✓", 820, 260);
    }
  };

  TutorialController.prototype.frame = function (time) {
    if (!this.running) return;
    var dt = this.lastTime ? Math.min(0.05, (time - this.lastTime) / 1000) : 0;
    this.lastTime = time;
    this.update(dt);
    this.draw();
    this.frameId = requestAnimationFrame(this.frame);
  };

  TutorialController.prototype.stop = function () {
    this.running = false;
    this.listeners.splice(0).forEach(function (dispose) {
      dispose();
    });
    if (this.frameId != null) cancelAnimationFrame(this.frameId);
    this.frameId = null;
    this.lastTime = 0;
  };

  return { STEPS: STEPS, TutorialController: TutorialController };
});
