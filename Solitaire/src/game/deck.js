const SUITS = ['S', 'H', 'D', 'C'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
const RANK_VALUES = { A:1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,T:10,J:11,Q:12,K:13 };
const SUIT_COLORS = { S:'black', H:'red', D:'red', C:'black' };

export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: rank + suit, suit, rank: RANK_VALUES[rank], rankStr: rank, color: SUIT_COLORS[suit], faceUp: false });
    }
  }
  return deck;
}

export function shuffle(deck) {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function dealInitialState(shuffledDeck) {
  const tableaus = Array.from({ length: 7 }, () => []);
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...shuffledDeck[idx++] };
      card.faceUp = (row === col);
      tableaus[col].push(card);
    }
  }
  const stock = shuffledDeck.slice(idx).map(c => ({ ...c, faceUp: false }));
  return { tableaus, stock };
}
