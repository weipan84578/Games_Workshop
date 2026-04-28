const Renderer = (() => {
  let boardEl, tileEls, size;

  function buildBoard(s) {
    size = s;
    boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      boardEl.appendChild(cell);
    }
    document.documentElement.style.setProperty('--radius', SettingsStore.get('radius') + 'px');
  }

  function getCellPos(r, c) {
    const boardRect = boardEl.getBoundingClientRect();
    const cells = boardEl.querySelectorAll('.cell');
    const cell = cells[r * size + c];
    const cellRect = cell.getBoundingClientRect();
    return {
      left: cellRect.left - boardRect.left,
      top: cellRect.top - boardRect.top,
      width: cellRect.width,
      height: cellRect.height,
    };
  }

  function render(grid, prevGrid, mergedPositions = [], newTilePos = null) {
    if (!boardEl) return;

    const duration = Animation.getDuration();
    const boardRect = boardEl.getBoundingClientRect();

    // Remove old tiles
    boardEl.querySelectorAll('.tile').forEach(t => t.remove());

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = grid[r][c];
        if (!val) continue;

        const { left, top, width, height } = getCellPos(r, c);
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.setAttribute('data-val', val);
        tile.style.left = left + 'px';
        tile.style.top = top + 'px';
        tile.style.width = width + 'px';
        tile.style.height = height + 'px';
        tile.style.fontSize = getFontSize(val, width);

        const isMerged = mergedPositions && mergedPositions.some(m => m.r === r && m.c === c);
        const isNew = newTilePos && newTilePos[0] === r && newTilePos[1] === c;

        if (isNew) tile.classList.add('tile-new');
        else if (isMerged) tile.classList.add('tile-merge');

        tile.textContent = val;
        boardEl.appendChild(tile);
      }
    }
  }

  function getFontSize(val, width) {
    const digits = String(val).length;
    const base = width * 0.35;
    const scale = Math.max(0.5, 1 - (digits - 1) * 0.15);
    return Math.round(base * scale) + 'px';
  }

  function applyTheme() {
    const theme = SettingsStore.get('theme');
    document.body.className = document.body.className
      .replace(/\btheme-\S+/g, '')
      .replace(/\bhigh-contrast\b/g, '')
      .replace(/\bshow-grid\b/g, '')
      .trim();

    if (theme !== 'classic') document.body.classList.add('theme-' + theme);
    if (SettingsStore.get('highContrast')) document.body.classList.add('high-contrast');
    if (SettingsStore.get('showGrid')) document.body.classList.add('show-grid');
    document.documentElement.style.setProperty('--radius', SettingsStore.get('radius') + 'px');
    Animation.applyDuration();
  }

  return { buildBoard, render, applyTheme, getCellPos };
})();
