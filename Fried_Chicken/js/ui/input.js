(function (global) {
  "use strict";
  var CCC = global.CCC;
  var controller = null;
  var drag = null;
  var selected = false;
  var marinateHolding = false;
  var suppressMarinateClickUntil = 0;
  var lastCoatAt = 0;

  function session() { return CCC.state.session; }

  function setSelected(value, root) {
    selected = value;
    var item = root && root.querySelector('[data-drag-food="current"]');
    if (item) { item.setAttribute("aria-pressed", value ? "true" : "false"); }
    Array.prototype.forEach.call((root || document).querySelectorAll("[data-drop-zone]"), function (zone) {
      zone.classList.toggle("is-valid-target", value);
    });
    if (value) { CCC.events.emit("feedback", { key: "status.selected", tone: "info" }); }
  }

  function handleDrop(zone) {
    var currentSession = session();
    if (!currentSession || !zone) { return; }
    currentSession.cooking.moveCurrent(zone.dataset.zone, { basketIndex: zone.dataset.basketIndex == null ? undefined : Number(zone.dataset.basketIndex) });
  }

  function cancelDrag() {
    if (!drag) { return; }
    if (drag.ghost && drag.ghost.parentNode) { drag.ghost.parentNode.removeChild(drag.ghost); }
    if (drag.source) { drag.source.classList.remove("is-dragging"); }
    drag = null;
  }

  function bindGame(root) {
    if (controller) { controller.abort(); }
    controller = new AbortController();
    var signal = controller.signal;
    selected = false;

    root.addEventListener("click", function (event) {
      var action = event.target.closest("[data-game-action]");
      var currentSession = session();
      if (!currentSession || currentSession.finished || !action) { return; }
      var type = action.dataset.gameAction;
      if (type === "take") { currentSession.cooking.takeChicken(); }
      else if (type === "marinate-toggle") {
        if (performance.now() < suppressMarinateClickUntil) { return; }
        if (currentSession.cooking.current && currentSession.cooking.current.marinateActive) { currentSession.cooking.stopMarinate(); }
        else { currentSession.cooking.startMarinate(); }
      }
      else if (type === "coat") { currentSession.cooking.coat(); }
      else if (type === "heat-up") { currentSession.cooking.adjustTemperature(1); }
      else if (type === "heat-down") { currentSession.cooking.adjustTemperature(-1); }
      else if (type === "flip") { currentSession.cooking.flip(Number(action.dataset.index)); }
      else if (type === "collect") { currentSession.cooking.collect(Number(action.dataset.index)); }
      else if (type === "season") { currentSession.cooking.season(action.dataset.recipe); }
      else if (type === "bag") { currentSession.cooking.bag(); }
      else if (type === "discard") { currentSession.cooking.discard(); }
      else if (type === "select-order") {
        currentSession.selectOrder(action.dataset.orderId);
        if (currentSession.cooking.current && currentSession.cooking.current.stage === "bagged") { currentSession.cooking.deliver(action.dataset.orderId); }
      }
      else if (type === "deliver") { currentSession.cooking.deliver(action.dataset.orderId); }
      else if (type === "pause") { CCC.router.togglePause(); }
    }, { signal: signal });

    root.addEventListener("pointerdown", function (event) {
      var marinate = event.target.closest('[data-game-action="marinate-toggle"]');
      if (marinate && event.pointerType !== "mouse") {
        event.preventDefault();
        marinateHolding = true;
        session().cooking.startMarinate();
        marinate.setPointerCapture(event.pointerId);
        return;
      }
      var source = event.target.closest('[data-drag-food="current"]');
      if (!source || !session() || session().finished || event.button > 0) { return; }
      event.preventDefault();
      var ghost = source.cloneNode(true);
      ghost.classList.add("drag-ghost");
      ghost.removeAttribute("tabindex");
      ghost.removeAttribute("role");
      document.body.appendChild(ghost);
      source.classList.add("is-dragging");
      drag = { source: source, ghost: ghost, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, moved: false };
      ghost.style.left = event.clientX + "px";
      ghost.style.top = event.clientY + "px";
      source.setPointerCapture(event.pointerId);
    }, { signal: signal });

    root.addEventListener("pointermove", function (event) {
      var coating = event.target.closest('.station--coating');
      if (!drag && coating && event.buttons && session().cooking.current && session().cooking.current.stage === "coating" && performance.now() - lastCoatAt > 110) {
        lastCoatAt = performance.now(); session().cooking.coat();
      }
      if (!drag) { return; }
      drag.x = event.clientX; drag.y = event.clientY;
      drag.moved = drag.moved || Math.hypot(drag.x - drag.startX, drag.y - drag.startY) > 8;
      drag.ghost.style.left = drag.x + "px";
      drag.ghost.style.top = drag.y + "px";
      Array.prototype.forEach.call(root.querySelectorAll("[data-drop-zone]"), function (zone) { zone.dataset.dropActive = "false"; });
      var under = document.elementFromPoint(drag.x, drag.y);
      var zone = under && under.closest("[data-drop-zone]");
      if (zone) { zone.dataset.dropActive = "true"; }
    }, { signal: signal });

    function pointerEnd(event) {
      if (marinateHolding) {
        marinateHolding = false;
        suppressMarinateClickUntil = performance.now() + 450;
        if (session() && session().cooking.current) { session().cooking.stopMarinate(); }
      }
      if (!drag) { return; }
      var wasMoved = drag.moved;
      var x = event.clientX || drag.x;
      var y = event.clientY || drag.y;
      var under = document.elementFromPoint(x, y);
      var zone = under && under.closest("[data-drop-zone]");
      cancelDrag();
      Array.prototype.forEach.call(root.querySelectorAll("[data-drop-zone]"), function (item) { item.dataset.dropActive = "false"; });
      if (wasMoved && zone) { handleDrop(zone); setSelected(false, root); }
      else if (!wasMoved) { setSelected(!selected, root); }
      else { CCC.events.emit("feedback", { key: "status.invalid", tone: "error" }); }
    }

    root.addEventListener("pointerup", pointerEnd, { signal: signal });
    root.addEventListener("pointercancel", pointerEnd, { signal: signal });
    root.addEventListener("click", function (event) {
      var zone = event.target.closest("[data-drop-zone]");
      if (selected && zone && !event.target.closest("button, [data-drag-food]")) { handleDrop(zone); setSelected(false, root); }
    }, { signal: signal });
    root.addEventListener("keydown", function (event) {
      var food = event.target.closest('[data-drag-food="current"]');
      if (food && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setSelected(!selected, root); return; }
      var zone = event.target.closest("[data-drop-zone]");
      if (selected && zone && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); handleDrop(zone); setSelected(false, root); }
    }, { signal: signal });
  }

  CCC.ui = CCC.ui || {};
  CCC.ui.input = { bindGame: bindGame, cancelDrag: cancelDrag };
}(typeof window !== "undefined" ? window : globalThis));
