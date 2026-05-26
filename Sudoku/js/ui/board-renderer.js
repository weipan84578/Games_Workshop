(function (global) {
  "use strict";

  let board = null;
  let cells = [];

  function buildCell(index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sudoku-cell";
    button.dataset.index = String(index);
    button.setAttribute("role", "gridcell");
    button.setAttribute("aria-label", `第 ${Math.floor(index / 9) + 1} 列，第 ${(index % 9) + 1} 行`);

    if (index % 9 === 2 || index % 9 === 5) {
      button.classList.add("border-right");
    }
    if (Math.floor(index / 9) === 2 || Math.floor(index / 9) === 5) {
      button.classList.add("border-bottom");
    }

    button.addEventListener("click", () => global.GameState.selectCell(index));
    return button;
  }

  function noteGrid(notes) {
    const grid = document.createElement("span");
    grid.className = "note-grid";
    for (let value = 1; value <= 9; value += 1) {
      const note = document.createElement("span");
      note.textContent = notes.includes(value) ? String(value) : "";
      grid.appendChild(note);
    }
    return grid;
  }

  function valueNode(value) {
    const span = document.createElement("span");
    span.className = "cell-value";
    span.textContent = String(value);
    return span;
  }

  function baseClasses(index) {
    const classes = ["sudoku-cell"];
    if (index % 9 === 2 || index % 9 === 5) {
      classes.push("border-right");
    }
    if (Math.floor(index / 9) === 2 || Math.floor(index / 9) === 5) {
      classes.push("border-bottom");
    }
    return classes;
  }

  function render(state) {
    if (!board || !state) {
      return;
    }

    const settings = global.SettingsState.get();
    const selected = state.selectedIndex;
    const selectedValue = selected !== null && selected !== undefined ? state.currentValues[selected] : 0;
    const peers = selected !== null && selected !== undefined ? global.SudokuValidator.peersOf(selected) : [];

    cells.forEach((cell, index) => {
      const value = state.currentValues[index];
      const classes = baseClasses(index);
      const isGiven = Boolean(state.puzzle[index]);
      const isError = settings.validateOnInput
        && !isGiven
        && state.playerInput[index]
        && state.playerInput[index] !== state.solution[index];

      if (isGiven) {
        classes.push("is-given");
      }
      if (settings.autoHighlight && peers.includes(index)) {
        classes.push("is-highlighted");
      }
      if (settings.autoHighlight && selectedValue && value === selectedValue && index !== selected) {
        classes.push("is-same");
      }
      if (index === selected) {
        classes.push("is-selected");
      }
      if (isError) {
        classes.push("is-error");
      }

      cell.className = classes.join(" ");
      cell.disabled = Boolean(state.paused || state.gameOver);
      cell.setAttribute("aria-selected", index === selected ? "true" : "false");
      cell.replaceChildren();

      if (value) {
        cell.appendChild(valueNode(value));
      } else if (state.memoNotes[index].length) {
        cell.appendChild(noteGrid(state.memoNotes[index]));
      }
    });
  }

  function flash(index, className) {
    const cell = cells[index];
    if (!cell) {
      return;
    }
    cell.classList.remove(className);
    void cell.offsetWidth;
    cell.classList.add(className);
  }

  global.BoardRenderer = {
    init() {
      board = document.getElementById("sudoku-board");
      cells = Array.from({ length: 81 }, (_, index) => buildCell(index));
      board.replaceChildren(...cells);

      document.addEventListener("sudoku:stateChange", (event) => render(event.detail.state));
      document.addEventListener("sudoku:numberInput", (event) => {
        const index = event.detail.row * 9 + event.detail.col;
        flash(index, event.detail.isError ? "flash-error" : "flash-success");
      });
      document.addEventListener("sudoku:hintUsed", (event) => flash(event.detail.row * 9 + event.detail.col, "flash-success"));
      document.addEventListener("sudoku:settingsChange", () => render(global.GameState.getState()));
    },
    render,
  };
})(window);
