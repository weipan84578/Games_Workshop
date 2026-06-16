const COLORS = ['#ff4757', '#ffc312', '#12cbc4', '#9980fa', '#a3cb38', '#fda7df'];

export const ConfettiEffect = {
  play(duration = 1600) {
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

    for (let i = 0; i < 120; i += 1) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.35,
        vx: -2 + Math.random() * 4,
        vy: 2 + Math.random() * 4,
        size: 5 + Math.random() * 7,
        color: COLORS[i % COLORS.length],
        spin: Math.random() * Math.PI,
      });
    }

    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.035;
        p.spin += 0.18;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55);
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
