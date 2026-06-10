(function(global) {
  "use strict";

  var Mancala = global.Mancala = global.Mancala || {};

  function ToastManager(container) {
    this.container = container;
  }

  ToastManager.prototype.show = function(message, options) {
    options = options || {};
    if (!this.container) {
      return;
    }

    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    this.container.appendChild(toast);

    global.setTimeout(function() {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      global.setTimeout(function() {
        toast.remove();
      }, 180);
    }, options.duration || 2600);
  };

  Mancala.ToastManager = ToastManager;
})(window);
