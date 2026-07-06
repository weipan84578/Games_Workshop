# 2026-07-06_darts_web_game

## Goal
Build the web Darts game described in `darts-game-spec.md` as a static, offline-capable frontend that can be opened directly from `index.html`.

## Acceptance Criteria
- [x] `index.html` opens without Node.js, npm, bundler, server, CDN, or backend API.
- [x] Main menu supports start, continue, instructions, settings, and visible saved-game state.
- [x] Gameplay supports 501, 301, Cricket, and Around the Clock with 1 to 4 players.
- [x] Dartboard is rendered in-browser with hit detection for singles, doubles, triples, bull, outer bull, and misses.
- [x] Pointer/touch interaction supports aim, charge, release, and visible dart hit markers.
- [x] Settings persist to `localStorage`: language, theme, BGM/SFX, volumes, animation, player count, start score.
- [x] Instructions use tabs and cover throw controls, board areas, scoring, modes, and accessibility.
- [x] i18n supports Traditional Chinese, English, and Japanese for user-facing UI.
- [x] Layout is responsive for mobile, tablet, desktop, and wide desktop.
- [x] Audio is available without external assets and respects mute/volume settings.
- [x] README documents how to run, feature scope, and verification.

## Risk & Rollback
- Risk level: medium, because this is a full new interactive app with broad UI/gameplay behavior.
- Affected components: new static HTML/CSS/JS assets and documentation.
- Rollback strategy: revert the new files/directories from this task; no migrations or external state beyond browser `localStorage`.
- Monitoring signals: manual browser console errors, gameplay state consistency, responsive layout checks.

## Dependencies & Environment
- Runtime: modern desktop/mobile browsers with HTML5, CSS3, ES6-capable JavaScript, SVG, and Web Audio API.
- Required services: none.
- External dependencies: none.
- Storage: browser `localStorage`.

## Plan
- [x] Restate goal + acceptance criteria
- [x] Locate existing implementation / patterns
- [x] Design: minimal approach + key decisions
- [x] Implement smallest safe slice
- [x] Add/adjust tests or deterministic checks
- [x] Run verification (static checks/manual repro)
- [x] Summarize changes + verification story
- [x] Record lessons (if any)

## Working Notes
- The repository currently contains only `darts-game-spec.md`; there is no existing app framework or package manifest.
- The spec requires direct `index.html` launch, so implementation must avoid module imports that can be blocked under `file://`.
- Use classic scripts and relative paths to keep offline/file launch reliable.
- Use SVG for the dartboard so hit zones, labels, and markers scale cleanly across viewports.
- Use Web Audio synthesis for BGM/SFX so the game remains self-contained without external media assets.

## Results
- Implemented a static Darts web game with `index.html`, layered CSS, classic JS modules, SVG dartboard rendering, Web Audio synthesis, i18n, settings, persistence, and README documentation.
- Verification passed:
  - `node --check` for all files under `js/`
  - static search for `type="module"`, external URLs, `cdn`, and `npm` returned no matches
  - Node scoring/hit-detection checks covered X01 bust restore, Double Out win, Cricket close/win, Around the Clock win, bull, double 20, and miss detection
  - Playwright headless opened `index.html` over `file://`, started a game, rendered the board, threw a dart, rendered a marker, and wrote a game log entry
  - Playwright screenshots checked desktop/mobile menu and desktop/mobile gameplay layouts

# 2026-07-06_darts_revision_ai_setup

## Goal
Apply the requested UI and gameplay revisions: move match setup behind Start, replace player count with AI count/difficulty, remove gameplay settings, expand illustrated instructions, improve select/log contrast, make throws arc/scatter more realistic, and remove mobile directional throw controls.

