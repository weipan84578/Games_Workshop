# 2026-07-08 nim-web-game

## Goal
Build the web version of the Nim game according to `nim-game-specification.md`.

## Acceptance Criteria
- [ ] `index.html` runs directly from `file://` with traditional `<script>` tags and no build/server requirement.
- [ ] Game supports Normal and Misere rules, presets, custom piles, player/AI/random first turn, and save/continue.
- [ ] AI supports Easy, Normal, Hard, and Master behavior using nim-sum strategy with misere endgame handling.
- [ ] UI includes main menu, game screen, instructions, settings, result modal, and responsive controls that do not cover the board.
- [ ] Settings include language, theme, BGM/SFX volume and toggles, difficulty, rule, setup, first turn, skin, motion reduction, and reset progress confirmation.
- [ ] Three locales exist: `zh-TW`, `en`, and `ja`.
- [ ] Web Audio API path includes GainNode and DynamicsCompressorNode, with in-game BGM multiplier set to 10.
- [ ] CSS/JS follow the requested folder split and no README is generated.

## Risk & Rollback
- Risk level: low to medium. This is a new static frontend with no existing production code or data migration.
- Affected components: new `index.html`, `css/`, `js/`, `assets/`, and task notes.
- Rollback strategy: remove the newly added static files or revert the change set.

## Dependencies & Environment
- Runtime: modern browser with HTML5, CSS3, localStorage, and Web Audio API.
- No npm, bundler, server, CDN, or external network dependency.
- Placeholder audio is synthesized through Web Audio because no source audio files are provided.

## Working Notes
- The repo initially contained only `nim-game-specification.md`.
- The specification requires no ES modules because `file://` should work without CORS errors.
- Use IIFE modules under `window.NimGame`.
- Do not create `README.md` in this task.
- Audio uses generated Web Audio tones because no licensed BGM/SFX source files were provided. The in-game GainNode multiplier is still implemented as `10`, followed by a `DynamicsCompressorNode` limiter.
- Browser autoplay restrictions mean audio starts after the first pointer/key interaction, avoiding initial-load AudioContext warnings.

## Plan
- [x] Restate goal + acceptance criteria.
- [x] Risk level + affected components.
- [x] Rollback strategy.
- [x] Dependencies & environment.
- [x] Locate existing implementation / patterns.
- [x] Design: minimal approach + key decisions.
- [x] Implement smallest safe slice.
- [x] Add/adjust tests or deterministic checks.
- [x] Run verification (syntax checks/manual browser smoke where possible).
- [x] Summarize changes + verification story.
- [x] Record lessons if any.

## Results
- Added a zero-build static web game in `index.html`, with CSS split across `css/base`, `css/layout`, `css/themes`, `css/components`, and `css/animations`.
- Added IIFE JavaScript modules under `js/utils`, `js/i18n`, `js/audio`, `js/core`, and `js/ui`.
- Implemented playable Nim vs AI, including Normal/Misere rules, presets/custom piles, first-turn modes, save/continue, settings, instructions, result modal, six themes, four object skins, generated SFX/BGM, and responsive footer controls.
- Added local SVG mascot assets under `assets/images/mascot`.

## Verification Performed
- `foreach ($file in Get-ChildItem js -Recurse -Filter *.js) { node --check $file.FullName }` -> passed.
- Node VM core checks -> passed:
  - Normal rule: last taker wins.
  - Misere rule: last taker loses.
  - Normal nim-sum optimal move reaches zero nim-sum.
  - Misere one-large-pile endgame leaves odd ones.
  - Audio in-game multiplier is `10`.
  - `zh-TW` locale resolves `menu.start`.
- HTML reference check -> passed: 42 local references exist.
- HTML module check -> passed: no `type="module"`.
- `rg 'type="module"|import |export '` -> no matches.
- README check -> passed: `README.md` absent.
- `git -c safe.directory='C:/Users/weipan/OneDrive - WEIKENG INDUSTRIAL CO., LTD/桌面/Test/Github/Games_Workshop' status --short -- .` -> reports `?? ./`, so this `Nim/` work is currently untracked from the parent repository view. Git also warned that the sandbox cannot read `C:\Users\weipan/.config/git/ignore`.

## Not Run
- Headless browser smoke test: no Playwright package or callable Chrome/Edge command is available in this shell.

## Lessons
- No user correction or postmortem occurred, so `tasks/lessons.md` was not created.

---

# 2026-07-08 nim-ui-audio-corrections

## Goal
Apply the requested UI and BGM behavior corrections after the initial Nim web game implementation.

## Acceptance Criteria
- [ ] Remove the top-right "pure frontend/offline playable" header status text.
- [ ] Remove the language selector from Settings and keep only the top-right language selector.
- [ ] Remove the Settings back button and keep "Save and Back".
- [ ] Make the Settings title scroll as normal text, not a sticky/frozen header.
- [ ] Prevent overlapping BGM when switching screens.
- [ ] Prevent overlapping BGM when starting a new round.
- [ ] Make menu BGM volume match game BGM volume, with game volume behavior as the single source of truth.

