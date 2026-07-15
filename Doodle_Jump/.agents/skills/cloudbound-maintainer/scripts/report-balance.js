#!/usr/bin/env node
"use strict";

var fs = require("fs");
var path = require("path");

function projectRoot() {
  var explicit = process.env.CLOUDBOUND_ROOT;
  var root = explicit
    ? path.resolve(explicit)
    : path.resolve(__dirname, "..", "..", "..", "..");
  var required = [
    "index.html",
    path.join("js", "core", "namespace.js"),
    path.join("js", "utils", "math.js"),
    path.join("js", "game", "difficulty.js"),
  ];
  required.forEach(function (relative) {
    if (!fs.existsSync(path.join(root, relative))) {
      throw new Error("Not a Cloudbound project root; missing " + relative);
    }
  });
  return root;
}

function percent(value) {
  return (value * 100).toFixed(1) + "%";
}

var root = projectRoot();
global.window = global;
require(path.join(root, "js", "core", "namespace.js"));
require(path.join(root, "js", "utils", "math.js"));
require(path.join(root, "js", "game", "difficulty.js"));

var requested = process.argv.slice(2).map(Number).filter(Number.isFinite);
var heights = requested.length
  ? requested
  : [0, 100, 300, 700, 1500, 3000, 6000];

var rows = heights.map(function (height) {
  var difficulty = global.DJGame.Difficulty.get(height);
  return {
    height: height,
    stage: difficulty.stage,
    width: difficulty.platformWidth,
    gap: difficulty.gapMin + "-" + difficulty.gapMax,
    special: percent(difficulty.specialPlatformChance),
    item: percent(difficulty.itemChance),
    rare: percent(difficulty.rareItemChance),
    hazard: percent(difficulty.hazardChance),
    flyer: percent(difficulty.flyerChance),
    wind: difficulty.wind.toFixed(3),
  };
});

console.log("Cloudbound balance report: " + root);
console.table(rows);
