import { clone } from './clone.js';

export class UndoStack {
  constructor(maxDepth = 30) {
    this.stack = [];
    this.maxDepth = maxDepth;
  }

  push(snapshot) {
    const copy = clone(snapshot);
    if (this.stack.length >= this.maxDepth) this.stack.shift();
    this.stack.push(copy);
  }

  pop() {
    return this.stack.pop() ?? null;
  }

  clear() {
    this.stack = [];
  }

  get canUndo() {
    return this.stack.length > 0;
  }
}
