(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config;
  var Rules = BigTwo.Rules = BigTwo.Rules || {};
  var Errors = BigTwo.Errors = BigTwo.Errors || {};

  function RuleError(code, message) {
    this.name = 'RuleError';
    this.code = code;
    this.message = message;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RuleError);
    }
  }
  RuleError.prototype = Object.create(Error.prototype);
  RuleError.prototype.constructor = RuleError;

  function compareNumbers(left, right) {
    var length = Math.max(left.length, right.length);
    var index;
    for (index = 0; index < length; index += 1) {
      if ((left[index] || 0) !== (right[index] || 0)) {
        return (left[index] || 0) > (right[index] || 0) ? 1 : -1;
      }
    }
    return 0;
  }

  function compareHands(candidateCards, tableCards) {
    var candidate = Rules.classifyHand(candidateCards);
    var table = Rules.classifyHand(tableCards);
    var candidateStrength;
    var tableStrength;
    if (!candidate.valid) {
      throw new RuleError('INVALID_CANDIDATE_HAND', candidate.reason);
    }
    if (!table.valid) {
      throw new RuleError('INVALID_TABLE_HAND', table.reason);
    }
    if (candidate.cardCount !== table.cardCount) {
      return -1;
    }
    if (candidate.cardCount === 5) {
      candidateStrength = Config.FIVE_CARD_STRENGTH[candidate.type];
      tableStrength = Config.FIVE_CARD_STRENGTH[table.type];
      if (candidateStrength !== tableStrength) {
        return candidateStrength > tableStrength ? 1 : -1;
      }
    } else if (candidate.type !== table.type) {
      return -1;
    }
    return compareNumbers(candidate.tieBreakers, table.tieBreakers);
  }

  function canBeat(candidateCards, tableCards) {
    try {
      return compareHands(candidateCards, tableCards) === 1;
    } catch (error) {
      return false;
    }
  }

  Errors.RuleError = RuleError;
  Rules.compareTieBreakers = compareNumbers;
  Rules.compareHands = compareHands;
  Rules.canBeat = canBeat;
}(window));
