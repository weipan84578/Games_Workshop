(function (ns) {
  "use strict";

  ns.ThemeSwitcher = {
    apply: function (theme) {
      var selected = theme || "classic";
      document.body.dataset.theme = selected;
      var color = selected === "night" ? "#101827" : "#2b2438";
      var themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) {
        themeColor.setAttribute("content", color);
      }
      ns.events.emit("themechange", selected);
    }
  };
})(window.DAB = window.DAB || {});
