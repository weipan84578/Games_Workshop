(function (global) {
  "use strict";
  var CCC = global.CCC;

  CCC.data = CCC.data || {};

  CCC.data.levels = [
    { day: 1, duration: 120, goal: 360, patience: 34, maxOrders: 1, recipes: 1, drift: 3.0, tutorial: "tutorial.day1" },
    { day: 2, duration: 135, goal: 560, patience: 32, maxOrders: 1, recipes: 2, drift: 3.2, tutorial: "tutorial.day2" },
    { day: 3, duration: 150, goal: 800, patience: 31, maxOrders: 2, recipes: 3, drift: 3.4, tutorial: "tutorial.day3" },
    { day: 4, duration: 165, goal: 1080, patience: 29, maxOrders: 2, recipes: 4, drift: 3.7, tutorial: "tutorial.day4" },
    { day: 5, duration: 180, goal: 1380, patience: 28, maxOrders: 2, recipes: 4, drift: 4.0, tutorial: "tutorial.day5" },
    { day: 6, duration: 195, goal: 1760, patience: 27, maxOrders: 3, recipes: 5, drift: 4.2, tutorial: "tutorial.day6" },
    { day: 7, duration: 210, goal: 2160, patience: 26, maxOrders: 3, recipes: 5, drift: 4.5, tutorial: "tutorial.day7" },
    { day: 8, duration: 225, goal: 2620, patience: 25, maxOrders: 3, recipes: 6, drift: 4.8, tutorial: "tutorial.day8" },
    { day: 9, duration: 240, goal: 3150, patience: 24, maxOrders: 4, recipes: 6, drift: 5.2, tutorial: "tutorial.day9" },
    { day: 10, duration: 270, goal: 3900, patience: 23, maxOrders: 4, recipes: 6, drift: 5.6, tutorial: "tutorial.day10" }
  ];

  CCC.data.recipes = [
    { id: "pepper", unlockDay: 1, nameKey: "recipe.pepper", price: 100, icon: "◌", jarColor: "#9a7b55", jarShape: "8px", bg: "#fff3d6" },
    { id: "chili", unlockDay: 2, nameKey: "recipe.chili", price: 110, icon: "🌶", jarColor: "#b91c1c", jarShape: "16px", bg: "#fee2e2" },
    { id: "nori", unlockDay: 3, nameKey: "recipe.nori", price: 115, icon: "≋", jarColor: "#047857", jarShape: "5px", bg: "#d1fae5" },
    { id: "plum", unlockDay: 4, nameKey: "recipe.plum", price: 120, icon: "✿", jarColor: "#db2777", jarShape: "22px", bg: "#fce7f3" },
    { id: "garlic", unlockDay: 6, nameKey: "recipe.garlic", price: 130, icon: "♢", jarColor: "#a16207", jarShape: "3px", bg: "#fef3c7" },
    { id: "cheese", unlockDay: 8, nameKey: "recipe.cheese", price: 145, icon: "▱", jarColor: "#d97706", jarShape: "13px 4px", bg: "#ffedd5" }
  ];

  CCC.data.upgrades = {
    fryer: {
      id: "fryer", nameKey: "upgrade.fryer", icon: "♨️",
      prices: [0, 900, 2200],
      effectKeys: ["upgrade.fryer.l1", "upgrade.fryer.l2", "upgrade.fryer.l3"]
    },
    prep: {
      id: "prep", nameKey: "upgrade.prep", icon: "🥣",
      prices: [0, 700, 1800],
      effectKeys: ["upgrade.prep.l1", "upgrade.prep.l2", "upgrade.prep.l3"]
    },
    counter: {
      id: "counter", nameKey: "upgrade.counter", icon: "🔔",
      prices: [0, 800, 2000],
      effectKeys: ["upgrade.counter.l1", "upgrade.counter.l2", "upgrade.counter.l3"]
    }
  };

  CCC.data.customers = [
    { icon: "👩🏽", bg: "#fde2c7" }, { icon: "👨🏻‍🦳", bg: "#e8edf6" },
    { icon: "🧑🏿‍🦱", bg: "#f5d5ba" }, { icon: "👩🏻‍🦰", bg: "#ffe0d6" },
    { icon: "👨🏽‍🦲", bg: "#d8eff0" }, { icon: "👵🏻", bg: "#eee1f8" },
    { icon: "🧕🏽", bg: "#f1e5ca" }, { icon: "🧑🏼‍🎓", bg: "#dbeafe" }
  ];

  CCC.data.themes = [
    { id: "cream", nameKey: "theme.cream" },
    { id: "berry", nameKey: "theme.berry" },
    { id: "mint", nameKey: "theme.mint" },
    { id: "sky", nameKey: "theme.sky" }
  ];

  CCC.data.helpSections = [
    ["🎯", "help.goal.title", "help.goal.body"],
    ["1️⃣", "help.steps.title", "help.steps.body"],
    ["🧾", "help.orders.title", "help.orders.body"],
    ["♨️", "help.frying.title", "help.frying.body"],
    ["⭐", "help.quality.title", "help.quality.body"],
    ["🛠️", "help.upgrades.title", "help.upgrades.body"],
    ["👆", "help.controls.title", "help.controls.body"],
    ["⏸️", "help.pause.title", "help.pause.body"],
    ["❔", "help.faq.title", "help.faq.body"]
  ];
}(typeof window !== "undefined" ? window : globalThis));
