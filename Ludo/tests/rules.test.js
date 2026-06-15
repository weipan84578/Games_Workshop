'use strict';

const assert = require('assert');
const { loadLudo } = require('./helpers/load-ludo');

const L = loadLudo([
  'js/core/namespace.js',
  'js/core/config.js',
  'js/core/state.js',
  'js/engine/board.js',
  'js/engine/rules.js'
]);

function newGame() {
  return L.state.newGame({ aiCount: 1, difficulty: 'normal', playerColor: 0 });
}

function token(id) {
  return L.state.getToken(id);
}

function putOnRel(t, rel) {
  t.inYard = false;
  t.finished = false;
  t.rel = rel;
}

function putOnAbs(t, abs) {
  putOnRel(t, (abs - L.config.START_OFFSET[t.owner] + 52) % 52);
}

function hasMove(moves, tokenId) {
  return moves.some((m) => m.tokenId === tokenId);
}

function moveFor(moves, tokenId) {
  return moves.find((m) => m.tokenId === tokenId);
}

function testExactFinish() {
  newGame();
  putOnRel(token(0), 54);
  assert.strictEqual(moveFor(L.engine.rules.getLegalMoves(0, 2), 0).finishes, true);

  token(0).rel = 55;
  assert.strictEqual(hasMove(L.engine.rules.getLegalMoves(0, 2), 0), false);
}

function testSingleEnemyCanBeCaptured() {
  newGame();
  putOnRel(token(0), 0);
  putOnAbs(token(8), L.engine.board.relToAbs(0, 4));

  const move = moveFor(L.engine.rules.getLegalMoves(0, 4), 0);
  assert.deepStrictEqual(move.capturesIds, [8]);
}

function testFortressBlocksLandingFromYard() {
  newGame();
  putOnAbs(token(8), L.engine.board.relToAbs(0, 0));
  putOnAbs(token(9), L.engine.board.relToAbs(0, 0));

  assert.strictEqual(hasMove(L.engine.rules.getLegalMoves(0, 6), 0), false);
}

function testFortressBlocksPassing() {
  newGame();
  putOnRel(token(0), 0);
  putOnAbs(token(8), L.engine.board.relToAbs(0, 3));
  putOnAbs(token(9), L.engine.board.relToAbs(0, 3));

  assert.strictEqual(hasMove(L.engine.rules.getLegalMoves(0, 4), 0), false);
}

testExactFinish();
testSingleEnemyCanBeCaptured();
testFortressBlocksLandingFromYard();
testFortressBlocksPassing();

console.log('rules.test.js passed');
