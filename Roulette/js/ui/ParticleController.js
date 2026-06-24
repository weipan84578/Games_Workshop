(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};
  const { randomPick } = R;

  class ParticleController {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.particles = [];
      this.running = false;
      this.resize = this.resize.bind(this);
      window.addEventListener("resize", this.resize);
      this.resize();
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = Math.floor(window.innerWidth * dpr);
      this.canvas.height = Math.floor(window.innerHeight * dpr);
      this.canvas.style.width = `${window.innerWidth}px`;
      this.canvas.style.height = `${window.innerHeight}px`;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    burst(x = window.innerWidth / 2, y = window.innerHeight / 2) {
      const colors = ["#ffd700", "#ffa500", "#ff6b6b", "#4caf50", "#ffffff"];
      for (let i = 0; i < 48; i += 1) {
        this.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 12,
          vy: -Math.random() * 9 - 3,
          size: Math.random() * 7 + 3,
          color: randomPick(colors),
          life: 1,
          decay: 0.018 + Math.random() * 0.025,
        });
      }
      if (!this.running) this.animate();
    }

    animate() {
      this.running = true;
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.particles = this.particles.filter((particle) => particle.life > 0);
      this.particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.28;
        particle.life -= particle.decay;
        this.ctx.globalAlpha = Math.max(0, particle.life);
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
      this.ctx.globalAlpha = 1;
      if (this.particles.length) {
        requestAnimationFrame(() => this.animate());
      } else {
        this.running = false;
      }
    }
  }

  Object.assign(R, { ParticleController });
})();
