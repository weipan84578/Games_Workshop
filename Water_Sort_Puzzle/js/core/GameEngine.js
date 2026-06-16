import { canPour, deepCopyTubes, getValidMoves, pour } from './PourLogic.js';
import { clone } from './clone.js';
import { UndoStack } from './UndoStack.js';
import { findHint } from './HintEngine.js';
import { calculateStars, checkWin } from './WinChecker.js';

export class GameEngine extends EventTarget {
  constructor(level, options = {}) {
    super();
    this.level = level;
    this.initialTubes = deepCopyTubes(options.resumeTubes ?? level.tubes);
    this.undoStack = new UndoStack(30);
    this.status = 'IDLE';
    this.gameState = {
      tubes: deepCopyTubes(this.initialTubes),
      moves: options.resumeMoves ?? 0,
      time: options.resumeTime ?? 0,
      selectedTube: null,
      difficulty: level.difficulty,
      levelId: level.id,
      hintsUsed: options.resumeHintsUsed ?? 0,
      undoCount: options.resumeUndoCount ?? 0,
    };
  }

  snapshot() {
    return clone(this.gameState);
  }

  emit(type, detail = {}) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
    this.dispatchEvent(new CustomEvent('state-change', { detail: this.snapshot() }));
  }

  selectTube(idx) {
    if (this.status === 'WIN' || this.status === 'FAIL') return;
    const selected = this.gameState.selectedTube;
    const tube = this.gameState.tubes[idx];

    if (selected === null) {
      if (!tube?.length) {
        this.emit('invalid', { reason: 'empty', idx });
        return;
      }
      this.gameState.selectedTube = idx;
      this.emit('selection-change', { selectedTube: idx });
      return;
    }

    if (selected === idx) {
      this.gameState.selectedTube = null;
      this.emit('selection-change', { selectedTube: null });
      return;
    }

    if (canPour(this.gameState.tubes, selected, idx)) {
      this.applyPour(selected, idx);
      return;
    }

    if (tube?.length) {
      this.gameState.selectedTube = idx;
      this.emit('invalid', { reason: 'blocked', from: selected, to: idx, reselect: idx });
      return;
    }

    this.emit('invalid', { reason: 'blocked', from: selected, to: idx });
  }

  applyPour(from, to) {
    this.status = 'POURING';
    this.undoStack.push({
      tubes: deepCopyTubes(this.gameState.tubes),
      moves: this.gameState.moves,
      time: this.gameState.time,
      hintsUsed: this.gameState.hintsUsed,
      undoCount: this.gameState.undoCount,
    });

    const result = pour(this.gameState.tubes, from, to);
    this.gameState.tubes = result.tubes;
    this.gameState.moves += 1;
    this.gameState.selectedTube = null;
    this.emit('pour-end', { from, to, amount: result.amount, color: result.color });
    this.status = 'CHECKING';
    this.checkEndState();
  }

  undo() {
    const previous = this.undoStack.pop();
    if (!previous || this.status === 'WIN') {
      this.emit('invalid', { reason: 'undo' });
      return;
    }

    this.gameState.tubes = deepCopyTubes(previous.tubes);
    this.gameState.moves = previous.moves;
    this.gameState.time = previous.time;
    this.gameState.hintsUsed = previous.hintsUsed;
    this.gameState.undoCount += 1;
    this.gameState.selectedTube = null;
    this.status = 'IDLE';
    this.emit('undo-applied');
  }

  hint() {
    const move = findHint(this.gameState.tubes);
    if (!move) {
      this.emit('invalid', { reason: 'hint' });
      return null;
    }

    this.gameState.hintsUsed += 1;
    this.emit('hint', { move });
    return move;
  }

  restart() {
    this.undoStack.clear();
    this.status = 'IDLE';
    this.gameState = {
      tubes: deepCopyTubes(this.initialTubes),
      moves: 0,
      time: 0,
      selectedTube: null,
      difficulty: this.level.difficulty,
      levelId: this.level.id,
      hintsUsed: 0,
      undoCount: 0,
    };
    this.emit('restart');
  }

  tick() {
    if (this.status === 'WIN' || this.status === 'FAIL') return;
    this.gameState.time += 1;
    if (this.level.difficulty === 'hard' && this.gameState.time >= this.timeLimit) {
      this.status = 'FAIL';
      this.emit('fail', { reason: 'time' });
      return;
    }
    this.emit('tick');
  }

  checkEndState() {
    if (checkWin(this.gameState.tubes)) {
      this.status = 'WIN';
      const stars = calculateStars({
        difficulty: this.level.difficulty,
        moves: this.gameState.moves,
        time: this.gameState.time,
        optimalMoves: this.level.optimalMoves,
        timeBenchmark: this.level.timeBenchmark,
        hintsUsed: this.gameState.hintsUsed,
        undoCount: this.gameState.undoCount,
      });
      this.emit('win', { stars });
      return;
    }

    if (getValidMoves(this.gameState.tubes).length === 0) {
      this.status = 'FAIL';
      this.emit('fail', { reason: 'stuck' });
      return;
    }

    this.status = 'IDLE';
  }

  get canUndo() {
    return this.undoStack.canUndo;
  }

  get timeLimit() {
    return Math.max(120, Math.round(this.level.timeBenchmark * 1.8));
  }
}
