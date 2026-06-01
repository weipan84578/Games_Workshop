(function () {
  function render(container, model, userGrid, viewState) {
    const selectedKey = viewState.selected ? Helpers.cellKey(viewState.selected.row, viewState.selected.col) : "";
    const activeEntry = viewState.activeEntryId ? model.entries.get(viewState.activeEntryId) : null;
    const activeKeys = new Set((activeEntry ? activeEntry.cells : []).map((cell) => Helpers.cellKey(cell.row, cell.col)));
    container.innerHTML = `
      <div class="board-frame">
        <div class="crossword-board" role="grid" aria-label="${model.title}" style="--rows:${model.rows};--cols:${model.cols};">
          ${model.cells
            .flatMap((row) =>
              row.map((cell) => renderCell(cell, userGrid[cell.row][cell.col], selectedKey, activeKeys))
            )
            .join("")}
        </div>
      </div>
      <div class="board-status">
        <div class="progress-track" aria-hidden="true"><div class="progress-bar"></div></div>
        <div class="progress-caption"><span class="progress-label">0%</span><span>${model.rows} x ${model.cols}</span></div>
      </div>
    `;
    cacheDom(container);
    applyCellSize(container, model);
  }

  function renderCell(cell, userCell, selectedKey, activeKeys) {
    if (cell.isBlack) {
      return `<button class="cell black" type="button" tabindex="-1" aria-hidden="true"></button>`;
    }
    const classes = cellClasses(cell, userCell, selectedKey, activeKeys);
    const number = cell.number ? `<span class="cell-number">${cell.number}</span>` : "";
    const letter = userCell && userCell.letter ? userCell.letter : "";
    return `
      <button class="${classes.join(" ")}" type="button" role="gridcell"
        data-row="${cell.row}" data-col="${cell.col}" aria-label="${cellLabel(cell, letter)}">
        ${number}<span class="cell-letter">${letter}</span>
      </button>
    `;
  }

  function refresh(container, model, userGrid, viewState) {
    const selectedKey = viewState.selected ? Helpers.cellKey(viewState.selected.row, viewState.selected.col) : "";
    const activeEntry = viewState.activeEntryId ? model.entries.get(viewState.activeEntryId) : null;
    const activeKeys = new Set((activeEntry ? activeEntry.cells : []).map((cell) => Helpers.cellKey(cell.row, cell.col)));
    const cache = container._gridCache || cacheDom(container);

    (model.playableCells || model.cells.flat().filter((cell) => !cell.isBlack)).forEach((cell) => {
      const button = cache.cells[cell.row] && cache.cells[cell.row][cell.col];
      if (!button) {
        return;
      }
      const row = cell.row;
      const col = cell.col;
      const userCell = userGrid[row][col];
      const letter = userCell && userCell.letter ? userCell.letter : "";
      const nextClassName = cellClasses(cell, userCell, selectedKey, activeKeys).join(" ");
      if (button.className !== nextClassName) {
        button.className = nextClassName;
      }
      const nextLabel = cellLabel(cell, letter);
      if (button.getAttribute("aria-label") !== nextLabel) {
        button.setAttribute("aria-label", nextLabel);
      }
      const letterNode = cache.letters[row] && cache.letters[row][col];
      if (letterNode && letterNode.textContent !== letter) {
        letterNode.textContent = letter;
      }
    });

    return updateProgress(model, userGrid);
  }

  function cellClasses(cell, userCell, selectedKey, activeKeys) {
    const key = Helpers.cellKey(cell.row, cell.col);
    const classes = ["cell"];
    if (key === selectedKey) {
      classes.push("active");
    } else if (activeKeys.has(key)) {
      classes.push("in-word");
    }
    if (userCell && userCell.revealed) {
      classes.push("hint");
    } else if (userCell && userCell.status) {
      classes.push(userCell.status);
    }
    return classes;
  }

  function cellLabel(cell, letter) {
    return `第 ${cell.row + 1} 列第 ${cell.col + 1} 欄${letter ? `，${letter}` : ""}`;
  }

  function applyCellSize(container, model) {
    const board = container.querySelector(".crossword-board");
    if (!board) {
      return;
    }
    const region = container.closest(".board-region") || container;
    const rawWidth = region.clientWidth || window.innerWidth - 32;
    const available = Math.min(rawWidth - 24, 600);
    const cellSize = Helpers.calcCellSize(Math.max(model.rows, model.cols), available);
    board.style.setProperty("--cell-size", `${cellSize}px`);
  }

  function updateProgress(model, userGrid) {
    const cells = model.playableCells || model.cells.flat().filter((cell) => !cell.isBlack);
    const total = cells.length;
    let filled = 0;
    cells.forEach((cell) => {
      if (userGrid[cell.row][cell.col] && userGrid[cell.row][cell.col].letter) {
        filled += 1;
      }
    });
    const percent = total ? Math.round((filled / total) * 100) : 0;
    const cache = document.querySelector("#board-root")?._gridCache;
    const bars = cache ? cache.progressBars : document.querySelectorAll(".board-status .progress-bar");
    const labels = cache ? cache.progressLabels : document.querySelectorAll(".board-status .progress-label");
    bars.forEach((bar) => {
      const width = `${percent}%`;
      if (bar.style.width !== width) {
        bar.style.width = width;
      }
    });
    labels.forEach((label) => {
      const text = `${percent}%`;
      if (label.textContent !== text) {
        label.textContent = text;
      }
    });
    return percent;
  }

  function cacheDom(container) {
    const cache = {
      cells: [],
      letters: [],
      progressBars: Array.from(container.querySelectorAll(".board-status .progress-bar")),
      progressLabels: Array.from(container.querySelectorAll(".board-status .progress-label")),
    };
    container.querySelectorAll(".cell[data-row][data-col]").forEach((button) => {
      const row = Number(button.dataset.row);
      const col = Number(button.dataset.col);
      cache.cells[row] = cache.cells[row] || [];
      cache.letters[row] = cache.letters[row] || [];
      cache.cells[row][col] = button;
      cache.letters[row][col] = button.querySelector(".cell-letter");
    });
    container._gridCache = cache;
    return cache;
  }

  window.GridRenderer = {
    render,
    refresh,
    applyCellSize,
    updateProgress,
  };
})();
