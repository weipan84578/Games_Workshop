window.VP = window.VP || {};

VP.EggSelection = (function () {
  function render() {
    var grid = VP.dom.$("#egg-grid");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";
    VP.PetCatalog.listEggs().forEach(function (egg) {
      var card = document.createElement("button");
      card.className = "egg-card";
      card.type = "button";
      card.setAttribute("data-egg-type", egg.id);
      card.style.setProperty("--egg-a", egg.colors[0]);
      card.style.setProperty("--egg-b", egg.colors[1]);
      card.innerHTML = [
        '<span class="egg-orb" aria-hidden="true"><span>' + egg.icon + "</span></span>",
        '<strong data-i18n="eggSelection.eggs.' + egg.id + '"></strong>',
        '<em data-i18n="eggSelection.unknown"></em>'
      ].join("");
      grid.appendChild(card);
    });
    VP.i18n.apply(grid);
  }

  function init() {
    render();
    VP.dom.on(VP.dom.$("#egg-grid"), "click", function (event) {
      var card = event.target.closest("[data-egg-type]");
      if (!card) {
        return;
      }
      VP.AudioManager.playSfx("hatch");
      VP.App.beginEggGame(card.getAttribute("data-egg-type"));
    });
    VP.EventBus.on("i18n:changed", render);
  }

  return {
    init: init,
    render: render
  };
})();
