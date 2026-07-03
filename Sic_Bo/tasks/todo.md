# 2026-07-03 sicbo_static_game

## Goal + Acceptance Criteria
- Build the pure static Sic Bo game described in `SicBo_spec.md`.
- `index.html` must open directly by double click / `file://` without npm, build tools, CDN, server, or `fetch()` for local data.
- Implement main menu, gameplay screen, help screen, settings screen, i18n for zh-TW/en/ja, LocalStorage save/continue, five themes, responsive desktop/tablet/mobile layouts, and correct Sic Bo payout rules.
- Keep project structured exactly by spec: `css/base`, `css/layout`, `css/components`, `css/themes`, `css/responsive`, `js/core`, `js/ui`, `js/audio`, `js/i18n`, `js/settings`, `js/storage`, `assets`, `docs-assets`.
- Do not create `README.md`.

## Risk & Rollback
- Risk level: low to medium. This is a new static app with no production backend, but broad surface area.
- Affected components: new HTML/CSS/JS/static asset files in this workspace.
- Rollback strategy: delete the generated app files or revert the workspace changes.
- Rollout plan: open `index.html` locally and test core flows before use.
- Monitoring signals: browser console errors, layout overlap at mobile/desktop widths, incorrect payout results.

## Dependencies & Environment
- Runtime: modern browser only. No Node/npm/build step.
- Required services: none.
- Storage: browser LocalStorage key `sicbo.save.v1`.
- Audio: generated Web Audio tones, no external audio files required for core functionality.
- Data loading: all dictionaries and bet metadata are JS globals, no local `fetch()`.

## Checklist
- [x] Restate goal + acceptance criteria
- [x] Locate existing implementation / patterns
- [x] Design: minimal approach + key decisions
- [x] Implement file structure and `index.html`
- [x] Implement i18n dictionaries and manager
- [x] Implement bet metadata, dice roller, payout calculator, betting logic, and game engine
- [x] Implement save/settings/theme/audio managers
- [x] Implement menu, board, modal, and animation controllers
- [x] Implement responsive CSS, themes, dice/chips/table styling, settings/help UI
- [x] Run verification: no npm/build, direct static file checks, browser console/manual smoke test where possible
- [x] Summarize changes + verification story
- [x] Record lessons if any correction or mistake occurs

## Working Notes
- `SicBo_spec.md` was read successfully as UTF-8.
- Workspace initially contained only `SicBo_spec.md`; no existing app patterns or tests were present.
- Must avoid ES modules to keep `file://` behavior reliable across browsers.
- Must avoid `fetch()` for local JSON; all app data goes into plain script-loaded JS globals.
- Subagents are not used because current tool policy only permits them when explicitly requested by the user.

## Results
- Built the static Sic Bo app from `SicBo_spec.md` with `index.html`, modular CSS/JS, i18n, gameplay, settings, storage, generated Web Audio, responsive layout, help content, and SVG betting map.
- Verification passed:
  - `node --check` over all `js/**/*.js`
  - deterministic payout checks for big/small/odd/total/single/double/any triple/specific triple/combo
  - `index.html` relative reference existence check
  - script load-order smoke test for all 20 scripts
  - no `fetch()` usage, no `type="module"`, no `README.md`
  - required folder structure exists
- Browser headless automation was attempted with Chrome and Edge against `file://` but the local headless environment did not produce DOM/screenshots; Chrome reported GPU/headless process errors and Edge returned only update-registry warnings. Manual browser opening remains the final visual smoke check.

---

# 2026-07-03 playwright_spec_audit

## Goal + Acceptance Criteria
- Browse the whole Sic Bo static site with Playwright and compare behavior against `SicBo_spec.md`.
- Store screenshots only under `Temp/`; do not put scripts, text logs, or audit notes in `Temp/`.
- Fix any discovered implementation gaps and rerun tests until no known spec mismatch remains.
- Preserve records; do not delete generated evidence from this audit.

## Risk & Rollback
- Risk level: low. Changes are limited to the static app and test evidence.
- Affected components: UI behavior, i18n, CSS responsiveness, static test records under `Temp/`.
- Rollback strategy: revert changed app files and remove/ignore `Temp/` records only if explicitly requested.

