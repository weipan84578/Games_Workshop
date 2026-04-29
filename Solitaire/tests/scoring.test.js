import { describe, it, expect } from 'vitest';
import { SCORE, clamp, calcTimeBonus, calcStars } from '../src/game/scoring.js';

describe('scoring constants', () => {
  it('WASTE_TO_TABLEAU is 5', () => expect(SCORE.WASTE_TO_TABLEAU).toBe(5));
  it('TABLEAU_TO_FOUNDATION is 10', () => expect(SCORE.TABLEAU_TO_FOUNDATION).toBe(10));
  it('FOUNDATION_TO_TABLEAU is -15', () => expect(SCORE.FOUNDATION_TO_TABLEAU).toBe(-15));
});

describe('clamp', () => {
  it('does not go below 0', () => expect(clamp(-50)).toBe(0));
  it('keeps positive values', () => expect(clamp(300)).toBe(300));
});

describe('calcTimeBonus', () => {
  it('returns 0 for 0 seconds', () => expect(calcTimeBonus(0)).toBe(0));
  it('returns positive bonus for fast completion', () => expect(calcTimeBonus(60)).toBeGreaterThan(0));
});

describe('calcStars', () => {
  it('awards 5 stars for fast low-time high-score', () => expect(calcStars(120, 9000, 1)).toBe(5));
  it('awards 1 star just for completing', () => expect(calcStars(1800, 100, 1)).toBe(1));
});
