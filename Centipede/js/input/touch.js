(function (window) {
  "use strict";

  const Game = window.Game = window.Game || {};
  Game.Input = Game.Input || {};

  class TouchInput {
    constructor(app) {
      this.app = app;
      this.stick = document.getElementById("touchStick");
      this.nub = document.getElementById("touchNub");
      this.fire = document.getElementById("touchFire");
      this.pointerId = null;
      this.vectorValue = { x: 0, y: 0 };
      this.firing = false;
      this.bind();
    }

    bind() {
      this.stick.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        this.app.unlockAudio();
        this.pointerId = event.pointerId;
        this.stick.setPointerCapture(event.pointerId);
        this.updateStick(event);
      });
      this.stick.addEventListener("pointermove", (event) => {
        if (event.pointerId === this.pointerId) {
          event.preventDefault();
          this.updateStick(event);
        }
      });
      const reset = (event) => {
        if (event.pointerId === this.pointerId) {
          this.pointerId = null;
          this.vectorValue = { x: 0, y: 0 };
          this.nub.style.transform = "translate(-50%, -50%)";
        }
      };
      this.stick.addEventListener("pointerup", reset);
      this.stick.addEventListener("pointercancel", reset);

      this.fire.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        this.app.unlockAudio();
        this.firing = true;
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
        if (this.app.state.is("PAUSED")) {
          this.app.resume();
        }
      });
      this.fire.addEventListener("pointerup", () => {
        this.firing = false;
      });
      this.fire.addEventListener("pointercancel", () => {
        this.firing = false;
      });
      this.fire.addEventListener("pointerleave", () => {
        this.firing = false;
      });
    }

    updateStick(event) {
      const rect = this.stick.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const max = rect.width * 0.34;
      let dx = event.clientX - cx;
      let dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy);
      if (distance > max) {
        dx = dx / distance * max;
        dy = dy / distance * max;
      }
      this.vectorValue = {
        x: Math.abs(dx) > 4 ? dx / max : 0,
        y: Math.abs(dy) > 4 ? dy / max : 0
      };
      this.nub.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }

    vector() {
      return this.vectorValue;
    }

    wantsShoot() {
      return this.firing;
    }
  }

  Game.Input.TouchInput = TouchInput;
})(window);
