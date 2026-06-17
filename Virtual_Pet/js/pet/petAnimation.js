window.VP = window.VP || {};

VP.PetAnimation = (function () {
  var activeTimer = 0;

  function sprite() {
    return VP.dom.$("#pet-sprite");
  }

  function applyColors(element, species, eggType) {
    var egg = VP.PetCatalog.getEggType(eggType);
    var colors = species ? species.colors : [egg.colors[0], egg.colors[1], "#ffffff"];
    element.style.setProperty("--pet-primary", colors[0]);
    element.style.setProperty("--pet-secondary", colors[1]);
    element.style.setProperty("--pet-accent", colors[2] || colors[1]);
    element.setAttribute("data-family", species ? species.family : "egg");
    element.setAttribute("aria-label", species ? VP.PetCatalog.getPetName(species) : VP.i18n.t("eggSelection.mysteryEgg"));
  }

  function setVisual(stage, mood, species, eggType, hiddenSpecies) {
    var element = sprite();
    if (!element) {
      return;
    }
    applyColors(element, species, eggType);
    element.setAttribute("data-stage", stage || "egg");
    element.setAttribute("data-mood", mood || "normal");
    if (VP.PetArt && VP.PetArt.render) {
      VP.PetArt.render(element, {
        stage: stage || "egg",
        mood: mood || "normal",
        species: species,
        hiddenSpecies: hiddenSpecies,
        eggType: eggType
      });
    }
    if (mood === "sleeping") {
      element.className = "pet-sprite is-sleep";
      return;
    }
    if (element.classList.contains("is-sleep")) {
      element.className = "pet-sprite is-idle";
      return;
    }
    if (!/(is-warm|is-feed|is-play|is-clean|is-pet|is-levelup|is-warning)/.test(element.className)) {
      element.classList.add("is-idle");
    }
  }

  function play(name, duration) {
    var element = sprite();
    if (!element) {
      return;
    }
    window.clearTimeout(activeTimer);
    element.className = "pet-sprite is-" + name;
    if (name !== "sleep") {
      activeTimer = window.setTimeout(function () {
        element.className = "pet-sprite is-idle";
      }, duration || 760);
    }
  }

  function setSpeech(keyOrText) {
    var bubble = VP.dom.$("#speech-bubble");
    if (!bubble) {
      return;
    }
    bubble.textContent = VP.i18n.t(keyOrText) === keyOrText ? keyOrText : VP.i18n.t(keyOrText);
  }

  return {
    setVisual: setVisual,
    play: play,
    setSpeech: setSpeech
  };
})();
