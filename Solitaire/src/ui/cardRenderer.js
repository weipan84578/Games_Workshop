const SUIT_SYM = { S: '♠', H: '♥', D: '♦', C: '♣' };
const RANK_DISP = { A: 'A', T: '10', J: 'J', Q: 'Q', K: 'K' };

// Pip positions [left%, top%, flipped?] for each rank
// Coordinates are relative to the full card face (position: absolute, inset:0)
const PIP_POSITIONS = {
  '2': [[50, 24, false], [50, 76, true]],
  '3': [[50, 24, false], [50, 50, false], [50, 76, true]],
  '4': [[30, 28, false], [70, 28, false], [30, 72, true], [70, 72, true]],
  '5': [[30, 28, false], [70, 28, false], [50, 50, false], [30, 72, true], [70, 72, true]],
  '6': [[30, 24, false], [70, 24, false], [30, 50, false], [70, 50, false], [30, 76, true], [70, 76, true]],
  '7': [[30, 21, false], [70, 21, false], [50, 35, false], [30, 50, false], [70, 50, false], [30, 79, true], [70, 79, true]],
  '8': [[30, 21, false], [70, 21, false], [50, 35, false], [30, 50, false], [70, 50, false], [50, 65, true], [30, 79, true], [70, 79, true]],
  '9': [[30, 19, false], [70, 19, false], [30, 37, false], [70, 37, false], [50, 50, false], [30, 63, true], [70, 63, true], [30, 81, true], [70, 81, true]],
  'T': [[30, 19, false], [70, 19, false], [50, 28, false], [30, 37, false], [70, 37, false], [30, 63, true], [70, 63, true], [50, 72, true], [30, 81, true], [70, 81, true]],
};

export function rankDisplay(rankStr) {
  return RANK_DISP[rankStr] || rankStr;
}

function buildCardCenter(rankStr, suitSym) {
  if (['J', 'Q', 'K'].includes(rankStr)) {
    return `<div class="card-face-design">
      <span class="card-face-letter">${rankStr}</span>
      <span class="card-face-suit">${suitSym}</span>
    </div>`;
  }
  if (rankStr === 'A') {
    return `<div class="card-center-sym">${suitSym}</div>`;
  }
  const positions = PIP_POSITIONS[rankStr];
  if (!positions) return `<div class="card-center-sym">${suitSym}</div>`;
  return positions.map(([x, y, flip]) =>
    `<span class="card-pip${flip ? ' card-pip-flip' : ''}" style="left:${x}%;top:${y}%">${suitSym}</span>`
  ).join('');
}

export function createCardEl(card, opts = {}) {
  const el = document.createElement('div');
  el.className = 'card';
  el.dataset.cardId = card.id;

  if (!card.faceUp) {
    el.classList.add('card-back');
    const back = opts.cardBack || 'blue-diamond';
    el.innerHTML = `<div class="card-back-inner back-${back}"></div>`;
    return el;
  }

  el.classList.add('card-face', `card-${card.color}`);
  const r = rankDisplay(card.rankStr);
  const s = SUIT_SYM[card.suit];
  el.innerHTML = `
    <div class="card-corner card-tl">
      <span class="card-rank">${r}</span>
      <span class="card-suit-sm">${s}</span>
    </div>
    ${buildCardCenter(card.rankStr, s)}
    <div class="card-corner card-br">
      <span class="card-rank">${r}</span>
      <span class="card-suit-sm">${s}</span>
    </div>`;

  if (opts.selected) el.classList.add('card-selected');
  if (opts.hint) el.classList.add('card-hint');
  if (opts.validDrop) el.classList.add('card-valid-drop');
  return el;
}

export function createPileEmptyEl(type, idx) {
  const el = document.createElement('div');
  el.className = 'pile-empty-inner';
  if (type === 'foundation') {
    const sym = ['♠', '♥', '♦', '♣'];
    el.innerHTML = `<span class="pile-sym">${sym[idx]}</span>`;
  } else if (type === 'stock-recycle') {
    el.innerHTML = `<span class="pile-sym" title="點擊循環">↺</span>`;
  } else if (type === 'stock-empty') {
    el.innerHTML = `<span class="pile-sym" style="opacity:0.3" title="無牌可抽">✕</span>`;
  }
  return el;
}
