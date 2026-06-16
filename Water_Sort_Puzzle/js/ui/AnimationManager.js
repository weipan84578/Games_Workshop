export const AnimationManager = {
  markPour(container, from, to, color = 'cyan') {
    const source = container.querySelector(`[data-tube="${from}"]`);
    const target = container.querySelector(`[data-tube="${to}"]`);
    if (!source || !target) return;

    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const direction = targetRect.left >= sourceRect.left ? 1 : -1;
    const startX = sourceRect.left + sourceRect.width * (direction > 0 ? 0.72 : 0.28);
    const startY = sourceRect.top + sourceRect.height * 0.08;
    const endX = targetRect.left + targetRect.width * 0.5;
    const endY = targetRect.top + targetRect.height * 0.11;
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.max(36, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const bend = Math.min(96, Math.max(34, Math.abs(dx) * 0.22 + 18));
    const stream = document.createElement('span');
    const splash = document.createElement('span');

    source.classList.add(direction > 0 ? 'tube--pour-right' : 'tube--pour-left');
    target?.classList.add('tube--target');
    stream.className = `pour-arc tube__layer--${color}`;
    stream.style.left = `${startX}px`;
    stream.style.top = `${startY}px`;
    stream.style.width = `${length}px`;
    stream.style.setProperty('--pour-bend', `${bend}px`);
    stream.style.setProperty('--pour-angle', `${angle}deg`);
    splash.className = `pour-splash tube__layer--${color}`;
    splash.style.left = `${endX}px`;
    splash.style.top = `${endY}px`;
    document.body.append(stream);
    splash.style.color = getComputedStyle(stream).backgroundColor;
    document.body.append(splash);

    window.setTimeout(() => {
      stream.remove();
      splash.remove();
      source?.classList.remove('tube--pour-right');
      source?.classList.remove('tube--pour-left');
      target?.classList.remove('tube--target');
    }, 820);
  },
};