## Dependencies & Environment
- Playwright CLI exists at `C:\Users\weipan\AppData\Roaming\npm\playwright.cmd`, version 1.61.1.
- Tests run directly against `file://` `index.html`; no local server.
- Screenshots are kept in `Temp/`. Text records stay in this task file and final response.

## Checklist
- [x] Create `Temp/` evidence directory
- [x] Run Playwright audit with inline scripts only
- [x] Capture desktop/mobile/tablet screenshots across menu, help, settings, and gameplay
- [x] Verify console/page errors are absent
- [x] Verify i18n switching, settings, theme changes, save/continue, betting flow, and payout basics
- [x] Check static constraints: no npm/build requirement, no fetch/module scripts, no README.md
- [x] Fix discovered mismatches
- [x] Rerun Playwright/static checks to clean
- [x] Record final audit results

## Results
- Used Playwright Chromium through the installed CLI/runtime against `file://` `index.html`.
- `Temp/` is reserved for screenshots only; temporary test scripts/log files were removed after correction.
- Screenshots kept in `Temp/` with run prefixes, including menu, help, settings, gameplay, result, mobile, and tablet states.
- Discovered and fixed:
  - Help odds section lacked category tabs and dice/number visual aids.
  - `any-triple` bet rendered raw i18n keys on the board/help table.
  - Tablet layout stretched the dice panel to the betting board height, making the fixed action bar overlap the visible layout.
  - Mobile action bar overlapped the first betting cards on the initial game viewport.
  - Help tab strip needed extra top spacing to avoid clipped text in the dialog.
- Final verification passed:
  - Playwright audit run 4: static checks, desktop full-site flow, responsive layout.
  - `node --check` for all JS files.
  - deterministic payout checks for key Sic Bo rules.
  - `Temp` contains screenshots/images only.
  - no `README.md` outside `Temp`.

---

# 2026-07-03 sicbo_readme

## Goal + Acceptance Criteria
- Overwrite or create `README.md` for this project.
- Include English, Japanese, and Chinese content.
- Provide quick navigation to the desired language and topic.
- Document game introduction, detailed gameplay, program introduction, and program/module classification.
- Use icons and tables to keep the document scannable and organized.

## Risk & Rollback
- Risk level: low. Documentation-only change.
- Affected components: `README.md`, task record only.
- Rollback strategy: revert the README/documentation diff.

## Dependencies & Environment
- Source of truth: `SicBo_spec.md`, current `index.html`, and existing `css/` and `js/` module layout.
- No screenshots or non-image artifacts should be written to `Temp/` for this task.

## Checklist
- [x] Restate goal + acceptance criteria
- [x] Read spec and current implementation structure
- [x] Write multilingual README
- [x] Verify anchors/content and basic formatting
- [x] Summarize changes + verification story

## Working Notes
- The current app is a pure static HTML/CSS/JavaScript game that runs from `index.html` without npm, build tools, server, CDN, ES modules, or local `fetch()`.
- Runtime data is stored in browser LocalStorage under `sicbo.save.v1`.
- JS modules are grouped under `core`, `ui`, `audio`, `i18n`, `settings`, and `storage`; CSS is grouped under `base`, `layout`, `components`, `themes`, and `responsive`.

## Results
- Added `README.md` with Chinese, English, and Japanese sections.
- Included quick navigation links, game introduction, detailed gameplay, betting odds, program introduction, and module classification.
- Used tables and icons for scannable organization.
- Verification passed: required anchors exist and required multilingual topic names are present.

---

# 2026-07-03 sicbo_3d_dice

## Goal + Acceptance Criteria
- Upgrade the dice display from a flat face to true CSS 3D dice cubes.
- Keep the project pure static: no npm package, CDN, server, or build step.
- Each die must contain all six faces, roll with a 3D transform animation, and settle with the correct result face visible.
- Preserve current gameplay and payout logic.

## Risk & Rollback
- Risk level: low. The change is localized to dice rendering and CSS animation.
- Affected components: `js/ui/board-renderer.js`, `css/components/dice.css`.
- Rollback strategy: revert the dice renderer/CSS diff.

