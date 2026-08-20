---
name: pet-simulation-feature-workflow
description: Implement or extend gameplay, progression, economy, persistence, training, and UI features in this zero-build offline Pet Simulation Game. Use when changes must preserve classic-script load order, old saves, deterministic rules, trilingual parity, motion accessibility, and Node-based validation; do not use for README-only or commit-only tasks.
---

# Pet Simulation Feature Workflow

Build features without breaking the project's direct-open, offline runtime or existing saves.

## Preserve the runtime contract

- Treat `index.html` as both the entry point and dependency manifest. The game uses classic scripts, shared `window.PSG` namespaces, relative assets, and no build step, package manager, server, `fetch`, or dynamic import.
- Place a new module in the narrowest existing namespace and folder. Load data before domain consumers, domain modules before UI, scene registration before `js/core/app.js`, and keep `app.js` last.
- Mirror production dependency order in the `scripts` array in `tests/unit.test.js`. A module that works only because the test harness loads it differently is a defect.
- Keep the game viable under `file://`: use local relative paths and do not introduce network dependencies or module-CORS requirements.

## Extend rules through one source of truth

- Put formulas and mutations in domain modules, not UI handlers. UI code may preview a rule by cloning a save and calling the same domain calculation.
- Preserve seeded behavior in ranking, opponent generation, outings, and training. Use `PSG.utils.RNG` and `PSG.utils.seedFrom` instead of ambient randomness when replayability matters.
- Distinguish permanent intrinsic growth from temporary modifiers. For example, Ability Candy pricing uses natural stats plus permanent candy boosts, so changing equipment, affection, or mastery does not make shop prices jump unexpectedly.
- Return structured results such as `{ ok, reason, ... }` from mutations. Check affordability, unlocks, ownership, inventory, AP, energy, and mood before modifying state.

## Keep saves compatible

- Add defaults to new-game creation and conservative repair logic in `js/storage/saveManager.js`. Missing fields from older saves must become valid without requiring a reset.
- Clamp and normalize persisted values before formulas consume them. Recompute dependent values such as maximum HP only after new fields have been repaired.
- Preserve the validated-clone write path and the previous formal save on validation failure. Avoid schema changes when an optional repaired field is sufficient.
- After a permanent stat or equipment change, refresh BP-based matchmaking and handle current HP intentionally rather than allowing accidental healing or damage.

## Build accessible, maintainable UI

- Add every user-facing key to Traditional Chinese, English, and Japanese. Run the locale-parity test; never rely on fallback text as the finished translation.
- Keep feature styling in focused CSS files and register them in `index.html`. Reuse theme tokens, support narrow screens, and retain at least 48px touch targets.
- For animated training or battle effects, provide a `[data-motion="reduced"]` path. Track and clean up `requestAnimationFrame`, intervals, timeouts, pointer listeners, and focus listeners when a scene exits.
- Pause timed mini-games on window blur and resume after a countdown so backgrounding the tab cannot create unfair misses.
- Use effects to clarify outcomes: immediate rating, score, combo, or state feedback should accompany animation rather than relying on decoration alone.

## Validate the finished change

Add focused tests for boundaries, failure paths, persistence repair, deterministic output, and script order. When requirements change, update obsolete static assertions instead of weakening unrelated coverage.

Run:

```powershell
node tests/unit.test.js
node tests/static.test.js
$files = rg --files js tests tools -g '*.js'; foreach ($file in $files) { node --check $file; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }
git diff --check
```

When visual browser validation is useful, apply the project's `safe-browser-validation` skill. Never launch or drive Chrome or Edge from PowerShell through CDP, WebSockets, a remote-debugging port, or injected runtime evaluation; use deterministic checks and a short manual checklist when no approved browser connector exists.
