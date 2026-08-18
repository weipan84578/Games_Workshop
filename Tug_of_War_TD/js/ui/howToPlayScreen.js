(function (global) {
  var app = global.TugOfWar = global.TugOfWar || {};
  var tabs = ["basics", "resources", "units", "matchups", "victory"];
  var currentIndex = 0;

  function init() {
    document.querySelectorAll("[data-how-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        switchTo(tabs.indexOf(button.getAttribute("data-how-tab")));
      });
    });
    document.getElementById("how-prev").addEventListener("click", function () { switchTo(currentIndex - 1); });
    document.getElementById("how-next").addEventListener("click", function () { switchTo(currentIndex + 1); });
    app.events.on("i18n:change", function () {
      renderUnits();
      switchTo(currentIndex);
    });
    renderUnits();
  }

  function switchTo(index) {
    currentIndex = (index + tabs.length) % tabs.length;
    var name = tabs[currentIndex];
    document.querySelectorAll("[data-how-tab]").forEach(function (button) {
      var active = button.getAttribute("data-how-tab") === name;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll("[data-how-panel]").forEach(function (panel) {
      var active = panel.getAttribute("data-how-panel") === name;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
    document.getElementById("how-page-indicator").textContent = (currentIndex + 1) + " / " + tabs.length;
  }

  function renderUnits() {
    var container = document.getElementById("how-unit-grid");
    if (!container) {
      return;
    }
    container.innerHTML = "";
    global.UNIT_ORDER.forEach(function (id) {
      var unit = global.UNITS_DATA[id];
      var card = document.createElement("article");
      card.className = "unit-guide-card";
      card.style.setProperty("--unit-color", unit.color);
      card.innerHTML =
        '<span class="unit-guide-icon">' + unit.icon + '</span><div><h3>' + app.t(unit.nameKey) + '</h3><span class="unit-guide-meta"><span class="unit-meta-pill">' + app.t(unit.roleKey) + '</span><span class="unit-meta-pill">⚡ ' + unit.cost + '</span></span></div>' +
        '<p>' + app.t(unit.descriptionKey) + '</p><div class="unit-guide-meta"><span class="unit-meta-pill">❤️ ' + unit.hp + '</span><span class="unit-meta-pill">⚔️ ' + unit.atk + '</span><span class="unit-meta-pill">' + app.t(unit.attribute === "normal" ? "attribute_normal" : "attribute_" + unit.attribute) + '</span></div>';
      container.appendChild(card);
    });
  }

  app.HowToPlayScreen = { init: init, switchTo: switchTo };
})(window);
