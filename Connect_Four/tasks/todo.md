# 2026-07-07 connect_four_zero_build

## Goal
Build the Connect Four game described in `connect-four-spec.md` as a zero-build browser app that can be opened from `index.html`.

## Acceptance Criteria
- `index.html` is the entry point and only wires static assets and the app mount.
- No build tools, npm dependencies, CDN calls, or server-side code are required.
- The game supports 7x6 Connect Four, win/draw detection, undo, restart, save/continue, player-vs-player, and player-vs-AI.
- AI supports Easy, Normal, Hard, and Expert; Hard/Expert use minimax with alpha-beta pruning.
- UI supports responsive desktop/tablet/mobile layouts without controls covering the board.
- Settings support zh-TW, en, ja, five themes, BGM/SFX volume, default AI difficulty, vibration, and animation toggles.
- Local storage persists settings, in-progress game state, and basic stats.
- No `README.md` is created.

## Dependencies & Environment
- Runtime: modern desktop/mobile browser.
- Required services: none.
- External network: none.
- Storage: `localStorage` keys scoped with `connectfour_`.

## Risk & Rollback
- Risk level: medium, because this is a full app implementation from an empty folder.
- Affected components: all new files under `css/`, `js/`, `assets/`, `data/`, and `index.html`.
- Rollback strategy: remove the new generated app files or revert this directory in git.
- Operational notes: no deployment, no migrations, no secrets.

## Working Notes
- The source spec is UTF-8; reading without `-Encoding UTF8` can display mojibake.
- The app must remain file-system friendly. Avoid runtime `fetch()` for local JSON/audio assets because some browsers block local file reads.
- Audio will use Web Audio generated BGM/SFX patterns so the game remains playable without binary media assets.

## Checklist
- [x] Restate goal + acceptance criteria
- [x] Locate existing implementation / patterns
- [x] Risk level + affected components
- [x] Rollback strategy
- [x] Dependencies & environment
- [x] Scaffold zero-build file structure and static assets
- [x] Implement core board/rules/history/state
- [x] Implement AI difficulty behavior
- [x] Implement i18n/settings/storage
- [x] Implement responsive UI, themes, modals, animations, icons, and audio
- [x] Run verification: file list, syntax checks, no README, smoke test guidance
- [x] Summarize results + verification story
- [ ] Record lessons if corrections or postmortem items occur

## Results
- Built a zero-build Connect Four app with `index.html` as the entry point.
- Added split CSS files for base styles, themes, responsive layout, components, screens, and animations.
- Added split JS files for storage/settings/i18n, board rules, history, game state, AI, UI rendering, modal/toast control, responsive handling, and Web Audio.
- Added local SVG image/icon assets and JSON defaults/language package files.
- Used generated Web Audio BGM/SFX patterns instead of binary media assets to keep the app offline-safe without licensing or missing-file risk.
- Fixed file-open compatibility by loading `js/main.js` as a classic script instead of an ES module. The app uses global namespaces and no `import/export`, so this avoids browser `file://` module restrictions.

## Verification
- `Get-ChildItem -Path .\js -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }` passed.
- JSON parse check for `js/i18n/*.json` and `data/defaultSettings.json` passed.
- Core smoke test passed: horizontal win detection, Easy AI immediate block, and Minimax legal move.
- `index.html` local reference check passed: 43 linked local files exist.
- `Get-ChildItem -Path . -Recurse -Filter README.md` returned no files.

## Lessons
- Mistake class: incorrect assumption about browser behavior. `type="module"` can fail under `file://` even when the JS itself is valid.
- Prevention rule: for a strict double-click offline app, avoid ES module entry scripts unless the target browsers have been manually verified with `file://`; use classic scripts or provide a server-based launch path.

## 2026-07-07 result_modal_rwd

### Goal
Fix win/loss/draw result modal RWD so the settlement UI remains readable and usable on mobile portrait, mobile landscape, and desktop.

### Acceptance Criteria
- Result modal gets a dedicated layout instead of inheriting the generic content modal behavior.
- Action buttons do not overflow or crowd each other on narrow screens.
- Result message and decorative mark fit without covering the board or toolbar.
- Existing game logic and persistence behavior remain unchanged.

### Results
- Added a `result-modal` class hook to modal rendering.
- Replaced the win/loss/draw body with a dedicated `result-outcome` layout and responsive badge/message markup.
- Added desktop, mobile portrait, narrow-phone, and mobile-landscape CSS rules for result modal sizing and action buttons.
- Kept a scroll fallback for very short screens.

### Verification
- `Get-ChildItem -Path .\js -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }` passed.
- `index.html` local reference check passed: 43 local files found.
- Playwright is not installed in this zero-build folder, so screenshot-level browser verification was not available from the current environment.