## Acceptance Criteria
- [x] Main menu has no quick-start mode/start-score controls.
- [x] Clicking Start opens a match setup screen where the player chooses mode, AI count up to 3, and AI difficulty.
- [x] Settings no longer contains the Gameplay section.
- [x] Instructions are expanded with detailed text and inline illustrations.
- [x] Select controls stay visible on dark/black backgrounds.
- [x] Dart throws animate along an arc and apply realistic scatter instead of landing exactly at the pressed point.
- [x] Mobile/RWD no longer shows up/down/left/right throw controls; throw remains press-and-release on the board.
- [x] Game log numbering remains readable at 10+ entries.
- [x] Existing offline `index.html` launch, i18n, localStorage, and supported game modes still work.

## Risk & Rollback
- Risk level: medium, because this changes menu flow and turn flow.
- Affected components: `index.html`, CSS pages/components/layout, `js/main.js`, storage, translations, scoring names, README/tasks.
- Rollback strategy: revert this revision commit; no migrations beyond localStorage keys that have defaults.
- Monitoring signals: browser console errors, setup-to-game flow, AI turn completion, mobile screenshots, log readability.

## Dependencies & Environment
- Runtime remains static browser only.
- No new dependencies or external services.
- Existing saved settings may lack AI fields; storage normalization must provide defaults.

## Plan
- [x] Restate goal + acceptance criteria
- [x] Locate affected UI/logic references
- [x] Implement setup flow and remove old settings controls
- [x] Implement AI and realistic throw animation/scatter
- [x] Expand instructions and CSS contrast/RWD fixes
- [x] Run verification
- [x] Summarize results

## Working Notes
- Keep classic scripts; no ES modules or fetch-based loading.
- Treat Player 1 as the human and AI 1..3 as automated opponents.

## Results
- Main menu now only opens setup from Start; mode, AI count, and AI difficulty are chosen in the new setup screen.
- Settings now only contains audio, language/theme, and save management.
- Player 1 is human; AI 1..3 are automated and use difficulty-based aim/power/landing spread.
- Throws now animate along an SVG arc and land with scatter before score resolution.
- Mobile directional throw controls were removed; mobile uses board press/release.
- Instructions now render detailed tab content with inline SVG illustrations.
- Select controls use high-contrast surfaces; game log uses custom counters for readable 10+ numbering.
- Verification passed:
  - `node --check` for all files under `js/`
  - static search for `type="module"`, external URLs, `cdn`, and `npm` returned no matches
  - old ID/reference scan found no active references to removed menu/settings/mobile controls
  - Node scoring/hit checks covered AI creation, X01 bust/Double Out, Cricket, Around the Clock, target points, bull, and miss detection
  - Playwright desktop smoke test covered Start -> setup -> game, AI auto throw, menu -> settings, and removed gameplay settings
  - Playwright mobile smoke test covered no directional controls and board press/release throw
  - Playwright screenshots checked setup desktop, dark settings select contrast, mobile gameplay, and illustrated instructions
  - Temporary Playwright screenshots matching `%TEMP%/darts-*.png` were deleted after inspection and rechecked clean

# 2026-07-06_darts_revision_ai_min_power_mode_help

## Goal
Apply the requested refinements: AI count must start at one, throw accuracy must be driven by a power formula with both large misses and precise throws possible, and each setup mode must have a clickable explanation modal before the match starts.

## Acceptance Criteria
- [x] Setup AI count minimum is 1 and maximum is 3.
- [x] Storage normalization upgrades old `aiCount: 0` or missing values to at least 1.
- [x] Throws use a deterministic formula shape that combines release power error, radial distance, player/AI stability, and random variance without showing formula text in the game UI.
- [x] Setup mode choices include a clickable control that opens a mode explanation modal.
- [x] Mode explanation modal supports 501, 301, Cricket, and Around the Clock with i18n text.
- [x] Existing offline launch, setup flow, AI turns, and board press/release still work.

## Risk & Rollback
- Risk level: low to medium, because this is a focused setup and throw-behavior change.
- Affected components: `index.html`, setup CSS, `js/main.js`, storage normalization, translations, README/tasks.
- Rollback strategy: revert this revision; no schema migration needed because settings normalization supplies defaults.

