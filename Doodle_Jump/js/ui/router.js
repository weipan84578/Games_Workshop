(function (Game) {
  "use strict";
  function Router(root, bus) {
    this.root = root;
    this.bus = bus;
    this.pages = {};
    this.current = "home";
  }
  Router.prototype.register = function (page) {
    this.pages[page.getAttribute("data-route")] = page;
  };
  Router.prototype.go = function (route, options) {
    options = options || {};
    if (!this.pages[route]) route = "home";

    var previous = this.current;
    var pages = this.pages;
    Object.keys(pages).forEach(function (name) {
      var page = pages[name];
      var active = name === route;
      page.hidden = !active;
      page.classList.toggle("is-active", active);
      page.setAttribute("aria-hidden", active ? "false" : "true");
    });

    this.current = route;
    if (!options.preserveScroll) window.scrollTo(0, 0);

    var heading = this.pages[route].querySelector("h1, h2");
    if (heading && !options.noFocus) {
      heading.setAttribute("tabindex", "-1");
      window.setTimeout(function () {
        heading.focus({ preventScroll: true });
      }, 0);
    }

    if (this.bus) {
      this.bus.emit(Game.Events.ROUTE, { from: previous, to: route });
    }
  };
  Router.prototype.back = function () {
    this.go("home");
  };
  Game.Router = Router;
})(window.DJGame);
