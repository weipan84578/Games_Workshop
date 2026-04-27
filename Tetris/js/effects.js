'use strict';

class Effects {
  constructor(overlay) {
    this.overlay = overlay;
    this.particles = [];
    this.running = false;
    this.raf = null;
  }

  // Floating text label on the game board overlay
  showFloatText(text, color) {
    const el = document.createElement('div');
    el.className = 'float-text';
    el.textContent = text;
    el.style.color = color;
    el.style.top = `${30 + Math.random() * 20}%`;
    this.overlay.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  showClearText(lines, isTSpin, isbtb, comboCount) {
    const colors = { 'TETRIS!': '#f0c040', tspin: '#a000f0', combo: '#f0a000', btb: '#00f0f0', normal: '#ffffff' };
    if (isTSpin) {
      const labels = ['T-SPIN','T-SPIN SINGLE','T-SPIN DOUBLE','T-SPIN TRIPLE'];
      this.showFloatText(labels[lines] ?? 'T-SPIN', colors.tspin);
    } else if (lines === 4) {
      this.showFloatText('TETRIS!', colors['TETRIS!']);
    } else if (lines > 0) {
      const labels = ['','SINGLE','DOUBLE','TRIPLE'];
      this.showFloatText(labels[lines] || '', colors.normal);
    }
    if (isbtb && lines > 0) this.showFloatText('BACK-TO-BACK!', colors.btb);
    if (comboCount > 0) this.showFloatText(`${comboCount} COMBO!`, colors.combo);
  }

  showLevelUp(level) {
    const el = document.createElement('div');
    el.className = 'float-text';
    el.textContent = `LEVEL UP!  ${level}`;
    el.style.color = '#f0c040';
    el.style.top = '40%';
    el.style.fontSize = '13px';
    this.overlay.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  flashBoard(wrapper) {
    wrapper.classList.remove('flash');
    void wrapper.offsetWidth; // reflow
    wrapper.classList.add('flash');
    wrapper.addEventListener('animationend', () => wrapper.classList.remove('flash'), { once: true });
  }

  // Row flash before clear (called from renderer's clearAnimation)
  // Managed externally via renderer
}
