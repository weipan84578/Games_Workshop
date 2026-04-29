// Click-to-move logic is handled in main.js (handleCardClick / handleDoubleClick).
// This module can be used to export utilities if needed.

export function isClickable(cardEl) {
  return !cardEl.classList.contains('card-back') || cardEl.dataset.pile?.startsWith('tableau_');
}
