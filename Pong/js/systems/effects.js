(function () {
  const Effects = {
    emit(x, y, color, count) {
      const particles = Pong.GameState.effects.particles;
      for (let index = 0; index < count; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Pong.Math.randomRange(1, 5);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: Pong.Math.randomRange(280, 680),
          maxLife: 680,
          radius: Pong.Math.randomRange(1.5, 4),
          color
        });
      }
    },

    scoreFlash() {
      const app = Pong.DOM.app();
      app.classList.remove("screen-flash");
      void app.offsetWidth;
      app.classList.add("screen-flash");
      window.setTimeout(() => app.classList.remove("screen-flash"), 430);
    },

    vibrate(pattern) {
      const settings = Pong.GameState.settings;
      if (settings && settings.vibration && navigator.vibrate) {
        navigator.vibrate(pattern || 24);
      }
    },

    update(deltaMs) {
      const particles = Pong.GameState.effects.particles;
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.life -= deltaMs;
        particle.x += particle.vx * (deltaMs / 16.6667);
        particle.y += particle.vy * (deltaMs / 16.6667);
        particle.vx *= 0.985;
        particle.vy *= 0.985;
        if (particle.life <= 0) {
          particles.splice(index, 1);
        }
      }
    },

    render(ctx) {
      const particles = Pong.GameState.effects.particles;
      ctx.save();
      particles.forEach((particle) => {
        const alpha = Math.max(0, particle.life / particle.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    },

    recordFrame(deltaMs) {
      const effects = Pong.GameState.effects;
      effects.frames += 1;
      effects.fpsTime += deltaMs;
      if (effects.fpsTime >= 500) {
        effects.fps = Math.round((effects.frames * 1000) / effects.fpsTime);
        effects.frames = 0;
        effects.fpsTime = 0;
        Pong.GameScreen.updateFPS(effects.fps);
      }
    }
  };

  window.Pong = window.Pong || {};
  window.Pong.Effects = Effects;
})();
