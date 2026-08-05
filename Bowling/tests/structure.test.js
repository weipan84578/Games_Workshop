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

test("plays impact feedback only when physics reports a newly hit pin", async () => {
  const gamePage = await readFile(new URL("../js/ui/gamePage.js", import.meta.url), "utf8");
  const fallback = await readFile(new URL("../js/file-fallback.js", import.meta.url), "utf8");
  assert.match(gamePage, /newlyHitCount/);
  assert.match(gamePage, /audio\?\.playSfx\("pin"\)/);
  assert.match(fallback, /function triggerImpacts\(progress\)/);
  assert.match(fallback, /pinCollisionWindow/);
});

test("locks throw inputs while the fallback ball is rolling", async () => {
  const gamePage = await readFile(new URL("../js/ui/gamePage.js", import.meta.url), "utf8");
  const fallback = await readFile(new URL("../js/file-fallback.js", import.meta.url), "utf8");
  assert.match(gamePage, /if \(physics\.phase === PHYSICS_PHASES\.ROLLING\) return;/);
  assert.match(fallback, /function syncFallbackControls\(\)/);
  assert.match(fallback, /activeRollDurationMs/);
  assert.match(fallback, /var renderAngle = rolling \? activeRollAngle : angle/);
});

test("keeps the ready ball at the approach and aligns the aim guide", async () => {
  const renderer = await readFile(new URL("../js/render/canvasRenderer.js", import.meta.url), "utf8");
  const fallback = await readFile(new URL("../js/file-fallback.js", import.meta.url), "utf8");
  assert.doesNotMatch(fallback, /visualProgress = 1;/);
  assert.match(fallback, /function setPower[\s\S]*?visualProgress = 0;[\s\S]*?drawCanvas\(0\);/);
  assert.match(fallback, /ballPathLateralScale = 0\.34/);
  assert.match(renderer, /BALL_PATH_LATERAL_SCALE = 0\.34/);
});

test("documents the prohibited browser automation and preserves agent skills", async () => {
  const instructions = await readFile(new URL("../AGENTS.md", import.meta.url), "utf8");
  assert.match(instructions, /--remote-debugging-port/);
  assert.match(instructions, /ClientWebSocket/);
  assert.match(instructions, /Games_Workshop\/\.agents/);
  assert.match(instructions, /Do not delete, move, replace, or/);
});
