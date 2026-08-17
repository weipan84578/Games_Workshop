(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};
  var draggingId = null;

  app.DragDrop = {
    init: function () {
      document.addEventListener("dragstart", function (event) {
        var element = event.target.closest && event.target.closest("[data-unit-id]");
        if (!element) return;
        draggingId = element.getAttribute("data-unit-id");
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", draggingId);
        }
      });
      document.addEventListener("dragover", function (event) {
        if (event.target.closest && event.target.closest("[data-action=board-slot]")) event.preventDefault();
      });
      document.addEventListener("drop", function (event) {
        var target = event.target.closest && event.target.closest("[data-action=board-slot]");
        if (!target) return;
        event.preventDefault();
        var id = draggingId || (event.dataTransfer && event.dataTransfer.getData("text/plain"));
        if (id) app.GameEngine.dropUnit(id, Number(target.getAttribute("data-slot")));
        draggingId = null;
      });
      document.addEventListener("dragend", function () { draggingId = null; });
    }
  };
}(window));
