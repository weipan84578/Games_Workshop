(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Config = BigTwo.Config;
  var Rules = BigTwo.Rules = BigTwo.Rules || {};
  var TYPE_ORDER = {
    single: 0, pair: 1, triple: 2, straight: 3, flush: 4,
    fullHouse: 5, fourOfAKind: 6, straightFlush: 7
  };

  function requiresOpeningCard(context) {
    return !!(context && (context.openingMoveRequired === true ||
      context.mustIncludeClubThree === true || context.isOpeningMove === true));
  }

  function isOpeningMove(cards, context) {
    if (!requiresOpeningCard(context)) {
      return true;
    }
    return Array.isArray(cards) && cards.some(function (card) {
      return card && card.id === Config.OPENING_CARD_ID;
    });
  }

  function moveComparator(left, right) {
    var leftEvaluation = Rules.classifyHand(left);
    var rightEvaluation = Rules.classifyHand(right);
    var comparison;
    if (left.length !== right.length) {
      return left.length - right.length;
    }
    if (TYPE_ORDER[leftEvaluation.type] !== TYPE_ORDER[rightEvaluation.type]) {
      return TYPE_ORDER[leftEvaluation.type] - TYPE_ORDER[rightEvaluation.type];
    }
    comparison = Rules.compareTieBreakers(leftEvaluation.tieBreakers, rightEvaluation.tieBreakers);
    if (comparison !== 0) {
      return comparison;
    }
    return BigTwo.Utils.makeCardSignature(left).localeCompare(BigTwo.Utils.makeCardSignature(right));
  }

  function getLegalMoves(hand, tableCards, context) {
    var table = Array.isArray(tableCards) ? tableCards : [];
    var sizes;
    var tableEvaluation;
    var seen = {};
    var moves = [];
    if (!Array.isArray(hand) || !hand.every(BigTwo.Utils.Validation.isCard)) {
      throw new TypeError('hand must contain valid cards');
    }
    if (BigTwo.Utils.unique(hand.map(function (card) { return card.id; })).length !== hand.length) {
      throw new TypeError('hand contains duplicate cards');
    }
    if (table.length) {
      tableEvaluation = Rules.classifyHand(table);
      if (!tableEvaluation.valid) {
        throw new BigTwo.Errors.RuleError('INVALID_TABLE_HAND', tableEvaluation.reason);
      }
      sizes = [table.length];
    } else {
      sizes = [1, 2, 3, 5];
    }
    sizes.forEach(function (size) {
      if (size > hand.length) {
        return;
      }
      BigTwo.Utils.combinations(hand, size).forEach(function (cards) {
        var evaluation = Rules.classifyHand(cards);
        var signature;
        if (!evaluation.valid || !isOpeningMove(cards, context)) {
          return;
        }
        if (table.length && !Rules.canBeat(cards, table)) {
          return;
        }
        signature = BigTwo.Utils.makeCardSignature(cards);
        if (!seen[signature]) {
          seen[signature] = true;
          moves.push(cards.slice());
        }
      });
    });
    return moves.sort(moveComparator);
  }

  Rules.isOpeningMove = isOpeningMove;
  Rules.getLegalMoves = getLegalMoves;
  Rules.compareMoves = moveComparator;
}(window));
