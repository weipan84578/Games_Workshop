import { MAX_FRAMES, PINS_PER_FRAME } from "../utils/constants.js";
import { clamp } from "../utils/helpers.js";

export function isStrike(firstRoll) {
  return firstRoll === PINS_PER_FRAME;
}

export function isSpare(firstRoll, secondRoll) {
  return firstRoll !== undefined && secondRoll !== undefined && firstRoll < PINS_PER_FRAME && firstRoll + secondRoll === PINS_PER_FRAME;
}

export function normalizeRoll(value) {
  return clamp(Math.round(Number(value) || 0), 0, PINS_PER_FRAME);
}

function validateTenthRolls(rolls) {
  if (rolls.length > 3) return false;
  if (rolls.length === 0) return true;

  const first = rolls[0];
  if (first === PINS_PER_FRAME) {
    if (rolls.length < 2) return true;
    const second = rolls[1];
    if (second < PINS_PER_FRAME && rolls.length === 3 && rolls[1] + rolls[2] > PINS_PER_FRAME) return false;
    return true;
  }

  if (rolls.length === 1) return true;
  if (first + rolls[1] > PINS_PER_FRAME) return false;
  if (first + rolls[1] < PINS_PER_FRAME) return rolls.length === 2;
  return true;
}

export function isValidRollSequence(rolls) {
  if (!Array.isArray(rolls) || rolls.length > 21) return false;
  if (rolls.some((roll) => !Number.isInteger(roll) || roll < 0 || roll > PINS_PER_FRAME)) return false;

  let index = 0;
  for (let frame = 1; frame <= 9; frame += 1) {
    if (index >= rolls.length) return true;
    const first = rolls[index];
    if (first === PINS_PER_FRAME) {
      index += 1;
      continue;
    }
    if (index + 1 >= rolls.length) return true;
    if (first + rolls[index + 1] > PINS_PER_FRAME) return false;
    index += 2;
  }

  return validateTenthRolls(rolls.slice(index));
}

export function calculateScores(rolls = []) {
  if (!isValidRollSequence(rolls)) return Array(MAX_FRAMES).fill(null);

  const scores = Array(MAX_FRAMES).fill(null);
  let rollIndex = 0;

  for (let frame = 0; frame < MAX_FRAMES; frame += 1) {
    if (rollIndex >= rolls.length) break;
    const first = rolls[rollIndex];

    if (frame === MAX_FRAMES - 1) {
      const finalRolls = rolls.slice(rollIndex, rollIndex + 3);
      if (first === PINS_PER_FRAME) {
        if (finalRolls.length === 3) scores[frame] = finalRolls.reduce((sum, roll) => sum + roll, 0);
      } else if (finalRolls.length >= 2 && first + finalRolls[1] < PINS_PER_FRAME) {
        scores[frame] = first + finalRolls[1];
      } else if (finalRolls.length === 3) {
        scores[frame] = finalRolls.reduce((sum, roll) => sum + roll, 0);
      }
      break;
    }

    if (isStrike(first)) {
      if (rollIndex + 2 < rolls.length) scores[frame] = PINS_PER_FRAME + rolls[rollIndex + 1] + rolls[rollIndex + 2];
      rollIndex += 1;
      continue;
    }

    if (rollIndex + 1 >= rolls.length) break;
    const second = rolls[rollIndex + 1];
    const frameTotal = first + second;
    if (isSpare(first, second)) {
      if (rollIndex + 2 < rolls.length) scores[frame] = PINS_PER_FRAME + rolls[rollIndex + 2];
    } else {
      scores[frame] = frameTotal;
    }
    rollIndex += 2;
  }

  return scores;
}

export function getTotalScore(rolls = []) {
  return calculateScores(rolls).reduce((sum, score) => sum + (score ?? 0), 0);
}

function emptyFrame(number) {
  return { number, rolls: [], type: "empty", complete: false, score: null };
}