## Risk & Rollback
- Risk level: low. Changes are scoped to static UI and audio scheduling.
- Affected components: `index.html`, `css/layout/grid.css`, `css/layout/rwd.css`, `js/audio/audio-manager.js`, `js/main.js`, `js/ui/settings-controller.js`, task notes, lessons.
- Rollback strategy: revert this correction change set.

## Plan
- [x] Restate requested corrections and acceptance criteria.
- [x] Inspect affected files.
- [x] Update header/settings layout.
- [x] Fix BGM scheduling and volume multiplier behavior.
- [x] Run verification.
- [x] Record results and lessons.

## Results
- Removed the header status text and the main menu version line that displayed "pure frontend/offline playable".
- Removed the Settings language selector; language is now only controlled from the top-right selector.
- Removed the Settings back button; Settings keeps only "Save and Back" as the return action.
- Made the Settings title a normal non-sticky heading while leaving the instructions heading behavior unchanged.
- Made BGM start/stop idempotent so switching screens or pressing New Round does not layer another BGM interval or scheduled oscillator group.
- Changed BGM gain handling so menu and game screens both use the same `AudioConfig.inGameMultiplier` value, making game-volume behavior the source of truth.

## Verification Performed
- `foreach ($file in Get-ChildItem js -Recurse -Filter *.js) { node --check $file.FullName }` -> passed.
- `rg "header-status|language-select|settings-back|menu-version"` -> no matches.
- HTML reference check -> passed: 42 local references exist.
- HTML module check -> passed: no `type="module"`.
- Node VM core/audio checks -> passed:
  - Normal rule: last taker wins.
  - Misere rule: last taker loses.
  - Normal nim-sum optimal move reaches zero nim-sum.
  - Misere one-large-pile endgame leaves odd ones.
  - Audio in-game multiplier is `10`.
  - `zh-TW` locale resolves `menu.start`.
  - New Round does not create another BGM timer.
  - Screen switching keeps one BGM timer.
- Screen switching does not accumulate scheduled BGM sources.
- Menu and game use the same 10x BGM gain.

---

# 2026-07-08 nim-gameplay-polish

## Goal
Apply user-requested polish for the game screen RWD, New Round confirmation, and longer BGM phrases.

## Acceptance Criteria
- [ ] Game screen RWD is more polished across desktop, tablet, phone portrait, and short landscape layouts.
- [ ] Pressing New Round shows a clear confirmation before replacing the current board.
- [ ] Repeated New Round clicks do not stack duplicate prompt messages.
- [ ] Main/game BGM phrases are substantially longer so the loop feels less repetitive.

## Risk & Rollback
- Risk level: low. Changes are scoped to layout CSS, modal-trigger flow, audio phrase data/scheduling, and i18n strings.
- Affected components: `index.html`, `css/components/board.css`, `css/components/hud.css`, `css/layout/rwd.css`, `js/main.js`, `js/audio/audio-config.js`, `js/audio/audio-manager.js`, locale files, task notes, lessons.
- Rollback strategy: revert this polish change set.

## Plan
- [x] Restate requested corrections and acceptance criteria.
- [x] Review lessons and affected files.
- [x] Improve game screen RWD.
- [x] Add non-stacking New Round confirmation.
- [x] Extend generated BGM phrases and scheduling interval.
- [x] Run verification.
- [x] Record results and lessons.

## Results
- Improved game screen RWD:
  - Desktop keeps a stable HUD + board two-column layout.
  - Tablet uses a compact horizontal HUD row above the board.
  - Mid-width screens switch the footer controls into wrapped rows before buttons become cramped.
  - Phone portrait uses a compact HUD and two-column board grid with smaller pile objects.
  - Short landscape keeps controls in a right-side rail and tightens board/HUD spacing.
- Added New Round confirmation through the existing modal controller, so repeated clicks reuse the same modal instead of stacking messages.
- Added localized New Round confirmation copy in `zh-TW`, `en`, and `ja`.
- Expanded generated BGM phrases from short six-note loops to 24-note menu/game phrases and extended loop scheduling to roughly nine seconds or longer.
- Removed the remaining viewport-scaled `font-size` in `css/base/typography.css`.

## Verification Performed
- `foreach ($file in Get-ChildItem js -Recurse -Filter *.js) { node --check $file.FullName }` -> passed.
- HTML reference check -> passed: 42 local references exist.
- HTML module check -> passed: no `type="module"`.
- `rg "font-size:\s*clamp|font-size:\s*.*vw" css` -> no matches.
- Node VM core/audio checks -> passed:
  - Normal rule: last taker wins.
  - Misere rule: last taker loses.
  - Normal nim-sum optimal move reaches zero nim-sum.
  - `zh-TW` New Round confirmation title exists.
  - Menu BGM phrase has at least 24 notes.
  - Game BGM phrase has at least 24 notes.
  - Repeated game entry still keeps one BGM timer.
  - Menu/game BGM loops are at least nine seconds.
  - Menu and game still use the same 10x BGM gain.
