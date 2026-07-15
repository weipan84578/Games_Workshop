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
    return selected
      .reduce(function (chain, item) {
        return chain.then(function (results) {
          return Promise.resolve()
            .then(function () {
              return item.callback();
            })
            .then(
              function () {
                results.push({
                  name: item.name,
                  module: item.module,
                  passed: true,
                });
                return results;
              },
              function (error) {
                results.push({
                  name: item.name,
                  module: item.module,
                  passed: false,
                  error:
                    error && error.message ? error.message : String(error),
                });
                return results;
              },
            );
        });
      }, Promise.resolve([]))
      .then(function (results) {
        return {
          results: results,
          duration: Math.round(performance.now() - started),
        };
      });
  };
})(window);
