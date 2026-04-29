export function getAnimMultiplier() {
  const speed = document.documentElement.dataset.animSpeed || 'normal';
  if (speed === 'fast') return 0.5;
  if (speed === 'slow') return 2.0;
  return 1.0;
}

export function animDuration(ms) {
  return ms * getAnimMultiplier();
}

export function flyCard(cardEl, fromRect, toRect, duration = 200) {
  return new Promise(resolve => {
    const ghost = cardEl.cloneNode(true);
    ghost.style.cssText = `
      position: fixed;
      left: ${fromRect.left}px;
      top: ${fromRect.top}px;
      width: ${fromRect.width}px;
      height: ${fromRect.height}px;
      z-index: 9000;
      pointer-events: none;
      transition: left ${duration}ms ease-in-out, top ${duration}ms ease-in-out;
      margin: 0;
    `;
    document.body.appendChild(ghost);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ghost.style.left = `${toRect.left}px`;
        ghost.style.top = `${toRect.top}px`;
        ghost.style.width = `${toRect.width}px`;
        ghost.style.height = `${toRect.height}px`;
      });
    });
    setTimeout(() => {
      ghost.remove();
      resolve();
    }, duration + 20);
  });
}

export function bounceBack(el) {
  el.classList.add('card-bounce');
  setTimeout(() => el.classList.remove('card-bounce'), 300);
}

export function pulseHint(el) {
  el.classList.add('card-hint');
  setTimeout(() => el.classList.remove('card-hint'), 1600);
}

export function launchConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['#f44336','#e91e63','#9c27b0','#2196f3','#4caf50','#ffeb3b','#ff9800','#00bcd4'];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = `${2 + Math.random() * 2}s`;
    p.style.animationDelay = `${Math.random() * 1.5}s`;
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(p);
  }
  setTimeout(() => { container.innerHTML = ''; }, 5000);
}

export function dealAnimation(tableauEls) {
  tableauEls.forEach((colEl, ci) => {
    const cards = colEl.querySelectorAll('.card');
    cards.forEach((card, ri) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, (ci * 2 + ri) * 60);
    });
  });
}
