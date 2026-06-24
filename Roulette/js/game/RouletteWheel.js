(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};
  const { clamp, getResultColor, getWheelOrder, lerp } = R;

  class RouletteWheel {
    constructor(canvas, settingsManager) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.settingsManager = settingsManager;
      this.innerAngle = 0;
      this.ballAngle = -Math.PI / 2;
      this.ballRadiusRatio = 0.76;
      this.spinning = false;
      this.order = getWheelOrder(settingsManager.settings.wheelType);
      this.resize = this.resize.bind(this);
      window.addEventListener("resize", this.resize);
      this.resize();
    }

    setWheelType(type) {
      this.order = getWheelOrder(type);
      this.draw();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const size = Math.max(260, Math.floor(rect.width || 420));
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = Math.floor(size * dpr);
      this.canvas.height = Math.floor(size * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.size = size;
      this.draw();
    }

    spin(result, speed = "normal") {
      if (this.spinning) return Promise.resolve(result);
      this.spinning = true;
      const durationMap = { slow: 7000, normal: 5400, fast: 3800 };
      const duration = durationMap[speed] || durationMap.normal;
      const start = performance.now();
      const startAngle = this.innerAngle;
      const rotations = 9 + Math.random() * 4;
      const finalAngle = startAngle + rotations * Math.PI * 2;
      const startBall = this.ballAngle;

      return new Promise((resolve) => {
        const step = (now) => {
          const progress = clamp((now - start) / duration, 0, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const wobble = Math.sin(progress * Math.PI * 40) * (1 - progress) * 0.035;
          this.innerAngle = startAngle + (finalAngle - startAngle) * eased;
          this.ballAngle = startBall - rotations * Math.PI * 2 * 1.4 * eased + wobble;
          this.ballRadiusRatio = progress < 0.65 ? 0.83 : lerp(0.83, 0.64, (progress - 0.65) / 0.35);
          this.draw();
          if (progress < 1) {
            requestAnimationFrame(step);
            return;
          }
          this.spinning = false;
          this.innerAngle = finalAngle % (Math.PI * 2);
          this.ballAngle = this.angleForResult(result);
          this.ballRadiusRatio = 0.64;
          this.draw(result);
          resolve(result);
        };
        requestAnimationFrame(step);
      });
    }

    angleForResult(result) {
      const index = this.order.findIndex((value) => String(value) === String(result));
      const safeIndex = Math.max(0, index);
      const segment = (Math.PI * 2) / this.order.length;
      return -Math.PI / 2 + this.innerAngle + safeIndex * segment + segment / 2;
    }

    draw(highlightResult = null) {
      if (!this.ctx || !this.size) return;
      const ctx = this.ctx;
      const size = this.size;
      const center = size / 2;
      const outer = size * 0.48;
      const pocketOuter = outer * 0.86;
      const pocketInner = outer * 0.5;
      const colors = getComputedStyle(document.documentElement);
      const wheelBase = colors.getPropertyValue("--color-wheel-base").trim();
      const wheelAccent = colors.getPropertyValue("--color-wheel-accent").trim();
      const red = colors.getPropertyValue("--color-number-red").trim();
      const black = colors.getPropertyValue("--color-number-black").trim();
      const green = colors.getPropertyValue("--color-number-green").trim();
      const border = colors.getPropertyValue("--color-table-border").trim();
      ctx.clearRect(0, 0, size, size);

      const baseGradient = ctx.createRadialGradient(center * 0.8, center * 0.72, outer * 0.1, center, center, outer);
      baseGradient.addColorStop(0, "#f5d985");
      baseGradient.addColorStop(0.22, wheelAccent);
      baseGradient.addColorStop(0.45, wheelBase);
      baseGradient.addColorStop(0.74, border);
      baseGradient.addColorStop(1, "#2b160b");
      ctx.beginPath();
      ctx.arc(center, center, outer, 0, Math.PI * 2);
      ctx.fillStyle = baseGradient;
      ctx.fill();
      ctx.lineWidth = outer * 0.04;
      ctx.strokeStyle = "rgba(255,255,255,0.24)";
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(this.innerAngle);
      const segment = (Math.PI * 2) / this.order.length;
      this.order.forEach((number, index) => {
        const start = -Math.PI / 2 + index * segment;
        const end = start + segment;
        const color = getResultColor(number);
        ctx.beginPath();
        ctx.arc(0, 0, pocketOuter, start, end);
        ctx.arc(0, 0, pocketInner, end, start, true);
        ctx.closePath();
        ctx.fillStyle = color === "green" ? green : color === "red" ? red : black;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 1;
        ctx.stroke();

        const mid = start + segment / 2;
        ctx.save();
        ctx.rotate(mid);
        ctx.translate((pocketOuter + pocketInner) / 2, 0);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = "#fff7dc";
        ctx.font = `800 ${Math.max(11, size * 0.03)}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(number), 0, 0);
        ctx.restore();

        if (highlightResult !== null && String(highlightResult) === String(number)) {
          ctx.beginPath();
          ctx.arc(0, 0, pocketOuter, start, end);
          ctx.arc(0, 0, pocketInner, end, start, true);
          ctx.closePath();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });
      ctx.restore();

      ctx.beginPath();
      ctx.arc(center, center, outer * 0.48, 0, Math.PI * 2);
      const innerGradient = ctx.createRadialGradient(center * 0.9, center * 0.82, outer * 0.05, center, center, outer * 0.48);
      innerGradient.addColorStop(0, "#ffe7a4");
      innerGradient.addColorStop(0.42, wheelAccent);
      innerGradient.addColorStop(1, "#5b4215");
      ctx.fillStyle = innerGradient;
      ctx.fill();

      for (let i = 0; i < 12; i += 1) {
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(this.innerAngle * -0.65 + i * Math.PI / 6);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(outer * 0.16, outer * 0.05, outer * 0.32, 0);
        ctx.quadraticCurveTo(outer * 0.16, -outer * 0.05, 0, 0);
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fill();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(center, center, outer * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = wheelBase;
      ctx.fill();
      ctx.strokeStyle = wheelAccent;
      ctx.lineWidth = 3;
      ctx.stroke();

      const ballRadius = Math.max(5, size * 0.018);
      const ballDistance = outer * this.ballRadiusRatio;
      const bx = center + Math.cos(this.ballAngle) * ballDistance;
      const by = center + Math.sin(this.ballAngle) * ballDistance;
      const ballGradient = ctx.createRadialGradient(bx - ballRadius * 0.4, by - ballRadius * 0.45, 1, bx, by, ballRadius * 1.25);
      ballGradient.addColorStop(0, "#ffffff");
      ballGradient.addColorStop(0.45, "#e5e5e5");
      ballGradient.addColorStop(1, "#777777");
      ctx.beginPath();
      ctx.arc(bx, by, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = ballGradient;
      ctx.fill();
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    }
  }

  Object.assign(R, { RouletteWheel });
})();
