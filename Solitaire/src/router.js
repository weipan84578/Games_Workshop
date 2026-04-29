import { showScreen } from './ui/screenManager.js';

const routes = {
  menu: 'screen-menu',
  game: 'screen-game',
  settings: 'screen-settings',
  leaderboard: 'screen-leaderboard',
};

export function navigate(route) {
  if (routes[route]) showScreen(route);
}

export function initFloatingCards() {
  const container = document.getElementById('floating-cards-container');
  if (!container) return;
  const symbols = ['♠', '♥', '♦', '♣', 'A', 'K', 'Q', 'J'];
  for (let i = 0; i < 14; i++) {
    const card = document.createElement('div');
    card.className = 'floating-card';
    card.textContent = symbols[i % symbols.length];
    card.style.left = `${Math.random() * 100}%`;
    card.style.animationDuration = `${12 + Math.random() * 14}s`;
    card.style.animationDelay = `${-Math.random() * 20}s`;
    card.style.fontSize = `${1 + Math.random() * 1.2}rem`;
    card.style.transform = `rotate(${(Math.random() - 0.5) * 30}deg)`;
    if (i % 2 === 0) card.style.color = '#d63031';
    container.appendChild(card);
  }
}
