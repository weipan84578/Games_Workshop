(function (root) {
  "use strict";

  var app = root.AutoBattler = root.AutoBattler || {};
  app.ItemData = [
    { id: "acorn-charm", icon: "🌰", nameKey: "items.acorn", stat: "health", value: 30 },
    { id: "sun-drop", icon: "☀️", nameKey: "items.sunDrop", stat: "attack", value: 8 },
    { id: "moon-ribbon", icon: "🎀", nameKey: "items.moonRibbon", stat: "manaMax", value: -10 },
    { id: "leaf-cape", icon: "🍃", nameKey: "items.leafCape", stat: "defense", value: 8 }
  ];
}(window));
