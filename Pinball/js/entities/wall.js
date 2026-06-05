(function (window) {
  "use strict";

  var Pinball = window.Pinball;

  function Wall(x1, y1, x2, y2, options) {
    options = options || {};
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.restitution = options.restitution || 0.78;
    this.kind = options.kind || "rail";
  }

  Pinball.Wall = Wall;
})(window);
