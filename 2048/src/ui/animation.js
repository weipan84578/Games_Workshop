const Animation = (() => {
  const SPEED_MAP = { slow: 250, normal: 150, fast: 80, none: 0 };

  function getDuration() {
    return SPEED_MAP[SettingsStore.get('animSpeed')] ?? 150;
  }

  function applyDuration() {
    const d = getDuration();
    document.documentElement.style.setProperty('--anim-duration', d + 'ms');
    document.documentElement.style.setProperty('--new-anim-duration', Math.round(d * 1.3) + 'ms');
  }

  function spawnConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#f67c5f','#edcf72','#f2b179','#edc22e','#5ba8d5','#5d8a5e','#e94560'];
    for (let i = 0; i < 80; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width = (Math.random() * 8 + 6) + 'px';
      el.style.height = (Math.random() * 8 + 6) + 'px';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      const dur = (Math.random() * 2 + 1.5).toFixed(2);
      el.style.animationDuration = dur + 's';
      el.style.animationDelay = (Math.random() * 1).toFixed(2) + 's';
      container.appendChild(el);
    }
    setTimeout(() => { container.innerHTML = ''; }, 4000);
  }

  function spawnScoreFloat(el, amount) {
    const container = document.getElementById('score-floats');
    const rect = el.getBoundingClientRect();
    const wrapRect = document.getElementById('board-wrapper').getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'score-float';
    f.textContent = '+' + amount;
    f.style.left = (rect.left - wrapRect.left + rect.width / 2) + 'px';
    f.style.top = (rect.top - wrapRect.top) + 'px';
    container.appendChild(f);
    setTimeout(() => f.remove(), 900);
  }

  return { applyDuration, spawnConfetti, spawnScoreFloat, getDuration };
})();
