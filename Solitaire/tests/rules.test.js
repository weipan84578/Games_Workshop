import { describe, it, expect } from 'vitest';
import { canMoveToTableau, canMoveToFoundation, getMovableCards } from '../src/game/rules.js';

describe('canMoveToTableau', () => {
  it('allows K on empty pile', () => {
    const king = { rank: 13, color: 'black', faceUp: true };
    expect(canMoveToTableau(king, [])).toBe(true);
  });
  it('disallows non-K on empty pile', () => {
    const queen = { rank: 12, color: 'red', faceUp: true };
    expect(canMoveToTableau(queen, [])).toBe(false);
  });
  it('allows valid color-alternating sequence', () => {
    const target = { rank: 8, color: 'black', faceUp: true };
    const card = { rank: 7, color: 'red' };
    expect(canMoveToTableau(card, [target])).toBe(true);
  });
  it('disallows same color', () => {
    const target = { rank: 8, color: 'black', faceUp: true };
    const card = { rank: 7, color: 'black' };
    expect(canMoveToTableau(card, [target])).toBe(false);
  });
  it('disallows non-sequential rank', () => {
    const target = { rank: 8, color: 'black', faceUp: true };
    const card = { rank: 6, color: 'red' };
    expect(canMoveToTableau(card, [target])).toBe(false);
  });
});

describe('canMoveToFoundation', () => {
  it('allows Ace on empty foundation', () => {
    const ace = { rank: 1, suit: 'H' };
    expect(canMoveToFoundation(ace, [])).toBe(true);
  });
  it('allows sequential same-suit', () => {
    const top = { rank: 5, suit: 'H' };
    const card = { rank: 6, suit: 'H' };
    expect(canMoveToFoundation(card, [top])).toBe(true);
  });
  it('disallows wrong suit', () => {
    const top = { rank: 5, suit: 'H' };
    const card = { rank: 6, suit: 'S' };
    expect(canMoveToFoundation(card, [top])).toBe(false);
  });
});
