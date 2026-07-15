(function (window) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var filter = document.getElementById("module-filter");
    var runButton = document.getElementById("run-all");
    var resultsRoot = document.getElementById("test-results");
    var modules = Array.from(
      new Set(
        window.DJTest.tests.map(function (item) {
          return item.module;
        }),
      ),
    ).sort();

    modules.forEach(function (module) {
      var option = document.createElement("option");
      option.value = module;
      option.textContent = module;
      filter.appendChild(option);
    });

    function render(report) {
      while (resultsRoot.firstChild)
        resultsRoot.removeChild(resultsRoot.firstChild);
      var passed = report.results.filter(function (result) {
        return result.passed;
      }).length;
      var failed = report.results.length - passed;
      document.getElementById("total-count").textContent =
        report.results.length;
      document.getElementById("pass-count").textContent = passed;
      document.getElementById("fail-count").textContent = failed;
      document.getElementById("duration").textContent = report.duration + " ms";

      if (!report.results.length) {
        var empty = document.createElement("div");
        empty.className = "runner-empty";
        empty.textContent = "沒有符合篩選條件的測試。";
        resultsRoot.appendChild(empty);
        return;
      }

      report.results.forEach(function (result) {
        var article = document.createElement("article");
        article.className =
          "test-case " + (result.passed ? "test-pass" : "test-fail");
        var head = document.createElement("div");
        head.className = "test-case-head";
        var badge = document.createElement("span");
        badge.className = "test-badge";
        badge.textContent = result.passed ? "✓" : "!";
        var name = document.createElement("span");
        name.className = "test-name";
        name.textContent = result.name;
        var module = document.createElement("span");
        module.className = "test-module";
        module.textContent = result.module;
        head.appendChild(badge);
        head.appendChild(name);
        head.appendChild(module);
        article.appendChild(head);
        if (result.error) {
          var error = document.createElement("pre");
          error.className = "test-error";
          error.textContent = result.error;
          article.appendChild(error);
        }
        resultsRoot.appendChild(article);
      });
    }

    function run() {
      render(window.DJTest.run(filter.value));
    }

    runButton.addEventListener("click", run);
    filter.addEventListener("change", run);
    run();
  });
})(window);
