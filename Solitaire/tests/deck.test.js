import { describe, it, expect } from 'vitest';
import { createDeck, shuffle, dealInitialState } from '../src/game/deck.js';

describe('createDeck', () => {
  it('creates 52 unique cards', () => {
    const deck = createDeck();
    expect(deck.length).toBe(52);
    const ids = new Set(deck.map(c => c.id));
    expect(ids.size).toBe(52);
  });
  it('assigns correct colors', () => {
    const deck = createDeck();
    deck.filter(c => c.suit === 'H' || c.suit === 'D').forEach(c => expect(c.color).toBe('red'));
    deck.filter(c => c.suit === 'S' || c.suit === 'C').forEach(c => expect(c.color).toBe('black'));
  });
});

describe('shuffle', () => {
  it('returns same number of cards', () => {
    const deck = createDeck();
    expect(shuffle(deck).length).toBe(52);
  });
  it('does not modify original', () => {
    const deck = createDeck();
    const first = deck[0].id;
    shuffle(deck);
    expect(deck[0].id).toBe(first);
  });
});

describe('dealInitialState', () => {
  it('deals 28 cards to tableaus', () => {
    const deck = shuffle(createDeck());
    const { tableaus, stock } = dealInitialState(deck);
    const total = tableaus.reduce((sum, col) => sum + col.length, 0);
    expect(total).toBe(28);
    expect(stock.length).toBe(24);
  });
  it('only top card of each column is face-up', () => {
    const deck = shuffle(createDeck());
    const { tableaus } = dealInitialState(deck);
    tableaus.forEach(col => {
      col.slice(0, -1).forEach(c => expect(c.faceUp).toBe(false));
      expect(col[col.length - 1].faceUp).toBe(true);
    });
  });
});
