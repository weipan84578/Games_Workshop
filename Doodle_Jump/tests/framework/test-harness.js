(function (window) {
  "use strict";

  var tests = [];

  window.DJTest = window.DJTest || {};
  window.DJTest.tests = tests;
  window.DJTest.test = function (name, module, callback) {
    tests.push({ name: name, module: module, callback: callback });
  };
  window.DJTest.run = function (filter) {
    var selected =
      filter && filter !== "all"
        ? tests.filter(function (item) {
            return item.module === filter;
          })
        : tests.slice();
    var started = performance.now();
    var results = selected.map(function (item) {
      try {
        item.callback();
        return { name: item.name, module: item.module, passed: true };
      } catch (error) {
        return {
          name: item.name,
          module: item.module,
          passed: false,
          error: error && error.message ? error.message : String(error),
        };
      }
    });
    return {
      results: results,
      duration: Math.round(performance.now() - started),
    };
  };
})(window);
