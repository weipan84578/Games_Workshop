'use strict';

const assert = require('assert');
const { loadLudo } = require('./helpers/load-ludo');

const L = loadLudo([
  'js/core/namespace.js',
  'js/core/config.js',
  'js/core/state.js',
  'js/engine/board.js',
  'js/engine/rules.js',
  'js/engine/dice.js',
  'js/engine/token.js',
  'js/engine/turn.js'
]);

const calls = {
  highlighted: false,
  rollEnabled: null,
  saved: 0,
  prompt: ''
};

L.ui.renderBoard = { draw: function () {} };
L.ui.renderTokens = {
  draw: function () {},
  clearHighlights: function () {},
  highlightMovable: function () { calls.highlighted = true; }
};
L.ui.hud = {
  update: function () {},
  setRollEnabled: function (enabled) { calls.rollEnabled = enabled; },
  prompt: function (text) { calls.prompt = text; }
};
L.ui.showResult = function () {};
L.audio.playSfx = function () {};
L.storage.saveGame = function () { calls.saved++; };
L.storage.clearSave = function () {};
L.ai.chooseMove = function (_owner, _dice, moves) { return moves[0]; };

function putOnRel(t, rel) {
  t.inYard = false;
  t.finished = false;
  t.rel = rel;
}

function resetCalls() {
  calls.highlighted = false;
  calls.rollEnabled = null;
  calls.saved = 0;
  calls.prompt = '';
}

function testResumeAwaitMoveKeepsRolledDice() {
  const game = L.state.newGame({ aiCount: 1, difficulty: 'normal', playerColor: 0 });
  putOnRel(L.state.getToken(0), 0);
  game.phase = L.state.PHASE.AWAIT_MOVE;
  game.dice.value = 3;
  game.dice.rolled = true;
  resetCalls();

  L.engine.turn.resume();

  assert.strictEqual(game.phase, L.state.PHASE.AWAIT_MOVE);
  assert.strictEqual(game.dice.value, 3);
  assert.strictEqual(game.dice.rolled, true);
  assert.strictEqual(calls.rollEnabled, false);
  assert.strictEqual(calls.highlighted, true);
  assert.strictEqual(L.engine.turn.getPendingMoves().length > 0, true);
  assert.strictEqual(calls.saved, 1);
}

function testResumeRollPhasePreservesSixStreak() {
  const game = L.state.newGame({ aiCount: 1, difficulty: 'normal', playerColor: 0 });
  game.phase = L.state.PHASE.ROLL;
  game.dice.value = 0;
  game.dice.rolled = false;
  game.dice.sixStreak = 2;
  resetCalls();

  L.engine.turn.resume();

  assert.strictEqual(game.phase, L.state.PHASE.ROLL);
  assert.strictEqual(game.dice.sixStreak, 2);
  assert.strictEqual(calls.rollEnabled, true);
  assert.strictEqual(calls.saved, 1);
}

testResumeAwaitMoveKeepsRolledDice();
testResumeRollPhasePreservesSixStreak();

console.log('turn-resume.test.js passed');
