---
name: castle-multiplier-defense
description: Maintain and extend the Castle Multiplier Defense browser game while preserving its turn-based ballistic combat, five-missile volleys, x0-x30 moving multiplier gates, terrain cover, camera behavior, localization, and lightweight validation. Use when changing gameplay, physics, gates, camera/input, responsive layout, UI text, or tests in this repository.
---

# Castle Multiplier Defense Development

Use this skill as the project-specific implementation guide for Castle Multiplier Defense. Keep the game source-grounded: it is a static browser game built from plain JavaScript IIFEs, HTML, and CSS, with `window.CastleGame` as the shared namespace. Preserve the existing script load order in `index.html` and avoid introducing a framework or package-manager workflow unless the project explicitly gains one.

## Source map

Inspect the relevant module before editing it:

| Area | Files | Responsibility |
| --- | --- | --- |
| Entry and loop | `index.html`, `assets/js/core/app.js`, `assets/js/core/game-loop.js`, `assets/js/core/state.js` | DOM shell, action routing, screen state, and frame updates |
| Rules and data | `assets/js/core/constants.js`, `assets/js/game/level.js`, `assets/js/game/difficulty.js` | Tunable limits, levels, and difficulty modifiers |
| Battle simulation | `assets/js/game/battle.js`, `assets/js/game/projectile.js`, `assets/js/game/castle.js`, `assets/js/game/collision.js` | Turns, ballistic missiles, damage, castle state, and swept collision |
| Gates and cover | `assets/js/game/multiplier-gate.js`, `assets/js/game/terrain.js` | Moving multipliers, gate splitting, random cover, and terrain collision |
| View and input | `assets/js/game/camera.js`, `assets/js/input/keyboard.js`, `assets/js/input/pointer.js`, `assets/js/input/touch.js` | Follow/manual camera controls and aiming/fire gestures |
| Presentation | `assets/js/ui/`, `assets/js/audio/`, `assets/js/i18n/`, `assets/css/` | HUD, menus, settings, audio, locales, themes, and responsive styling |
| Persistence | `assets/js/storage/` | Settings and battle-progress storage |

## Gameplay invariants

### Turn and volley flow

1. Start a battle with `Battle.start()`; the first turn belongs to the player.
2. `Battle.spawnVolley()` uses `Constants.VOLLEY_SIZE` and must create five missiles for a normal turn.
3. A volley remains active until every projectile is consumed. `Battle.finishVolley()` switches to the enemy, then increments `turnNumber` before returning to the player.
4. Call `Camera.snapToSide()` when a turn changes. During flight, follow the first active projectile; after the volley ends, return to the current side unless the user is in manual camera mode.
5. `Battle.isFirstTurnShieldActive()` is true while `turnNumber <= 1`. Preserve the 75% first-turn damage reduction in `Battle.hitCastle()`.

### Ballistic missiles

- Compute launch velocity with `calculateVelocity()` and `calculateGravity()` in `battle.js`; retain the deliberate upward apex and separate portrait/landscape gravity values.
- Store `prevX` and `prevY` before every integration step. Use swept segment collision for gates, terrain, and castles so fast missiles cannot tunnel through narrow targets.
- Keep the logical missile count separate from the visual pool count. `Projectile.refreshVisualCount()` and the desktop/mobile render limits prevent a large multiplier from freezing the browser.
- When cloning, use `Projectile.copyFrom()` and spread clone velocity with a small rotation. Release consumed projectiles back to `Battle.projectilePool`.

### Multiplier gates

The following are hard gameplay requirements:

- `Constants.MULTIPLIER_VALUES` contains exactly the integers `0` through `30`.
- `Constants.GATE_COUNT_PER_BATTLE` is `5`; `Gate.create()` must always shuffle the complete table and select five values per battle.
- Gates are placed with rejection sampling plus a deterministic fallback, then kept apart by `keepSeparated()` after every movement update. Do not replace this with unconstrained random movement.
- Gates stay in the upper playfield. Portrait bounds are `0.14..0.86`; landscape bounds use `0.10..GATE_LANDSCAPE_UPPER_LIMIT`. Preserve the current gate dimensions and orientation-aware limits unless the layout is revalidated.
- `Gate.updateAll()` moves each active gate toward a random target using the configured interval, distance, and speed, then reapplies separation and bounds.
- `projectile.passedGates[gate.id]` prevents one projectile from consuming the same gate twice.
- `Gate.apply()` must preserve the x0 edge case. x0 sets the projectile count, damage, and multiplier to zero; `Battle.processGate()` deactivates it. x1 leaves one physical missile; xN produces N physical missiles, capped by `MAX_GATE_SPLIT` and the available visual pool.
- Do not use `Math.max(1, factor)` around x0, and do not confuse the logical multiplier with the number of rendered projectile objects.

