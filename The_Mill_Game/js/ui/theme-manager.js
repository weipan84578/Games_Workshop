(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var C = NMM.Constants;

  function apply(theme) {
    var selected = C.THEMES.indexOf(theme) >= 0 ? theme : "classic";
    for (var i = 0; i < C.THEMES.length; i += 1) {
      document.body.classList.remove("theme-" + C.THEMES[i]);
    }
    document.body.classList.add("theme-" + selected);
    return selected;
  }

  function label(theme) {
    return NMM.I18n.t("theme_" + theme);
  }

  NMM.ThemeManager = {
    apply: apply,
    label: label
  };
})(window);
