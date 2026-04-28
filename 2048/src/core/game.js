const Game = (() => {
  let size, grid, score, moves, won, over, undoStack, undoLimit, goal, continueAfterWin;

  function init(cfg = {}) {
    size = cfg.size || SettingsStore.get('size');
    goal = cfg.goal || SettingsStore.get('goal');
    undoLimit = cfg.undoLimit !== undefined ? cfg.undoLimit : SettingsStore.get('undoLimit');
    continueAfterWin = cfg.continueAfterWin !== undefined ? cfg.continueAfterWin : SettingsStore.get('continueAfterWin');
    grid = Array.from({ length: size }, () => Array(size).fill(0));
    score = 0;
    moves = 0;
    won = false;
    over = false;
    undoStack = [];
    addTile();
    addTile();
  }

  function addTile() {
    const empties = [];
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        if (grid[r][c] === 0) empties.push([r, c]);
    if (!empties.length) return null;
    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return [r, c];
  }

  function cloneGrid() {
    return grid.map(row => [...row]);
  }

  function slideRow(row) {
    const filtered = row.filter(v => v !== 0);
    const merged = [];
    const mergeIndices = new Set();
    let gained = 0;
    let i = 0;
    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const val = filtered[i] * 2;
        merged.push(val);
        mergeIndices.add(merged.length - 1);
        gained += val;
        i += 2;
      } else {
        merged.push(filtered[i]);
        i++;
      }
    }
    while (merged.length < size) merged.push(0);
    return { row: merged, mergeIndices, gained };
  }

  function move(dir) {
    if (over) return { moved: false, merged: [], newTile: null };

    const prevGrid = cloneGrid();
    let totalGained = 0;
    let moved = false;
    const mergedCells = [];

    const rotate = (g) => g[0].map((_, c) => g.map(row => row[c]).reverse());
    const rotateBack = (g) => g[0].map((_, c) => g.map(row => row[row.length - 1 - c]));

    let rotated = cloneGrid();
    let rotations = { left: 0, right: 2, up: 3, down: 1 }[dir];
    for (let i = 0; i < rotations; i++) rotated = rotate(rotated);

    const newGrid = rotated.map((row, r) => {
      const { row: newRow, mergeIndices, gained } = slideRow(row);
      totalGained += gained;
      for (let c = 0; c < size; c++) {
        if (newRow[c] !== rotated[r][c]) moved = true;
        if (mergeIndices.has(c)) mergedCells.push({ r, c, val: newRow[c] });
      }
      return newRow;
    });

    let finalGrid = newGrid;
    for (let i = 0; i < rotations; i++) finalGrid = rotateBack(finalGrid);

    if (!moved) return { moved: false, merged: [], newTile: null };

    // Convert merged cell coords from rotated (CW) space back to original grid space via CCW
    const finalMerged = mergedCells.map(({ r, c, val }) => {
      let pr = r, pc = c;
      for (let i = 0; i < rotations; i++) {
        [pr, pc] = [size - 1 - pc, pr];
      }
      return { r: pr, c: pc, val };
    });

    if (undoLimit > 0) {
      undoStack.push({ grid: prevGrid, score, moves });
      if (undoStack.length > (undoLimit === 99 ? 999 : undoLimit)) undoStack.shift();
    }

    grid = finalGrid;
    score += totalGained;
    moves++;

    const newPos = addTile();
    if (!won && grid.some(row => row.includes(goal))) won = true;
    if (!canMove()) over = true;

    return { moved: true, merged: finalMerged, newTile: newPos, gained: totalGained };
  }

  function undo() {
    if (!undoStack.length) return false;
    const prev = undoStack.pop();
    grid = prev.grid;
    score = prev.score;
    moves = prev.moves;
    over = false;
    return true;
  }

  function canMove() {
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === 0) return true;
        if (r + 1 < size && grid[r][c] === grid[r + 1][c]) return true;
        if (c + 1 < size && grid[r][c] === grid[r][c + 1]) return true;
      }
    return false;
  }

  function getState() {
    return {
      grid: cloneGrid(), size, score, moves, won, over,
      undoCount: undoStack.length, goal,
    };
  }

  function serialize() {
    return JSON.stringify({ grid, size, score, moves, won, over, undoStack, goal, continueAfterWin });
  }

  function deserialize(raw) {
    try {
      const s = JSON.parse(raw);
      grid = s.grid; size = s.size; score = s.score; moves = s.moves;
      won = s.won; over = s.over; undoStack = s.undoStack || [];
      goal = s.goal; continueAfterWin = s.continueAfterWin;
      undoLimit = SettingsStore.get('undoLimit');
      return true;
    } catch { return false; }
  }

  function maxTile() {
    return Math.max(...grid.flat());
  }

  return { init, move, undo, getState, serialize, deserialize, maxTile };
})();
