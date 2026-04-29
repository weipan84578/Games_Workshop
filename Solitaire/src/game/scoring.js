export const SCORE = {
  WASTE_TO_TABLEAU: 5,
  WASTE_TO_FOUNDATION: 10,
  TABLEAU_TO_FOUNDATION: 10,
  FOUNDATION_TO_TABLEAU: -15,
  FLIP_CARD: 5,
  USE_HINT: -10,
  UNDO: -15,
  DRAW3_RECYCLE: -20,
};

export function calcTimeBonus(timeSeconds) {
  if (timeSeconds <= 0) return 0;
  return Math.max(0, Math.floor(700000 / timeSeconds));
}

export function clamp(score) {
  return Math.max(0, score);
}

export function calcStars(timeSeconds, score, drawMode) {
  if (drawMode === 1) {
    if (timeSeconds < 180 && score > 8000) return 5;
    if (timeSeconds < 300 && score > 6000) return 4;
    if (timeSeconds < 480) return 3;
    if (timeSeconds < 900) return 2;
    return 1;
  } else {
    if (timeSeconds < 300 && score > 6000) return 5;
    if (timeSeconds < 480 && score > 4000) return 4;
    if (timeSeconds < 720) return 3;
    if (timeSeconds < 1200) return 2;
    return 1;
  }
}
