(function (global) {
  "use strict";

  const VERSION = "1.0.0";
  const DIFFICULTIES = {
    easy: { label: "簡單", blanks: 36, factor: 1 },
    medium: { label: "中等", blanks: 46, factor: 1.5 },
    hard: { label: "困難", blanks: 52, factor: 2 },
    expert: { label: "專家", blanks: 58, factor: 3 },
  };

  let state = null;

  function emit(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function emptyNotes() {
    return Array.from({ length: 81 }, () => []);
  }

  function cloneNotes(notes) {
    return notes.map((cell) => cell.slice());
  }

  function createSnapshot() {
    return {
      playerInput: state.playerInput.slice(),
      memoNotes: cloneNotes(state.memoNotes),
      errorCount: state.errorCount,
      hintCount: state.hintCount,
    };
  }

  function pushUndo() {
    state.undoHistory.push(createSnapshot());
    if (state.undoHistory.length > 50) {
      state.undoHistory.shift();
    }
  }

  function currentValues(targetState) {
    const source = targetState || state;
    if (!source) {
      return Array(81).fill(0);
    }
    return source.puzzle.map((value, index) => value || source.playerInput[index] || 0);
  }

  function isMutable(index) {
    return state
      && !state.paused
      && !state.completed
      && !state.gameOver
      && index >= 0
      && !state.puzzle[index];
  }

  function selectedMutableIndex() {
    if (!state || state.selectedIndex === null || state.selectedIndex === undefined) {
      return -1;
    }
    return isMutable(state.selectedIndex) ? state.selectedIndex : -1;
  }

  function serialize() {
    return {
      version: VERSION,
      savedAt: Date.now(),
      difficulty: state.difficulty,
      puzzle: state.puzzle,
      solution: state.solution,
      playerInput: state.playerInput,
      memoNotes: state.memoNotes,
      elapsedSeconds: state.elapsedSeconds,
      errorCount: state.errorCount,
      hintCount: state.hintCount,
      undoHistory: state.undoHistory,
    };
  }

  function isValidSave(data) {
    return data
      && data.version === VERSION
      && DIFFICULTIES[data.difficulty]
      && Array.isArray(data.puzzle)
      && data.puzzle.length === 81
      && Array.isArray(data.solution)
      && data.solution.length === 81
      && Array.isArray(data.playerInput)
      && data.playerInput.length === 81;
  }

  function save() {
    if (!state || state.completed || state.gameOver) {
      return;
    }
    global.SudokuStorage.saveGame(serialize());
  }

  function afterMutation() {
    save();
    emit("sudoku:stateChange", { state: getState() });
  }

  function removeNoteFromPeers(index, value) {
    const peers = global.SudokuValidator.peersOf(index);
    peers.forEach((peer) => {
      state.memoNotes[peer] = state.memoNotes[peer].filter((note) => note !== value);
    });
  }

  function completeGame() {
    state.completed = true;
    state.paused = true;
    const result = getScore();
    global.SudokuStorage.clearGame();
    emit("sudoku:stateChange", { state: getState() });
    emit("sudoku:gameComplete", result);
  }

  function gameOver(reason) {
    state.gameOver = true;
    state.paused = true;
    global.SudokuStorage.clearGame();
    emit("sudoku:stateChange", { state: getState() });
    emit("sudoku:gameOver", { reason });
  }

  function checkCompletion() {
    const board = currentValues();
    if (global.SudokuValidator.isComplete(board, state.solution)) {
      completeGame();
    }
  }

  function reachedErrorLimit() {
    const limit = global.SettingsState.get().errorLimit;
    return limit !== "none" && state.errorCount >= Number(limit);
  }

  function getScore() {
    if (!state) {
      return { time: 0, errors: 0, hints: 0, score: 0, rank: "C" };
    }

    const factor = DIFFICULTIES[state.difficulty].factor;
    const timePenalty = Math.floor(state.elapsedSeconds / factor) * 10;
    const errorPenalty = state.errorCount * 50;
    const hintPenalty = state.hintCount * 100;
    const score = Math.max(1000 - timePenalty - errorPenalty - hintPenalty, 0);
    const rank = score >= 800 ? "S" : score >= 500 ? "A" : "B";

    return {
      time: state.elapsedSeconds,
      errors: state.errorCount,
      hints: state.hintCount,
      score,
      rank,
    };
  }

  function hydrate(data) {
    state = {
      difficulty: data.difficulty,
      puzzle: data.puzzle.slice(),
      solution: data.solution.slice(),
      playerInput: data.playerInput.slice(),
      memoNotes: Array.isArray(data.memoNotes) && data.memoNotes.length === 81 ? cloneNotes(data.memoNotes) : emptyNotes(),
      elapsedSeconds: Number(data.elapsedSeconds) || 0,
      errorCount: Number(data.errorCount) || 0,
      hintCount: Number(data.hintCount) || 0,
      undoHistory: Array.isArray(data.undoHistory) ? data.undoHistory.slice(-50) : [],
      selectedIndex: null,
      memoMode: false,
      paused: false,
      completed: false,
      gameOver: false,
    };
  }

  function getState() {
    if (!state) {
      return null;
    }

    return {
      ...state,
      puzzle: state.puzzle.slice(),
      solution: state.solution.slice(),
      playerInput: state.playerInput.slice(),
      memoNotes: cloneNotes(state.memoNotes),
      undoHistory: state.undoHistory.slice(),
      currentValues: currentValues(),
      difficultyLabel: DIFFICULTIES[state.difficulty].label,
      score: getScore(),
    };
  }

  global.GameState = {
    DIFFICULTIES,
    newGame(difficulty) {
      const key = DIFFICULTIES[difficulty] ? difficulty : "easy";
      const generated = global.SudokuGenerator.generate(DIFFICULTIES[key].blanks);
      state = {
        difficulty: key,
        puzzle: generated.puzzle.slice(),
        solution: generated.solution.slice(),
        playerInput: Array(81).fill(0),
        memoNotes: emptyNotes(),
        elapsedSeconds: 0,
        errorCount: 0,
        hintCount: 0,
        undoHistory: [],
        selectedIndex: null,
        memoMode: false,
        paused: false,
        completed: false,
        gameOver: false,
      };
      global.SudokuStorage.clearGame();
      save();
      emit("sudoku:gameStart", { difficulty: key });
      emit("sudoku:stateChange", { state: getState() });
      return getState();
    },
    loadSaved() {
      const data = global.SudokuStorage.loadGame();
      if (!isValidSave(data)) {
        global.SudokuStorage.clearGame();
        return null;
      }
      hydrate(data);
      emit("sudoku:gameLoad", { saveData: data });
      emit("sudoku:stateChange", { state: getState() });
      return getState();
    },
    hasSave() {
      return global.SudokuStorage.hasGame();
    },
    save,
    getState,
    getCurrentValues: currentValues,
    selectCell(index) {
      if (!state || state.paused || state.gameOver) {
        return;
      }
      state.selectedIndex = index;
      emit("sudoku:cellSelected", {
        row: Math.floor(index / 9),
        col: index % 9,
        index,
      });
      emit("sudoku:stateChange", { state: getState() });
    },
    moveSelection(rowDelta, colDelta) {
      if (!state || state.paused || state.gameOver) {
        return;
      }

      const current = state.selectedIndex ?? 0;
      const row = Math.max(0, Math.min(8, Math.floor(current / 9) + rowDelta));
      const col = Math.max(0, Math.min(8, (current % 9) + colDelta));
      this.selectCell(row * 9 + col);
    },
    setNumber(value) {
      const index = selectedMutableIndex();
      if (index < 0 || value < 1 || value > 9) {
        return false;
      }

      if (state.memoMode) {
        pushUndo();
        const notes = new Set(state.memoNotes[index]);
        if (notes.has(value)) {
          notes.delete(value);
        } else {
          notes.add(value);
        }
        state.memoNotes[index] = Array.from(notes).sort((a, b) => a - b);
        emit("sudoku:numberInput", { row: Math.floor(index / 9), col: index % 9, value, memo: true, isError: false });
        afterMutation();
        return true;
      }

      pushUndo();
      state.playerInput[index] = value;
      state.memoNotes[index] = [];

      const isError = global.SettingsState.get().validateOnInput && value !== state.solution[index];
      if (isError) {
        state.errorCount += 1;
      } else {
        removeNoteFromPeers(index, value);
      }

      emit("sudoku:numberInput", {
        row: Math.floor(index / 9),
        col: index % 9,
        value,
        memo: false,
        isError,
      });

      afterMutation();

      if (isError && reachedErrorLimit()) {
        gameOver("too-many-errors");
        return false;
      }

      checkCompletion();
      return !isError;
    },
    erase() {
      const index = selectedMutableIndex();
      if (index < 0) {
        return false;
      }

      if (!state.playerInput[index] && state.memoNotes[index].length === 0) {
        return false;
      }

      pushUndo();
      state.playerInput[index] = 0;
      state.memoNotes[index] = [];
      emit("sudoku:cellErased", { row: Math.floor(index / 9), col: index % 9, index });
      afterMutation();
      return true;
    },
    hint() {
      if (!state || state.paused || state.completed || state.gameOver) {
        return false;
      }

      const values = currentValues();
      let index = selectedMutableIndex();
      if (index < 0 || values[index] === state.solution[index]) {
        index = state.puzzle.findIndex((given, cellIndex) => !given && values[cellIndex] !== state.solution[cellIndex]);
      }

      if (index < 0) {
        return false;
      }

      pushUndo();
      state.selectedIndex = index;
      state.playerInput[index] = state.solution[index];
      state.memoNotes[index] = [];
      state.hintCount += 1;
      removeNoteFromPeers(index, state.solution[index]);
      emit("sudoku:hintUsed", {
        row: Math.floor(index / 9),
        col: index % 9,
        value: state.solution[index],
      });
      afterMutation();
      checkCompletion();
      return true;
    },
    undo() {
      if (!state || state.paused || state.undoHistory.length === 0) {
        return false;
      }

      const snapshot = state.undoHistory.pop();
      state.playerInput = snapshot.playerInput.slice();
      state.memoNotes = cloneNotes(snapshot.memoNotes);
      state.errorCount = snapshot.errorCount;
      state.hintCount = snapshot.hintCount;
      emit("sudoku:undoPerformed", { step: state.undoHistory.length });
      afterMutation();
      return true;
    },
    toggleMemo() {
      if (!state || state.paused || state.completed || state.gameOver) {
        return false;
      }
      state.memoMode = !state.memoMode;
      emit("sudoku:stateChange", { state: getState() });
      return state.memoMode;
    },
    pause() {
      if (!state || state.completed || state.gameOver) {
        return;
      }
      state.paused = true;
      emit("sudoku:paused", { state: getState() });
      emit("sudoku:stateChange", { state: getState() });
    },
    resume() {
      if (!state || state.completed || state.gameOver) {
        return;
      }
      state.paused = false;
      emit("sudoku:resumed", { state: getState() });
      emit("sudoku:stateChange", { state: getState() });
    },
    tick() {
      if (!state || state.paused || state.completed || state.gameOver) {
        return;
      }
      state.elapsedSeconds += 1;
      if (state.elapsedSeconds % 5 === 0) {
        save();
      }
      emit("sudoku:stateChange", { state: getState() });
    },
    clearSave() {
      global.SudokuStorage.clearGame();
    },
  };
})(window);
