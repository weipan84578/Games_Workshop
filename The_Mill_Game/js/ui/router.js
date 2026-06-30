(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};
  var currentView = "view-main-menu";

  function show(viewId) {
    var views = document.querySelectorAll(".view");
    var target = document.getElementById(viewId);
    if (!target) {
      return;
    }
    for (var i = 0; i < views.length; i += 1) {
      views[i].classList.toggle("active", views[i].id === viewId);
    }
    currentView = viewId;
    if (NMM.I18n) {
      NMM.I18n.apply(document);
    }
  }

  function getCurrentView() {
    return currentView;
  }

  NMM.Router = {
    show: show,
    getCurrentView: getCurrentView
  };
})(window);
