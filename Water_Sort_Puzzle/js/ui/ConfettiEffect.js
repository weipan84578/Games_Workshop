const COLORS = ['#ff4757', '#ffc312', '#12cbc4', '#9980fa', '#a3cb38', '#fda7df', '#00b4d8', '#ff6b35'];

export const ConfettiEffect = {
  play(duration = 2600) {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    const ctx = canvas.getContext('2d');
    const particles = [];
    const start = performance.now();

    function resize() {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);
    document.body.append(canvas);

    function addParticle(originX, originY, burst) {
      const angle = burst ? Math.random() * Math.PI * 2 : Math.PI * 0.5 + (Math.random() - 0.5) * 0.9;
      const speed = burst ? 4 + Math.random() * 8 : 1.5 + Math.random() * 4;
      const streamer = Math.random() > 0.62;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (burst ? 5 : 0),
        width: streamer ? 5 + Math.random() * 5 : 5 + Math.random() * 8,
        height: streamer ? 22 + Math.random() * 26 : 5 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        spin: Math.random() * Math.PI,
        spinSpeed: -0.22 + Math.random() * 0.44,
        wave: Math.random() * Math.PI * 2,
        gravity: streamer ? 0.035 : 0.055,
        alpha: 0.82 + Math.random() * 0.18,
      });
    }

    for (let i = 0; i < 150; i += 1) {
      addParticle(Math.random() * window.innerWidth, -24 - Math.random() * window.innerHeight * 0.25, false);
    }
    for (let i = 0; i < 110; i += 1) {
      addParticle(window.innerWidth * 0.5, window.innerHeight * 0.38, true);
    }

    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.wave += 0.08;
        p.x += p.vx;
        p.y += p.vy;
        p.x += Math.sin(p.wave) * 0.55;
        p.vy += p.gravity;
        p.spin += p.spinSpeed;
        ctx.save();
        ctx.globalAlpha = p.alpha * Math.max(0, 1 - elapsed / duration);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.restore();
      });

      if (elapsed < duration) {
        requestAnimationFrame(frame);
      } else {
        window.removeEventListener('resize', resize);
        canvas.remove();
      }
    }

    requestAnimationFrame(frame);
  },
};