export function getFrameRecords(rolls = []) {
  const scores = calculateScores(rolls);
  const records = [];
  let rollIndex = 0;

  for (let frame = 0; frame < MAX_FRAMES - 1; frame += 1) {
    const number = frame + 1;
    if (rollIndex >= rolls.length) {
      records.push(emptyFrame(number));
      continue;
    }

    const first = rolls[rollIndex];
    if (first === PINS_PER_FRAME) {
      records.push({ number, rolls: [first], type: "strike", complete: true, score: scores[frame] });
      rollIndex += 1;
      continue;
    }

    if (rollIndex + 1 >= rolls.length) {
      records.push({ number, rolls: [first], type: "partial", complete: false, score: null });
      rollIndex += 1;
      continue;
    }

    const second = rolls[rollIndex + 1];
    records.push({
      number,
      rolls: [first, second],
      type: isSpare(first, second) ? "spare" : "open",
      complete: true,
      score: scores[frame],
    });
    rollIndex += 2;
  }

  const finalRolls = rolls.slice(rollIndex, rollIndex + 3);
  const finalFirst = finalRolls[0];
  let finalType = "empty";
  let finalComplete = false;
  if (finalFirst !== undefined) {
    if (finalFirst === PINS_PER_FRAME) {
      finalType = "strike";
      finalComplete = finalRolls.length === 3;
    } else if (finalRolls.length === 1) {
      finalType = "partial";
    } else if (isSpare(finalFirst, finalRolls[1])) {
      finalType = "spare";
      finalComplete = finalRolls.length === 3;
    } else {
      finalType = "open";
      finalComplete = finalRolls.length >= 2;
    }
  }
  records.push({ number: MAX_FRAMES, rolls: finalRolls, type: finalType, complete: finalComplete, score: scores[9] });
  return records;
}

export function isGameComplete(rolls = []) {
  return getFrameRecords(rolls)[MAX_FRAMES - 1].complete;
}

export function getNextRollContext(rolls = []) {
  const records = getFrameRecords(rolls);
  const current = records.find((record) => !record.complete);
  if (!current) return { done: true, frame: MAX_FRAMES, ball: 0, pinsRemaining: 0 };

  if (current.number < MAX_FRAMES) {
    if (current.rolls.length === 0) return { done: false, frame: current.number, ball: 1, pinsRemaining: PINS_PER_FRAME };
    return { done: false, frame: current.number, ball: 2, pinsRemaining: PINS_PER_FRAME - current.rolls[0] };
  }

  const [first, second] = current.rolls;
  if (first === undefined) return { done: false, frame: MAX_FRAMES, ball: 1, pinsRemaining: PINS_PER_FRAME };
  if (first === PINS_PER_FRAME && second === undefined) return { done: false, frame: MAX_FRAMES, ball: 2, pinsRemaining: PINS_PER_FRAME };
  if (first === PINS_PER_FRAME && second !== undefined) {
    return { done: false, frame: MAX_FRAMES, ball: 3, pinsRemaining: second === PINS_PER_FRAME ? PINS_PER_FRAME : PINS_PER_FRAME - second };
  }
  if (second === undefined) return { done: false, frame: MAX_FRAMES, ball: 2, pinsRemaining: PINS_PER_FRAME - first };
  return { done: false, frame: MAX_FRAMES, ball: 3, pinsRemaining: PINS_PER_FRAME };
}

export function recordRoll(rolls = [], pins) {
  const context = getNextRollContext(rolls);
  if (context.done) throw new Error("The game is already complete.");
  const normalized = Number(pins);
  if (!Number.isInteger(normalized) || normalized < 0 || normalized > context.pinsRemaining) {
    throw new Error("Roll exceeds the pins remaining in this ball.");
  }
  const next = [...rolls, normalized];
  if (!isValidRollSequence(next)) throw new Error("Invalid roll sequence.");
  return next;
}

export function rollSymbol(roll, index, frameRolls, frameType) {
  if (roll === undefined) return "";
  if (roll === 10) return "X";
  if (frameType === "spare" && index === 1) return "/";
  return String(roll);
}
