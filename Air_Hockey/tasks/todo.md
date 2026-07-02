# 2026-07-02 air-hockey-web-game

## Goal
Build the Air Hockey web game described in `air-hockey-spec.md` as a zero-build static web app that can be opened directly from `index.html`.

## Acceptance Criteria
- `index.html` runs without npm, bundlers, servers, or external CDNs.
- Main menu has only Start, Continue, How To Play, and Settings.
- Canvas game supports player vs AI, scoring, pause, resume, restart, and result screens.
- AI has easy, normal, and hard behavior differences without teleporting.
- Settings cover language, theme, audio, mute, effects quality, and target score.
- Traditional Chinese, English, and Japanese strings cover all visible screens.
- Four themes are available: neon, classic, sunset, and ice.
- `localStorage` persists settings and in-progress games; completed games clear progress.
- Audio is implemented with Web Audio API, including gameplay BGM gain based on a 10x multiplier from a low base volume.
- No `README.md` is created.

## Risk & Rollback
- Risk level: medium, because this is a new multi-file interactive UI/game implementation.
- Affected components: all newly created HTML, CSS, JS, and data files.
- Rollback strategy: delete the newly created app files or revert this change set.
- Monitoring/manual checks: browser console, UI layout at desktop/mobile widths, game loop behavior, storage persistence.

## Dependencies & Environment
- Runtime: modern browser with Canvas 2D, Web Audio API, and localStorage.
- No package manager, build step, network, or server required.
- Audio uses generated Web Audio tones because no binary audio source assets are present in the repo.

## Working Notes
- The folder started from the provided Air Hockey specification and currently does not keep an `AGENTS.md` file.
- Use `script defer` files attached to `window.AirHockey` for better direct `file://` compatibility than ES modules.
- Keep `index.html` as structure/imports only: no inline styles or inline game logic.
- Do not create `README.md`.

## Checklist
- [x] Restate goal + acceptance criteria
- [x] Locate existing implementation / patterns
- [x] Design minimal approach + key decisions
- [x] Implement static project skeleton
- [x] Implement settings, storage, i18n, and screen manager
- [x] Implement Canvas table, physics, scoring, AI, input, and effects
- [x] Implement audio manager and UI controls
- [x] Run verification: file structure, no README, JS syntax, browser/manual smoke
- [x] Summarize changes + verification story
- [x] Record lessons if a correction or postmortem occurs

## Results
- Implemented a zero-build static Air Hockey web game under `index.html`, `css/`, `js/`, and `data/`.
- Added Canvas gameplay with player vs AI, three AI difficulties, collision physics, scoring, countdowns, pause/resume/restart, result modal, particles, and responsive sizing.
- Added settings, localStorage persistence, first-run language modal, three-language i18n, four visual themes, generated Web Audio BGM/SFX, and gameplay BGM gain based on the required 10x multiplier.
- Verification run:
  - `node --check` on every `js/**/*.js` file: passed.
  - Static `index.html` CSS/JS reference existence check: `ALL_REFS_EXIST`.
  - No `README.md`: confirmed.
  - Bootstrap order VM check: `BOOTSTRAP_ORDER_OK`.
  - DOM startup VM check: `DOM_BOOT_OK`.
  - Headless Edge browser screenshot/DOM verification attempted, but the local headless environment failed in GPU/profile handling before producing output. No generated artifacts were kept.
- No correction/postmortem lesson was recorded because no user correction or production-impacting mistake occurred during this task.

## Follow-up 2026-07-02 settings-and-puck-flow

### Goal
Clarify settings labels, remove unnecessary control settings, and keep the puck moving with gradual acceleration so matches resolve reliably.

### Acceptance Criteria
- Settings page shows `特效品質` for the low/medium/high display setting.
- Settings page shows `勝利分數` instead of vague `遊戲規則`.
- Operation/touch sensitivity/keyboard assist settings are removed from the settings page.
- Puck does not slow to a stop during active play.
- Puck gradually accelerates during rallies while still capped by a maximum speed.

### Checklist
- [x] Update settings page markup and i18n labels
- [x] Remove unused control setting UI handling
- [x] Adjust puck physics constants and update logic
- [x] Run JS syntax and static reference checks
- [x] Summarize verification

### Results
- Renamed the settings page target score section to `勝利分數`.
- Added the `特效品質` label above the low/medium/high display setting.
- Removed operation settings from the settings page and removed persisted control-setting use from runtime settings.
- Changed active-play puck physics to enforce a minimum speed and apply gradual rally acceleration up to a maximum cap.
- Verification run:
  - `node --check` on every `js/**/*.js` file: passed.
  - Static `index.html` CSS/JS reference existence check: `ALL_REFS_EXIST`.
  - DOM startup VM check: `DOM_BOOT_OK`.
  - Puck acceleration check: `PUCK_ACCELERATION_OK`.
  - Confirmed no `README.md` and no `AGENTS.md` in `Air_Hockey/`.

## Follow-up 2026-07-02 landscape-rwd-scroll

### Goal
Fix responsive behavior so the app is treated as a landscape-first game and the main menu can scroll when horizontal mobile height is limited.

### Acceptance Criteria
- Main menu uses its own vertical scroll area instead of clipping content.
- Portrait mobile/tablet orientation shows a landscape prompt across the whole app, not only inside the game screen.
- Landscape mobile menu spacing is compressed enough to remain usable, with scroll as fallback.
- Orientation prompt text is updated in Traditional Chinese, English, and Japanese.

### Checklist
- [x] Move orientation prompt to global app scope
- [x] Make main menu screen vertically scrollable
- [x] Add landscape mobile menu spacing adjustments
- [x] Update i18n orientation prompt text
- [x] Run JS syntax, static reference, and startup checks
- [x] Summarize verification

