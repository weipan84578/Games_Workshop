(function (global) {
  'use strict';

  var BigTwo = global.BigTwo = global.BigTwo || {};
  var Utils = BigTwo.Utils = BigTwo.Utils || {};

  function hashSeed(seed) {
    var text = String(seed == null ? 'big-two-default' : seed);
    var hash = 2166136261;
    var index;
    for (index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    hash >>>= 0;
    return hash === 0 ? 0x6d2b79f5 : hash;
  }

  function parseState(seedOrState) {
    var match;
    if (typeof seedOrState === 'string') {
      match = /^xorshift32:([0-9a-f]{8})$/i.exec(seedOrState);
      if (match) {
        return parseInt(match[1], 16) >>> 0;
      }
    }
    return hashSeed(seedOrState);
  }

  function createRng(seedOrState) {
    var state = parseState(seedOrState);
    return {
      next: function () {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        state >>>= 0;
        if (state === 0) {
          state = 0x6d2b79f5;
        }
        return state / 4294967296;
      },
      int: function (maximum) {
        if (!Number.isInteger(maximum) || maximum <= 0) {
          throw new RangeError('maximum must be a positive integer');
        }
        return Math.floor(this.next() * maximum);
      },
      pick: function (items) {
        if (!items || !items.length) {
          return undefined;
        }
        return items[this.int(items.length)];
      },
      getState: function () {
        return 'xorshift32:' + ('00000000' + state.toString(16)).slice(-8);
      },
      setState: function (serializedState) {
        state = parseState(serializedState);
      }
    };
  }

  function nextRandom(rng) {
    var value;
    if (typeof rng === 'function') {
      value = rng();
    } else if (rng && typeof rng.next === 'function') {
      value = rng.next();
    } else if (rng && typeof rng.random === 'function') {
      value = rng.random();
    } else {
      throw new TypeError('An injected RNG is required');
    }
    if (typeof value !== 'number' || value < 0 || value >= 1 || !isFinite(value)) {
      throw new RangeError('RNG values must be in the range [0, 1)');
    }
    return value;
  }

  function shuffle(items, rng) {
    var output = items.slice();
    var index;
    var other;
    var temporary;
    for (index = output.length - 1; index > 0; index -= 1) {
      other = Math.floor(nextRandom(rng) * (index + 1));
      temporary = output[index];
      output[index] = output[other];
      output[other] = temporary;
    }
    return output;
  }

  function randomSeed() {
    var values;
    if (global.crypto && typeof global.crypto.getRandomValues === 'function') {
      values = new Uint32Array(2);
      global.crypto.getRandomValues(values);
      return values[0].toString(16) + '-' + values[1].toString(16);
    }
    return String(Date.now()) + '-' + String(Math.random());
  }

  Utils.RNG = {
    create: createRng,
    fromState: createRng,
    next: nextRandom,
    shuffle: shuffle,
    hashSeed: hashSeed,
    randomSeed: randomSeed
  };
}(window));