## Dependencies & Environment
- No new dependency is allowed.
- Visual evidence, if captured, must stay in `Temp/` as image files only.

## Checklist
- [x] Locate current dice rendering and animation code
- [x] Implement six-face CSS 3D dice
- [x] Verify JavaScript syntax
- [x] Capture/inspect Playwright screenshot for static and rolling dice
- [x] Summarize changes + verification story

## Working Notes
- Current `.die` renders a single pip grid and rotates the flat square, so it reads as pseudo-3D rather than a cube.
- Use CSS 3D transforms instead of Three.js or external libraries to preserve the no-build, offline static constraint.
- Playwright screenshots for this change are stored as images under `Temp/04_game_dice_3d/`.

## Results
- Updated `js/ui/board-renderer.js` so each die renders six faces inside a `.die-cube`.
- Updated `css/components/dice.css` with 3D cube face placement, result-facing transforms, rolling animation, shadows, face highlights, and hidden backfaces.
- Verification passed:
  - `node --check` for `js/ui/board-renderer.js`
  - `node --check` for all JS files
  - Playwright screenshot checks for static, rolling, and settled dice states
  - DOM check confirmed each visible die has 6 faces, rolling dice use `die-3d-roll`, and backfaces are hidden

---

# 2026-07-03 sicbo_unified_bgm_volume

## Goal + Acceptance Criteria
- Make BGM volume consistent between the main menu and gameplay screen.
- Remove the game-screen-only 10x BGM amplification.
- Keep existing settings controls and save behavior intact.
- Update documentation so it no longer describes different menu/game BGM levels.

## Risk & Rollback
- Risk level: low. The change is limited to audio gain calculation and README wording.
- Affected components: `js/audio/audio-manager.js`, `README.md`, task record.
- Rollback strategy: revert the audio/documentation diff.

## Dependencies & Environment
- No new dependency.
- No screenshots needed for this audio-only change.

## Checklist
- [x] Locate BGM menu/game amplification logic
- [x] Remove game-mode-only BGM gain multiplier
- [x] Update README in Chinese, English, and Japanese
- [x] Verify JavaScript syntax and static references
- [x] Summarize changes + verification story

## Working Notes
- The mismatch came from `effectiveBGMVolume()`, which multiplied BGM by 10 only in game mode.
- `setMode()` remains available for existing menu/game calls, but it no longer changes BGM loudness.

## Results
- Updated `js/audio/audio-manager.js` so BGM gain uses the same `bgmVolume` value in menu and game modes.
- Updated `README.md` in Chinese, English, and Japanese to describe consistent menu/game BGM volume.
- Verification passed:
  - `node --check` for all JS files
  - fake AudioContext test confirmed menu/game/menu BGM gain stayed at `0.23`
  - static search confirmed no obsolete BGM amplification references remain in `README.md` or `js/`

---

# 2026-07-03 sicbo_cool_main_menu

## Goal + Acceptance Criteria
- Make the main menu look significantly cooler and more casino-like.
- Keep the app pure static with no image dependency, CDN, npm package, server, or build step.
- Preserve existing menu controls, language switching, and start-game behavior.
- Ensure desktop and mobile layouts remain readable and clickable.

## Risk & Rollback
- Risk level: low. The change is CSS-only for the main menu.
- Affected components: `css/layout/main-menu.css`, task record.
- Rollback strategy: revert the main-menu CSS diff.

## Dependencies & Environment
- No new dependency.
- Playwright screenshots for visual review are stored as images under `Temp/menu-cool-*.png`.

## Checklist
- [x] Inspect current main menu CSS and DOM
- [x] Add casino stage background, 3D dice logo, glowing title, animated chips, and button shine
- [x] Verify desktop and mobile menu layout with Playwright
- [x] Confirm Start Game still works from the upgraded menu
- [x] Summarize changes + verification story

## Working Notes
- The menu is upgraded using CSS pseudo-elements and transforms only, so no new asset pipeline is introduced.

