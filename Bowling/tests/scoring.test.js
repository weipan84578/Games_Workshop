import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateScores,
  getFrameRecords,
  getNextRollContext,
  getTotalScore,
  isGameComplete,
  isValidRollSequence,
  recordRoll,
} from "../js/core/scoring.js";

test("scores a perfect game as 300", () => {
  const rolls = Array(12).fill(10);
  assert.equal(getTotalScore(rolls), 300);
  assert.deepEqual(calculateScores(rolls), Array(10).fill(30));
  assert.equal(isGameComplete(rolls), true);
});

test("scores twenty-one fives as 150", () => {
  const rolls = Array(21).fill(5);
  assert.equal(getTotalScore(rolls), 150);
  assert.deepEqual(calculateScores(rolls), Array(10).fill(15));
  assert.equal(getFrameRecords(rolls)[9].complete, true);
});

test("scores an all-gutter game as zero", () => {
  const rolls = Array(20).fill(0);
  assert.equal(getTotalScore(rolls), 0);
  assert.deepEqual(calculateScores(rolls), Array(10).fill(0));
});

test("leaves strike and spare bonuses pending until enough balls exist", () => {
  assert.equal(calculateScores([10])[0], null);
  assert.equal(calculateScores([5, 5])[0], null);
  assert.equal(calculateScores([10, 4, 3])[0], 17);
  assert.equal(calculateScores([5, 5, 4])[0], 14);
});

test("handles a tenth-frame strike with two bonus balls", () => {
  const rolls = [...Array(18).fill(0), 10, 7, 2];
  const scores = calculateScores(rolls);
  assert.equal(scores[8], 0);
  assert.equal(scores[9], 19);
  assert.equal(getTotalScore(rolls), 19);
  assert.equal(isGameComplete(rolls), true);
});

test("exposes the next legal ball and rejects illegal pin counts", () => {
  assert.deepEqual(getNextRollContext([]), { done: false, frame: 1, ball: 1, pinsRemaining: 10 });
  const afterFirst = recordRoll([], 6);
  assert.deepEqual(getNextRollContext(afterFirst), { done: false, frame: 1, ball: 2, pinsRemaining: 4 });
  assert.throws(() => recordRoll(afterFirst, 5), /pins remaining/);
  assert.deepEqual(recordRoll(afterFirst, 4), [6, 4]);
});

test("validates partial and completed tenth-frame sequences", () => {
  assert.equal(isValidRollSequence([10, 10, 10]), true);
  assert.equal(isValidRollSequence([...Array(9).fill(10), 10, 5, 6]), false);
  assert.equal(isValidRollSequence([...Array(18).fill(0), 4, 5]), true);
  assert.equal(isValidRollSequence([...Array(18).fill(0), 4, 7]), false);
});
