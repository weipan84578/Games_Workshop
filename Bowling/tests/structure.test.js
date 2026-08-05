import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("index remains a clean zero-build module entry point", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /script type="module" src="js\/main\.js"/);
  assert.match(html, /script src="js\/file-fallback\.js"/);
  assert.doesNotMatch(html, /<style[\s>]/i);
  assert.doesNotMatch(html, /fetch\s*\(/i);
  assert.match(html, /css\/base\/reset\.css/);
  assert.match(html, /css\/themes\/theme-cute\.css/);
});