## Plan
- [x] Restate goal + acceptance criteria
- [x] Update AI count defaults/options
- [x] Refine throw landing formula
- [x] Add setup mode help modal
- [x] Run verification
- [x] Summarize results

## Working Notes
- Do not display the throw formula in the game UI.
- Keep screenshots in `TEMP/` if visual verification is needed, and delete them after use.

## Results
- Setup AI count now offers 1, 2, or 3 only; storage normalization upgrades old zero/missing AI settings to one.
- Throw landing now combines release power error, target radial distance, player/AI stability, focus/slip random variance, and difficulty spread. No formula text is shown in the UI.
- Each setup mode now has a `?` control that opens a modal with mode-specific guidance in Traditional Chinese, English, and Japanese.
- Verification passed:
  - `node --check` for all files under `js/`
  - static search for `type="module"`, external URLs, `cdn`, and `npm` returned no matches
  - Node checks covered storage normalization from `aiCount: 0` to `1` and minimum-AI game creation
  - Playwright desktop smoke test covered old `aiCount: 0` localStorage normalization, absence of `0` AI option, Cricket/301 mode info modals, starting a match, and AI auto throw
  - Playwright mobile smoke test covered setup without `0` AI and board press/release throw
  - UI/source scan confirmed no formula text or `option value="0"` in `index.html`, `js`, `css`, or `README.md`
  - `TEMP/` contains only `.gitignore`; no verification screenshots were left behind

# 2026-07-06_darts_revision_701_mode

## Goal
Add a 701 countdown mode, include it in setup/help/settings documentation, and change the third player's dart color from green to purple.

## Acceptance Criteria
- [x] Setup mode selection includes 701 with a clickable explanation modal.
- [x] Storage normalization accepts mode `701` and preserves a 701 start score.
- [x] 701 starts every player at 701, subtracts hits, wins immediately on exact zero, and busts only when the score goes below zero.
- [x] 501/301 Double Out behavior remains unchanged.
- [x] Instructions, mode help, and README document the 701 rules.
- [x] Third player dart markers use purple instead of green.
- [x] Verification covers syntax, storage, scoring, and setup UI behavior.

## Risk & Rollback
- Risk level: low to medium, because this extends existing X01 behavior with one mode-specific rule branch.
- Affected components: setup HTML/CSS, storage normalization, scoring engine, main UI logic, translations, README.
- Rollback strategy: revert this focused revision; no external state migration required because settings normalize invalid modes safely.

## Plan
- [x] Restate goal + acceptance criteria
- [x] Add 701 setup/storage/UI plumbing
- [x] Add 701 scoring rule and purple third-player color
- [x] Update instructions, mode help, and README
- [x] Run verification
- [x] Summarize results

## Working Notes
- Treat 701 as an X01 countdown mode with no Double Out requirement.
- For 701, remaining 1 is valid; only scoring below 0 should bust.
- Normalize start score from mode instead of trusting stale `startScore`, so 501 cannot inherit a stray 701 value.

## Results
- Added 701 to setup mode selection and mode info keys.
- Added storage/scoring support for 701 with exact-zero wins and below-zero busts only.
- Kept 501/301 Double Out behavior unchanged.
- Changed the third player color palette entry from green to purple and reapplied palette colors when hydrating old saves.
- Updated instructions, mode help, README, and the instruction mode illustration for 701.
- Verification passed:
  - `node --check` for all files under `js/`
  - Node storage/scoring checks for 701 normalization, 701 start scores, exact-zero single-hit win, below-zero bust, remaining-one allowance, 501 Double Out bust, and third-player purple color
  - Source assertions for setup 701 controls, 701 modal translation keys in all three languages, 701 scoreboard hint, scoring branch, README docs, and purple color
  - Static scans found no old `#1e9c66` third-player color or old `mode === "301" ? 301 : 501` start-score special case
  - Browser automation was not run because `playwright` is not installed in this workspace
  - `TEMP/` contains only `.gitignore`; no verification screenshots were left behind
