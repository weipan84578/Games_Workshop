---
name: pet-simulation-feature-workflow
description: Implement or extend gameplay, progression, economy, persistence, training, and UI features in this zero-build offline Pet Simulation Game. Use when changes must preserve classic-script load order, old saves, deterministic rules, trilingual parity, motion accessibility, and Node-based validation; do not use for README-only or commit-only tasks.
---

# Pet Simulation Feature Workflow

Build features without breaking the project's direct-open, offline runtime or existing saves.

## Project skill map

Use the narrowest project skill that matches the requested work, and keep this workflow as the gameplay implementation source of truth:

- Gameplay, progression, economy, persistence, training, battle, or UI changes: use this skill.
- README creation or a full README rewrite: also load [readme-writer](../readme-writer/SKILL.md).
- A requested Git commit: also load [trilingual-energetic-commits](../trilingual-energetic-commits/SKILL.md) and stage only the intended files.
- Browser or manual visual validation: also load [safe-browser-validation](../safe-browser-validation/SKILL.md).
- Skill creation or maintenance: load the system `skill-creator` skill before editing anything under `.agents/skills`.

## Current gameplay contracts

Treat these rules as regression contracts. Change them only when the user explicitly changes the design, and update the relevant domain tests and locale text together.

- Persistence has three independent save slots. Legacy saves must be repaired into slot one, and new fields such as bank state, battle settings, Boss progress, and daily AP must have safe defaults.
- Daily AP is level-scaled: levels 1–30 receive 7 AP, 31–50 receive 10, 51–75 receive 12, and 76–100 receive 15. Boss battles cost zero AP and may be attempted repeatedly, while their energy and mood requirements still apply.
- The rank-one Boss gate has three species and seeded random arenas: grassland protects the Lion, swamp protects the Crocodile, and sky protects the Eagle. Non-native combatants take 3% damage each round; Boss battles last up to 80 rounds, grow endlessly stronger, and award large coin/experience rewards plus a 1% random-candy chance.
- The economy includes deposit/withdraw banking, with one interest settlement after rest. Interest is `deposit * 1%` and is added to hand-held coins rather than the deposit balance. Daily coin income keeps the requested 300% boost.
- Candy purchases and experience purchases support quantities up to 999. Candy Festival halves the current regular-candy price, discounts experience by 40%, and shows its localized notice inside the home `.pet-stage__bubble`; without the event, the original home message returns.
- Reaching rank #1 automatically grants exactly three Mythic items—Armor (`HP +18%`, `Defense +9%`, `Special Defense +9%`), Accessory (`Attack +9%`, `Special Attack +9%`, `Accuracy +6%`), and Emblem (`Speed +7%`, `Mobility +7.5%`, `Attack CRIT +20%`)—to `economy.ownedEquipment`. The grant must be idempotent and must also repair already-rank-one legacy saves.
- Only equipped Mythic equipment can be upgraded, and the entry point is the top three-slot equipped-gear panel in the Inventory scene. The lower owned-equipment list must not expose an upgrade action. Upgrade levels persist in `economy.equipmentUpgrades`, batches are capped at 999, the first level costs 10,000 coins, and each next level costs `ceil(10000 * (1 + currentLevel * 0.1))`; batch purchases sum each level's cost. Each level adds `0.001` (0.1 percentage point) to every non-CRIT bonus on that item, while Mythic Emblem Attack CRIT remains exactly `0.20`.
- Toast messages remain in the fixed bottom-right notification slot, use 50% opacity, and format large numbers with thousands separators. Mood dialogue should choose from localized seeded variants instead of repeating one sentence.
- The battle UI keeps persistent fast mode and auto battle. Auto battle performs normal attacks automatically and uses the special attack when its condition is met; timers and listeners must stop cleanly when the scene exits.
- Seven local BGM tracks are mapped by context: `menu`, `home`, `training`, `outing`, `battle`, `champion`, and `bossbattle`. Boss victories switch to champion music, while the active Boss fight uses Boss battle music.
- Main-menu help and settings controls must use visible icons (`❓` and `⚙`), not a literal `?` placeholder. Add a static regression assertion when changing icon markup.

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
- Normalize missing or malformed `equipmentUpgrades` to non-negative integer levels, and call the idempotent Mythic grant during repair when the saved player is already rank #1.
- Preserve the validated-clone write path and the previous formal save on validation failure. Avoid schema changes when an optional repaired field is sufficient.
- After a permanent stat or equipment change, refresh BP-based matchmaking and handle current HP intentionally rather than allowing accidental healing or damage.

## Build accessible, maintainable UI

- Add every user-facing key to Traditional Chinese, English, and Japanese. Run the locale-parity test; never rely on fallback text as the finished translation.
- Keep feature styling in focused CSS files and register them in `index.html`. Reuse theme tokens, support narrow screens, and retain at least 48px touch targets.
- Keep Mythic upgrade controls in the top equipped-gear panel of the Inventory scene, show the current level and next cost with thousands separators, preview the same domain batch calculation used by the mutation, and display the rank-one reward in the battle settlement dialog. The domain mutation must reject a Mythic item that is owned but not currently equipped.
- Keep JavaScript, HTML fragments, and CSS readable: split long concatenated markup at meaningful boundaries, keep one responsibility per handler, use named domain helpers for formulas, and avoid minified or densely packed source in committed files.
- Keep contextual home notices inside the existing `.pet-stage__bubble` text box. The Candy Festival home message uses `shop.candyFestivalTitle` there, while the shop may keep its own price banner; do not add a separate top-of-scene alert for the home notice. Mood dialogue should use localized variants selected by the saved seed and day so rerenders stay stable.
- For animated training or battle effects, provide a `[data-motion="reduced"]` path. Track and clean up `requestAnimationFrame`, intervals, timeouts, pointer listeners, and focus listeners when a scene exits.
- Pause timed mini-games on window blur and resume after a countdown so backgrounding the tab cannot create unfair misses.
- Use effects to clarify outcomes: immediate rating, score, combo, or state feedback should accompany animation rather than relying on decoration alone.

## Validate the finished change

Add focused tests for boundaries, failure paths, persistence repair, deterministic output, and script order. When requirements change, update obsolete static assertions instead of weakening unrelated coverage.

Run:

```powershell
node tests/unit.test.js
node tests/static.test.js
node tests/audio.test.js
$files = rg --files js tests tools -g '*.js'; foreach ($file in $files) { node --check $file; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }
npx prettier --check index.html js css tests
git diff --check
```

When visual browser validation is useful, apply the project's `safe-browser-validation` skill. Never launch or drive Chrome or Edge from PowerShell through CDP, WebSockets, a remote-debugging port, or injected runtime evaluation; use deterministic checks and a short manual checklist when no approved browser connector exists.
