(function (global) {
  "use strict";

  var tests = [];
  var suiteStack = [];
  var runSequence = 0;

  function AssertionError(message, actual, expected) {
    this.name = "AssertionError";
    this.message = message || "Assertion failed";
    this.actual = actual;
    this.expected = expected;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssertionError);
    } else {
      this.stack = (new Error(this.message)).stack;
    }
  }
  AssertionError.prototype = Object.create(Error.prototype);
  AssertionError.prototype.constructor = AssertionError;

  function format(value) {
    if (typeof value === "string") {
      return JSON.stringify(value);
    }
    if (typeof value === "undefined") {
      return "undefined";
    }
    if (typeof value === "function") {
      return "[Function " + (value.name || "anonymous") + "]";
    }
    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      return String(value);
    }
  }

  function valuesEqual(actual, expected) {
    return actual === expected || (Number.isNaN(actual) && Number.isNaN(expected));
  }

  function deepEqualInternal(actual, expected, seenActual, seenExpected) {
    if (valuesEqual(actual, expected)) {
      return true;
    }
    if (!actual || !expected || typeof actual !== "object" || typeof expected !== "object") {
      return false;
    }
    if (Object.getPrototypeOf(actual) !== Object.getPrototypeOf(expected)) {
      return false;
    }
    if (actual instanceof Date) {
      return actual.getTime() === expected.getTime();
    }
    if (actual instanceof RegExp) {
      return actual.source === expected.source && actual.flags === expected.flags;
    }

    var priorIndex = seenActual.indexOf(actual);
    if (priorIndex !== -1) {
      return seenExpected[priorIndex] === expected;
    }
    seenActual.push(actual);
    seenExpected.push(expected);

    if (Array.isArray(actual)) {
      if (!Array.isArray(expected) || actual.length !== expected.length) {
        return false;
      }
      for (var index = 0; index < actual.length; index += 1) {
        if (!deepEqualInternal(actual[index], expected[index], seenActual, seenExpected)) {
          return false;
        }
      }
      return true;
    }

    var actualKeys = Object.keys(actual).sort();
    var expectedKeys = Object.keys(expected).sort();
    if (!deepEqualInternal(actualKeys, expectedKeys, seenActual, seenExpected)) {
      return false;
    }
    for (var keyIndex = 0; keyIndex < actualKeys.length; keyIndex += 1) {
      var key = actualKeys[keyIndex];
      if (!deepEqualInternal(actual[key], expected[key], seenActual, seenExpected)) {
        return false;
      }
    }
    return true;
  }

  function assertEqual(actual, expected, message) {
    if (!valuesEqual(actual, expected)) {
      throw new AssertionError(message || ("Expected " + format(expected) + " but received " + format(actual)), actual, expected);
    }
  }

  function assertDeepEqual(actual, expected, message) {
    if (!deepEqualInternal(actual, expected, [], [])) {
      throw new AssertionError(message || ("Values are not deeply equal.\nExpected: " + format(expected) + "\nActual: " + format(actual)), actual, expected);
    }
  }

  function assertTrue(value, message) {
    if (value !== true) {
      throw new AssertionError(message || ("Expected true but received " + format(value)), value, true);
    }
  }

  function assertThrows(callback, expected, message) {
    if (typeof callback !== "function") {
      throw new AssertionError("assertThrows requires a function", callback, "function");
    }
    var thrown = null;
    try {
      callback();
    } catch (error) {
      thrown = error;
    }
    if (!thrown) {
      throw new AssertionError(message || "Expected function to throw", undefined, expected || "an error");
    }
    if (typeof expected === "function" && !(thrown instanceof expected)) {
      throw new AssertionError(message || ("Expected " + (expected.name || "specified error") + " but received " + thrown.name), thrown, expected);
    }
    if (expected instanceof RegExp && !expected.test(String(thrown.message || thrown))) {
      throw new AssertionError(message || ("Thrown message did not match " + expected), thrown.message, expected);
    }
    if (typeof expected === "string" && String(thrown.message || thrown).indexOf(expected) === -1) {
      throw new AssertionError(message || ("Thrown message did not contain " + format(expected)), thrown.message, expected);
    }
    return thrown;
  }

  function describe(name, callback) {
    var suite = { name: String(name), beforeEachHooks: [] };
    suiteStack.push(suite);
    try {
      callback();
    } catch (error) {
      registerTest("suite registration", function () { throw error; }, false);
    } finally {
      suiteStack.pop();
    }
  }

  function beforeEach(callback) {
    if (suiteStack.length === 0) {
      throw new Error("beforeEach() must be declared inside describe()");
    }
    if (typeof callback !== "function") {
      throw new Error("beforeEach() requires a function");
    }
    suiteStack[suiteStack.length - 1].beforeEachHooks.push(callback);
  }

  function registerTest(name, callback, skipped) {
    if (typeof callback !== "function" && !skipped) {
      throw new Error("it() requires a function");
    }
    var suiteNames = suiteStack.map(function (suite) { return suite.name; });
    var hooks = [];
    suiteStack.forEach(function (suite) {
      hooks = hooks.concat(suite.beforeEachHooks);
    });
    tests.push({
      name: String(name),
      fullName: suiteNames.concat(String(name)).join(" › "),
      callback: callback || function () {},
      beforeEachHooks: hooks,
      skipped: Boolean(skipped)
    });
  }

  function it(name, callback) {
    registerTest(name, callback, false);
  }
  it.skip = function (name, callback) {
    registerTest(name, callback, true);
  };

  function getElement(id) {
    return global.document && global.document.getElementById(id);
  }

  function setCount(id, value) {
    var element = getElement(id);
    if (element) {
      element.textContent = String(value);
      element.dataset.count = String(value);
    }
  }

  function errorText(error) {
    if (!error) {
      return "Unknown error";
    }
    return error.stack || (error.name ? error.name + ": " : "") + (error.message || String(error));
  }

  function renderResult(result, openFailure) {
    var container = getElement("test-results");
    if (!container) {
      return;
    }
    var details = global.document.createElement("details");
    var summary = global.document.createElement("summary");
    var icon = global.document.createElement("span");
    var name = global.document.createElement("span");
    var duration = global.document.createElement("span");
    details.className = "test-result test-result--" + result.status;
    details.dataset.status = result.status;
    details.dataset.testName = result.test.fullName;
    if (openFailure && result.status === "failed") {
      details.open = true;
    }
    summary.className = "test-result__summary";
    icon.className = "test-result__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = result.status === "passed" ? "✓" : result.status === "failed" ? "×" : "–";
    name.className = "test-result__name";
    name.textContent = result.test.fullName;
    duration.className = "test-result__duration";
    duration.textContent = result.duration.toFixed(1) + " ms";
    summary.appendChild(icon);
    summary.appendChild(name);
    summary.appendChild(duration);
    details.appendChild(summary);
    if (result.error) {
      var pre = global.document.createElement("pre");
      pre.className = "test-error";
      pre.textContent = errorText(result.error);
      details.appendChild(pre);
    }
    container.appendChild(details);
  }

  function updateDocumentSummary(summary) {
    setCount("test-total", summary.total);
    setCount("test-passed", summary.passed);
    setCount("test-failed", summary.failed);
    setCount("test-skipped", summary.skipped);
    var duration = getElement("test-duration");
    if (duration) {
      duration.textContent = summary.duration.toFixed(1) + " ms";
      duration.dataset.milliseconds = summary.duration.toFixed(1);
    }
    if (global.document && global.document.body) {
      var body = global.document.body;
      body.dataset.testStatus = summary.failed > 0 ? "failed" : "passed";
      body.dataset.total = String(summary.total);
      body.dataset.passed = String(summary.passed);
      body.dataset.failed = String(summary.failed);
      body.dataset.skipped = String(summary.skipped);
      body.dataset.duration = summary.duration.toFixed(1);
    }
    var status = getElement("test-status");
    if (status) {
      status.textContent = summary.failed > 0
        ? (summary.failed + " test(s) failed; remaining tests still completed.")
        : (summary.passed + " test(s) passed.");
    }
  }

  async function run() {
    var currentRun = ++runSequence;
    var runButton = getElement("run-tests");
    var resultsContainer = getElement("test-results");
    var status = getElement("test-status");
    if (runButton) {
      runButton.disabled = true;
      runButton.textContent = "執行中…";
    }
    if (resultsContainer) {
      resultsContainer.textContent = "";
    }
    if (global.document && global.document.body) {
      global.document.body.dataset.testStatus = "running";
    }
    if (status) {
      status.textContent = "Running " + tests.length + " tests…";
    }
    setCount("test-total", tests.length);
    setCount("test-passed", 0);
    setCount("test-failed", 0);
    setCount("test-skipped", 0);

    var startedAt = global.performance && performance.now ? performance.now() : Date.now();
    var summary = { total: tests.length, passed: 0, failed: 0, skipped: 0, duration: 0, results: [] };
    var firstFailureRendered = false;

    for (var index = 0; index < tests.length; index += 1) {
      if (currentRun !== runSequence) {
        break;
      }
      var test = tests[index];
      var testStart = global.performance && performance.now ? performance.now() : Date.now();
      var result = { test: test, status: "passed", duration: 0, error: null };
      if (test.skipped) {
        result.status = "skipped";
        summary.skipped += 1;
      } else {
        try {
          for (var hookIndex = 0; hookIndex < test.beforeEachHooks.length; hookIndex += 1) {
            await Promise.resolve(test.beforeEachHooks[hookIndex]());
          }
          await Promise.resolve(test.callback());
          summary.passed += 1;
        } catch (error) {
          result.status = "failed";
          result.error = error;
          summary.failed += 1;
        }
      }
      result.duration = (global.performance && performance.now ? performance.now() : Date.now()) - testStart;
      summary.results.push(result);
      renderResult(result, !firstFailureRendered);
      if (result.status === "failed") {
        firstFailureRendered = true;
      }
      setCount("test-passed", summary.passed);
      setCount("test-failed", summary.failed);
      setCount("test-skipped", summary.skipped);
      await Promise.resolve();
    }

    summary.duration = (global.performance && performance.now ? performance.now() : Date.now()) - startedAt;
    updateDocumentSummary(summary);
    if (runButton) {
      runButton.disabled = false;
      runButton.textContent = "重新執行";
    }
    global.TestRunner.lastResult = summary;
    return summary;
  }

  global.describe = describe;
  global.it = it;
  global.beforeEach = beforeEach;
  global.assertEqual = assertEqual;
  global.assertDeepEqual = assertDeepEqual;
  global.assertTrue = assertTrue;
  global.assertThrows = assertThrows;
  global.TestRunner = {
    AssertionError: AssertionError,
    tests: tests,
    run: run,
    lastResult: null
  };

  function ready() {
    var runButton = getElement("run-tests");
    if (runButton) {
      runButton.addEventListener("click", run);
    }
    global.setTimeout(run, 0);
  }

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", ready, { once: true });
    } else {
      ready();
    }
  }
}(window));
