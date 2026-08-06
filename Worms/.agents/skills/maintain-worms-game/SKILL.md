---
name: maintain-worms-game
description: Maintain and extend the Wormy Boom Squad browser game while preserving its specification-driven behavior, classic-script offline runtime, modular HTML/CSS/JavaScript structure, deterministic simulation, turn-state and attack-camera contracts, localization, responsive UI, and Node test coverage. Use when changing gameplay, weapons, AI, terrain, physics, camera tracking, screens, controls, audio, storage, translations, tests, or documentation under the Worms project.
---

# Maintain Worms Game

Evolve Wormy Boom Squad without collapsing its clear module boundaries or breaking the direct-open browser build. Treat this file as a compact field guide distilled from implementing the game and correcting its panel layout and attack-camera lifecycle.

## Orient Before Editing

1. Work from the `Worms/` project root.
2. Read `spec.md` as the requirements map, then verify every relevant claim against `index.html`, `js/`, `css/`, and `tests/`.
3. Inspect `git status --short` and preserve unrelated user changes.
4. Trace the requested behavior from UI event or game command through state mutation, snapshot creation, rendering, and tests before changing code.

## Preserve Runtime Contracts

- Keep `index.html` directly openable through `file://`; do not introduce a CDN, `fetch()`, absolute asset path, module script, bundler, or runtime package dependency.
- Keep browser files as ordered classic scripts. Expose reusable modules through `window.WormsGame`, and retain guarded `module.exports` support where Node tests require the same implementation.
- Keep simulation logic independent from rendering. Mutate battle data in `GameState`, expose detached snapshots, and let `Renderer`, `BattleHUD`, and `App` consume those snapshots.
- Preserve the `1920 x 1080` world and the fixed `1/120`-second simulation step unless the specification itself changes.
- Route gameplay randomness through the seeded helpers in `js/utils/random.js`. Do not use `Math.random()` for terrain, wind, spawns, or AI decisions that must reproduce from a seed.
- Add code to the narrowest responsible file. Avoid large inline blocks in `index.html` and avoid turning `js/ui/app.js` into a home for physics, weapons, or renderer logic.

## Follow the Turn Lifecycle

Treat the turn state machine as a cross-module contract:

```text
TURN_INTRO -> PLAYER_CONTROL | AI_THINKING
            -> ACTION_ACTIVE
            -> WORLD_SETTLING
            -> DAMAGE_SUMMARY
            -> CHECK_VICTORY
            -> NEXT_TURN | RESULT
```

- Change transitions in `js/core/turn-manager.js` and battle consequences in `js/core/game-state.js` deliberately.
- Finish projectiles, placed weapons, terrain destruction, character falls, damage reporting, and victory checks before advancing the active team.
- Freeze match and turn timers while paused, and keep sudden death tied to elapsed match time and completed turns.
- Test the complete state path when a weapon has exceptional behavior such as the shotgun second shot, sheep detonation, mine trigger delay, airstrike targeting, or teleport validation.

## Keep the Camera on the Action

- Centralize battle-focus selection in `chooseBattleFocus()` inside `js/render/camera.js` so camera rules remain testable without a browser.
- During `ACTION_ACTIVE`, `WORLD_SETTLING`, and `DAMAGE_SUMMARY`, lock focus in this priority order: live projectile, moving or triggered placed weapon, latest effect, last impact, then current character.
- Store impact coordinates as plain `{ x, y }` values because projectiles and effects may be removed before world settling finishes.
- Clear the stored attack focus only on the next `turnStart`; return to the new active worm at that point, not immediately after the projectile disappears.
- Disable manual camera drift while the attack lock is active. Preserve manual pan, wheel or pinch zoom, and the focus command during player control.
- Extend `tests/camera.test.js` whenever adding a new moving attack entity or changing the action lifecycle.

## Build Maintainable Screens and Controls

- Keep semantic screen sections and accessible names in `index.html`; keep visual styling split across `css/base.css`, `screens.css`, `hud.css`, `controls.css`, and `responsive.css`.
- Give panel back buttons a dedicated grid column through `.panel-heading`; do not absolutely position them over localized headings.
- Check long English and Japanese labels as well as Traditional Chinese. Add every new `data-i18n` key to `zh-Hant`, `en`, and `ja`, then keep key parity tests green.
- Maintain keyboard, pointer, and touch paths through semantic commands in `InputManager`. Do not duplicate game rules inside event handlers.
- Preserve `aria-live` announcements, labelled controls, focus visibility, `prefers-reduced-motion`, the 320 CSS-pixel minimum layout, safe-area insets, and the portrait rotation prompt.

## Protect Supporting Systems

- Validate persisted data through `StorageService`; recover from malformed or unavailable `localStorage` and preserve settings when clearing career statistics.
- Keep BGM optional and use the exact relative paths under `assets/audio/bgm/`. Resume Web Audio only after user interaction and tolerate rejected playback promises.
- Register weapons through immutable definitions in `js/weapons/weapons.js`. Keep ammo consumption after action validation so invalid targets do not spend limited ammo.
- Update the HUD, AI legality, localized names, icons, statistics, and focused tests whenever adding or changing a weapon.

## Validate in Proportion to the Change

1. Run `node --check` for every changed JavaScript file.
2. Run `npm test` from `Worms/`; the suite covers structure, browser loading, deterministic terrain and physics, turns, weapons, AI, storage, i18n, camera focus, and integrated game state.
3. Run `git diff --check` and inspect the final diff for accidental generated files or unrelated edits.
4. When visual or interaction verification is needed, use the sibling `safe-browser-validation` skill and follow its low-risk browser procedure. Never improvise PowerShell/CDP/WebSocket browser automation.
5. Add the smallest regression test that proves a corrected failure mode and would fail if the bug returned.

## Document Truthfully

- Keep `README.md` synchronized with implemented controls, locales, themes, weapons, storage, test commands, and runtime constraints.
- Label `spec.md` requirements as plans when code does not implement them.
- Credit third-party or generated assets exactly as requested, without inventing licenses, authorship, or source URLs.
