window.VP = window.VP || {};

VP.EncyclopediaPanel = (function () {
  function render() {
    var grid = VP.dom.$("#encyclopedia-grid");
    var count = VP.dom.$("#encyclopedia-count");
    if (!grid || !count) {
      return;
    }
    var pets = VP.PetCatalog.listPets();
    var collection = VP.PetCatalog.loadCollection();
    var raisedCount = 0;
    grid.innerHTML = "";

    pets.forEach(function (pet, index) {
      var entry = collection[pet.id] || {};
      var raised = Boolean(entry.raised);
      if (raised) {
        raisedCount += 1;
      }

      var card = document.createElement("article");
      card.className = "dex-card" + (raised ? " is-raised" : " is-locked");
      card.style.setProperty("--pet-primary", pet.colors[0]);
      card.style.setProperty("--pet-secondary", pet.colors[1]);
      card.style.setProperty("--pet-accent", pet.colors[2]);

      var number = String(index + 1).padStart(2, "0");
      var name = raised ? VP.PetCatalog.getPetName(pet) : VP.i18n.t("encyclopedia.lockedName");
      var family = raised ? VP.i18n.t("families." + pet.family) : "???";
      var raisedAt = raised ? VP.TimeUtils.formatClock(entry.raisedAt) : "";

      var icon = raised && VP.PetArt ? VP.PetArt.thumbnail(pet, "prime") : "?";

      card.innerHTML = [
        '<div class="dex-icon" aria-hidden="true">' + icon + "</div>",
        '<div class="dex-copy">',
        "<strong>#" + number + " " + name + "</strong>",
        "<span>" + family + "</span>",
        raisedAt ? '<small>' + VP.i18n.t("encyclopedia.raisedAt", { time: raisedAt }) + "</small>" : '<small data-i18n="encyclopedia.lockedHint"></small>',
        "</div>"
      ].join("");
      grid.appendChild(card);
    });

    count.textContent = raisedCount + " / " + pets.length;
    VP.i18n.apply(grid);
  }

  function init() {
    render();
    VP.EventBus.on("collection:changed", render);
    VP.EventBus.on("i18n:changed", render);
    VP.EventBus.on("scene:changed", function (scene) {
      if (scene.current === "encyclopedia") {
        render();
      }
    });
  }

  return {
    init: init,
    render: render
  };
})();
