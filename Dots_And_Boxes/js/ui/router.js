(function (ns) {
  "use strict";

  var previousRoute = "menu";
  var currentRoute = "menu";

  ns.Router = {
    show: function (route) {
      var page = document.querySelector('[data-route="' + route + '"]');
      if (!page) {
        return;
      }
      previousRoute = currentRoute;
      currentRoute = route;
      ns.$$(".page").forEach(function (node) {
        node.classList.toggle("page--active", node === page);
      });
      document.body.dataset.page = route;
      if (route === "game") {
        ns.AudioManager.playBgm("gameplay");
      } else {
        ns.AudioManager.playBgm("menu");
      }
      ns.events.emit("routechange", { route: route, previousRoute: previousRoute });
    },

    back: function () {
      if (currentRoute === "settings" && previousRoute === "game") {
        this.show("game");
        return;
      }
      this.show("menu");
    },

    current: function () {
      return currentRoute;
    }
  };
})(window.DAB = window.DAB || {});
