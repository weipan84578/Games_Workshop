"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const required = [
  "index.html",
  "css/base.css",
  "css/screens.css",
  "css/hud.css",
  "css/controls.css",
  "css/responsive.css",
  "js/utils/random.js",
  "js/data/i18n.js",
  "js/storage/storage.js",
  "js/physics/physics.js",
  "js/terrain/terrain.js",
  "js/weapons/weapons.js",
  "js/core/game-loop.js",
  "js/core/turn-manager.js",
  "js/core/game-state.js",
  "js/ai/ai.js",
  "js/render/camera.js",
  "js/render/renderer.js",
  "js/input/input.js",
  "js/audio/audio.js",
  "js/ui/tutorial.js",
  "js/ui/hud.js",
  "js/ui/app.js",
  "js/main.js",
];

test("required HTML, CSS, and JavaScript modules exist", () => {
  required.forEach((file) =>
    assert.equal(fs.existsSync(path.join(root, file)), true, file),
  );
});

test("every local HTML script, stylesheet, and image path exists", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const references = Array.from(
    html.matchAll(/(?:src|href)=["']([^"'#]+)["']/g),
    (match) => match[1],
  );
  references.forEach((reference) =>
    assert.equal(fs.existsSync(path.join(root, reference)), true, reference),
  );
});

test("browser entry has no CDN, fetch, module script, or absolute resource dependency", () => {
  const files = required.filter((file) => /\.(html|js|css)$/.test(file));
  const source = files
    .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
    .join("\n");
  assert.doesNotMatch(source, /https?:\/\//i);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(
    fs.readFileSync(path.join(root, "index.html"), "utf8"),
    /type=["']module["']/i,
  );
  assert.doesNotMatch(
    fs.readFileSync(path.join(root, "index.html"), "utf8"),
    /(?:src|href)=["']\//i,
  );
});

test("the optional BGM contract uses the three exact relative paths", () => {
  const audio = fs.readFileSync(path.join(root, "js/audio/audio.js"), "utf8");
  for (const name of ["menu", "battle", "result"])
    assert.match(audio, new RegExp(`assets/audio/bgm/${name}\\.mp3`));
});
