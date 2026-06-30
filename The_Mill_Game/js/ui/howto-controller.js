(function (global) {
  "use strict";

  var NMM = global.NMM = global.NMM || {};

  function render() {
    var root = document.getElementById("howto-content");
    root.textContent = "";
    for (var i = 1; i <= 7; i += 1) {
      var section = document.createElement("section");
      var number = document.createElement("span");
      var title = document.createElement("h3");
      var body = document.createElement("p");
      section.className = "howto-item";
      number.textContent = String(i);
      title.textContent = NMM.I18n.t("howto_" + i + "_title");
      body.textContent = NMM.I18n.t("howto_" + i + "_body");
      section.appendChild(number);
      section.appendChild(title);
      section.appendChild(body);
      root.appendChild(section);
    }
  }

  NMM.Howto = {
    render: render
  };
})(window);