### Terrain, castles, and layout changes

- `Terrain.create()` creates a random count between `TERRAIN_MIN_COUNT` and `TERRAIN_MAX_COUNT` (currently 4-6), avoids gates and castle protection points, and assigns durability 2-3.
- Terrain absorbs missiles through swept rectangle collision; an object is removed only after durability reaches zero.
- On orientation changes, call both `Gate.reflow()` and `Terrain.reflow()` so world coordinates remain valid.
- Keep castle origins, world bounds, HP, and defense changes in `constants.js` and the castle/battle modules rather than scattering numeric literals through rendering code.

## Camera and controls

Preserve both automatic and user-controlled camera modes:

| Action | Current behavior |
| --- | --- |
| Missile flight | `Camera.follow()` tracks the active volley unless manual mode is selected |
| Turn change | `Camera.snapToSide()` restores the current side's initial view |
| Pan | `Camera.panBy()` enters manual mode; pointer Shift/secondary drag pans the canvas |
| Zoom | `+`/`-` or the on-screen controls adjust bounded zoom |
| Overview/reset | `V` shows the full field; `C` restores the current side |
| Aim/fire | Pointer/touch aiming plus `Space` or the canvas gesture fires a volley |
| Skill/pause | `E` uses the player skill; `Escape` pauses |

When adding a control, route it through `Input.emit()` and `App` action handling so keyboard, pointer, touch, and UI buttons stay consistent. Keep localized `aria-label`, title, and visible text in sync.

## Localization and UI rules

- Supported locale files are `assets/js/i18n/en-US.js`, `ja-JP.js`, and `zh-TW.js`. Keep their key sets identical; add a key to all three files in the same change.
- Put user-visible labels in `data-i18n`, `data-i18n-title`, or `data-i18n-aria-label` rather than hard-coding a new language-specific string in a module.
- Theme and graphics-quality labels must also be localized. Verify the settings screen in all three locales after changing options.
- Keep toast notifications stacked without covering each other and retain reduced-motion, high-contrast, camera-shake, and responsive behavior.

## Safe change and validation workflow

1. Run `git status --short` and inspect the relevant diff. Preserve unrelated staged, modified, and untracked user files.
2. Search with `rg` before editing; follow the existing two-space formatting and IIFE/module style. Use `apply_patch` for source edits.
3. Run Prettier on changed JavaScript and locale files when available, then run `node --check` on every JavaScript file.
4. Run `git diff --check` and a lightweight Node VM harness that loads the game modules with minimal browser stubs. Exercise at least:
   - 200 portrait/landscape gate scenes with five gates, values in `0..30`, no initial or moving overlap, and upper-zone bounds;
   - x0 removal, x1 one-projectile behavior, and x30 splitting with the visual cap;
   - 2,000 terrain creations with counts remaining in `4..6`;
   - HTML local references and equal translation key counts across all three locales.
5. If browser inspection is available, manually check a new battle in both orientations: aim and fire, watch the full arc, observe gate movement, drag/zoom the camera, switch turns, pause/resume, and change locale/theme/quality.
6. Review `git diff --stat`, stage only the requested files, and describe actual validations in the commit message. Do not claim a browser test that was not run.

## Common failure modes

- Using level metadata to choose gate count instead of the fixed per-battle constant.
- Generating five gates correctly but allowing movement to overlap them later.
- Treating x0 as x1 through a generic minimum-count clamp.
- Multiplying `logicalCount` while also creating that many visual objects without a pool cap.
- Checking only the current projectile point instead of the previous-to-current segment.
- Following missiles forever after a volley or letting manual camera mode be overwritten by automatic follow.
- Adding a locale key to only one language, or localizing visible text while leaving `aria-label` and title text in English.
- Writing a README inside the skill directory; the project README belongs only at the repository root.
