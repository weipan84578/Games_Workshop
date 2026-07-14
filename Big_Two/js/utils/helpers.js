(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Utils = BigTwo.Utils = BigTwo.Utils || {};

  function deepClone(value) {
    var result;
    var keys;
    var index;
    if (value === null || typeof value !== 'object') {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map(deepClone);
    }
    result = {};
    keys = Object.keys(value);
    for (index = 0; index < keys.length; index += 1) {
      result[keys[index]] = deepClone(value[keys[index]]);
    }
    return result;
  }

  function deepEqual(left, right) {
    var leftKeys;
    var rightKeys;
    var index;
    if (left === right) {
      return true;
    }
    if (!left || !right || typeof left !== 'object' || typeof right !== 'object') {
      return false;
    }
    if (Array.isArray(left) !== Array.isArray(right)) {
      return false;
    }
    if (Array.isArray(left)) {
      if (left.length !== right.length) {
        return false;
      }
      for (index = 0; index < left.length; index += 1) {
        if (!deepEqual(left[index], right[index])) {
          return false;
        }
      }
      return true;
    }
    leftKeys = Object.keys(left).sort();
    rightKeys = Object.keys(right).sort();
    if (!deepEqual(leftKeys, rightKeys)) {
      return false;
    }
    for (index = 0; index < leftKeys.length; index += 1) {
      if (!deepEqual(left[leftKeys[index]], right[rightKeys[index]])) {
        return false;
      }
    }
    return true;
  }

  function stableStringify(value) {
    var keys;
    if (value === null || typeof value !== 'object') {
      return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
      return '[' + value.map(function (item) {
        return typeof item === 'undefined' ? 'null' : stableStringify(item);
      }).join(',') + ']';
    }
    keys = Object.keys(value).filter(function (key) {
      return typeof value[key] !== 'undefined' && typeof value[key] !== 'function';
    }).sort();
    return '{' + keys.map(function (key) {
      return JSON.stringify(key) + ':' + stableStringify(value[key]);
    }).join(',') + '}';
  }

  function combinations(items, size) {
    var output = [];
    var chosen = [];
    function visit(start) {
      var index;
      if (chosen.length === size) {
        output.push(chosen.slice());
        return;
      }
      for (index = start; index <= items.length - (size - chosen.length); index += 1) {
        chosen.push(items[index]);
        visit(index + 1);
        chosen.pop();
      }
    }
    if (!Array.isArray(items) || size < 0 || size > items.length) {
      return output;
    }
    if (size === 0) {
      return [[]];
    }
    visit(0);
    return output;
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function unique(items) {
    var seen = {};
    return items.filter(function (item) {
      var key = typeof item + ':' + String(item);
      if (seen[key]) {
        return false;
      }
      seen[key] = true;
      return true;
    });
  }

  function makeCardSignature(cards) {
    return cards.map(function (card) { return card.id; }).sort().join('|');
  }

  Utils.deepClone = deepClone;
  Utils.deepEqual = deepEqual;
  Utils.stableStringify = stableStringify;
  Utils.combinations = combinations;
  Utils.clamp = clamp;
  Utils.unique = unique;
  Utils.makeCardSignature = makeCardSignature;
}(window));
