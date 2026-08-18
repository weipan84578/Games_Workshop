---
name: tug-of-war-td-maintainer
description: Maintain Tug of War TD gameplay, balance, persistence, audio, responsive UI, tests, and source-grounded documentation. Use when changing this project’s units, Boss rules, energy economy, combat movement, level flow, localization, save snapshots, or README.
---

# Tug of War TD Maintainer

Use this skill to keep the one-lane battle rules readable, data-driven, and regression-tested. Treat the project source as authoritative and keep the root README, development experience log, tests, and balance values synchronized.

## Working sequence

1. Inspect `git status --short`, `rg --files`, the affected source files, `README.md`, `docs/DEVELOPMENT_EXPERIENCE.md`, and `tests/unit.test.js`.
2. Keep responsibilities separated: put tuning in `data/` or `js/core/config.js`, entity state in `js/entities/`, rules in `js/systems/`, presentation in `js/ui/` or `js/engine/`, and persistence in `js/core/saveManager.js`.
3. Add or update a unit test for every player-visible rule. Prefer a small deterministic `BattleSession` scenario over a broad timing assertion.
4. Update the three language sections of `README.md` and the reusable lessons in `docs/DEVELOPMENT_EXPERIENCE.md` whenever behavior or balance changes.
5. Run `node tests/unit.test.js`, check every JavaScript file with `node --check`, and run `git diff --check`.
6. Stage only the requested files. For a commit, use the repository’s English → Japanese → Taiwan Traditional Chinese message order with purposeful emojis and verify `git log -1 --format=%B` plus a clean status.

## Gameplay invariants

- Keep battles unlimited-time. `BattleSession.elapsed` may remain as a simulation clock for path animation, unit age, and cooldown behavior, but do not derive a defeat, draw, star, or HUD countdown from a time limit.
- Keep all six level IDs directly selectable. Progression may still store stars, but it must not lock a level.
- Keep the one-lane frontline stationary while a living opponent is in attack range. Do not add knockback or collision separation that moves a character backward.
- Use `BossSystem` as the single Boss gate: normal levels trigger at or below 30% enemy-castle HP; the enhanced level triggers at 90% through 10% in 10% steps; a living Boss blocks the enemy castle.
- Keep normal Bosses and enhanced-level Tier 1 at 2200 HP, 156 attack, and 40% defense. For the explicitly requested Crown Endless Line ramp, Tier 1–Tier 9 add 18% base HP, 12% base attack, and 0.04 defense per tier step; preserve those stats in snapshots.
- Keep the Crown Endless Line ramp data-driven: start wave acceleration after 8 seconds with a 0.35 interval floor, unlock higher-tier pools at 18/36/54 seconds, and keep AI selection/affordability separate from level tuning.
- Apply enemy ranged damage through `Config.enemyRangedDamageMultiplier` to both unit and castle attacks. Do not weaken player ranged damage through that enemy-only coefficient.
- Calculate deployable costs through `app.utils.getUnitCost(definition)` so the card label, affordability check, player spend, and AI spend stay identical. Preserve a zero cost for the enemy-only Boss.
- Apply defensive stat bonuses only to player units marked `defensive: true`. The current defensive roster is `basic`, `tank`, `guard`, and `guardian`; each receives the configured HP multiplier and defense bonus.
- Current balance targets are enemy ranged `0.8×`, player energy `1.24×` level rate, deployable cost `0.8×`, income upgrade cost `0.7×`, defensive HP `1.2×`, and defensive damage reduction `+0.2`; update the README and tests when these values change.
- Preserve energy upgrade levels LV1–LV5, snapshot fields, and legacy snapshot migration. A new energy-rate formula must be tested with both current and old snapshot shapes.

## Source map

| Area | Files | Responsibility |
| --- | --- | --- |
| Entry and UI | `index.html`, `js/main.js`, `js/ui/` | Screens, controls, HUD, localization refresh, and navigation. |
| Configuration | `js/core/config.js` | World size, storage key, unit cap, and balance multipliers. |
| Data | `data/levels.js`, `data/unitsData.js` | Level roster/tuning, base unit stats, attributes, and defensive markers. |
| Simulation | `js/engine/gameLoop.js`, `js/entities/` | Battle session, simulation clock, units, castles, snapshots, and frame loop. |
| Rules | `js/systems/battleSystem.js`, `bossSystem.js`, `resourceSystem.js`, `spawnSystem.js`, `aiSystem.js`, `abilitySystem.js` | Combat, Boss gates, energy, spawning, enemy decisions, and special abilities. |
| Rendering and audio | `js/engine/renderer.js`, `js/audio/` | Canvas world, effects, generated Web Audio patterns, limiters, and scene cleanup. |
| Persistence and tests | `js/core/saveManager.js`, `tests/unit.test.js` | localStorage snapshots/progression and deterministic regression coverage. |

## Balance change checklist

When changing a number, record the old and new behavior in the development log and check these paths together:

- Unit card display → `battleHUD.js` and `howToPlayScreen.js`.
- Player spawn spend and enemy AI affordability → `spawnSystem.js`.
- Unit-versus-unit damage and castle damage → `battleSystem.js`.
- Player-only defensive HP and damage reduction → `Unit.js` plus snapshot restore.
- Energy HUD, upgrade feedback, and save migration → `resourceSystem.js`, `battleHUD.js`, `gameLoop.js`, and i18n dictionaries.
- Enhanced Boss stats and final-level enemy ramp → `config.js`, `data/levels.js`, `bossSystem.js`, `aiSystem.js`, `Unit.js`, and snapshot tests.
- Unlimited-time result flow → `gameLoop.js`, `battleSystem.js`, `main.js`, `levelSystem.js`, `data/levels.js`, and timer/result translations.

## Validation commands

Run from the project root:

```text
node tests/unit.test.js
```

```powershell
$failed = $false
$files = rg --files -g '*.js'
foreach ($file in $files) {
  node --check $file
  if ($LASTEXITCODE -ne 0) { $failed = $true }
}
if ($failed) { exit 1 }
```

For README updates, verify the explicit language anchors, internal links, three-language order, and that `[🔝 Back to top](#top)` is the final non-whitespace line. Use the browser validation skill when browser automation or manual browser verification is requested; do not claim browser validation from Node tests alone.