## Results
- Updated `css/layout/main-menu.css` with a dynamic casino-stage background, 3D dice logo, animated halo, floating chips, neon title energy, table glow, and button sweep effects.
- Verification passed:
  - Playwright desktop screenshot: `Temp/05_main_menu_3d/menu-cool-desktop.png`
  - Playwright mobile screenshot: `Temp/05_main_menu_3d/menu-cool-mobile.png`
  - Playwright confirmed no console errors and Start Game transitions into the game screen on both viewports

---

# 2026-07-03 sicbo_menu_die_and_3d_chips

## Goal + Acceptance Criteria
- Make the main-menu die a real six-face 3D die.
- The menu die must rotate slowly before interaction.
- Clicking the die must trigger a random high-speed 3D spin over multiple 360-degree turns.
- While the die is spinning, it must be locked against repeated clicks until the spin fully stops.
- The menu die must stop at different positions across clicks.
- Background chips must be multiple semi-transparent 3D chips with front faces, back faces, and visible thickness, rotating slowly in irregular 3D directions.
- Update README and in-game help text.

## Risk & Rollback
- Risk level: low to medium. This touches menu markup, menu controller behavior, visual CSS, README, and i18n help text.
- Affected components: `index.html`, `css/layout/main-menu.css`, `css/layout/modal.css`, `js/ui/menu-controller.js`, `js/ui/modal-controller.js`, `js/i18n/lang-*.js`, `README.md`.
- Rollback strategy: revert the menu die/chip/help documentation diff.

## Dependencies & Environment
- No new dependency; the effect is CSS/HTML/vanilla JavaScript only.
- Visual evidence stays under `Temp/` as image files only.

## Checklist
- [x] Replace menu die markup with a six-face 3D cube
- [x] Add idle slow rotation and random high-speed click spin
- [x] Lock the die while the spin animation is active
- [x] Convert background chips into 3D chips with front/back faces and thickness
- [x] Update README and in-game help in Chinese, English, and Japanese
- [x] Verify JavaScript syntax and Playwright interaction behavior

## Results
- Menu die now renders 6 faces and 21 pips, idles with `menu-die-idle`, and spins with `menu-die-fast-spin`.
- Each click writes randomized X/Y/Z spin angles; Playwright confirmed two consecutive clicks produced different spin endpoints and different rest angles.
- Background chips now render as `.ambient-chip` elements with front/back pseudo-faces, depth transforms, and `matrix3d` irregular rotation.
- In-game help now includes the menu die/chip interaction note.
- Verification passed:
  - `node --check` for all JS files
  - README three-language keyword check
  - Playwright interaction test for menu die lock/unlock, randomized endpoints, 8 background chips, 3D chip transforms, and help text
  - Screenshots: `Temp/05_main_menu_3d/menu-3d-die-3d-chips-idle.png`, `Temp/05_main_menu_3d/menu-3d-die-random-fast-spin.png`, `Temp/06_help_dialog/help-menu-die-3d-chip-text.png`

---

# 2026-07-03 temp_image_classification

## Goal + Acceptance Criteria
- Classify all images under `Temp/` before ending work.
- Keep `Temp/` image-only; do not add logs, scripts, or text files.
- Preserve screenshots while moving them into clear category folders.

## Risk & Rollback
- Risk level: low. This is evidence-file organization only.
- Affected components: `Temp/` image paths and task record.
- Rollback strategy: move images back to prior paths if required.

## Dependencies & Environment
- All moves are within `Temp/`.
- Source and destination paths were checked to stay under the resolved `Temp` directory.

## Checklist
- [x] Inventory current `Temp/` files
- [x] Move images into category folders
- [x] Remove empty legacy `Run` and `fix` directories
- [x] Verify `Temp/` contains only image files
- [x] Verify no loose/unclassified image files remain at `Temp/` root

## Results
- Classified 77 images:
  - `Temp/00_user_reported/`: 4 files
  - `Temp/01_full_audit/`: 43 files
  - `Temp/02_fix_verification/`: 12 files
  - `Temp/03_toast_notifications/`: 3 files
  - `Temp/04_game_dice_3d/`: 6 files
  - `Temp/05_main_menu_3d/`: 7 files
  - `Temp/06_help_dialog/`: 2 files
  - `Temp/99_misc/`: 0 files
- Verification passed: no non-image files in `Temp/`, no loose files at `Temp/` root, and only classification directories remain.
