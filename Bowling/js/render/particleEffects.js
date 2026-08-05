import { clamp } from "../utils/helpers.js";

const COLORS = ["#ffb6d9", "#fff3b0", "#b8e8fc", "#ff9e6d", "#ffffff"];

export function createParticleSystem({ maxParticles = 90 } = {}) {
  let particles = [];

  function emit({ x = 0.5, y = 0.4, count = 18, kind = "spark" } = {}) {
    const amount = Math.min(count, maxParticles - particles.length);
    for (let index = 0; index < amount; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.08 + Math.random() * 0.18;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.08,
        life: 0.55 + Math.random() * 0.55,
        age: 0,
        size: kind === "confetti" ? 0.012 + Math.random() * 0.014 : 0.006 + Math.random() * 0.01,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 8,
        color: COLORS[index % COLORS.length],
        kind,
      });
    }
  }

  function update(deltaSeconds) {
    particles = particles
      .map((particle) => ({
        ...particle,
        age: particle.age + deltaSeconds,
        x: particle.x + particle.vx * deltaSeconds,
        y: particle.y + particle.vy * deltaSeconds,
        vy: particle.vy + 0.3 * deltaSeconds,
        rotation: particle.rotation + particle.spin * deltaSeconds,
      }))
      .filter((particle) => particle.age < particle.life);
  }

  function draw(context, width, height) {
    particles.forEach((particle) => {
      const alpha = clamp(1 - particle.age / particle.life, 0, 1);
      context.save();
      context.translate(particle.x * width, particle.y * height);
      context.rotate(particle.rotation);
      context.globalAlpha = alpha;
      context.fillStyle = particle.color;
      if (particle.kind === "confetti") {
        context.fillRect(-particle.size * width, -particle.size * height * 0.45, particle.size * width * 2, particle.size * height * 0.9);
      } else {
        context.beginPath();
        context.arc(0, 0, particle.size * width, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    });
    context.globalAlpha = 1;
  }

  return {
    emit,
    update,
    draw,
    clear: () => { particles = []; },
    getParticles: () => particles.map((particle) => ({ ...particle })),
  };
}
