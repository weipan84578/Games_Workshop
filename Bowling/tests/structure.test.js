import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

test("index remains a clean zero-build module entry point", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /script type="module" src="js\/main\.js"/);
  assert.match(html, /script src="js\/file-fallback\.js"/);
  assert.doesNotMatch(html, /<style[\s>]/i);
  assert.doesNotMatch(html, /fetch\s*\(/i);
  assert.match(html, /css\/base\/reset\.css/);
  assert.match(html, /css\/themes\/theme-cute\.css/);
});

test("keeps the main menu language control inside Settings only", async () => {
  const mainMenu = await readFile(new URL("../js/ui/mainMenu.js", import.meta.url), "utf8");
  const fallback = await readFile(new URL("../js/file-fallback.js", import.meta.url), "utf8");
  assert.doesNotMatch(mainMenu, /quick-language/);
  assert.doesNotMatch(fallback, /class="quick-language"/);
  assert.match(fallback, /data-fb-language/);
});

test("ships the realistic bowling-alley scene used by both renderers", async () => {
  await access(new URL("../assets/images/backgrounds/bowling-alley-realistic.png", import.meta.url));
  const renderer = await readFile(new URL("../js/render/canvasRenderer.js", import.meta.url), "utf8");
  const fallback = await readFile(new URL("../js/file-fallback.js", import.meta.url), "utf8");
  assert.match(renderer, /bowling-alley-realistic\.png/);
  assert.match(fallback, /bowling-alley-realistic\.png/);
  assert.match(renderer, /drawAimGuide/);
});

test("documents the direct-file fallback and keeps the UI code split into named sections", async () => {
  const fallback = await readFile(new URL("../js/file-fallback.js", import.meta.url), "utf8");
  assert.match(fallback, /Audio/);
  assert.match(fallback, /Local storage/);
  assert.match(fallback, /Canvas presentation/);
  assert.match(fallback, /Screen views/);
  assert.doesNotMatch(fallback, /sections\.menu\.innerHTML = '.*fb-start/s);
});
