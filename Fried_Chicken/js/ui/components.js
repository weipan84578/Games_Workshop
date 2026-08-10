(function (global) {
  "use strict";
  var CCC = global.CCC;
  var dialogState = null;

  function t(key, values) { return CCC.i18n.t(key, values); }

  function recipeById(id) {
    return CCC.data.recipes.find(function (recipe) { return recipe.id === id; });
  }

  function recipeIcon(recipe, small) {
    return '<span class="flavor-icon' + (small ? ' flavor-icon--small' : '') + '" aria-hidden="true" style="--shape:' + recipe.jarShape + ';--flavor-bg:' + recipe.bg + ';color:' + recipe.jarColor + '">' + CCC.utils.escapeHtml(recipe.icon) + '</span>';
  }

  function foodLabel(piece) {
    if (!piece) { return ""; }
    var key = "food.raw";
    if (piece.stage === "marinating" || piece.stage === "marinated") { key = "food.marinated"; }
    else if (piece.stage === "coating") { key = "food.coated"; }
    else if (piece.stage === "frying") { key = "food.frying"; }
    else if (piece.stage === "fried") { key = "food.fried"; }
    else if (piece.stage === "seasoned") { key = "food.seasoned"; }
    else if (piece.stage === "bagged") { key = "food.bagged"; }
    return t(key);
  }

  function foodStage(piece) {
    if (piece.stage === "raw") { return "raw"; }
    if (piece.stage === "marinating" || piece.stage === "marinated") { return "marinated"; }
    if (piece.stage === "coating") { return "coated"; }
    if (piece.stage === "frying" || piece.stage === "fried") {
      if (piece.fry && piece.fry.doneness > 100) { return "fried-burnt"; }
      if (piece.fry && piece.fry.doneness >= 90) { return "fried-golden"; }
      return "fried-light";
    }
    return piece.stage;
  }

  function food(piece, draggable) {
    var label = foodLabel(piece);
    var attrs = draggable ? ' role="button" tabindex="0" data-drag-food="current" aria-pressed="false"' : '';
    return '<div class="food-item" data-stage="' + foodStage(piece) + '" aria-label="' + CCC.utils.escapeHtml(label) + '"' + attrs + '><span>' + CCC.utils.escapeHtml(label) + '</span></div>';
  }

  function closeDialog(result) {
    if (!dialogState) { return; }
    var state = dialogState;
    dialogState = null;
    CCC.state.dialogOpen = false;
    document.getElementById("dialog-root").innerHTML = "";
    document.removeEventListener("keydown", state.keyHandler, true);
    document.getElementById("dialog-root").removeEventListener("click", state.clickHandler);
    if (state.trigger && typeof state.trigger.focus === "function" && document.contains(state.trigger)) { state.trigger.focus(); }
    if (typeof state.onClose === "function") { state.onClose(result); }
  }

  function openDialog(options) {
    if (dialogState) { return false; }
    var root = document.getElementById("dialog-root");
    var trigger = document.activeElement;
    var actions = options.actions || [{ label: t("common.close"), className: "btn", value: "close" }];
    var actionHtml = actions.map(function (action, index) {
      return '<button class="' + (action.className || "btn") + '" type="button" data-dialog-action="' + index + '"' + (action.autofocus ? ' autofocus' : '') + '>' + CCC.utils.escapeHtml(action.label) + '</button>';
    }).join("");
    root.innerHTML = '<div class="dialog-backdrop"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><h2 id="dialog-title">' + CCC.utils.escapeHtml(options.title) + '</h2><div class="dialog__body">' + (options.bodyHtml || '<p>' + CCC.utils.escapeHtml(options.body || "") + '</p>') + '</div><div class="dialog__actions">' + actionHtml + '</div></section></div>';
    CCC.state.dialogOpen = true;

    function keyHandler(event) {
      if (!dialogState) { return; }
      if (event.key === "Escape" && options.dismissible !== false) { event.preventDefault(); closeDialog("escape"); return; }
      if (event.key !== "Tab") { return; }
      var focusable = Array.prototype.slice.call(root.querySelectorAll("button:not(:disabled), [href], input:not(:disabled), select:not(:disabled)"));
      if (!focusable.length) { return; }
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    function clickHandler(event) {
      var button = event.target.closest("[data-dialog-action]");
      if (!button || !dialogState) { return; }
      var action = actions[Number(button.dataset.dialogAction)];
      if (action && typeof action.onClick === "function") { action.onClick(); }
      if (!action || action.close !== false) { closeDialog(action ? action.value : undefined); }
    }

    dialogState = { trigger: trigger, onClose: options.onClose, keyHandler: keyHandler, clickHandler: clickHandler };
    document.addEventListener("keydown", keyHandler, true);
    root.addEventListener("click", clickHandler);
    var firstFocus = root.querySelector("[autofocus], button:not(:disabled), input:not(:disabled), select:not(:disabled)");
    if (firstFocus) { setTimeout(function () { firstFocus.focus(); }, 0); }
    return true;
  }

  function toast(message, tone) {
    var region = document.getElementById("toast-region");
    var item = document.createElement("div");
    item.className = "toast" + (tone ? " toast--" + tone : "");
    item.setAttribute("role", tone === "error" ? "alert" : "status");
    item.textContent = message;
    region.appendChild(item);
    setTimeout(function () {
      item.style.opacity = "0";
      setTimeout(function () { if (item.parentNode) { item.parentNode.removeChild(item); } }, 220);
    }, 3200);
  }

  CCC.ui = CCC.ui || {};
  CCC.ui.components = {
    t: t,
    recipeById: recipeById,
    recipeIcon: recipeIcon,
    food: food,
    foodLabel: foodLabel,
    openDialog: openDialog,
    closeDialog: closeDialog,
    toast: toast,
    stars: function (count) {
      var html = '<span class="stars" aria-label="' + count + ' / 3">';
      for (var index = 1; index <= 3; index += 1) { html += '<span class="star' + (index <= count ? ' is-earned' : '') + '" aria-hidden="true">★</span>'; }
      return html + '</span>';
    },
    progress: function (value, className, label) {
      return '<div class="progress ' + (className || "") + '" aria-label="' + CCC.utils.escapeHtml(label) + '"><div class="progress__fill" style="--value:' + CCC.utils.clamp(value, 0, 100) + '%"></div><span class="progress__label">' + CCC.utils.escapeHtml(label) + '</span></div>';
    }
  };
}(typeof window !== "undefined" ? window : globalThis));
