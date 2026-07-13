---
name: build-basketball-arcade
description: Build, refactor, document, and validate the pure-frontend Basketball Shoot arcade game in this repository. Use when Codex needs to implement requirements from Basketball_Shoot-spec.md; change vanilla HTML/CSS/JavaScript or Canvas gameplay; tune five-ball physics, rim collisions, return tracks, stages, scoring, audio, RWD, i18n, localStorage, or leaderboard behavior; create a multilingual README; or run Node/browser/Playwright regression tests with temporary screenshot cleanup.
---

# Build Basketball Arcade

## Preserve the product contract

- Keep the game runnable by opening `index.html` directly through `file://`.
- Use native HTML, CSS, JavaScript, Canvas 2D, Web Audio, Pointer Events, and localStorage.
- Do not introduce a framework, build step, backend, CDN dependency, or runtime npm requirement.
- Treat the latest explicit user request as an authorized override when it conflicts with the original specification.
- Preserve unrelated user changes in a dirty worktree.

Read [references/project-contract.md](references/project-contract.md) before changing gameplay, physics, scoring, storage, audio, i18n, or layout. Read [references/validation-playbook.md](references/validation-playbook.md) before browser validation, screenshot work, or README updates.

## Follow the implementation workflow

1. Inspect the relevant specification, current files, and tests before editing.
2. Map the request to affected layers: DOM, CSS, input, engine, physics, audio, data, i18n, documentation, and tests.
3. Change shared constants before duplicating numeric values in the engine or tests.
4. Implement domain logic in its owning module; keep `main.js` as orchestration rather than physics or rendering code.
5. Update all three language dictionaries together when adding visible text.
6. Bump the save version when persisted progress becomes incompatible.
7. Add or update unit tests for every new rule and regression.
8. Run syntax, headless logic, browser, RWD, and cleanup checks proportional to the change.
9. Report measured results, not assumptions.

## Keep gameplay coherent

- Model the five physical balls as independent state machines; do not replace them with a single respawning ball.
- Keep picking, holding, flying, colliding, returning, and rack availability distinct.
- Map flick direction and distance continuously to velocity. Ignore tiny or downward gestures.
- Use normal-based collision reflection for circular rim endpoints.
- Prevent oversized collision proxies from making the hoop unfair; verify the playable center opening after geometry changes.
- Make side-cage and ceiling boundaries rebound inward instead of deleting the ball.
- Allow simultaneous flying-ball collisions and resolve overlap before applying momentum exchange.
- Keep stage intros from consuming playable time or accepting hidden input.
- Apply stage targets, hoop movement, combos, and final-ten-second doubling through one scoring path.

## Protect visual and RWD quality

- Keep the Canvas internal ratio at `900:1120`; never stretch it to fill a differently shaped box.
- Draw cabinet framing with outlines, shadows, or pseudo-elements so borders do not shrink and distort Canvas content.
- Use `getBoundingClientRect()` for pointer-to-Canvas mapping after responsive scaling or centered cropping.
- Validate phone portrait, phone landscape, tablet portrait, and desktop layouts.
- In landscape, center the Canvas in the playable column, excluding the side control strip.
- Keep CSS split by responsibility and formatted as readable multi-line rules.
- Pause the render loop before deterministic Canvas screenshots to avoid mid-frame tearing.

## Handle audio safely

- Unlock `AudioContext` only after a user gesture; retain the `TOUCH TO START` gate.
- Keep menu, gameplay, and victory tempo modes distinct.
- Maintain independent BGM and SFX gain channels.
- Preserve the required 10x BGM gain calculation, hard safety cap, and compressor protection.
- Prefer generated Web Audio sounds over network-hosted assets.

## Maintain data and language integrity

- Store settings, progress, and leaderboard data under their existing localStorage keys.
- Sanitize leaderboard nicknames before rendering and retain only the sorted Top 10.
- Keep Traditional Chinese, English, and Japanese dictionary keys identical and non-empty.
- Use `data-i18n` for user-visible DOM text and update Canvas-only messages deliberately.
- Keep the README language order as English, Japanese, then Traditional Chinese unless the user requests another order.

## Validate before completion

Run at minimum:

```powershell
$files = rg --files -g "*.js"
foreach ($file in $files) { node --check $file }
node tests/node-verify.js
```

Open `tests/test-runner.html` or run the Playwright workflow when browser behavior, Canvas, audio gates, dialogs, gestures, or RWD changed. Follow the exact commands and cleanup rules in [references/validation-playbook.md](references/validation-playbook.md).

Do not claim completion while any required assertion fails. Distinguish a product failure from a test-harness failure, fix the harness only when its expectation is objectively wrong, and rerun the complete suite.

## Finish cleanly

- Confirm no test screenshots remain in the repository.
- Confirm temporary `node_modules` or Playwright installations are absent from the project.
- Confirm direct `index.html` play remains intact.
- Summarize gameplay changes, test totals, Playwright coverage, and cleanup status.
