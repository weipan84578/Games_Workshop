window.VP = window.VP || {};

VP.InstructionsPanel = (function () {
  var activeTab = "actions";

  function render() {
    var grid = VP.dom.$("#instruction-grid");
    var cards = VP.i18n.t("instructions.cards." + activeTab) || [];
    if (!grid) {
      return;
    }
    grid.innerHTML = "";
    cards.forEach(function (card) {
      var item = document.createElement("article");
      item.className = "instruction-card";
      item.innerHTML = [
        '<span class="instruction-icon" aria-hidden="true"></span>',
        "<h3></h3>",
        "<p></p>"
      ].join("");
      VP.dom.$(".instruction-icon", item).textContent = card.icon;
      VP.dom.$("h3", item).textContent = card.title;
      VP.dom.$("p", item).textContent = card.body;
      grid.appendChild(item);
    });
  }

  function setTab(tab) {
    activeTab = tab;
    VP.dom.$$(".tab").forEach(function (button) {
      var active = button.getAttribute("data-tab") === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    render();
  }

  function init() {
    VP.dom.$$(".tab").forEach(function (button) {
      button.addEventListener("click", function () {
        setTab(button.getAttribute("data-tab"));
        VP.AudioManager.playSfx("click");
      });
    });
    VP.EventBus.on("i18n:changed", render);
    render();
  }

  return {
    init: init,
    render: render
  };
})();
