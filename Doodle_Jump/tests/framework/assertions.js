(function (window) {
  "use strict";

  function fail(message) {
    throw new Error(message);
  }

  window.DJTest = window.DJTest || {};
  window.DJTest.assert = {
    truthy: function (value, message) {
      if (!value) fail(message || "Expected a truthy value.");
    },
    equal: function (actual, expected, message) {
      if (actual !== expected)
        fail(message || "Expected " + expected + ", received " + actual + ".");
    },
    deepEqual: function (actual, expected, message) {
      var left = JSON.stringify(actual);
      var right = JSON.stringify(expected);
      if (left !== right)
        fail(message || "Expected " + right + ", received " + left + ".");
    },
    closeTo: function (actual, expected, tolerance, message) {
      if (Math.abs(actual - expected) > tolerance)
        fail(
          message || "Expected " + actual + " to be close to " + expected + ".",
        );
    },
    throws: function (callback, message) {
      var didThrow = false;
      try {
        callback();
      } catch (error) {
        didThrow = true;
      }
      if (!didThrow) fail(message || "Expected the callback to throw.");
    },
  };
})(window);
