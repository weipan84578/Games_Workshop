---
name: cloudbound-maintainer
description: Maintain, debug, balance, test, document, and extend the repository-local Cloudbound/Doodle Jump browser game. Use for changes involving gameplay physics, procedural platforms/items/hazards, scoring and difficulty, saves or leaderboard data, settings, input, Canvas rendering, audio, localization, responsive/accessibility behavior, application lifecycle, direct file:// compatibility, or the custom browser test suite.
---

# Cloudbound Maintainer

Maintain this zero-build browser game without breaking deterministic gameplay, validated local data, responsive controls, or direct `file://` execution.

## Start every task

1. Resolve the repository root as the directory containing `index.html`, `js/`, `css/`, and `tests/`. The skill normally lives at `.agents/skills/cloudbound-maintainer/` inside that root.
2. Run `git status --short`. Preserve all unrelated and pre-existing changes, including sibling skill folders.
3. Inspect the actual source and tests for the requested behavior. Treat `DOODLE_JUMP_GAME_SPEC.md` and `README.md` as maps, never as proof of implementation.
4. Load only the references relevant to the task:

| Task | Read first |
|---|---|
| Architecture, lifecycle, new modules, game loop | [references/architecture.md](references/architecture.md) |
| Physics, collision, platforms, items, enemies, score, generation, balancing | [references/gameplay-balance.md](references/gameplay-balance.md) |
| Saves, settings, UI, i18n, audio, RWD, accessibility, performance | [references/systems-ui-data.md](references/systems-ui-data.md) |
| Debugging, regression tests, browser verification, known traps | [references/testing-pitfalls.md](references/testing-pitfalls.md) |

Read multiple references when a change crosses boundaries. Read every selected reference completely before editing.

## Preserve these invariants

- Keep the runtime dependency-free: plain HTML, CSS, and ordered classic scripts under `window.DJGame`.
- Keep `index.html` and `tests/test-runner.html` usable through ordinary `file://` URLs without special browser flags.
- Keep simulation mutations inside fixed 1/120-second updates; render from state and interpolation without changing gameplay state.
- Keep seeded generation deterministic. Consume randomness only from `state.rng` in gameplay generation.
- Keep the opening route reachable and calm, prevent consecutive fragile main platforms, prevent adjacent generated hazards, and cap item drought at three main platforms.
- Keep save data deeply validated, size-limited, backward compatible for optional additions, and recoverable without throwing.
- Keep navigation consistent with `Game.AppTransitions`; pause active play before blocking confirmation dialogs.
- Keep settings effective at runtime, not merely stored in UI controls.
- Keep all three locale dictionaries key-compatible and render user text with `textContent`, not HTML injection.
- Keep mobile controls outside the Canvas and preserve 320 px portrait, short landscape, and desktop layouts.
- Add or update regression tests for every behavior change.

## Choose the change path

### Gameplay or balance

1. Read `difficulty.js`, `world-generator.js`, the affected entity module, `session.js`, and generator/session tests.
2. Express height scaling as monotonic curves with safe asymptotic caps; do not scatter duplicate hard-coded height gates in the generator.
3. Preserve fairness metadata (`itemType`, `hazardType`) and old-save defaults when generation history changes.
4. Test both formulas and actual multi-seed output. Test safety invariants separately from frequency targets.
5. Run `scripts/report-balance.js` to review representative heights.

### Persistence or data

1. Trace `Storage` → store validator/sanitizer → `GameState.snapshot/fromSnapshot` → `App` caller.
2. Validate every nested object and array element before dereferencing it.
3. Prefer optional additive fields under schema version 1 when old snapshots can receive safe defaults; change schema versions only for incompatible shapes.
4. Roll back in-memory checkpoint metadata after failed writes.
5. Test malformed nested data, old snapshots, storage failure, throttling, and round trips.

### UI, settings, input, rendering, or audio

1. Trace the HTML control, screen/controller, store, `App.applySettings`, and runtime consumer.
2. Preserve focus, ARIA status, modal focus trapping, and pause/resume semantics.
3. Verify reduced motion, low quality, touch swap, tilt sensitivity, shake, and audio track changes at the final consumer.
4. Make repeated per-frame setters idempotent; never reset animation or audio sequence state when the selected value did not change.
5. Update all three locale files for new user-facing keys.

### New module or cross-cutting feature

1. Place the module in the existing responsibility folder.
2. Add its classic script after dependencies and before consumers in both application and test-runner HTML.
3. Expose the smallest stable API on `window.DJGame`; avoid new globals.
4. Wire lifecycle through the event bus and state machine rather than direct page-class mutations.
5. Add focused unit coverage and one integration test for the cross-module flow.

### Documentation only

Inspect current code and tests, change only the requested documentation, and do not imply that specification-only behavior is implemented. Use the repository `readme-writer` skill when replacing or substantially revising `README.md`.

## Validate proportionally

1. Run syntax checks and targeted tests while iterating.
2. Run the complete verifier before handoff when source or tests changed:

```powershell
powershell -ExecutionPolicy Bypass -File .agents/skills/cloudbound-maintainer/scripts/verify-project.ps1
```

3. Use `-SkipBrowser` only when Edge is genuinely unavailable, and report that browser coverage was skipped.
4. Run `git diff --check` and inspect `git status --short` after verification.
5. Confirm temporary browser profiles were removed and no unrelated files changed.

## Use bundled tools

- `scripts/verify-project.ps1`: check all JavaScript syntax, `git diff --check`, the complete direct-file browser suite, and production home startup.
- `scripts/report-balance.js`: print current difficulty and spawn probabilities for chosen heights.
- `references/`: load project knowledge on demand; keep code authoritative if a reference becomes stale.

Do not create extra skill documentation such as a skill README or changelog. Update these references and scripts when project invariants materially change.
