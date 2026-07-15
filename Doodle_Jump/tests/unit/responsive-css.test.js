(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  function withViewport(width, height, callback) {
    return new Promise(function (resolve, reject) {
      var iframe = document.createElement("iframe");
      iframe.title = "Responsive CSS fixture";
      iframe.style.position = "fixed";
      iframe.style.left = "-10000px";
      iframe.style.width = width + "px";
      iframe.style.height = height + "px";
      iframe.style.border = "0";
      iframe.addEventListener("load", function () {
        try {
          callback(iframe.contentWindow, iframe.contentDocument);
          iframe.parentNode.removeChild(iframe);
          resolve();
        } catch (error) {
          if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
          reject(error);
        }
      });
      iframe.srcdoc =
        '<!doctype html><html><head>' +
        '<link rel="stylesheet" href="../css/00-tokens.css">' +
        '<link rel="stylesheet" href="../css/pages/game.css">' +
        '<link rel="stylesheet" href="../css/components/touch-controls.css">' +
        '<link rel="stylesheet" href="../css/utilities/responsive.css">' +
        "</head><body>" +
        '<main class="page-game"><div class="game-stage-row">' +
        '<div class="canvas-column"><div class="canvas-frame"></div></div>' +
        '<div class="touch-controls"><button class="touch-button touch-left"></button>' +
        '<button class="touch-button touch-right"></button></div>' +
        "</div></main></body></html>";
      document.body.appendChild(iframe);
    });
  }

  Test.test("320px 直向套用正式底部控制列樣式", "responsive", function () {
    return withViewport(320, 568, function (view, doc) {
      assert.equal(view.getComputedStyle(doc.querySelector(".game-stage-row")).display, "block");
      assert.equal(view.getComputedStyle(doc.querySelector(".touch-controls")).display, "flex");
      var buttonWidth = parseFloat(
        view.getComputedStyle(doc.querySelector(".touch-button")).width,
      );
      assert.truthy(buttonWidth > 100 && buttonWidth < 160);
    });
  });

  Test.test("568×320 橫向套用 Canvas 兩側安全控制欄", "responsive", function () {
    return withViewport(568, 320, function (view, doc) {
      assert.equal(view.getComputedStyle(doc.querySelector(".game-stage-row")).display, "grid");
      assert.equal(view.getComputedStyle(doc.querySelector(".touch-controls")).display, "contents");
      assert.equal(view.getComputedStyle(doc.querySelector(".touch-button")).position, "absolute");
    });
  });

  Test.test("1366px 桌面保留三欄遊戲舞台", "responsive", function () {
    return withViewport(1366, 768, function (view, doc) {
      var stage = view.getComputedStyle(doc.querySelector(".game-stage-row"));
      var controls = view.getComputedStyle(doc.querySelector(".touch-controls"));
      assert.equal(stage.display, "grid");
      assert.equal(controls.display, "none");
    });
  });
})(window.DJGame, window.DJTest);
