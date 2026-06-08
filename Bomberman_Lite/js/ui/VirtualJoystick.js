(function () {
  "use strict";

  const root = window.BML || (window.BML = {});

  class VirtualJoystick {
    constructor(host, touchInput, game) {
      this.host = host;
      this.touchInput = touchInput;
      this.game = game;
      this.activePointer = null;
      this.mount();
    }

    mount() {
      this.host.innerHTML = `
        <div class="touch-controls auto-hide" data-touch-controls>
          <div class="joystick" data-joystick><div class="joystick-knob" data-knob></div></div>
          <div class="touch-action-group">
            <button class="touch-button" data-bomb title="放置炸彈">B</button>
          </div>
        </div>
      `;
      this.controls = this.host.querySelector("[data-touch-controls]");
      this.pad = this.host.querySelector("[data-joystick]");
      this.knob = this.host.querySelector("[data-knob]");
      this.bind();
      this.applySettings(this.game.settings);
    }

    bind() {
      this.pad.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        this.activePointer = event.pointerId;
        this.pad.setPointerCapture(event.pointerId);
        this.updateDirection(event);
      });
      this.pad.addEventListener("pointermove", (event) => {
        if (event.pointerId === this.activePointer) this.updateDirection(event);
      });
      const release = (event) => {
        if (event.pointerId !== this.activePointer) return;
        this.activePointer = null;
        this.touchInput.setDirection({ x: 0, y: 0 });
        this.knob.style.transform = "translate(-50%, -50%)";
      };
      this.pad.addEventListener("pointerup", release);
      this.pad.addEventListener("pointercancel", release);
      this.host.querySelector("[data-bomb]").addEventListener("pointerdown", (event) => {
        event.preventDefault();
        this.touchInput.pressBomb();
        this.game.vibrate(25);
      });
    }

    updateDirection(event) {
      const rect = this.pad.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const max = rect.width * 0.34;
      const length = Math.min(max, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);
      const x = Math.cos(angle) * length;
      const y = Math.sin(angle) * length;
      this.knob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      this.touchInput.setDirection({ x: dx / max, y: dy / max });
    }

    applySettings(settings) {
      this.controls.classList.toggle("hidden", !settings.showJoystick);
    }
  }

  root.VirtualJoystick = VirtualJoystick;
}());