### Results
- Moved the landscape orientation prompt to global app scope so mobile/tablet portrait is blocked across menu, settings, instructions, and gameplay.
- Changed the main menu from centered grid-only layout to a vertically scrollable screen, with compressed spacing for short landscape mobile viewports.
- Updated the orientation prompt text in Traditional Chinese, English, and Japanese.
- Verification run:
  - `node --check` on every `js/**/*.js` file: passed.
  - Static `index.html` CSS/JS reference existence check: `ALL_REFS_EXIST`.
  - Orientation prompt count check: `ORIENTATION_PROMPT_COUNT=1`.
  - DOM startup VM check: `DOM_BOOT_OK`.
  - RWD static rule check: `RWD_RULES_OK`.

## Follow-up 2026-07-02 hud-difficulty-ai-rwd

### Goal
Improve in-game HUD layout, difficulty-based speed scaling, AI strength, help content, and landscape difficulty selection layout.

### Acceptance Criteria
- In-game top HUD stays inside the viewport and contains pause/mute buttons without awkward floating controls.
- Puck acceleration has difficulty-specific caps: easy slower, normal faster, hard fastest.
- AI reaction feels stronger across all difficulties while still respecting mallet movement limits.
- How-to-play content explains difficulty speed/AI differences.
- Landscape difficulty selection keeps the back button and title visible, with scrolling as fallback.

### Checklist
- [x] Move pause/mute controls into HUD layout
- [x] Add difficulty-specific puck acceleration and max speed
- [x] Strengthen AI reaction, speed, and targeting
- [x] Update how-to-play i18n text
- [x] Fix difficulty selection landscape RWD
- [x] Run verification and summarize results

### Results
- Reworked the in-game HUD into a five-column top bar with pause and mute controls inside the HUD boundary.
- Added difficulty-specific puck speed profiles: easy caps low, normal caps higher, hard caps highest and accelerates fastest.
- Strengthened AI behavior by reducing reaction delays, raising mallet speeds, increasing prediction, and lowering mistake rates.
- Updated how-to-play difficulty text in Traditional Chinese, English, and Japanese to explain speed caps and AI differences.
- Improved landscape difficulty selection on mobile with a sticky header/back button and compact three-column cards.
- Verification run:
  - `node --check` on every `js/**/*.js` file: passed.
  - Static `index.html` CSS/JS reference existence check: `ALL_REFS_EXIST`.
  - HUD button count check: one pause button and one mute button.
  - DOM startup VM check: `DOM_BOOT_OK`.
  - Difficulty speed cap check: `DIFFICULTY_SPEED_CAPS_OK easy=860 normal=1220 hard=1700`.
  - HUD/RWD static rule check: `HUD_AND_DIFFICULTY_RWD_OK`.

## Follow-up 2026-07-02 hud-score-labels

### Goal
Prevent the in-game score row from overflowing and show the HUD in the requested order: pause button, AI score, game status, player score, music button.

### Acceptance Criteria
- HUD reads as `暫停遊戲 / 電腦: 分數 / 進行中 / 玩家: 分數 / 音樂設定`.
- Existing button icons remain unchanged (`Ⅱ` for pause and `♪` for music/mute).
- Pause and music buttons are vertically centered inside the HUD.
- HUD columns use responsive sizing and do not overflow the screen.

### Checklist
- [x] Add visible pause/music labels while preserving original icons
- [x] Change score labels to include colons
- [x] Update HUD grid and mobile sizing to prevent overflow
- [x] Run verification and summarize results

### Results
- Updated the game HUD to read pause, AI score, game status, player score, and music settings in a single responsive row.
- Preserved the existing pause and music icons (`Ⅱ` and `♪`) while adding visible labels beside/under them.
- Centered the pause/music buttons vertically in the HUD and tightened mobile landscape sizing to reduce overflow risk.
- Verification run:
  - `node --check` on every `js/**/*.js` file: passed.
  - Static `index.html` CSS/JS reference existence check: `ALL_REFS_EXIST`.
  - HUD icon/button count check: `HUD_ICONS_OK pauseIcon=1 musicIcon=1 pauseButton=1 muteButton=1`.
  - HUD CSS rule check: `HUD_CSS_OK`.
  - I18n key check: `I18N_KEYS_OK`.
  - HUD HTML key check: `HUD_HTML_KEYS_OK`.
  - Confirmed no `README.md` and no `AGENTS.md` in `Air_Hockey/`.

## Follow-up 2026-07-02 multilingual-readme

### Goal
Create a detailed project `README.md` with English, Japanese, and Traditional Chinese content.

### Acceptance Criteria
- README includes fast navigation to major sections and languages.
- README documents game overview, gameplay, rules, settings, difficulty, program architecture, and file classification.
- README uses clear tables and icons where helpful.
- README reflects the implemented project, not outdated spec-only details.

### Checklist
- [x] Confirm whether README already exists
- [x] Inspect implemented files and feature behavior
- [x] Add multilingual README content
- [x] Run README verification and summarize results

### Results
- Added `README.md` with English, Japanese, and Traditional Chinese sections.
- Added a top quick-navigation table for language and topic jumps.
- Documented game overview, execution, gameplay, rules, difficulty tuning, settings, architecture, runtime flow, state model, rendering/audio/storage behavior, and file classification.
- Verification run:
  - Required README section check: `README_REQUIRED_SECTIONS_OK`.
  - Internal README anchor check: `README_ANCHORS_OK count=24`.
  - Local README file link check: `README_FILE_LINKS_OK count=1`.
  - `node --check` on every `js/**/*.js` file: passed.
  - `git diff --check -- Air_Hockey`: passed.
