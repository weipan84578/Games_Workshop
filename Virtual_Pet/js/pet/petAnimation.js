window.VP = window.VP || {};

VP.PetAnimation = (function () {
  var activeTimer = 0;

  function sprite() {
    return VP.dom.$("#pet-sprite");
  }

  function setVisual(stage, mood) {
    var element = sprite();
    if (!element) {
      return;
    }
    element.setAttribute("data-stage", stage || "egg");
    element.setAttribute("data-mood", mood || "normal");
    if (mood === "sleeping") {
      element.className = "pet-sprite is-sleep";
      return;
    }
    if (element.classList.contains("is-sleep")) {
      element.className = "pet-sprite is-idle";
      return;
    }
    if (!/(is-feed|is-play|is-clean|is-pet|is-levelup|is-warning)/.test(element.className)) {
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
